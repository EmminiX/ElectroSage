import { NextRequest, NextResponse } from 'next/server'
import { generateContextualPrompt } from '@/lib/ai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { message, context, messages } = await request.json()

    const prompt = generateContextualPrompt(message, context, '', messages)

    const assistantResponse = await getChatGPTResponse(prompt)

    return NextResponse.json({ message: assistantResponse })
  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

async function getChatGPTResponse(prompt: string): Promise<string> {
  // Simulate a delay and response from an AI model
  console.log('Sending prompt to AI:', prompt)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('AI Response: Based on the content provided, here is a detailed explanation...')
    }, 1000)
  })
}
