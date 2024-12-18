import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { constructPrompt } from '@/utils/prompt';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function checkContentSafety(content: string): Promise<{ safe: boolean; category?: string }> {
  try {
    const safetyCheck = await client.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'llama-guard-3-8b',
      temperature: 0,
      max_tokens: 10,
    });

    const response = safetyCheck.choices[0]?.message?.content || '';
    const lines = response.trim().split('\n');
    
    return {
      safe: lines[0] === 'safe',
      category: lines[0] === 'unsafe' ? lines[1] : undefined
    };
  } catch (error) {
    console.error('Error checking content safety:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { query, currentHtml, feedback, theme } = await request.json();

    const prompt = constructPrompt({
      ...(query && { query }),
      currentHtml,
      currentFeedback: feedback,
      theme
    });

    // Run safety check and code completion in parallel
    const [safetyResult, chatCompletion] = await Promise.all([
      checkContentSafety(prompt),
      client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-specdec',
        temperature: 0.1,
        max_tokens: 2000,
      })
    ]);

    // Check safety result before proceeding
    if (!safetyResult.safe) {
      return NextResponse.json(
        { 
          error: 'Your request contains content that violates our community guidelines.',
          category: safetyResult.category 
        },
        { status: 400 }
      );
    }

    let generatedHtml = chatCompletion.choices[0]?.message?.content || '';
    
    // Extract HTML content from between backticks if present
    if (generatedHtml.includes('```html')) {
      const match = generatedHtml.match(/```html\n([\s\S]*?)\n```/);
      generatedHtml = match ? match[1] : generatedHtml;
    }

    return NextResponse.json({ 
      html: generatedHtml,
      usage: chatCompletion.usage
    });
  } catch (error) {
    console.error('Error generating HTML:', error);
    return NextResponse.json(
      { error: 'Failed to generate HTML' },
      { status: 500 }
    );
  }
}
