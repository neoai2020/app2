import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const FRESHDESK_DOMAIN = 'neoaifreshdesk.freshdesk.com'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message } = await request.json()

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    const userEmail = user.email!
    const userName = user.user_metadata?.full_name || userEmail
    const apiKey = process.env.FRESHDESK_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Support system is not configured' }, { status: 500 })
    }

    const res = await fetch(`https://${FRESHDESK_DOMAIN}/api/v2/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:X`).toString('base64'),
      },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        subject,
        description: message,
        status: 2,
        priority: 1,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Freshdesk error:', err)
      return NextResponse.json({ error: 'Failed to send support request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
