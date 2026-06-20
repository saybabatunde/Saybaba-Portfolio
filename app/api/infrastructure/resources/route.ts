import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    // Fetch all requests for this user
    const { data: requests, error: requestError } = await supabase
      .from('infrastructure_requests')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false })

    if (requestError) {
      console.error('Error fetching requests:', requestError)
      return NextResponse.json(
        { error: 'Failed to fetch requests' },
        { status: 500 }
      )
    }

    // Fetch all deployed resources for this user (via their requests)
    const requestIds = requests?.map((r) => r.id) || []

    let resources = []
    if (requestIds.length > 0) {
      const { data: deployedResources, error: resourceError } = await supabase
        .from('deployed_resources')
        .select('*')
        .in('request_id', requestIds)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (resourceError) {
        console.error('Error fetching resources:', resourceError)
      } else {
        resources = deployedResources || []
      }
    }

    return NextResponse.json({
      requests: requests || [],
      resources: resources || [],
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
