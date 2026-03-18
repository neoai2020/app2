import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { DAILY_LEAD_LIMIT } from '@/lib/constants'

interface GoogleMapsPlace {
  title?: string
  address?: string
  phone?: string | null
  website?: string | null
  rating?: number | null
  reviews?: number | null
  gps_coordinates?: {
    latitude: number
    longitude: number
  }
}

interface ScraperAPIResponse {
  place_results?: GoogleMapsPlace[]
  local_results?: GoogleMapsPlace[]
  businesses?: any[]
  local_packs?: any[]
  search_information?: Record<string, unknown>
}

// Fetch real business data from ScraperAPI Google Maps
async function fetchRealLeads(industry: string, location: string, count: number): Promise<GoogleMapsPlace[]> {
  const apiKey = process.env.SCRAPER_API_KEY
  if (!apiKey) {
    throw new Error('SCRAPER_API_KEY is not configured')
  }

  const query = encodeURIComponent(`${industry} in ${location}`)
  const url = `https://api.scraperapi.com/structured/google/search?api_key=${apiKey}&query=${query}`

  console.log('[ScraperAPI] Fetching:', `${industry} in ${location}`)

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[ScraperAPI] Error:', response.status, errorText)
    throw new Error(`ScraperAPI request failed: ${response.status}`)
  }

  const data = await response.json() as ScraperAPIResponse
  
  // ScraperAPI can return data in many different formats depending on the query
  let places: GoogleMapsPlace[] = []
  
  if (data.place_results && data.place_results.length > 0) {
    places = data.place_results
  } else if (data.local_results && data.local_results.length > 0) {
    places = data.local_results
  } else if (data.businesses && data.businesses.length > 0) {
    places = data.businesses.map(b => ({
      title: b.title,
      address: b.location || b.address || location,
      phone: b.telephone_number || b.phone || null,
      website: b.website || null,
      rating: b.rating || null
    }))
  } else if (data.local_packs && data.local_packs.length > 0) {
    places = data.local_packs.map(p => ({
      title: p.title,
      address: p.details?.find((d: string) => d.includes(location)) || location,
      phone: null,
      website: null,
      rating: p.rating || null
    }))
  }
  
  console.log(`[ScraperAPI] Found ${places.length} places in fields:`, 
    Object.keys(data).filter(k => Array.isArray((data as any)[k]) && (data as any)[k].length > 0))
  
  return places.slice(0, count)
}

// Use ChatGPT RapidAPI to generate contact emails from business data
async function generateEmailsForLeads(
  businesses: { name: string; website: string | null; location: string }[]
): Promise<string[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  if (!rapidApiKey) {
    // Fallback: derive emails from website domain
    return businesses.map(b => deriveEmailFromWebsite(b.name, b.website))
  }

  try {
    const businessList = businesses.map((b, i) => 
      `${i + 1}. ${b.name} - Website: ${b.website || 'N/A'} - Location: ${b.location}`
    ).join('\n')

    const response = await fetch('https://chatgpt-42.p.rapidapi.com/gpt4', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `For each business below, generate the most likely business contact email address. Use patterns like info@, contact@, hello@, or the business name pattern. Return ONLY the emails, one per line, numbered to match the list. No explanations.

${businessList}`
          }
        ],
        web_access: false
      })
    })

    if (!response.ok) {
      console.error('[ChatGPT API] Error:', response.status)
      return businesses.map(b => deriveEmailFromWebsite(b.name, b.website))
    }

    const data = await response.json()
    const content = data.result || data.choices?.[0]?.message?.content || ''
    
    // Parse emails from response
    const lines = content.split('\n').filter((line: string) => line.trim())
    const emails: string[] = []
    
    for (let i = 0; i < businesses.length; i++) {
      const line = lines[i] || ''
      // Extract email from line (may contain numbering like "1. email@domain.com")
      const emailMatch = line.match(/[\w.\-+]+@[\w.\-]+\.\w+/)
      if (emailMatch) {
        emails.push(emailMatch[0])
      } else {
        emails.push(deriveEmailFromWebsite(businesses[i].name, businesses[i].website))
      }
    }

    return emails
  } catch (error) {
    console.error('[ChatGPT API] Exception:', error)
    return businesses.map(b => deriveEmailFromWebsite(b.name, b.website))
  }
}

