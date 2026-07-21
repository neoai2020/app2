import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { SUPPORT_EMAIL } from '@/lib/constants'

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN || 'neoaifreshdesk'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

async function sendViaResend(
  email: string,
  message: string,
  userId: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const from =
    process.env.RESEND_FROM_EMAIL || 'Profit Loop AI <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [SUPPORT_EMAIL],
      reply_to: email,
      subject: `Support request from ${email}`,
      text: `${message}\n\n---\nReply to: ${email}\nUser ID: ${userId}\nSubmitted from Profit Loop dashboard`,
      html: `<p>${escapeHtml(message)}</p><p><strong>Reply to:</strong> ${escapeHtml(email)}</p><p><em>User ID: ${userId} · Submitted from Profit Loop dashboard</em></p>`
    })
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Resend email error:', res.status, detail)
    return false
  }

  return true
}

async function sendViaFreshdesk(
  email: string,
  message: string,
  userId: string
): Promise<boolean> {
  const apiKey = process.env.FRESHDESK_API_KEY
  if (!apiKey) return false

  const auth = Buffer.from(`${apiKey}:X`).toString('base64')

  const res = await fetch(`https://${FRESHDESK_DOMAIN}.freshdesk.com/api/v2/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      email,
      subject: 'Profit Loop AI — Dashboard Support Request',
      description: `<p>${escapeHtml(message)}</p><p><em>Submitted from dashboard · User ID: ${userId}</em></p>`,
      priority: 2,
      status: 2
    })
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Freshdesk ticket error:', res.status, detail)
    return false
  }

  return true
}

export const runtime = 'nodejs'

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

    const sent =
      (await sendViaFreshdesk(email, message, user.id)) ||
      (await sendViaResend(email, message, user.id))

    if (!sent) {
      return NextResponse.json(
        {
          error: 'Could not send automatically — opening your email app instead.',
          useMailto: true
        },
        { status: 503 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support request error:', error)
    return NextResponse.json(
      {
        error: 'Could not send automatically — opening your email app instead.',
        useMailto: true
      },
      { status: 500 }
    )
  }
}
