import { NextResponse } from 'next/server';

import Groq from 'groq-sdk';
import { PRIMARY_MODEL, getFallbackModel, getModelTemperature } from '@/utils/models';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateSuggestionWithFallback(messages: any[]) {
  try {
    return await client.chat.completions.create({
      messages,
      model: PRIMARY_MODEL,
      temperature: getModelTemperature(PRIMARY_MODEL),
      max_tokens: 200,
      top_p: 1,
    });
  } catch (error) {
    // If the primary model fails, try with a fallback model
    console.error('Primary model failed, trying fallback model');
    return await client.chat.completions.create({
      messages,
      model: getFallbackModel(),
      temperature: getModelTemperature(getFallbackModel()),
      max_tokens: 2048,
      top_p: 1,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    const completion = await generateSuggestionWithFallback([
      {
        role: 'user',
        content: `Given this HTML content, suggest a concise title and brief description that captures the essence of the app. The title should be descriptive, while the description should explain what the app does in a single sentence. Format the response as JSON with "title" and "description" fields.

<app html>
${html}
</app html>`,
      },
    ]);

    const responseContent = completion.choices[0]?.message?.content || '';
    const startIndex = responseContent.indexOf('{');
    const endIndex = responseContent.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid JSON response from AI');
    }

    const jsonContent = responseContent.substring(startIndex, endIndex + 1);
    const suggestions = JSON.parse(jsonContent);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
