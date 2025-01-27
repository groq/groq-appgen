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
} from "@/utils/model-selection";
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
		temperature: 0.7,
		max_tokens: 1024,
		top_p: 1,
		stream: false,
		stop: null,
	});
}

async function tryCompletion(prompt: string, model: string) {
	return await client.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: model,
		temperature: 0.1,
		max_tokens: 8192,
		top_p: 1,
		stream: false,
		stop: null,
	});
}

async function generateWithFallback(prompt: string) {
	try {
		const chatCompletion = await tryCompletion(
			prompt,
			MAINTENANCE_USE_VANILLA_MODEL ? VANILLA_MODEL : PRIMARY_MODEL,
		);
		return chatCompletion;
	} catch (error) {
		console.error("Primary model failed, trying fallback model:", error);
		try {
			const chatCompletion = await tryCompletion(prompt, getFallbackModel());
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
		const { query, currentHtml, feedback, theme, drawingData } =
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

		// Run safety check and code completion in parallel
		const [safetyResult, chatCompletion] = await Promise.all([
			checkContentSafety(prompt),
			generateWithFallback(prompt),
		]);

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
	} catch (error) {
		console.error("Error generating HTML:", error);
		return NextResponse.json(
			{ error: "Failed to generate HTML" },
			{ status: 500 },
		);
	}
}
