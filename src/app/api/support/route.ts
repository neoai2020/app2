import { NextResponse } from 'next/server'

const FRESHDESK_DOMAIN = 'neoaifreshdesk.freshdesk.com'
const SUPPORT_EMAIL = 'ProfitLoopAI@neoai.freshdesk.com'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const apiKey = process.env.FRESHDESK_API_KEY

    if (apiKey) {
      const res = await fetch(`https://${FRESHDESK_DOMAIN}/api/v2/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${apiKey}:X`).toString('base64'),
        },
        body: JSON.stringify({
          name,
          email,
          subject: `Support Request from ${name}`,
          description: message,
          status: 2,
          priority: 1,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        console.error('Freshdesk API error:', err)
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
      }

      return NextResponse.json({ success: true, method: 'freshdesk' })
    }

    const mailtoBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Support Request from ${name}`)}&body=${encodeURIComponent(mailtoBody)}`

    return NextResponse.json({ success: true, method: 'mailto', mailtoUrl })
  } catch (error) {
    console.error('Support route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
