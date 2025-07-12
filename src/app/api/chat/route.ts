import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateContextualPrompt } from '@/lib/ai/prompts';
import { getRelevantContent, getSectionContent } from '@/lib/ai/rag';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4';
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '1000');
const TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { message, context, messages = [] } = await request.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Use RAG system to get relevant content
    const ragResult = getRelevantContent(message, 3);
    
    // Get current section content if provided
    let currentSectionContent = '';
    if (context && typeof context === 'string') {
      currentSectionContent = getSectionContent(context);
    }

    // Generate contextual prompt with RAG content
    const systemPrompt = generateContextualPrompt(
      message, 
      context, 
      ragResult.relevantContent || currentSectionContent, 
      messages
    );

    // Prepare conversation history for OpenAI
    const conversationMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add previous messages to conversation history
    if (messages && messages.length > 0) {
      messages.forEach((msg: any) => {
        conversationMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current user message
    conversationMessages.push({
      role: 'user',
      content: message
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: conversationMessages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      stream: false,
    });

    const assistantResponse = completion.choices[0]?.message?.content;

    if (!assistantResponse) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ 
      message: assistantResponse,
      usage: completion.usage 
    });

  } catch (error: any) {
    console.error('Error processing chat message:', error);
    
    // Handle specific OpenAI errors
    if (error?.error?.type === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'API quota exceeded. Please check your OpenAI billing.' },
        { status: 429 }
      );
    }
    
    if (error?.error?.type === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat message. Please try again.' },
      { status: 500 }
    );
  }
}
