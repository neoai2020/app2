'use client'

import { motion } from 'framer-motion'
import { Diamond, Mail, Copy, CheckCircle2, Search, Link as LinkIcon, CheckSquare } from 'lucide-react'
import { useState, useMemo } from 'react'

const LEADS_PER_PAGE = 10

const getRealisticLeads = (nicheId: string) => {
  const domains: Record<string, string[]> = {
    saas: ['Tech', 'IO', 'AI', 'Software', 'Cloud', 'Systems', 'Data', 'Logic'],
    realestate: ['Realty', 'Properties', 'Homes', 'Estate', 'Living', 'Residential', 'Land', 'Housing'],
    ecommerce: ['Shop', 'Store', 'Commerce', 'Apparel', 'Market', 'Outlet', 'Goods', 'Retail'],
    agencies: ['Digital', 'Media', 'Marketing', 'Creative', 'Agency', 'Studios', 'Lab', 'Works'],
    coaching: ['Coaching', 'Consulting', 'Success', 'Growth', 'Academy', 'Institute', 'Edge', 'Peak'],
    fitness: ['Fit', 'Gym', 'Wellness', 'Health', 'Active', 'Strong', 'Vital', 'Body'],
    crypto: ['Crypto', 'Web3', 'Chain', 'Labs', 'Block', 'Token', 'Ledger', 'Node'],
    local: ['Plumbing', 'Services', 'Electric', 'Repairs', 'Pro', 'Masters', 'Solutions', 'Expert']
  }
  const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Jessica', 'Daniel', 'Olivia', 'Matthew', 'Sophia', 'Robert', 'Ashley', 'William', 'Megan', 'Christopher', 'Lauren', 'Andrew', 'Rachel', 'Brandon', 'Nicole']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Clark', 'Lewis', 'Walker']

  const ext = domains[nicheId] || ['Corp', 'Inc', 'LLC', 'Group', 'Co', 'Hub', 'Global', 'Partners']
  const seed = nicheId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  return Array.from({ length: 200 }).map((_, i) => {
    const fIdx = (i * 7 + seed) % firstNames.length
    const lIdx = (i * 13 + seed + 3) % lastNames.length
    const fName = firstNames[fIdx]
    const lName = lastNames[lIdx]
    const company = `${lName} ${ext[i % ext.length]}`
    const domain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@${domain}`

    return {
      id: i,
      firstName: fName,
      lastName: lName,
      email,
      company: company + (nicheId === 'saas' ? ' Inc.' : ''),
      status: 'Verified'
    }
  })
}

const niches = [
  { id: 'saas', name: 'SaaS & Software', count: 200, icon: '💻' },
  { id: 'realestate', name: 'Real Estate & Realtors', count: 200, icon: '🏠' },
  { id: 'ecommerce', name: 'E-commerce Brands', count: 200, icon: '🛍️' },
  { id: 'agencies', name: 'Digital Marketing Agencies', count: 200, icon: '🚀' },
  { id: 'coaching', name: 'High-Ticket Coaching', count: 200, icon: '🎯' },
  { id: 'fitness', name: 'Fitness & Health Centers', count: 200, icon: '💪' },
  { id: 'crypto', name: 'Web3 & Crypto Projects', count: 200, icon: '⛓️' },
  { id: 'local', name: 'Local Services (Plumbers/Electricians)', count: 200, icon: '🔧' },
]

export default function DFYPage() {
  const [selectedNiche, setSelectedNiche] = useState(niches[0].id)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [userLink, setUserLink] = useState('')
  const [copiedAll, setCopiedAll] = useState(false)
  const [visibleCount, setVisibleCount] = useState(LEADS_PER_PAGE)

  const allLeads = useMemo(() => getRealisticLeads(selectedNiche), [selectedNiche])
  const currentLeads = useMemo(() => allLeads.slice(0, visibleCount), [allLeads, visibleCount])
  const remaining = 200 - visibleCount

  const handleSelectNiche = (nicheId: string) => {
    setSelectedNiche(nicheId)
    setVisibleCount(LEADS_PER_PAGE)
  }

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LEADS_PER_PAGE, 200))
  }

  const getEmailContent = (lead: { firstName: string; company: string; id: number }, link: string, nicheId: string, nicheName: string) => {
    const nicheData: Record<string, { painPoints: string[]; results: string[]; methods: string[]; audiences: string[] }> = {
      saas: {
        painPoints: [
          'trial-to-paid conversion rates are stalling',
          'customer acquisition costs keep climbing',
          'your sales pipeline has gaps that slow growth',
          'churn is eating into your monthly recurring revenue',
          'scaling outbound outreach takes too many resources',
          'inbound leads alone aren\'t hitting your growth targets',
          'your competitors are outpacing you in new signups',
          'demo bookings have plateaued despite great product updates',
          'your sales team is spending too much time on unqualified leads',
          'enterprise deals are taking too long to close',
        ],
        results: [
          'a 35% increase in qualified demo bookings within 60 days',
          '$50K+ in new ARR added in the first quarter alone',
          'a 40% reduction in customer acquisition cost',
          '25 new enterprise-level conversations per month',
          'a 3x improvement in outbound response rates',
          'pipeline growth of $200K+ in 90 days',
          '18 new paying customers per month on average',
          'a consistent flow of 30+ qualified leads every week',
          'a 28% lift in trial-to-paid conversions',
          'deal velocity improvements of 45% across the board',
        ],
        methods: [
          'AI-driven personalized outreach that targets decision-makers at companies actively searching for solutions like yours',
          'automated lead generation that identifies high-intent prospects based on technographic and firmographic data',
          'a done-for-you email campaign system that generates custom pitches for each prospect in your pipeline',
          'precision targeting that finds companies using competitor products and positions your solution as the upgrade',
          'an outreach engine that writes, sends, and follows up with prospects while your team focuses on closing',
        ],
        audiences: ['CTOs', 'product managers', 'VP of Engineering teams', 'startup founders', 'heads of growth'],
      },
      realestate: {
        painPoints: [
          'finding motivated sellers in your area has become harder than ever',
          'the leads from Zillow and Realtor.com are shared with a dozen other agents',
          'your pipeline is inconsistent — feast one month, famine the next',
          'open houses aren\'t generating the buyer interest they used to',
          'you\'re spending too much on advertising with unpredictable returns',
          'expired listings in your market are being scooped up by competitors',
          'FSBO homeowners in your area don\'t know you exist yet',
          'referrals alone can\'t sustain the growth you\'re aiming for',
          'your follow-up process is manual and leads are slipping through the cracks',
          'new agents in your market are undercutting commissions and stealing clients',
        ],
        results: [
          '15-30 new qualified buyer and seller leads per week',
          '3-5 additional closings per month from outreach alone',
          'a fully booked calendar of listing appointments within 30 days',
          'exclusive leads that no other agent in your area is getting',
          '12 new seller appointments booked in the first two weeks',
          'a 200% increase in listing inquiries without additional ad spend',
          '8 new buyer consultations per week on average',
          'a steady pipeline of motivated sellers reaching out to you directly',
          'a 60% response rate on personalized seller outreach campaigns',
          'consistent month-over-month growth in both listings and closings',
        ],
        methods: [
          'targeted outreach to homeowners in your area who are showing signs of selling — job changes, equity milestones, and life events',
          'automated prospecting that identifies motivated buyers based on search behavior and pre-approval status',
          'personalized email campaigns that position you as the go-to agent in your specific neighborhood and price range',
          'a system that reaches out to expired and withdrawn listings with compelling re-listing proposals',
          'direct outreach to FSBO homeowners showing them the value of professional representation with data from recent comps',
        ],
        audiences: ['homeowners', 'first-time buyers', 'investors', 'relocating families', 'downsizers'],
      },
      ecommerce: {
        painPoints: [
          'rising ad costs on Meta and Google are squeezing your margins',
          'your DTC model is strong but you\'re missing the wholesale opportunity',
          'customer acquisition costs have doubled in the past year',
          'you\'re too dependent on a single sales channel for revenue',
          'competitors with bigger budgets are outbidding you on every platform',
          'your email list growth has slowed and open rates are declining',
          'seasonal fluctuations make revenue unpredictable',
          'you haven\'t tapped into corporate gifting or bulk order opportunities',
          'influencer partnerships are expensive and results are inconsistent',
          'your brand has amazing products but not enough people know about them',
        ],
        results: [
          'a 30% increase in revenue from B2B wholesale channels in 90 days',
          '15 new retail partnership inquiries per month',
          'corporate gifting contracts worth $10K-$50K per order',
          'a diversified revenue stream that doesn\'t depend on paid ads',
          '20+ new wholesale accounts opened in the first quarter',
          'a 40% lift in average order value from B2B relationships',
          'distribution deals with regional and national retailers',
          'consistent monthly bulk orders from corporate clients',
          'a pipeline of influencers and ambassadors eager to promote your products',
          'revenue growth of 25-40% without increasing ad spend by a dollar',
        ],
        methods: [
          'automated outreach to retail buyers and purchasing managers at stores that carry products similar to yours',
          'a B2B prospecting engine that identifies companies with corporate gifting programs and introduces your product line',
          'personalized pitch campaigns targeting boutique retailers, subscription box curators, and online marketplace sellers',
          'strategic partnership outreach that connects your brand with complementary businesses for cross-promotion deals',
          'an influencer discovery and outreach system that finds creators in your niche and proposes collaboration terms',
        ],
        audiences: ['retail buyers', 'purchasing managers', 'subscription box curators', 'corporate gift coordinators', 'boutique owners'],
      },
      agencies: {
        painPoints: [
          'the feast-or-famine cycle makes it impossible to plan ahead',
          'you\'re delivering incredible results but your pipeline is always thin',
          'referrals are great but they\'re completely unpredictable',
          'you\'re competing against agencies that undercut on price',
          'scaling past your current revenue requires a repeatable client acquisition system',
          'your team spends more time pitching than actually doing client work',
          'inbound leads from your website have plateaued',
          'proposals take hours to write and most don\'t convert',
          'you know you could handle more clients but finding them is the bottleneck',
          'retainer clients are leaving and replacement takes months',
        ],
        results: [
          '10-20 qualified discovery calls booked per month without ad spend',
          '5 new retainer clients signed in the first 60 days',
          'a predictable pipeline that eliminates the feast-or-famine cycle',
          '$30K+ in new monthly retainer revenue within 90 days',
          'a 50% reduction in time spent on business development',
          'a fully booked discovery call calendar three weeks out',
          '8 new high-value client relationships started per month',
          'consistent growth to $50K+ monthly revenue',
          'a 35% close rate on outreach-generated leads',
          'long-term retainer agreements averaging $3K-$8K per month',
        ],
        methods: [
          'targeted outreach to businesses actively hiring freelancers or posting job ads for the services your agency provides',
          'automated prospecting that identifies companies with outdated websites, weak SEO, or underperforming ad campaigns',
          'personalized audit-based outreach that shows prospects exactly where they\'re losing money and how you can fix it',
          'a multi-touch email sequence that nurtures cold prospects into booked discovery calls over 14 days',
          'strategic outreach to companies that recently received funding and need to scale their marketing quickly',
        ],
        audiences: ['CEOs of SMBs', 'marketing directors', 'startup founders', 'e-commerce brand owners', 'VP of marketing teams'],
      },
      coaching: {
        painPoints: [
          'you\'re amazing at coaching but marketing yourself feels inauthentic',
          'your calendar has gaps where high-ticket clients should be',
          'social media content creation takes hours and the ROI is unclear',
          'you know your coaching transforms lives but not enough people know you exist',
          'group programs aren\'t filling because organic reach keeps declining',
          'you\'re stuck trading time for money without a scalable client system',
          'your competitors with less experience are somehow getting more clients',
          'webinar attendance has dropped and conversion rates are declining',
          'you\'re relying on one referral source and it\'s not sustainable',
          'premium clients who can afford your rates are hard to find and reach',
        ],
        results: [
          '15-25 discovery calls booked per month with pre-qualified prospects',
          '5 new high-ticket clients enrolled in the first 30 days',
          'a fully booked coaching calendar three weeks in advance',
          'average client values of $5,000-$15,000 from outreach-generated leads',
          'a waitlist of qualified prospects eager to work with you',
          'group program enrollment increases of 40% per cohort',
          'a predictable monthly income without relying on social media algorithms',
          '10 new premium client conversations per week',
          'revenue growth from $10K to $30K+ per month within one quarter',
          'a client acquisition system that runs while you focus on coaching',
        ],
        methods: [
          'personalized outreach to executives and professionals who match your ideal client profile based on their career stage and goals',
          'automated prospecting that identifies people actively investing in personal development, courses, and coaching programs',
          'a warm introduction system that connects you with high-net-worth individuals through strategic professional networks',
          'targeted outreach to HR directors and corporate training managers who book coaches for leadership development programs',
          'a referral amplification system that turns every satisfied client into a source of 3-5 warm introductions',
        ],
        audiences: ['executives', 'entrepreneurs', 'HR directors', 'professionals in career transitions', 'high-net-worth individuals'],
      },
      fitness: {
        painPoints: [
          'membership churn is eating into your monthly revenue',
          'new gym openings in your area are stealing potential members',
          'your social media posts aren\'t converting followers into paying members',
          'class attendance fluctuates wildly and makes scheduling difficult',
          'corporate wellness programs in your area don\'t know you exist',
          'seasonal dips in January-resolved motivation leave your gym half empty by March',
          'you\'re competing on price when you should be competing on value',
          'personal training slots are empty during peak hours',
          'your referral program isn\'t generating the word-of-mouth it used to',
          'online fitness options are pulling members away from in-person gyms',
        ],
        results: [
          '30-50 new member sign-ups per month from targeted outreach',
          'corporate wellness contracts worth $5K-$20K annually',
          'a 40% increase in personal training bookings within 60 days',
          'packed group fitness classes with waitlists for popular time slots',
          '25 new trial memberships booked per week',
          'member retention improvements of 35% through automated re-engagement',
          'partnerships with 10+ local businesses for employee wellness programs',
          'a 50% reduction in empty class slots during off-peak hours',
          'consistent month-over-month membership growth of 15-20%',
          'a referral pipeline generating 10+ new members per week organically',
        ],
        methods: [
          'targeted outreach to local residents who have recently searched for gyms, fitness classes, or personal trainers in your area',
          'corporate wellness proposals sent directly to HR managers and office managers at businesses within a 10-mile radius',
          'automated re-engagement campaigns that bring back former members with personalized offers based on their past activity',
          'partnership outreach to physical therapists, chiropractors, and nutritionists for cross-referral programs',
          'community outreach to local schools, sports teams, and organizations offering group training packages',
        ],
        audiences: ['local residents', 'HR managers', 'former members', 'corporate employees', 'community organizations'],
      },
      crypto: {
        painPoints: [
          'getting noticed in a space with thousands of competing projects feels impossible',
          'your community growth has stalled despite a strong product',
          'VCs and angel investors aren\'t seeing your pitch deck',
          'exchange listings require connections you haven\'t built yet',
          'KOL partnerships are expensive and often deliver fake engagement',
          'your token launch needs more visibility among serious investors',
          'Twitter and Discord growth strategies have diminishing returns',
          'competitors with weaker fundamentals are getting more attention',
          'institutional investors don\'t know your project exists',
          'your developer community needs to grow for ecosystem health',
        ],
        results: [
          'meetings with 15+ VCs and institutional investors per month',
          'exchange listing conversations initiated within the first 30 days',
          'strategic partnerships with 5+ complementary blockchain projects',
          'KOL collaborations that generate authentic community growth',
          'a 300% increase in qualified investor inquiries',
          'advisory board introductions from industry veterans',
          'grant program approvals from major blockchain foundations',
          'media coverage in top crypto publications',
          'community growth of 5,000+ real members in 90 days',
          'a pipeline of potential integration partners actively reaching out',
        ],
        methods: [
          'targeted outreach to crypto-focused VCs and angel investors who have recently invested in projects similar to yours',
          'exchange listing outreach with professionally crafted applications and follow-up sequences to listing managers',
          'KOL discovery and partnership proposals that offer authentic collaboration rather than pay-per-post deals',
          'strategic partnership outreach to complementary blockchain projects for integrations, shared liquidity, and co-marketing',
          'developer community building through outreach to blockchain engineers on GitHub, Stack Overflow, and developer forums',
        ],
        audiences: ['VCs', 'exchange listing managers', 'KOLs', 'blockchain developers', 'DeFi protocol teams'],
      },
      local: {
        painPoints: [
          'your phone isn\'t ringing as much as it used to',
          'competing on HomeAdvisor and Thumbtack means racing to the bottom on price',
          'seasonal slowdowns leave your crew without work for weeks',
          'new competitors are popping up and undercutting your prices',
          'your Google reviews are great but they\'re not enough to fill your schedule',
          'commercial contracts would be great but you don\'t know how to land them',
          'your marketing budget is limited and big advertising doesn\'t make sense',
          'word-of-mouth referrals have slowed down in your area',
          'emergency calls are unpredictable and you need more scheduled work',
          'property management companies in your area don\'t have you on their vendor list',
        ],
        results: [
          '15-25 new job bookings per month from targeted outreach alone',
          'commercial maintenance contracts worth $2K-$10K per month',
          'a fully booked schedule two weeks out at all times',
          'property management partnerships generating 10+ recurring jobs per month',
          'a 50% increase in scheduled (non-emergency) work',
          'new construction and renovation referrals from general contractors',
          'a waiting list of customers during your previously slow season',
          'corporate facility maintenance agreements with local businesses',
          '20+ new customer relationships started per month',
          'consistent year-round revenue that eliminates seasonal dips',
        ],
        methods: [
          'automated outreach to property management companies in your service area offering preferred vendor rates and guaranteed response times',
          'targeted prospecting of real estate agents who need reliable service providers for pre-listing repairs and buyer inspections',
          'commercial outreach to office buildings, restaurants, and retail stores that need ongoing maintenance and emergency services',
          'neighborhood-targeted campaigns reaching homeowners in high-income zip codes with personalized service offers',
          'general contractor partnership outreach for subcontracting opportunities on renovation and new construction projects',
        ],
        audiences: ['property managers', 'real estate agents', 'homeowners', 'commercial building managers', 'general contractors'],
      },
    }

    const subjects = [
      `Quick idea for {company}`,
      `{firstName}, I have a question for you`,
      `Thought of {company} when I saw this`,
      `{firstName} — {painSnippet}?`,
      `A strategy that could help {company}`,
      `{firstName}, {result} — interested?`,
      `{company} + our system = {resultShort}`,
      `Can {company} handle more {audience}?`,
      `{firstName}, this is working for {nicheName} businesses`,
      `One idea to change {company}'s trajectory`,
      `{firstName}, saw {company} and had to reach out`,
      `What if {company} could {resultShort}?`,
      `{firstName} — quick opportunity for {company}`,
      `The {nicheName} strategy nobody talks about`,
      `{firstName}, your competitors don't want you to see this`,
      `{company} is leaving money on the table`,
      `{firstName}, {resultShort} without extra effort`,
      `A {nicheName} growth idea for {company}`,
      `{firstName}, 5 minutes could change everything for {company}`,
      `I found something {company} needs to see`,
    ]

    const openers = [
      `I came across {company} and was genuinely impressed by what you've built.`,
      `{firstName}, I've been researching top {nicheName} businesses and {company} stood out.`,
      `I'll keep this brief because I know you're busy running {company}.`,
      `I noticed something about {company} that most people would miss.`,
      `{firstName}, I don't send emails like this often — but {company} caught my attention.`,
      `I spent time looking into {company}'s market, and I see a massive opportunity.`,
      `{firstName}, this might be the most important email you read this week.`,
      `I've been working with {nicheName} businesses for years, and {company} is exactly the kind of company we help best.`,
      `I was talking to another {nicheName} professional last week and they mentioned a challenge — it reminded me of {company}.`,
      `{firstName}, I'm reaching out because I genuinely believe {company} deserves more {audience} than it's currently getting.`,
      `Something tells me {company} is ready for a growth spurt — and I might be able to help.`,
      `{firstName}, I know you get a lot of emails. I'll make this one worth your time.`,
      `I recently helped a {nicheName} business similar to {company} achieve incredible results — and I immediately thought of you.`,
      `{firstName}, here's the honest truth about the {nicheName} industry right now — {painPoint}. But it doesn't have to be that way.`,
      `I was doing some research in the {nicheName} space and {company} kept coming up. That tells me you're doing something right.`,
      `{firstName}, what if I told you {company} could achieve {result} — would that be worth 5 minutes of your time?`,
      `I'm not going to waste your time with a generic pitch. What I have for {company} is specific and actionable.`,
      `{firstName}, I've helped dozens of {nicheName} businesses overcome the exact challenge {company} is likely facing right now.`,
      `There's a shift happening in the {nicheName} industry, and {company} is in the perfect position to capitalize on it.`,
      `{firstName}, I have a straightforward question — is {company} getting as many {audience} as it should be?`,
    ]

    const pitches = [
      `Here's the situation — {painPoint}. We've built a system that solves this using {method}. The businesses we work with are seeing {result}.`,
      `The reality is that {painPoint}. What we do differently is use {method}. It's not theory — our clients consistently achieve {result}.`,
      `Most {nicheName} businesses struggle because {painPoint}. Our approach is different. We use {method}, and the numbers speak for themselves — {result}.`,
      `I'll be direct — {painPoint}. We've developed {method}. Companies like yours are using it to achieve {result}. No fluff. Just results.`,
      `What we've found is that {painPoint}. The solution we've perfected involves {method}. The outcome? {result}. Every single time.`,
      `Let me share what's working right now — while others struggle because {painPoint}, our partners are thriving with {method}. They're seeing {result}.`,
      `The biggest opportunity I see for {company} is this — {painPoint}, but it doesn't have to be that way. Through {method}, we've helped businesses achieve {result}.`,
      `Here's what nobody in the {nicheName} space is talking about — {painPoint}. The fix is {method}. And when implemented correctly, the results are {result}.`,
      `I want to be honest with you — {painPoint}. But the businesses that work with us solve this fast using {method}. The average outcome is {result}.`,
      `Three things I know about the {nicheName} industry right now: {painPoint}. What I also know is that {method} is delivering {result} for businesses just like yours.`,
    ]

    const closings = [
      `Would you be open to a quick 5-minute call this week to see if this could work for {company}?`,
      `I'd love to show you exactly how this applies to {company}. Do you have 10 minutes this week?`,
      `If this sounds even slightly interesting, let's chat. I can walk you through the specifics in under 10 minutes.`,
      `No pressure at all — but I think {company} would benefit from seeing how this works. Open to a quick call?`,
      `I can send you a detailed breakdown tailored to {company} if you're interested. Just reply "yes" and I'll put it together.`,
      `The worst that happens is you spend 5 minutes learning a new strategy. The best? {company} hits a whole new level. Worth it?`,
      `I've put together a few ideas specifically for {company}. Want me to share them on a quick call?`,
      `If {company} is ready to level up, I'm ready to show you how. Just reply and we'll find 10 minutes that work.`,
      `Let's make this easy — reply with your availability this week and I'll handle the rest.`,
      `I'm confident this could be a game-changer for {company}. Let's find 5 minutes to connect and I'll prove it.`,
    ]

    const d = nicheData[nicheId] || nicheData.saas
    const seed = lead.id

    const painIdx = (seed * 7 + 3) % d.painPoints.length
    const resultIdx = (seed * 11 + 5) % d.results.length
    const methodIdx = (seed * 13 + 7) % d.methods.length
    const audienceIdx = (seed * 3 + 1) % d.audiences.length
    const subjectIdx = (seed * 17 + 2) % subjects.length
    const openerIdx = (seed * 19 + 11) % openers.length
    const pitchIdx = (seed * 23 + 4) % pitches.length
    const closingIdx = (seed * 29 + 6) % closings.length

    const painPoint = d.painPoints[painIdx]
    const result = d.results[resultIdx]
    const method = d.methods[methodIdx]
    const audience = d.audiences[audienceIdx]
    const resultShort = result.split(' ').slice(0, 6).join(' ')
    const painSnippet = painPoint.split(' ').slice(0, 6).join(' ')

    const replacePlaceholders = (text: string) =>
      text
        .replace(/{firstName}/g, lead.firstName)
        .replace(/{company}/g, lead.company)
        .replace(/{nicheName}/g, nicheName)
        .replace(/{painPoint}/g, painPoint)
        .replace(/{painSnippet}/g, painSnippet)
        .replace(/{result}/g, result)
        .replace(/{resultShort}/g, resultShort)
        .replace(/{method}/g, method)
        .replace(/{audience}/g, audience)

    const subject = replacePlaceholders(subjects[subjectIdx])
    const opener = replacePlaceholders(openers[openerIdx])
    const pitch = replacePlaceholders(pitches[pitchIdx])
    const closing = replacePlaceholders(closings[closingIdx])
    const linkBlock = link ? `\nSee how it works here: ${link}\n` : ''

    return `Subject: ${subject}\n\nHi ${lead.firstName},\n\n${opener}\n\n${pitch}${linkBlock}\n\n${closing}\n\nBest regards,\n[Your Name]`
  }

  const handleCopy = (index: number, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = () => {
    const nicheName = niches.find(n => n.id === selectedNiche)?.name || ''
    const allEmails = allLeads.map(lead => 
      `--- To: ${lead.email} ---\n${getEmailContent(lead, userLink, selectedNiche, nicheName)}`
    ).join('\n\n=========================================\n\n')
    
    navigator.clipboard.writeText(allEmails)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-10 bg-[#D946EF] rounded-full shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              ACCELERATOR
            </h1>
          </div>
          <p className="text-zinc-400 max-w-2xl pl-4">
            Exclusive premium access to pre-scraped, highly qualified leads. Each niche contains 200 verified emails with hand-crafted, high-converting copy ready to send.
          </p>
        </div>
        <div className="glass-card px-6 py-4 flex items-center gap-4">
          <Diamond className="text-[#D946EF] w-8 h-8" />
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Total Premium Leads</p>
            <p className="text-2xl font-black text-white">{niches.length * 200}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Niches Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <div className="glass-card p-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search niches..." 
                className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D946EF]/50 transition-colors"
              />
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {niches.map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => handleSelectNiche(niche.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                    selectedNiche === niche.id 
                      ? 'bg-[#D946EF]/10 border border-[#D946EF]/30' 
                      : 'bg-[#111111] border border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{niche.icon}</span>
                    <span className={`font-semibold text-sm ${selectedNiche === niche.id ? 'text-[#D946EF]' : 'text-zinc-300'}`}>
                      {niche.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Content */}
        <div className="xl:col-span-3">
          <div className="glass-card p-6 md:p-8 min-h-[700px]">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 pb-6 border-b border-white/5 gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  {niches.find(n => n.id === selectedNiche)?.icon}
                  {niches.find(n => n.id === selectedNiche)?.name}
                </h2>
                <p className="text-[#D946EF] text-sm mt-1 uppercase tracking-wider font-bold">
                  200 Verified Leads & Pre-written Emails
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="url"
                    placeholder="Your Affiliate Link / Website"
                    value={userLink}
                    onChange={(e) => setUserLink(e.target.value)}
                    className="w-full sm:w-72 bg-[#111111] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#D946EF]/50 transition-colors"
                  />
                </div>
                <button 
                  onClick={handleCopyAll}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-[#D946EF] hover:bg-[#D946EF]/90 text-white rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(217,70,239,0.3)] whitespace-nowrap"
                >
                  {copiedAll ? <CheckSquare className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedAll ? 'Copied All!' : 'Copy All Emails'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Data representing the emails */}
              {currentLeads.map((lead, index) => {
                const nicheName = niches.find(n => n.id === selectedNiche)?.name || ''
                const emailContent = getEmailContent(lead, userLink, selectedNiche, nicheName)
                
                return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#111111] rounded-2xl p-6 border border-white/5 hover:border-[#D946EF]/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#D946EF]/20 flex items-center justify-center text-[#D946EF] font-bold text-xs ring-1 ring-[#D946EF]/30 uppercase">
                          {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                        </div>
                        <h3 className="text-white font-semibold">{lead.firstName} {lead.lastName}</h3>
                      </div>
                      <div className="text-sm text-zinc-400 space-y-1 bg-black/50 p-3 rounded-lg">
                        <p className="truncate"><span className="text-zinc-600">Email:</span> {lead.email}</p>
                        <p><span className="text-zinc-600">Company:</span> {lead.company}</p>
                        <p><span className="text-zinc-600">Status:</span> <span className="text-green-400">{lead.status}</span></p>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 bg-black/40 rounded-xl p-4 border border-white/5 relative group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-[#D946EF] uppercase tracking-wider font-bold flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Pre-written Email
                        </span>
                        <button 
                          onClick={() => handleCopy(index, emailContent)}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          {copiedIndex === index ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle2 className="w-4 h-4" /> Copied</span>
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-sm text-zinc-300 space-y-2 font-mono whitespace-pre-wrap">
                        {emailContent}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )})}
              
              {remaining > 0 && (
                <div className="py-6 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-[#D946EF]/10 text-[#D946EF] rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#D946EF]/20 transition-colors border border-[#D946EF]/30"
                  >
                    Load More Leads ({remaining} Remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
