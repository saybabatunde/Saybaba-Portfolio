import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const THEME_PROMPTS: Record<string, string> = {
  motivational: 'Generate an inspiring and motivational quote that encourages personal growth, perseverance, and achieving goals. Make it original and impactful.',
  business: 'Generate a professional and insightful business quote about leadership, entrepreneurship, innovation, or success. Make it thought-provoking and actionable.',
  tech: 'Generate a quote about technology, innovation, coding, software development, or the digital future. Make it relevant to tech professionals.',
  philosophy: 'Generate a deep philosophical quote about life, meaning, existence, wisdom, or human nature. Make it contemplative and meaningful.',
  success: 'Generate a quote about success, achievement, hard work, excellence, and breaking through limitations. Make it powerful and motivating.',
  life: 'Generate a quote about life lessons, happiness, relationships, growth, or living authentically. Make it relatable and uplifting.',
}

export async function POST(request: NextRequest) {
  try {
    const { theme = 'motivational' } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

    const themePrompt = THEME_PROMPTS[theme] || THEME_PROMPTS.motivational

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `${themePrompt}

Format your response EXACTLY like this:
QUOTE: [The quote here]
AUTHOR: [Author name or "Unknown" if original]

Make sure the quote is unique, not a famous quote. Create something original.`,
        },
      ],
    })

    // Extract the response text
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse the response
    const quoteMatch = responseText.match(/QUOTE:\s*(.+)/i)
    const authorMatch = responseText.match(/AUTHOR:\s*(.+)/i)

    const quote = quoteMatch ? quoteMatch[1].trim() : 'Be yourself; everyone else is already taken.'
    const author = authorMatch ? authorMatch[1].trim() : 'Oscar Wilde'

    return NextResponse.json({
      quote,
      author,
      theme,
    })
  } catch (error) {
    console.error('Error generating quote:', error)

    // Fallback quote if Claude API fails
    return NextResponse.json({
      quote: 'The best time to plant a tree was 20 years ago. The second best time is now.',
      author: 'Chinese Proverb',
      theme: 'motivational',
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
