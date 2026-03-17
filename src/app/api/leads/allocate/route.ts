import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { DAILY_LEAD_LIMIT } from '@/lib/constants'
import { UsageLimit, Database } from '@/types/database'

// Mock business data generator (in production, this would call RapidAPI)
function generateMockLeads(industry: string, location: string, count: number) {
  const businessPrefixes = [
    'Prime', 'Elite', 'Metro', 'City', 'Local', 'Express', 'Pro', 'Quality',
    'First', 'Best', 'Top', 'Star', 'Golden', 'Premium', 'Classic'
  ]

  const businessSuffixes: Record<string, string[]> = {
    'Restaurants & Cafes': ['Restaurant', 'Cafe', 'Bistro', 'Grill', 'Kitchen', 'Diner'],
    'Retail Stores': ['Shop', 'Store', 'Boutique', 'Outlet', 'Mart', 'Emporium'],
    'Professional Services': ['Consulting', 'Solutions', 'Partners', 'Associates', 'Group'],
    'Health & Wellness': ['Wellness Center', 'Health Clinic', 'Spa', 'Fitness', 'Medical'],
    'Home Services': ['Home Services', 'Maintenance', 'Repair', 'Contractors', 'Solutions'],
    'Automotive': ['Auto', 'Motors', 'Automotive', 'Car Care', 'Auto Services'],
    'Real Estate': ['Realty', 'Properties', 'Real Estate', 'Homes', 'Estates'],
    'Legal Services': ['Law Firm', 'Legal', 'Attorneys', 'Law Office', 'Legal Services'],
    'Financial Services': ['Financial', 'Advisors', 'Wealth Management', 'Capital', 'Finance'],
    'Education & Training': ['Academy', 'Institute', 'Learning Center', 'School', 'Training'],
    'Technology Services': ['Tech', 'IT Solutions', 'Digital', 'Systems', 'Software'],
    'Marketing & Advertising': ['Marketing', 'Media', 'Creative', 'Agency', 'Advertising'],
    'Construction': ['Construction', 'Builders', 'Development', 'Contracting', 'Build Co'],
    'Manufacturing': ['Manufacturing', 'Industries', 'Products', 'Factory', 'Production'],
    'Other': ['Services', 'Company', 'Business', 'Enterprise', 'Corp']
  }

  const suffixes = businessSuffixes[industry] || businessSuffixes['Other']

  const leads = []
  for (let i = 0; i < count; i++) {
    const prefix = businessPrefixes[Math.floor(Math.random() * businessPrefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    const businessName = `${prefix} ${suffix}`

    // Generate realistic-looking business email
    const domain = businessName.toLowerCase().replace(/\s+/g, '') + '.com'
    const email = `info@${domain}`

    leads.push({
      business_name: businessName,
      website: `https://www.${domain}`,
      email: email,
      location: location,
      industry: industry
    })
  }

  return leads
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient() as any

    // Get authenticated user - still use regular client for auth context
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { industry, location } = body

    if (!industry || !location) {
      return NextResponse.json(
        { error: 'Industry and location are required' },
        { status: 400 }
      )
    }

    // Check today's usage - using adminClient to bypass RLS
    const today = new Date().toISOString().split('T')[0]
    const { data: usageData } = await adminClient
      .from('usage_limits' as any)
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const usage = usageData as any // Cast to any to bypass type conflicts
    const currentUsage = usage?.leads_allocated || 0

    if (currentUsage >= DAILY_LEAD_LIMIT) {
      return NextResponse.json(
        { error: 'Daily lead limit reached' },
        { status: 429 }
      )
    }

    // Calculate how many leads to allocate
    const remaining = DAILY_LEAD_LIMIT - currentUsage
    const toAllocate = Math.min(Math.min(10, remaining), 10)

    // Generate mock data
    const mockLeads = generateMockLeads(industry, location, toAllocate)

    // Insert leads - using adminClient to bypass RLS
    const leadsToInsert = mockLeads.map(lead => ({
      ...lead,
      user_id: user.id,
      status: 'allocated' as const
    }))

    const { data: insertedLeads, error: insertError } = await adminClient
      .from('leads' as any)
      .insert(leadsToInsert as any)
      .select()

    if (insertError) {
      console.error('Error inserting leads:', JSON.stringify(insertError, null, 2))
      return NextResponse.json(
        { error: `Failed to allocate leads: ${insertError.message}` },
        { status: 500 }
      )
    }

    // Update or insert usage record - using adminClient
    if (usage) {
      await adminClient
        .from('usage_limits' as any)
        .update({ leads_allocated: currentUsage + toAllocate } as any)
        .eq('id', usage.id)
    } else {
      await adminClient
        .from('usage_limits' as any)
        .insert({
          user_id: user.id,
          date: today,
          leads_allocated: toAllocate,
          emails_generated: 0
        } as any)
    }

    // Log activity - using adminClient
    await adminClient.from('activity_logs' as any).insert({
      user_id: user.id,
      action: 'lead_allocated',
      description: `Allocated ${toAllocate} leads for ${industry} in ${location}`,
      metadata: { industry, location, count: toAllocate }
    } as any)

    return NextResponse.json({
      success: true,
      leads: insertedLeads,
      allocated: toAllocate,
      remaining: remaining - toAllocate
    })

  } catch (error) {
    console.error('Lead allocation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
