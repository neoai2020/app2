import { NextResponse } from 'next/server'

// Use RapidAPI endpoint
const RAPIDAPI_HOST = 'chatgpt-42.p.rapidapi.com'
const RAPIDAPI_URL = `https://${RAPIDAPI_HOST}/gpt4`

export async function POST(request: Request) {
  try {
    const { service, niche, link, type, notes } = await request.json()

    const rapidApiKey = process.env.RAPIDAPI_KEY
    if (!rapidApiKey) {
      return NextResponse.json({ error: 'RAPIDAPI_KEY not configured' }, { status: 500 })
    }

    let prompt = `Create a business outreach email template for an offer. You MUST write this email in a highly professional, corporate, and polished tone. Ensure proper business email etiquette.\n\n`
    
    if (notes) {
      prompt += `User's Custom Instructions / Notes to consider: ${notes}\n\n`
    }

    if (type === 'Affiliate Offer') {
      prompt += `Type: Affiliate Marketing Offer\nLink provided by user: ${link || '[Your Link]'}\nGoal: Recommend a highly useful tool or resource and include the affiliate link.\nFormat: Output ONLY the email body in HTML format. Do not include a subject line. Format the user's link as a short, descriptive HTML anchor tag (e.g., <a href="${link}" style="color: #2563eb; text-decoration: underline;">View Resource</a>) so it appears as a clean blue hyperlink rather than a long raw URL. Use <br> and <p> for spacing.`
    } else if (type === 'Service Offer') {
      prompt += `Type: B2B Service Offer\nService Offered: ${service}\nTarget Niche: ${niche}\nLink provided by user: ${link || '[Your Link]'}\nGoal: Pitch the service to a prospect in the target niche, mentioning how this specific service helps this specific niche. Include a call to action.\nFormat: Output ONLY the email body in HTML format. Do not include a subject line. Format the user's link as a short, descriptive HTML anchor tag (e.g., <a href="${link}" style="color: #2563eb; text-decoration: underline;">View Our Portfolio</a>) so it appears as a clean blue hyperlink rather than a long raw URL. Use <br> and <p> for spacing.`
    } else if (type === 'Partnership') {
      prompt += `Type: B2B Partnership Proposal\nTarget Niche: ${niche}\nLink provided by user: ${link || '[Your Link]'}\nGoal: Propose a strategic partnership or collaboration with a company in the target niche. Mention synergy and mutual value.\nFormat: Output ONLY the email body in HTML format. Do not include a subject line. Format the user's link as a short, descriptive HTML anchor tag (e.g., <a href="${link}" style="color: #2563eb; text-decoration: underline;">Learn More About Us</a>) so it appears as a clean blue hyperlink rather than a long raw URL. Use <br> and <p> for spacing.`
    }

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
            content: 'You are an expert B2B copywriter. Write highly converting, personalized, and professional email templates. Always output purely the HTML body without subjects or markdown wrappers.'
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
    // Depending on the exact wrapper format, we try a few common paths:
    let template = ''
    if (data.result) template = data.result
    else if (data.answer) template = data.answer
    else if (data.choices && data.choices[0] && data.choices[0].message) template = data.choices[0].message.content
    else if (typeof data === 'string') template = data
    else template = JSON.stringify(data)

    template = template.trim()

    return NextResponse.json({ template })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
