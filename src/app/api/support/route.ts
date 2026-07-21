import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN || 'neoaifreshdesk'

async function createFreshdeskTicket(
  email: string,
  message: string,
  userId: string
): Promise<void> {
  const apiKey = process.env.FRESHDESK_API_KEY
  if (!apiKey) return

  const auth = Buffer.from(`${apiKey}:X`).toString('base64')
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')

  const res = await fetch(`https://${FRESHDESK_DOMAIN}.freshdesk.com/api/v2/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      email,
      subject: 'Profit Loop AI — Dashboard Support Request',
      description: `<p>${escaped}</p><p><em>Submitted from dashboard · User ID: ${userId}</em></p>`,
      priority: 2,
      status: 2
    })
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Freshdesk ticket error:', res.status, detail)
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }

    if (message.length < 10) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 })
    }

    const { error: insertError } = await supabase.from('support_requests').insert({
      user_id: user.id,
      email,
      message
    })

    if (insertError) {
      console.error('Support request insert error:', insertError)
      return NextResponse.json(
        {
          error:
            'We could not send your message right now. Please email ProfitLoopAI@neoai.freshdesk.com directly.'
        },
        { status: 500 }
      )
    }

    void createFreshdeskTicket(email, message, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support request error:', error)
    return NextResponse.json(
      {
        error:
          'We could not send your message right now. Please email ProfitLoopAI@neoai.freshdesk.com directly.'
      },
      { status: 500 }
    )
  }
}
