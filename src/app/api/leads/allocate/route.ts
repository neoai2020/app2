import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { DAILY_SEARCH_LIMIT, LEADS_PER_SEARCH } from '@/lib/constants'

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
  organic_results?: any[]
  search_information?: Record<string, unknown>
}

const SCRAPER_TIMEOUT_MS = 45_000
// How many result pages we're willing to walk through to find fresh leads
const MAX_RESULT_PAGES = 5

async function fetchJsonWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SCRAPER_TIMEOUT_MS)
  try {
    return await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
  } finally {
    clearTimeout(timer)
  }
}

// Geocode the location so the Maps endpoint returns businesses near it
async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ProfitLoop/1.0 (lead search)' }
    })
    if (!res.ok) return null
    const results = (await res.json()) as { lat: string; lon: string }[]
    if (!results?.length) return null
    return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
  } catch {
    return null
  }
}

type MapsResultRow = {
  title?: string
  name?: string
  address?: string | string[]
  address_line?: string
  phone?: string | null
  telephone?: string | null
  website?: string | null
  url?: string | null
  rating?: number | null
  stars?: number | null
}

function formatAddress(address: string | string[] | undefined, fallback: string): string {
  if (Array.isArray(address)) {
    return address.filter(Boolean).join(', ') || fallback
  }
  return address || fallback
}

function mapRowsToPlaces(rows: MapsResultRow[], fallbackLocation: string): GoogleMapsPlace[] {
  return rows
    .map(r => ({
      title: r.title || r.name,
      address: formatAddress(r.address ?? r.address_line, fallbackLocation),
      phone: r.phone || r.telephone || null,
      website: r.website || r.url || null,
      rating: r.rating ?? r.stars ?? null
    }))
    .filter(p => Boolean(p.title))
}

function withApiKey(url: string, apiKey: string): string {
  if (url.includes('api_key=')) return url
  return `${url}${url.includes('?') ? '&' : '?'}api_key=${apiKey}`
}

function normalizeBusinessName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * ScraperAPI's mapssearch pages via `next_page_url` (or `nextPageURL`).
 * We keep following pages until we collect `target` businesses that are
 * not in `excludeNames`, or run out of pages. This is what lets a repeat
 * search with the same parameters return the NEXT batch of leads instead
 * of the same ones again.
 */
async function fetchMapsPlaces(
  apiKey: string,
  industry: string,
  location: string,
  target: number,
  excludeNames: Set<string>
): Promise<GoogleMapsPlace[]> {
  const query = encodeURIComponent(`${industry} in ${location}`)
  const coords = await geocodeLocation(location)
  let url: string | null =
    `https://api.scraperapi.com/structured/google/mapssearch?api_key=${apiKey}&query=${query}` +
    (coords ? `&latitude=${coords.lat}&longitude=${coords.lng}` : '')

  const fresh: GoogleMapsPlace[] = []
  const seenInBatch = new Set<string>()

  for (let page = 0; page < MAX_RESULT_PAGES && url && fresh.length < target; page++) {
    const response = await fetchJsonWithTimeout(url)
    if (!response.ok) {
      console.error('[ScraperAPI][maps] HTTP', response.status, 'page', page)
      break
    }

    const data = (await response.json()) as {
      results?: MapsResultRow[]
      next_page_url?: string
      nextPageURL?: string
    }

    const places = mapRowsToPlaces(data.results ?? [], location)
    for (const place of places) {
      const key = normalizeBusinessName(place.title || '')
      if (!key || excludeNames.has(key) || seenInBatch.has(key)) continue
      seenInBatch.add(key)
      fresh.push(place)
      if (fresh.length >= target) break
    }

    const nextUrl = data.next_page_url || data.nextPageURL
    url = nextUrl ? withApiKey(nextUrl, apiKey) : null
  }

  return fresh
}

