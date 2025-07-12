import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('🎤 Processing audio file:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    // Convert File to the format expected by OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // English language
      response_format: 'text',
    });

    console.log('✅ Transcription completed:', transcription);

    return NextResponse.json({
      success: true,
      transcription,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Speech-to-text error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}