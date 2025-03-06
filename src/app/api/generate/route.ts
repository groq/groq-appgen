import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { constructPrompt } from "@/utils/prompt";
import { signHtml } from "@/server/signing";
import {
	PRIMARY_MODEL,
	VANILLA_MODEL,
	PRIMARY_VISION_MODEL,
	FALLBACK_VISION_MODEL,
	getFallbackModel,
	getModelTemperature,
	getModelMaxTokens
} from "@/utils/models";
import {
	MAINTENANCE_GENERATION,
	MAINTENANCE_USE_VANILLA_MODEL,
} from "@/lib/settings";

const client = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

async function checkContentSafety(
	content: string,
): Promise<{ safe: boolean; category?: string }> {
	try {
		const safetyCheck = await client.chat.completions.create({
			messages: [{ role: "user", content }],
			model: "llama-guard-3-8b",
			temperature: 0,
			max_tokens: 10,
		});

		const response = safetyCheck.choices[0]?.message?.content || "";
		const lines = response.trim().split("\n");

		return {
			safe: lines[0] === "safe",
			category: lines[0] === "unsafe" ? lines[1] : undefined,
		};
	} catch (error) {
		console.error("Error checking content safety:", error);
		return { safe: true, category: undefined };
	}
}

async function tryVisionCompletion(imageData: string, model: string) {
	return await client.chat.completions.create({
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "Describe this UI drawing in detail",
					},
					{
						type: "image_url",
						image_url: {
							url: imageData,
						},
					},
				],
			},
		],
		model: model,
		temperature: getModelTemperature(model),
		max_tokens: 1024,
		top_p: 1,
		stream: false,
		stop: null,
	});
}

async function tryCompletion(prompt: string, model: string, stream = false) {
	return await client.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: model,
		temperature: getModelTemperature(model),
		max_tokens: getModelMaxTokens(model),
		top_p: 1,
		stream: stream,
		stop: null,
	});
}

async function generateWithFallback(prompt: string, model: string, stream = false) {
	try {
		const chatCompletion = await tryCompletion(
			prompt,
			MAINTENANCE_USE_VANILLA_MODEL ? VANILLA_MODEL : model,
			stream
		);
		return chatCompletion;
	} catch (error) {
		console.error("Primary model failed, trying fallback model:", error);
		try {
			const chatCompletion = await tryCompletion(prompt, getFallbackModel(), stream);
			return chatCompletion;
		} catch (error) {
			console.error("Error generating completion:", error);
			throw error;
		}
	}
}

async function getDrawingDescription(imageData: string): Promise<string> {
	try {
		const chatCompletion = await tryVisionCompletion(
			imageData,
			PRIMARY_VISION_MODEL,
		);
		return chatCompletion.choices[0].message.content;
	} catch (error) {
		try {
			const chatCompletion = await tryVisionCompletion(
				imageData,
				FALLBACK_VISION_MODEL,
			);
			return chatCompletion.choices[0].message.content;
		} catch (error) {
			console.error("Error processing drawing:", error);
			throw error;
		}
	}
}

export async function POST(request: Request) {
	if (MAINTENANCE_GENERATION) {
		return NextResponse.json(
			{ error: "We're currently undergoing maintenance. We'll be back soon!" },
			{ status: 500 },
		);
	}

	try {
		const { query, currentHtml, feedback, theme, drawingData, model, stream = false } =
			await request.json();
		let finalQuery = query;
		if (drawingData) {
			const drawingDescription = await getDrawingDescription(drawingData);
			finalQuery = `${query}\n\nDrawing description: ${drawingDescription}`;
		}

		const prompt = constructPrompt({
			...(finalQuery && { query: finalQuery }),
			currentHtml,
			currentFeedback: feedback,
			theme,
		});

		// Run safety check
		const safetyResult = await checkContentSafety(prompt);

		// Check safety result before proceeding
		if (!safetyResult.safe) {
			return NextResponse.json(
				{
					error:
						"Your request contains content that violates our community guidelines.",
					category: safetyResult.category,
				},
				{ status: 400 },
			);
		}

		// If streaming is requested, return a streaming response
		if (stream) {
			const encoder = new TextEncoder();
			const streamingCompletion = await generateWithFallback(prompt, model, true);
			
			const responseStream = new ReadableStream({
				async start(controller) {
					// Send initial message
					controller.enqueue(encoder.encode(JSON.stringify({ type: "start" }) + "\n"));
					
					try {
						let fullContent = "";
						
						// Handle streaming response
						for await (const chunk of streamingCompletion as any) {
							const content = chunk.choices[0]?.delta?.content || "";
							if (content) {
								fullContent += content;
								
								// Send just the new content chunk to the client
								controller.enqueue(
									encoder.encode(
										JSON.stringify({
											type: "chunk",
											content: content,
										}) + "\n"
									)
								);
							}
						}
						
						// Extract HTML content from between backticks if present
						let generatedHtml = fullContent;
						if (generatedHtml.includes("```html")) {
							const match = generatedHtml.match(/```html\n([\s\S]*?)\n```/);
							generatedHtml = match ? match[1] : generatedHtml;
						}
						
						// Send the final HTML and close the stream
						controller.enqueue(
							encoder.encode(
								JSON.stringify({
									type: "complete",
									html: generatedHtml,
									signature: signHtml(generatedHtml),
								}) + "\n"
							)
						);
						controller.close();
					} catch (error) {
						console.error("Error in stream:", error);
						controller.enqueue(
							encoder.encode(
								JSON.stringify({
									type: "error",
									error: "Error generating content",
								}) + "\n"
							)
						);
						controller.close();
					}
				},
			});
			
			return new Response(responseStream, {
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					"Connection": "keep-alive",
				},
			});
		} else {
			// Non-streaming response (original behavior)
			const chatCompletion = await generateWithFallback(prompt, model, false) as any;
			let generatedHtml = chatCompletion.choices[0]?.message?.content || "";

			// Extract HTML content from between backticks if present
			if (generatedHtml.includes("```html")) {
				const match = generatedHtml.match(/```html\n([\s\S]*?)\n```/);
				generatedHtml = match ? match[1] : generatedHtml;
			}

			return NextResponse.json({
				html: generatedHtml,
				signature: signHtml(generatedHtml),
				usage: chatCompletion.usage,
			});
		}
	} catch (error) {
		console.error("Error generating HTML:", error);
		return NextResponse.json(
			{ error: "Failed to generate HTML" },
			{ status: 500 },
		);
	}
}
