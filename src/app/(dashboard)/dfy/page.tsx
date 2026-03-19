'use client'

import { motion } from 'framer-motion'
import { Diamond, Mail, Copy, CheckCircle2, Search, Link as LinkIcon, CheckSquare } from 'lucide-react'
import { useState, useMemo } from 'react'

const getRealisticLeads = (nicheId: string, count: number = 5) => {
  const domains = {
    saas: ['Tech', 'IO', 'AI', 'Software'],
    realestate: ['Realty', 'Properties', 'Homes', 'Estate'],
    ecommerce: ['Shop', 'Store', 'Commerce', 'Apparel'],
    agencies: ['Digital', 'Media', 'Marketing', 'Creative'],
    coaching: ['Coaching', 'Consulting', 'Success', 'Growth'],
    fitness: ['Fit', 'Gym', 'Wellness', 'Health'],
    crypto: ['Crypto', 'Web3', 'Chain', 'Labs'],
    local: ['Plumbing', 'Services', 'Electric', 'Repairs']
  };
  const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Jessica', 'Daniel', 'Olivia', 'Matthew', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const ext = domains[nicheId as keyof typeof domains] || ['Corp', 'Inc', 'LLC', 'Group'];
  
  return Array.from({ length: count }).map((_, i) => {
    const fName = firstNames[(i + nicheId.length) % firstNames.length];
    const lName = lastNames[(i * 3 + nicheId.length) % lastNames.length];
    const company = `${lName} ${ext[i % ext.length]}`;
    const domain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@${domain}`;
    
    return {
      id: i,
      firstName: fName,
      lastName: lName,
      email,
      company: company + (nicheId === 'saas' ? ' Inc.' : ''),
      status: 'Verified'
    }
  });
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

  const currentLeads = useMemo(() => getRealisticLeads(selectedNiche, 5), [selectedNiche])

  const getEmailContent = (lead: { firstName: string; company: string }, link: string, nicheName: string) => {
    return `Subject: Special strategy for ${nicheName}

Hi ${lead.firstName},

I noticed ${lead.company} is doing great work in the ${nicheName} space. We have an exclusive offer that perfectly aligns with your current trajectory and could help scale your operations significantly.

${link ? `You can check out our solution here: ${link}\n\n` : ''}Would you be open to a quick 5-minute chat this week?

Best regards,
[Your Name]`;
  }

  const handleCopy = (index: number, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = () => {
    const nicheName = niches.find(n => n.id === selectedNiche)?.name || ''
    const allEmails = currentLeads.map(lead => 
      `--- To: ${lead.email} ---\n${getEmailContent(lead, userLink, nicheName)}`
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
                  onClick={() => setSelectedNiche(niche.id)}
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
                const emailContent = getEmailContent(lead, userLink, nicheName)
                
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
              
              <div className="py-6 flex justify-center">
                <button className="px-6 py-3 bg-[#D946EF]/10 text-[#D946EF] rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#D946EF]/20 transition-colors border border-[#D946EF]/30">
                  Load More Leads (195 Remaining)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
