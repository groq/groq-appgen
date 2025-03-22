// utils/providers.ts
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize clients
export const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper for converting Gemini responses to match Groq format
export function normalizeGeminiResponse(geminiResponse: any) {
    return {
        choices: [{ 
            message: { 
                content: geminiResponse.response.text() 
            },
            delta: {
                content: geminiResponse.response.text()
            }
        }],
        usage: { total_tokens: 0 } // Gemini doesn't provide token usage in same format
    };
}

// Stream handlers for each provider
export async function handleGeminiStream(
    stream: any,
    controller: ReadableStreamDefaultController,
    encoder: TextEncoder
) {
    let fullContent = "";
    
    for await (const chunk of stream.stream) {
        const content = chunk.text();
        if (content) {
            fullContent += content;
            
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
    
    return fullContent;
}

export async function handleGroqStream(
    stream: any,
    controller: ReadableStreamDefaultController,
    encoder: TextEncoder
) {
    let fullContent = "";
    
    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
            fullContent += content;
            
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
    
    return fullContent;
}