import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { DAILY_EMAIL_LIMIT } from '@/lib/constants'
import { Lead, Offer, UsageLimit } from '@/types/database'
// Use RapidAPI endpoint
const RAPIDAPI_HOST = 'chatgpt-42.p.rapidapi.com'
const RAPIDAPI_URL = `https://${RAPIDAPI_HOST}/gpt4`

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
    const { leadId, offerId, customOffer, tone } = body

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    if (!offerId && !customOffer) {
      return NextResponse.json(
        { error: 'Either an offer or custom offer description is required' },
        { status: 400 }
      )
    }

    // Check today's usage
    const today = new Date().toISOString().split('T')[0]
    const { data: usageData } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const usage = usageData as UsageLimit | null
    const currentUsage = usage?.emails_generated || 0

    if (currentUsage >= DAILY_EMAIL_LIMIT) {
      return NextResponse.json(
        { error: 'Daily email generation limit reached' },
        { status: 429 }
      )
    }

    // Get lead details
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single()

    const lead = leadData as Lead | null

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Get offer details if offerId provided
    let offerDescription = customOffer
    if (offerId) {
      const { data: offerData } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .eq('user_id', user.id)
        .single()

      const offer = offerData as Offer | null
      if (offer) {
        offerDescription = `${offer.name}: ${offer.description}`
        if (offer.link) {
          offerDescription += ` (Link: ${offer.link})`
        }
      }
    }

    // Generate email using OpenAI
    const toneDescriptions = {
      friendly: 'warm, approachable, and conversational',
      professional: 'formal, business-like, and polished',
      direct: 'clear, concise, and to the point'
    }

    const prompt = `Generate a business outreach email for the following:

Business Name: ${lead.business_name}
Industry: ${lead.industry}
Location: ${lead.location}

Offer/Service to Promote: ${offerDescription}

Tone: ${toneDescriptions[tone as keyof typeof toneDescriptions] || 'professional'}

Requirements:
1. Subject line should be compelling but not spammy
2. Email should be 150-250 words
3. Include a clear call to action
4. Sound human and personalized
5. Do not make false claims or guarantees
6. Do not use excessive punctuation or ALL CAPS
7. Include a brief follow-up email (50-100 words) for if they don't respond

Format your response as JSON:
{
  "subject": "Subject line here",
  "body": "Email body here with proper formatting and line breaks",
  "followUp": "Follow-up email body"
}`

    let generatedEmail = {
      subject: '',
      body: '',
      followUp: ''
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY
    if (rapidApiKey) {
      try {
        const response = await fetch(RAPIDAPI_URL, {
          method: 'POST',
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': RAPIDAPI_HOST,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are a professional email copywriter who creates compliant, human-sounding business outreach emails. Never use spammy language or make unrealistic promises.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            web_access: false
          })
        })

        if (!response.ok) {
          throw new Error(`RapidAPI Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        let content = ''
        if (data.result) content = data.result
        else if (data.answer) content = data.answer
        else if (data.choices && data.choices[0] && data.choices[0].message) content = data.choices[0].message.content
        else if (typeof data === 'string') content = data
        else content = JSON.stringify(data)

        if (content) {
          try {
            // Strip any code block backticks if AI returns markdown
            const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/```([\s\S]*?)```/)
            const jsonStr = jsonMatch ? jsonMatch[1] : content
            generatedEmail = JSON.parse(jsonStr)
          } catch {
            // If JSON parsing fails, extract content manually
            generatedEmail = {
              subject: `Opportunity for ${lead.business_name}`,
              body: content,
              followUp: ''
            }
          }
        }
      } catch (apiError) {
        console.error('RapidAPI error:', apiError)
        // Fall back to template
        generatedEmail = generateFallbackEmail(lead, offerDescription, tone)
      }
    } else {
      // No API key, use fallback
      generatedEmail = generateFallbackEmail(lead, offerDescription, tone)
    }

    // Update usage
    if (usage) {
      await supabase
        .from('usage_limits')
        .update({ emails_generated: currentUsage + 1 })
        .eq('id', usage.id)
    } else {
      await supabase
        .from('usage_limits')
        .insert({
          user_id: user.id,
          date: today,
          leads_allocated: 0,
          emails_generated: 1
        })
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'email_generated',
      description: `Generated ${tone} email for ${lead.business_name}`,
      metadata: { leadId, tone }
    })

    return NextResponse.json({
      success: true,
      ...generatedEmail
    })

  } catch (error) {
    console.error('Email generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateFallbackEmail(
  lead: { business_name: string; industry: string; location: string },
  offerDescription: string,
  tone: string
) {
  const greetings = {
    friendly: "Hi there!",
    professional: "Dear Business Owner,",
    direct: "Hello,"
  }

  const closings = {
    friendly: "Looking forward to chatting!\n\nBest,\n[Your Name]",
    professional: "I look forward to your response.\n\nBest regards,\n[Your Name]",
    direct: "Let me know.\n\n[Your Name]"
  }

  const greeting = greetings[tone as keyof typeof greetings] || greetings.professional
  const closing = closings[tone as keyof typeof closings] || closings.professional

  return {
    subject: `Quick question for ${lead.business_name}`,
    body: `${greeting}

I came across ${lead.business_name} and was impressed by what you're doing in the ${lead.industry} space in ${lead.location}.

I wanted to reach out because I have something that might be valuable for your business:

${offerDescription}

Many businesses similar to yours have found this helpful for growing their customer base and improving their operations.

Would you be open to a quick 10-minute call this week to see if this could be a good fit for ${lead.business_name}?

${closing}`,
    followUp: `${greeting}

I wanted to follow up on my previous email about ${lead.business_name}.

I know you're busy, but I genuinely believe this could help your business. Would you have 10 minutes for a quick call?

${closing}`
  }
}
