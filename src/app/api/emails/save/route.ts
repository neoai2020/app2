import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { leadId, offerId, subject, body: emailBody, followUp, tone } = body

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      )
    }

    // Save email template
    const { data: savedEmail, error: saveError } = await supabase
      .from('email_templates')
      .insert({
        user_id: user.id,
        lead_id: leadId || null,
        offer_id: offerId || null,
        subject,
        body: emailBody,
        follow_up: followUp || null,
        tone: tone || 'professional'
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving email:', saveError)
      return NextResponse.json(
        { error: 'Failed to save email' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'email_saved',
      description: `Saved email: ${subject}`,
      metadata: { emailId: savedEmail.id, leadId }
    })

    return NextResponse.json({
      success: true,
      email: savedEmail
    })

  } catch (error) {
    console.error('Email save error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