// Fetch real local businesses from ScraperAPI Google Maps Search,
// with SERP local_packs as a fallback. Excludes businesses the user
// already received for this search.
async function fetchRealLeads(
  industry: string,
  location: string,
  count: number,
  excludeNames: Set<string>
): Promise<GoogleMapsPlace[]> {
  const apiKey = process.env.SCRAPER_API_KEY
  if (!apiKey) {
    throw new Error('SCRAPER_API_KEY is not configured')
  }

  console.log('[ScraperAPI] Fetching:', `${industry} in ${location}`, `(want ${count} fresh)`)

  let places: GoogleMapsPlace[] = []
  try {
    places = await fetchMapsPlaces(apiKey, industry, location, count, excludeNames)
  } catch (err) {
    console.error('[ScraperAPI][maps] request failed:', err)
  }

  // Fallback: SERP local packs / results
  if (places.length === 0) {
    const query = encodeURIComponent(`${industry} in ${location}`)
    const serpUrl = `https://api.scraperapi.com/structured/google/search?api_key=${apiKey}&query=${query}`
    const response = await fetchJsonWithTimeout(serpUrl)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[ScraperAPI][serp] Error:', response.status, errorText.slice(0, 300))
      // If the maps call already worked but simply had no new results,
      // treat this as "no more leads" rather than a hard failure.
      if (excludeNames.size > 0) return []
      throw new Error(`ScraperAPI request failed: ${response.status}`)
    }
    const data = (await response.json()) as ScraperAPIResponse

    let serpPlaces: GoogleMapsPlace[] = []
    if (data.local_results?.length) {
      serpPlaces = data.local_results
    } else if (data.place_results?.length) {
      serpPlaces = data.place_results
    } else if (data.businesses?.length) {
      serpPlaces = data.businesses.map(b => ({
        title: b.title,
        address: b.location || b.address || location,
        phone: b.telephone_number || b.phone || null,
        website: b.website || null,
        rating: b.rating || null
      }))
    } else if (data.local_packs?.length) {
      serpPlaces = data.local_packs.map(p => ({
        title: p.title,
        address:
          (Array.isArray(p.details) ? p.details.find((d: string) => /\d/.test(d)) : null) ||
          location,
        phone: null,
        website: null,
        rating: p.rating || null
      }))
    }

    const seenInBatch = new Set<string>()
    places = serpPlaces.filter(p => {
      const key = normalizeBusinessName(p.title || '')
      if (!key || excludeNames.has(key) || seenInBatch.has(key)) return false
      seenInBatch.add(key)
      return true
    })
  }

  console.log(`[ScraperAPI] Found ${places.length} fresh local businesses`)
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

function normalizedSearchKey(industry: string, location: string): string {
  return `${industry.trim().toLowerCase().replace(/\s+/g, ' ')}|${location.trim().toLowerCase().replace(/\s+/g, ' ')}`
}

