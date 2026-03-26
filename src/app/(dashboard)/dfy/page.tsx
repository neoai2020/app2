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
    const templates: Record<string, { subjects: string[]; bodies: string[] }> = {
      saas: {
        subjects: [
          `Quick idea to boost {company}'s user retention`,
          `{firstName}, a growth strategy for {company}`,
          `Saw {company}'s product — had to reach out`,
          `{company} + our solution = faster MRR growth`,
          `How {company} can reduce churn by 30%`,
          `A partnership opportunity for {company}`,
          `{firstName}, one question about {company}'s roadmap`,
          `What top SaaS companies are doing differently`,
          `{company}'s next competitive advantage`,
          `Quick win for {company}'s conversion funnel`,
        ],
        bodies: [
          `I've been following {company}'s growth in the SaaS space and I'm impressed by what your team has built.\n\nI work with software companies to dramatically increase trial-to-paid conversions using a proven outreach system. On average, our partners see a 25-40% lift within the first 60 days.\n\n{link}I'd love to show you how this could work specifically for {company}. Are you free for a 10-minute call this week?`,
          `Congrats on what {company} is building — your product clearly solves a real problem.\n\nI wanted to reach out because we help SaaS companies like yours acquire high-quality B2B leads without spending a fortune on ads. We've helped similar companies add $50K+ in new ARR within 90 days.\n\n{link}Would you be open to a quick conversation about how this could fit into {company}'s growth plan?`,
          `I noticed {company} is scaling in a competitive market, and I think we can help you move faster.\n\nOur system generates qualified leads and personalized outreach at scale — something that typically takes a full sales team to execute. The best part: it works on autopilot.\n\n{link}If this sounds interesting, I'd love 5 minutes of your time to walk through the specifics.`,
          `I came across {company} while researching top players in the SaaS space, and I had to reach out.\n\nWe specialize in helping software companies fill their pipeline with decision-makers who are actively looking for solutions like yours. No cold calling. No generic blasts.\n\n{link}Can we schedule a brief chat this week to see if there's a fit?`,
          `{firstName}, I'll keep this short — I believe {company} is leaving revenue on the table.\n\nMost SaaS companies lose 60% of their leads due to slow or generic follow-up. Our AI-powered system fixes that by generating personalized, high-converting outreach in seconds.\n\n{link}Would it make sense to chat for 5 minutes? I think you'll find this valuable.`,
        ],
      },
      realestate: {
        subjects: [
          `{firstName}, a new way to get listing leads`,
          `How top agents are getting 20+ leads/week`,
          `{company} — ready for more qualified buyers?`,
          `Quick strategy to fill {company}'s pipeline`,
          `{firstName}, stop paying for cold leads`,
          `The outreach system top realtors swear by`,
          `{company} + automated lead gen = more closings`,
          `{firstName}, one idea to double your showings`,
          `What's working right now in real estate lead gen`,
          `A proven way to get more seller leads for {company}`,
        ],
        bodies: [
          `The real estate market is competitive, and I know {company} is always looking for an edge.\n\nI work with agents and brokers to generate a steady flow of qualified buyer and seller leads without relying on Zillow or Realtor.com. Our clients typically see 15-30 new leads per week within the first month.\n\n{link}Would you be interested in learning how this could work for {company}?`,
          `{firstName}, I'll get straight to the point — I help real estate professionals like you fill their calendar with serious buyers and sellers.\n\nNo more chasing cold leads from generic platforms. Our system targets homeowners and buyers in your specific market area with personalized outreach that actually gets responses.\n\n{link}Do you have 5 minutes this week to see if this fits your business?`,
          `I've been watching the market in your area, and I think {company} is perfectly positioned to dominate.\n\nThe agents we work with are closing 3-5 extra deals per month using our automated lead generation and email outreach system. It handles everything from finding prospects to crafting the perfect follow-up.\n\n{link}Would it be worth a quick call to explore how this works?`,
          `{firstName}, most agents I talk to have the same problem — not enough quality leads and too much time wasted on the wrong prospects.\n\nOur system solves both. It identifies motivated buyers and sellers in your area and generates personalized outreach on your behalf. Set it up once, and leads flow in consistently.\n\n{link}Can we chat for 10 minutes? I think {company} would be a great fit.`,
          `I came across {company} and wanted to share something that could significantly boost your closings this quarter.\n\nWe've built a system that helps real estate professionals generate exclusive, high-intent leads without competing on the same platforms as everyone else. Our average client adds 5-10 qualified appointments per month.\n\n{link}Is this something worth exploring? I'd love to show you how it works.`,
        ],
      },
      ecommerce: {
        subjects: [
          `{firstName}, a way to boost {company}'s sales`,
          `How e-commerce brands are scaling without more ads`,
          `{company} — untapped revenue channel inside`,
          `Quick win to increase {company}'s AOV`,
          `{firstName}, your competitors are using this`,
          `The outreach hack growing e-commerce brands use`,
          `{company} + email outreach = more wholesale deals`,
          `How to get {company} in front of bulk buyers`,
          `{firstName}, one strategy to diversify {company}'s revenue`,
          `B2B partnerships that could 3x {company}'s orders`,
        ],
        bodies: [
          `I've been checking out {company}'s store, and your products are impressive.\n\nI wanted to reach out because we help e-commerce brands open up a whole new revenue channel through strategic B2B outreach. Think wholesale partnerships, corporate gifting deals, and bulk orders — all generated through our automated system.\n\n{link}Would you be open to exploring how this could work for {company}?`,
          `{firstName}, most e-commerce brands focus entirely on DTC and ignore the massive B2B opportunity sitting right in front of them.\n\nWe help brands like {company} connect with retailers, corporate buyers, and distributors who want to carry your products. Our clients typically add 20-40% to their revenue within 90 days.\n\n{link}Is this something you'd want to explore? Happy to walk you through it.`,
          `Running an e-commerce brand is tough when you're competing on the same ad platforms as everyone else.\n\nThat's why top brands are using outreach to build direct relationships with buyers, influencers, and retail partners. Our system automates the entire process for {company} — from finding the right contacts to writing personalized pitches.\n\n{link}Can we chat for 5 minutes this week?`,
          `I noticed {company} is doing well in the e-commerce space, and I think we can help you grow even faster.\n\nOur system identifies potential wholesale buyers, retail partners, and high-value B2B clients in your niche, then generates customized outreach that actually converts. No more spray-and-pray marketing.\n\n{link}Would a quick call make sense to see if there's a fit?`,
          `{firstName}, here's a question — what if {company} could add a new revenue stream without increasing your ad spend by a single dollar?\n\nThat's exactly what our outreach system does. It connects you with decision-makers at companies that would love to carry or resell your products. Fully automated. Highly personalized.\n\n{link}Worth a 5-minute conversation? I'd love to show you the potential.`,
        ],
      },
      agencies: {
        subjects: [
          `{firstName}, a client acquisition idea for {company}`,
          `How agencies are landing $5K+ retainers on autopilot`,
          `{company} — ready for a predictable client pipeline?`,
          `The outreach system scaling agencies use`,
          `{firstName}, stop relying on referrals alone`,
          `Quick strategy to land 5 new clients this month`,
          `{company} + automated outreach = booked calendar`,
          `What growing agencies are doing to win more deals`,
          `{firstName}, one system to eliminate feast-or-famine`,
          `A proven client acquisition method for {company}`,
        ],
        bodies: [
          `Running an agency is a rollercoaster — one month you're packed, the next you're scrambling for clients.\n\nWe've built a system that helps agencies like {company} generate a consistent pipeline of qualified prospects. Our clients typically book 10-20 discovery calls per month without spending a dime on ads.\n\n{link}Would you be open to learning how this works?`,
          `{firstName}, I know {company} does great work — but great work alone doesn't fill your pipeline.\n\nOur outreach system helps agencies land high-value retainer clients by targeting businesses that already need your services. Personalized emails, automated follow-ups, and a steady stream of booked calls.\n\n{link}Can we chat for 10 minutes? I think you'll find this incredibly relevant.`,
          `Most agencies I talk to rely on referrals and word-of-mouth. It works — until it doesn't.\n\nOur system gives {company} a predictable, scalable way to acquire new clients. We find the right prospects, generate personalized outreach, and help you book calls with decision-makers who actually have budget.\n\n{link}Is this something worth a quick conversation?`,
          `I came across {company} and was impressed by your portfolio. I wanted to share something that could help you scale faster.\n\nWe help digital agencies automate their client acquisition. Instead of spending hours on proposals and cold calls, our system does the heavy lifting — from prospecting to personalized email outreach.\n\n{link}Would 5 minutes work to walk through how this fits your growth goals?`,
          `{firstName}, what if {company} could add 5-10 new clients per month without hiring a single salesperson?\n\nThat's what our automated outreach system delivers. We target businesses in your ideal client profile, craft compelling outreach, and fill your calendar with qualified meetings. Agencies using our system are scaling past the $50K/month mark consistently.\n\n{link}Worth exploring? Let's set up a quick call.`,
        ],
      },
      coaching: {
        subjects: [
          `{firstName}, fill your coaching calendar this week`,
          `How top coaches are booking 20+ calls/month`,
          `{company} — your next high-ticket client is waiting`,
          `The client attraction system coaches love`,
          `{firstName}, stop undercharging and start scaling`,
          `Quick strategy to land premium coaching clients`,
          `{company} + automated outreach = more enrollments`,
          `How to attract $3K-$10K coaching clients consistently`,
          `{firstName}, one system to scale {company} fast`,
          `The outreach method top coaching businesses use`,
        ],
        bodies: [
          `{firstName}, I know firsthand how challenging it can be to consistently attract high-ticket coaching clients.\n\nThat's why I wanted to reach out about a system we've built specifically for coaches and consultants. It generates qualified leads who are actively seeking transformation — and connects them with you through personalized outreach.\n\n{link}Would you be open to a quick chat about how this could work for {company}?`,
          `Most coaches I know are incredible at delivering results but struggle with the business development side.\n\nOur system handles that for {company}. We find prospects who match your ideal client profile, craft personalized messages that speak to their pain points, and fill your calendar with discovery calls. No cold DMs. No awkward sales tactics.\n\n{link}Can we chat for 5 minutes? I think you'll love this.`,
          `{firstName}, your coaching changes lives — but only if the right people find you.\n\nWe help coaches like you get in front of high-value prospects through automated, personalized outreach. Our clients typically see 15-25 booked calls per month, with average deal sizes of $3,000-$10,000.\n\n{link}Is this worth a quick conversation? I'd love to show you how it works.`,
          `I've been following {company}'s work, and your expertise clearly makes a real impact.\n\nThe challenge most coaches face isn't skill — it's visibility. Our system fixes that by automating your client acquisition. We target professionals and executives who need exactly what you offer, and we make the introduction for you.\n\n{link}Would 10 minutes work to explore if this fits your growth plan?`,
          `{firstName}, here's the truth — the best coaches in the world aren't necessarily the busiest. The busiest ones have systems.\n\nOur automated outreach platform helps coaching businesses like {company} build a predictable pipeline of premium clients. Set it up once, and qualified leads flow in weekly.\n\n{link}Ready to see how? Let's chat.`,
        ],
      },
      fitness: {
        subjects: [
          `{firstName}, fill empty class slots this month`,
          `How top gyms are getting 50+ new members/month`,
          `{company} — your next wave of members is waiting`,
          `The member acquisition system gym owners love`,
          `{firstName}, stop losing members to the competition`,
          `Quick strategy to boost {company}'s membership`,
          `{company} + smart outreach = packed classes`,
          `How fitness businesses are thriving right now`,
          `{firstName}, one idea to grow {company}'s revenue`,
          `The local marketing hack for fitness businesses`,
        ],
        bodies: [
          `{firstName}, I know the fitness industry is more competitive than ever. Standing out in your local market takes more than just great classes and equipment.\n\nThat's why I wanted to introduce you to our member acquisition system. We help gyms and fitness centers like {company} attract motivated, high-intent members through targeted outreach — no expensive ads required.\n\n{link}Would you be interested in learning how this could work for your location?`,
          `Running a fitness business means constantly battling member churn and competition from new gyms popping up everywhere.\n\nOur system helps {company} stay ahead by consistently bringing in new members through automated, personalized outreach to people in your area who are actively looking to get fit. Our clients typically see 30-50 new sign-ups per month.\n\n{link}Can we chat for 5 minutes about how this fits your goals?`,
          `{firstName}, what if {company} could have a waiting list for classes instead of empty spots?\n\nOur outreach system targets fitness-minded people in your area with personalized messages about your programs. No generic ads. No competing in the Instagram algorithm. Just direct, high-converting outreach that fills your schedule.\n\n{link}Worth a quick call to see how this works?`,
          `I came across {company} and love what you're building in the fitness space.\n\nMost gym owners rely on foot traffic and social media — but the smartest ones are using direct outreach to corporate clients, local businesses, and community groups. Our system automates that entire process for you.\n\n{link}Would you be open to exploring how {company} could add a new member acquisition channel?`,
          `{firstName}, here's a stat that might surprise you — 73% of people who want to join a gym never actually walk through the door because nobody reached out to them.\n\nOur system helps {company} be the gym that reaches out first. Automated, personalized, and targeted to your local market. Our fitness clients average a 40% increase in new memberships.\n\n{link}Let's chat for 5 minutes — I'll show you the numbers.`,
        ],
      },
      crypto: {
        subjects: [
          `{firstName}, a growth strategy for {company}`,
          `How Web3 projects are building real communities`,
          `{company} — ready to accelerate adoption?`,
          `The outreach system crypto projects are using`,
          `{firstName}, get {company} in front of the right people`,
          `Quick strategy to grow {company}'s user base`,
          `{company} + targeted outreach = more holders`,
          `How to attract serious investors to {company}`,
          `{firstName}, one system to scale {company}'s reach`,
          `The partnership strategy top crypto projects use`,
        ],
        bodies: [
          `{firstName}, the crypto space is noisy, and getting noticed takes more than a good whitepaper and a Twitter account.\n\nWe help Web3 projects like {company} connect directly with investors, influencers, and potential partners through targeted, personalized outreach. Our clients have secured partnerships, listings, and funding rounds using our system.\n\n{link}Would you be open to a quick conversation about how this could accelerate {company}'s growth?`,
          `Building in Web3 is exciting but challenging — especially when it comes to standing out from thousands of other projects.\n\nOur outreach system helps {company} get in front of the people who matter: VCs, exchange listing managers, KOLs, and strategic partners. Automated, personalized, and built specifically for the crypto space.\n\n{link}Can we chat for 10 minutes? I think {company} would benefit massively from this.`,
          `{firstName}, most crypto projects fail not because of bad tech, but because they can't reach the right audience.\n\nWe fix that for projects like {company}. Our system identifies and connects you with potential investors, community leaders, and ecosystem partners through professional outreach that actually gets responses.\n\n{link}Is this worth exploring? I'd love to show you some case studies.`,
          `I've been following the Web3 space closely, and {company} caught my attention.\n\nThe projects that succeed long-term are the ones building real relationships — not just running airdrops. Our outreach platform helps you connect with high-value contacts in the blockchain ecosystem through automated, personalized messaging.\n\n{link}Would 5 minutes work to discuss how this fits {company}'s strategy?`,
          `{firstName}, what if {company} could get in front of 50+ qualified investors and partners every month without attending a single conference?\n\nOur outreach system makes that possible. We target the exact people your project needs — from angel investors to exchange listing teams — and handle the outreach automatically.\n\n{link}Ready to accelerate? Let's set up a quick call.`,
        ],
      },
      local: {
        subjects: [
          `{firstName}, more jobs for {company} this month`,
          `How local service pros are booking 20+ jobs/week`,
          `{company} — your next customer is searching now`,
          `The lead system local businesses swear by`,
          `{firstName}, stop waiting for the phone to ring`,
          `Quick strategy to fill {company}'s schedule`,
          `{company} + smart outreach = fully booked weeks`,
          `How service businesses are dominating their area`,
          `{firstName}, one idea to grow {company}'s revenue`,
          `The marketing shortcut for local service providers`,
        ],
        bodies: [
          `{firstName}, I know the local services business is all about keeping the schedule full and the phone ringing.\n\nThat's why I wanted to reach out about a system we've built for businesses like {company}. It connects you with homeowners and property managers in your area who need your services right now — through targeted, automated outreach.\n\n{link}Would you be interested in learning how this could keep {company}'s calendar packed?`,
          `Most local service businesses rely on word-of-mouth and a Google listing. Those work — but they're unpredictable.\n\nOur system gives {company} a steady stream of new customers by reaching out to homeowners, real estate agents, and property managers in your service area with personalized messages. Our clients typically add 15-25 new jobs per month.\n\n{link}Can we chat for 5 minutes about how this fits your business?`,
          `{firstName}, what if {company} never had another slow week?\n\nOur outreach system targets people in your area who need services like yours. No expensive ads. No competing with lowballers on lead gen sites. Just direct outreach to qualified homeowners and businesses that results in booked appointments.\n\n{link}Worth a quick conversation? I'd love to show you how it works.`,
          `I came across {company} and wanted to share something that could seriously boost your revenue.\n\nWe help local service providers automate their marketing with personalized outreach to nearby homeowners and commercial properties. Forget competing on HomeAdvisor or Thumbtack — our system brings leads directly to you.\n\n{link}Would 10 minutes work to see if this is a fit for {company}?`,
          `{firstName}, here's what the most successful service businesses do differently — they don't wait for leads. They go get them.\n\nOur system helps {company} do exactly that. We find homeowners and businesses in your area, generate personalized outreach about your services, and book appointments on your behalf. Fully automated.\n\n{link}Ready to fill your schedule? Let's chat.`,
        ],
      },
    }

    const nicheTemplates = templates[nicheId] || templates.saas
    const subjectIdx = lead.id % nicheTemplates.subjects.length
    const bodyIdx = lead.id % nicheTemplates.bodies.length

    const subject = nicheTemplates.subjects[subjectIdx]
      .replace(/{firstName}/g, lead.firstName)
      .replace(/{company}/g, lead.company)

    const linkBlock = link ? `Check out the details here: ${link}\n\n` : ''
    const body = nicheTemplates.bodies[bodyIdx]
      .replace(/{firstName}/g, lead.firstName)
      .replace(/{company}/g, lead.company)
      .replace(/{link}/g, linkBlock)

    return `Subject: ${subject}\n\nHi ${lead.firstName},\n\n${body}\n\nBest regards,\n[Your Name]`
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
              DONE FOR YOU (DFY)
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
