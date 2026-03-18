'use client'

import { motion } from 'framer-motion'
import { Diamond, Mail, Copy, CheckCircle2, Download, Search } from 'lucide-react'
import { useState } from 'react'

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

  const handleCopy = (index: number) => {
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
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
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  {niches.find(n => n.id === selectedNiche)?.icon}
                  {niches.find(n => n.id === selectedNiche)?.name}
                </h2>
                <p className="text-[#D946EF] text-sm mt-1 uppercase tracking-wider font-bold">
                  200 Verified Leads & Pre-written Emails
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="space-y-6">
              {/* Dummy data to represent the 200 emails */}
              {[1, 2, 3, 4, 5].map((item, index) => (
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
                        <div className="w-8 h-8 rounded-full bg-[#D946EF]/20 flex items-center justify-center text-[#D946EF] font-bold text-xs ring-1 ring-[#D946EF]/30">
                          {item}
                        </div>
                        <h3 className="text-white font-semibold">Lead Contact {item}</h3>
                      </div>
                      <div className="text-sm text-zinc-400 space-y-1 bg-black/50 p-3 rounded-lg">
                        <p><span className="text-zinc-600">Email:</span> contact{item}@example.com</p>
                        <p><span className="text-zinc-600">Company:</span> Agency Pro {item}</p>
                        <p><span className="text-zinc-600">Status:</span> <span className="text-green-400">Verified</span></p>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 bg-black/40 rounded-xl p-4 border border-white/5 relative group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-[#D946EF] uppercase tracking-wider font-bold flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Pre-written Email
                        </span>
                        <button 
                          onClick={() => handleCopy(index)}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          {copiedIndex === index ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle2 className="w-4 h-4" /> Copied</span>
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-sm text-zinc-300 space-y-2 font-mono">
                        <p className="text-white">Subject: Special strategy for {niches.find(n => n.id === selectedNiche)?.name}</p>
                        <p>Hi there,</p>
                        <p>I noticed your company is doing great work in the {niches.find(n => n.id === selectedNiche)?.name} space. We have an exclusive offer that perfectly aligns with your current trajectory and could help scale your operations significantly.</p>
                        <p>Would you be open to a quick 5-minute chat this week?</p>
                        <p>Best regards,<br/>[Your Name]</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
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
