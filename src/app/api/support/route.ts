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
    process.env.RESEND_FROM_EMAIL || 'Profit Loop AI <support@reliteagency.com>'

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
      text: `Customer email: ${email}\nSoftware: Profit Loop AI\n\nCustomer inquiry is:\n${message}\n\n---\nUser ID: ${userId}`,
      html: `<p><strong>Customer email:</strong> ${escapeHtml(email)}<br><strong>Software:</strong> Profit Loop AI</p><p><strong>Customer inquiry is:</strong></p><p>${escapeHtml(message)}</p><p><em>User ID: ${userId}</em></p>`
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
      description: `<p><strong>Customer email:</strong> ${escapeHtml(email)}<br><strong>Software:</strong> Profit Loop AI</p><p><strong>Customer inquiry is:</strong></p><p>${escapeHtml(message)}</p><p><em>User ID: ${userId}</em></p>`,
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
      data: { user }
    } = await supabase.auth.getUser()

    // Visitors on the login / signup / password pages can also contact support,
    // so requests without a session are accepted and labeled instead of rejected.
    const userId = user?.id ?? 'not signed in (auth pages)'

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
      (await sendViaFreshdesk(email, message, userId)) ||
      (await sendViaResend(email, message, userId))

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
