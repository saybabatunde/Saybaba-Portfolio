import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('onboarding_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Supabase fetch error:', error)
      return NextResponse.json(
        { error: `Failed to fetch request: ${error.message}` },
        { status: 404 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ request: data })
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