export async function POST(request: Request) {
  try {
    // Fail fast with a clear message when server env is incomplete,
    // instead of a generic "Internal server error".
    if (!process.env.SCRAPER_API_KEY) {
      console.error('[Lead Allocation] SCRAPER_API_KEY is not set')
      return NextResponse.json(
        { error: 'Search is not configured on this server yet. Please contact support.' },
        { status: 503 }
      )
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[Lead Allocation] SUPABASE_SERVICE_ROLE_KEY is not set')
      return NextResponse.json(
        { error: 'Search is not configured on this server yet. Please contact support.' },
        { status: 503 }
      )
    }

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

    // Check today's usage — one click = one search, no matter how many leads come back
    const today = new Date().toISOString().split('T')[0]
    const { data: usageData } = await (adminClient as any)
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const usage = usageData as any
    const searchesUsed = usage?.searches_used || 0

    if (searchesUsed >= DAILY_SEARCH_LIMIT) {
      return NextResponse.json(
        { error: "You've used all your searches for today. Come back tomorrow!" },
        { status: 429 }
      )
    }

    // Look for an existing search with the same parameters (same niche + place).
    // If found, we fetch the NEXT batch of qualified leads instead of repeats.
    const searchKey = normalizedSearchKey(industry, location)
    const { data: existingSearchData } = await (adminClient as any)
      .from('searches')
      .select('*')
      .eq('user_id', user.id)
      .eq('normalized_key', searchKey)
      .maybeSingle()

    const existingSearch = existingSearchData as any

    // Businesses this search already produced — never charge for duplicates
    const excludeNames = new Set<string>()
    if (existingSearch) {
      const { data: existingLeads } = await (adminClient as any)
        .from('leads')
        .select('business_name')
        .eq('search_id', existingSearch.id)

      for (const l of (existingLeads as { business_name: string }[]) || []) {
        excludeNames.add(normalizeBusinessName(l.business_name))
      }
    }

    // Fetch REAL leads from ScraperAPI (only ones the user doesn't already have)
    let places: GoogleMapsPlace[]
    try {
      places = await fetchRealLeads(industry, location, LEADS_PER_SEARCH, excludeNames)
    } catch (scraperError) {
      console.error('[Lead Allocation] ScraperAPI error:', scraperError)
      return NextResponse.json(
        { error: 'Failed to fetch business data. Please try again.' },
        { status: 502 }
      )
    }

    if (places.length === 0) {
      if (existingSearch) {
        // Repeat search exhausted — refund it (we never counted it)
        await (adminClient as any)
          .from('searches')
          .update({ last_searched_at: new Date().toISOString() })
          .eq('id', existingSearch.id)

        return NextResponse.json({
          success: true,
          exhausted: true,
          refunded: true,
          leads: [],
          allocated: 0,
          search: existingSearch,
          remainingSearches: DAILY_SEARCH_LIMIT - searchesUsed,
          message:
            'Those were the best income-driving results we could find for this niche and location. We refunded you that search for today.'
        })
      }
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

    // Upsert the search row (repeat searches append to the same search)
    let searchRow = existingSearch
    if (existingSearch) {
      const { data: updatedSearch } = await (adminClient as any)
        .from('searches')
        .update({ last_searched_at: new Date().toISOString() })
        .eq('id', existingSearch.id)
        .select()
        .single()
      if (updatedSearch) searchRow = updatedSearch
    } else {
      const { data: newSearch, error: searchInsertError } = await (adminClient as any)
        .from('searches')
        .insert({
          user_id: user.id,
          industry,
          location,
          normalized_key: searchKey
        })
        .select()
        .single()

      if (searchInsertError || !newSearch) {
        console.error('Error creating search:', JSON.stringify(searchInsertError, null, 2))
        return NextResponse.json(
          { error: 'Failed to record your search. Please try again.' },
          { status: 500 }
        )
      }
      searchRow = newSearch
    }

    // Insert leads into database, linked to their search
    const leadsToInsert = places.map((place, index) => ({
      user_id: user.id,
      search_id: searchRow.id,
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

    // Count this as exactly ONE search (leads_allocated keeps tracking lead volume)
    if (usage) {
      await (adminClient as any)
        .from('usage_limits')
        .update({
          searches_used: searchesUsed + 1,
          leads_allocated: (usage.leads_allocated || 0) + actualAllocated
        })
        .eq('id', usage.id)
    } else {
      await (adminClient as any)
        .from('usage_limits')
        .insert({
          user_id: user.id,
          date: today,
          searches_used: 1,
          leads_allocated: actualAllocated,
          emails_generated: 0
        })
    }

    // Log activity
    await (adminClient as any).from('activity_logs').insert({
      user_id: user.id,
      action: 'lead_allocated',
      description: `Allocated ${actualAllocated} real leads for ${industry} in ${location}`,
      metadata: { industry, location, count: actualAllocated, source: 'scraperapi', search_id: searchRow.id }
    })

    return NextResponse.json({
      success: true,
      exhausted: false,
      refunded: false,
      leads: insertedLeads,
      allocated: actualAllocated,
      search: searchRow,
      remainingSearches: DAILY_SEARCH_LIMIT - (searchesUsed + 1)
    })

  } catch (error) {
    console.error('Lead allocation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
