import { NextResponse } from 'next/server'

interface PhotonFeature {
  properties: {
    name?: string
    city?: string
    county?: string
    state?: string
    country?: string
    osm_value?: string
    osm_key?: string
  }
}

interface PhotonResponse {
  features?: PhotonFeature[]
}

const PHOTON_TIMEOUT_MS = 6_000

/**
 * Autocomplete for the location field. Proxies the free Photon geocoder
 * (photon.komoot.io) restricted to cities, counties, states and countries,
 * and returns clean "City, State, Country" labels.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const url =
    `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lang=en` +
    `&layer=city&layer=county&layer=state&layer=country`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PHOTON_TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'ProfitLoop/1.0 (location autocomplete)' },
      signal: controller.signal
    })
    if (!res.ok) {
      return NextResponse.json({ suggestions: [] })
    }

    const data = (await res.json()) as PhotonResponse
    const seen = new Set<string>()
    const suggestions: { label: string; type: string }[] = []

    for (const feature of data.features || []) {
      const p = feature.properties
      if (!p.name) continue

      const parts = [p.name]
      if (p.state && p.state !== p.name) parts.push(p.state)
      if (p.country && p.country !== p.name) parts.push(p.country)
      const label = parts.join(', ')

      const key = label.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)

      suggestions.push({
        label,
        type: p.osm_value || p.osm_key || 'place'
      })
      if (suggestions.length >= 6) break
    }

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [] })
  } finally {
    clearTimeout(timer)
  }
}
