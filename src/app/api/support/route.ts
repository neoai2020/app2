import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const SUPPORT_EMAIL = 'ProfitLoopAI@neoai.freshdesk.com'

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

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: `Profit Loop Support <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: SUPPORT_EMAIL,
      replyTo: userEmail,
      subject: `[Support] ${subject}`,
      text: `From: ${userName} (${userEmail})\n\nSubject: ${subject}\n\n${message}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