// Fallback: derive email from website domain
function deriveEmailFromWebsite(businessName: string, website: string | null): string {
  if (website) {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`)
      const domain = url.hostname.replace('www.', '')
      return `info@${domain}`
    } catch {
      // URL parsing failed
    }
  }
  
  // Generate from business name
  const domain = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    + '.com'
  return `info@${domain}`
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient() as ReturnType<typeof createAdminClient>

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { industry, location } = body

    if (!industry || !location) {
      return NextResponse.json(
        { error: 'Industry and location are required' },
        { status: 400 }
      )
    }

    // Check today's usage
    const today = new Date().toISOString().split('T')[0]
    const { data: usageData } = await (adminClient as any)
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const usage = usageData as any
    const currentUsage = usage?.leads_allocated || 0

    if (currentUsage >= DAILY_LEAD_LIMIT) {
      return NextResponse.json(
        { error: 'Daily lead limit reached' },
        { status: 429 }
      )
    }

    // Calculate how many leads to allocate
    const remaining = DAILY_LEAD_LIMIT - currentUsage
    const toAllocate = Math.min(10, remaining)

    // Fetch REAL leads from ScraperAPI
    let places: GoogleMapsPlace[]
    try {
      places = await fetchRealLeads(industry, location, toAllocate)
    } catch (scraperError) {
      console.error('[Lead Allocation] ScraperAPI error:', scraperError)
      return NextResponse.json(
        { error: 'Failed to fetch business data. Please try again.' },
        { status: 502 }
      )
    }

    if (places.length === 0) {
      return NextResponse.json(
        { error: 'No businesses found for this industry and location. Try different parameters.' },
        { status: 404 }
      )
    }

    // Generate emails using ChatGPT
    const businessesForEmail = places.map(p => ({
      name: p.title || 'Unknown Business',
      website: p.website || null,
      location: p.address || location
    }))

    const emails = await generateEmailsForLeads(businessesForEmail)

    // Insert leads into database (using existing schema columns)
    const leadsToInsert = places.map((place, index) => ({
      user_id: user.id,
      business_name: place.title || 'Unknown Business',
      website: place.website || null,
      email: emails[index] || `info@unknown.com`,
      location: place.address || location,
      industry: industry,
      status: 'allocated' as const
    }))

    const { data: insertedLeads, error: insertError } = await (adminClient as any)
      .from('leads')
      .insert(leadsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting leads:', JSON.stringify(insertError, null, 2))
      return NextResponse.json(
        { error: `Failed to allocate leads: ${insertError.message}` },
        { status: 500 }
      )
    }

    const actualAllocated = insertedLeads?.length || places.length

    // Update or insert usage record
    if (usage) {
      await (adminClient as any)
        .from('usage_limits')
        .update({ leads_allocated: currentUsage + actualAllocated })
        .eq('id', usage.id)
    } else {
      await (adminClient as any)
        .from('usage_limits')
        .insert({
          user_id: user.id,
          date: today,
          leads_allocated: actualAllocated,
          emails_generated: 0
        })
    }

    // Log activity
    await (adminClient as any).from('activity_logs').insert({
      user_id: user.id,
      action: 'lead_allocated',
      description: `Allocated ${actualAllocated} real leads for ${industry} in ${location}`,
      metadata: { industry, location, count: actualAllocated, source: 'scraperapi' }
    })

    return NextResponse.json({
      success: true,
      leads: insertedLeads,
      allocated: actualAllocated,
      remaining: remaining - actualAllocated
    })

  } catch (error) {
    console.error('Lead allocation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
