'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Play, Video, Target, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { useState } from 'react'

const niches = [
  "ALL", "WEIGHT LOSS", "MAKE MONEY ONLINE", "HEALTH & FITNESS", 
  "TECH & GADGETS", "BEAUTY & SKINCARE", "RELATIONSHIPS", "PETS", "HOME & GARDEN"
]

const baseSources = [
  { type: "FORUM", difficulty: "EASY", name: "MYFITNESSPAL COMMUNITY", traffic: "200-500 VISITORS/MONTH", time: "10 MIN" },
  { type: "FORUM", difficulty: "EASY", name: "SPARKPEOPLE FORUMS", traffic: "150-400 VISITORS/MONTH", time: "10 MIN" },
  { type: "FORUM", difficulty: "EASY", name: "3FATCHICKS FORUM", traffic: "100-300 VISITORS/MONTH", time: "8 MIN" },
  { type: "SOCIAL", difficulty: "EASY", name: "LOSEIT! REDDIT COMMUNITY", traffic: "300-800 VISITORS/MONTH", time: "5 MIN" },
  { type: "FORUM", difficulty: "MEDIUM", name: "FITNESS.COM FORUMS", traffic: "100-250 VISITORS/MONTH", time: "12 MIN" },
  { type: "SOCIAL", difficulty: "EASY", name: "WEIGHT WATCHERS CONNECT", traffic: "500-1K VISITORS/MONTH", time: "15 MIN" },
  { type: "FORUM", difficulty: "EASY", name: "MYNETDIARY FORUM", traffic: "50-150 VISITORS/MONTH", time: "10 MIN" },
  { type: "SOCIAL", difficulty: "EASY", name: "EAT THIS MUCH COMMUNITY", traffic: "100-200 VISITORS/MONTH", time: "5 MIN" },
  { type: "SOCIAL", difficulty: "EASY", name: "HEALTHY WAGE COMMUNITY", traffic: "80-160 VISITORS/MONTH", time: "10 MIN" },
  { type: "FORUM", difficulty: "HARD", name: "T-NATION FORUMS", traffic: "400-900 VISITORS/MONTH", time: "20 MIN" },
  { type: "FORUM", difficulty: "MEDIUM", name: "WARRIOR FORUM", traffic: "500-1.2K VISITORS/MONTH", time: "15 MIN" },
  { type: "FORUM", difficulty: "HARD", name: "BLACKHATWORLD", traffic: "1K-3K VISITORS/MONTH", time: "25 MIN" }
]

// Generate exactly 102 sources
const trafficSources = Array.from({ length: 102 }).map((_, i) => ({
  id: i + 1,
  ...baseSources[i % baseSources.length]
}))

export default function AutopilotPage() {
  const [activeNiche, setActiveNiche] = useState("ALL")
  const [url, setUrl] = useState("")

  const diffColors = {
    "EASY": "bg-green-500/10 text-green-500",
    "MEDIUM": "bg-yellow-500/10 text-yellow-500",
    "HARD": "bg-red-500/10 text-red-500"
  }

  const typeColors = {
    "FORUM": "bg-blue-500/10 text-blue-500",
    "SOCIAL": "bg-purple-500/10 text-purple-500"
  }

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      {/* Header Back Button */}
      <div className="flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer text-xs font-semibold tracking-widest uppercase mb-4">
        &larr; BACK TO DASHBOARD
      </div>

      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-[#0a1118] p-10 md:p-16 text-center">
        <div className="absolute inset-0 bg-linear-to-b from-[#D946EF]/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D946EF]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#D946EF] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(217,70,239,0.4)]">
            <TrendingUp className="w-8 h-8 text-black" strokeWidth={3} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-2 leading-tight">
            AUTOMATED INCOME -<br/>
            <span className="text-[#D946EF]">TRAFFIC ON AUTOPILOT</span>
          </h1>
          <h2 className="text-sm md:text-base font-black uppercase text-[#D946EF] tracking-widest mt-4 mb-6 leading-relaxed">
            100+ FREE TRAFFIC SOURCES - SUBMIT ONCE, GET<br/>TRAFFIC FOREVER
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm font-medium tracking-wide uppercase max-w-2xl mx-auto leading-loose">
            STOP CHASING TRAFFIC EVERY DAY. SUBMIT YOUR LINK TO THESE 100+ SITES ONCE AND GET
            ONGOING TRAFFIC AUTOMATICALLY. OUR MEMBERS HAVE GENERATED OVER 2.8 MILLION 
            VISITORS USING THESE SOURCES.
          </p>
        </div>
      </div>

      {/* Video Tutorial Section */}
      <div className="rounded-3xl border border-white/5 bg-[#111111] flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 min-h-[250px] relative bg-[#0a0a0a] border-r border-white/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent" />
          <button className="relative z-10 w-16 h-16 bg-[#D946EF] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.5)] transform hover:scale-105 transition-transform group">
             <Play className="w-6 h-6 text-black ml-1 group-hover:scale-110 transition-transform" fill="currentColor" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-xs font-bold uppercase tracking-widest">WATCH AUTOMATED INCOME TUTORIAL</p>
          </div>
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[#D946EF] font-bold text-xs uppercase tracking-widest mb-3">
            <Video className="w-4 h-4" /> WATCH FIRST
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">
            HOW TO USE AUTOMATED INCOME
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Watch this quick tutorial to learn how to submit your link to these 100+ traffic sources and get automated traffic forever!
          </p>
        </div>
      </div>

      {/* How This Works Section */}
      <div className="space-y-6 mt-16">
        <div className="flex items-center gap-3 pl-2 mb-6">
          <Target className="w-6 h-6 text-[#D946EF]" />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            HOW THIS WORKS (SUPER SIMPLE!)
          </h2>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111111] p-8 md:p-10 mb-6">
          <h3 className="text-sm font-black italic tracking-widest text-white mb-6 uppercase">
            THE SECRET TO AUTOMATED TRAFFIC:
          </h3>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed font-medium">
            Most people waste hours every day posting on social media for traffic.
          </p>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-medium">
            But what if you could submit your link ONCE and get traffic for months or even YEARS?
          </p>
          <p className="text-[#D946EF] text-sm font-bold italic tracking-wide">
            That&apos;s exactly what these traffic sources do. You submit once, and they send you visitors automatically - no daily work required!
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: 1, title: "PICK YOUR NICHE", text: "Choose your niche below and get 100+ traffic sources specifically for your market." },
            { step: 2, title: "SUBMIT YOUR LINK", text: "Follow the simple step-by-step instructions to submit your link to each site. Takes 5-15 minutes per site." },
            { step: 3, title: "GET AUTOMATIC TRAFFIC", text: "Once submitted, these sites send you traffic automatically. No daily work needed!" }
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-8">
              <div className="w-10 h-10 rounded-full bg-[#D946EF] flex items-center justify-center text-black font-black text-lg mb-8">
                {item.step}
              </div>
              <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-4">
                {item.title}
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* URL Entry Section */}
      <div className="rounded-4xl border border-white/5 bg-[#111111] p-8 md:p-10 mt-12">
        <div className="flex items-center gap-2 mb-6">
          <LinkIcon className="w-5 h-5 text-[#D946EF]" />
          <h3 className="text-lg font-black italic tracking-wide text-white uppercase">
            ENTER YOUR PAGE URL:
          </h3>
        </div>
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-page-url.com" 
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 px-5 text-sm text-white focus:outline-none focus:border-[#D946EF]/50 transition-colors mb-6 font-mono"
        />
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic mb-10">
          THIS IS THE PAGE YOU WANT TO PROMOTE. WE&apos;LL AUTOMATICALLY INSERT IT IN ALL THE SUBMISSION DESCRIPTIONS BELOW.
        </p>

        <div className="flex flex-wrap gap-3">
          {niches.map((niche) => (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black italic tracking-widest uppercase transition-all
                ${activeNiche === niche 
                  ? 'bg-[#D946EF] text-black shadow-[0_0_15px_rgba(217,70,239,0.3)]' 
                  : 'bg-transparent border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
                }
              `}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="rounded-4xl border border-white/5 bg-[#0a1118] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-12 mb-12">
        <div className="w-full md:w-3/4">
          <h3 className="text-xl font-black italic tracking-tight text-white uppercase mb-2">
            YOUR PROGRESS:
          </h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">
            0 OF 102 SOURCES COMPLETED
          </p>
          <div className="w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5 shadow-inner">
             {/* Progress bar fill would go here */}
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-[#D946EF] italic -mb-1">0%</p>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">COMPLETE</p>
        </div>
      </div>

      {/* 102 Traffic Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {trafficSources.map((source) => (
          <div key={source.id} className="rounded-3xl border border-white/5 bg-[#111111] p-6 hover:border-[#D946EF]/30 transition-colors flex flex-col h-full group">
            <div className="flex gap-2 mb-6">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm ${typeColors[source.type as keyof typeof typeColors]}`}>
                {source.type}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm ${diffColors[source.difficulty as keyof typeof diffColors]}`}>
                {source.difficulty}
              </span>
            </div>
            
            <h4 className="text-white font-black italic uppercase text-lg leading-snug mb-8">
              {source.name}
            </h4>
            
            <div className="mt-auto space-y-4 mb-8">
              <div className="flex items-center gap-2 text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                <TrendingUp className="w-4 h-4 text-zinc-500" /> 
                <span className="text-zinc-500">TRAFFIC:</span> {source.traffic}
              </div>
              <div className="flex items-center gap-2 text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                <Play className="w-4 h-4 text-zinc-500" /> 
                <span className="text-zinc-500">TIME:</span> {source.time}
              </div>
            </div>
            
            <button className="w-full bg-[#D946EF] text-black py-4 rounded-xl text-xs font-black italic uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D946EF]/90 transition-colors">
               VIEW INSTRUCTIONS
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
