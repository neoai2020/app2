'use client'

import { motion } from 'framer-motion'
import { Facebook, Play, Video, BookOpen, DollarSign, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const niches = [
  "ALL NICHES", "WEIGHT LOSS", "MAKE MONEY ONLINE", "HEALTH & FITNESS", 
  "BEAUTY & SKINCARE", "RELATIONSHIPS", "TECH & GADGETS", "PETS", "HOME & GARDEN"
]

export default function InstantIncomePage() {
  const [activeNiche, setActiveNiche] = useState("ALL NICHES")

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      {/* Header Back Button */}
      <div className="flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer text-xs font-semibold tracking-widest uppercase mb-4">
        &larr; BACK TO DASHBOARD
      </div>

      {/* Combined Hero & Video Section */}
      <div className="rounded-4xl border border-white/5 bg-[#111111] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        
        {/* Left: Video */}
        <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[450px] bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-white/5 flex items-center justify-center p-8 group overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700" />
           <div className="absolute inset-0 bg-linear-to-tr from-[#D946EF]/20 via-[#111111]/80 to-[#111111] opacity-80" />
           
           <button className="relative z-10 w-20 h-20 bg-[#D946EF] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.4)] transform group-hover:scale-110 transition-all duration-300">
             <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
           </button>
           
           <div className="absolute bottom-8 left-0 right-0 text-center">
             <span className="text-white text-xs font-black uppercase tracking-widest bg-black/60 py-2.5 px-6 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
               <Video className="w-3 h-3 inline-block mr-2 -mt-0.5" /> WATCH TUTORIAL
             </span>
           </div>
        </div>

        {/* Right: Content */}
        <div className="lg:w-1/2 p-10 md:p-14 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-linear-to-b from-[#D946EF]/5 to-transparent pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center mb-6">
            <Facebook className="w-7 h-7 text-[#1877F2]" fill="currentColor" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-2 leading-tight">
            INSTANT INCOME:<br/> <span className="text-[#D946EF]">FACEBOOK POSTS</span>
          </h1>
          
          <h2 className="text-xs md:text-sm font-black uppercase text-[#D946EF] tracking-widest mb-6">
            200+ READY-TO-POST MESSAGES
          </h2>
          
          <p className="text-zinc-400 text-sm font-medium tracking-wide leading-relaxed mb-8 max-w-md">
            Copy proven posts, paste them in Facebook groups, and start generating income today. No tech skills needed. Watch the quick tutorial to learn exactly how it works!
          </p>

          <div className="flex items-center gap-4">
            <button className="bg-white text-black font-black uppercase italic tracking-widest text-xs py-4 px-8 rounded-xl hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 shadow-xl">
              Start Earning
            </button>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pl-2">
          <BookOpen className="w-6 h-6 text-[#D946EF]" />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            HOW TO FIND & POST IN FACEBOOK GROUPS
          </h2>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-8">
            <h3 className="text-lg font-black italic tracking-tight text-white mb-6">
              <span className="text-[#3b82f6]">STEP 1:</span> FIND FACEBOOK GROUPS
            </h3>
            <ul className="space-y-3">
              {[
                'Go to Facebook and click the search bar at the top. Type keywords like "weight loss support", "make money online", or "fitness motivation"',
                'Click "Groups" in the left sidebar to see only groups (not pages or people)',
                'Join 10-15 groups with 5,000+ members. Bigger groups = more people seeing your posts = more money!',
                'Wait for the group admin to approve you (usually takes 1-24 hours). Be patient - it\'s worth it!'
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-8">
            <h3 className="text-lg font-black italic tracking-tight text-white mb-6">
              <span className="text-[#3b82f6]">STEP 2:</span> READ THE GROUP RULES
            </h3>
            <ul className="space-y-3">
              {[
                'Click "About" in the group to see the rules. Most groups allow personal stories but not direct selling',
                'Our posts are written as personal success stories, so they\'re usually allowed. But always check first!',
                'If a group says "no links", you can still post the message and send the link in private messages to people who ask'
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-8">
            <h3 className="text-lg font-black italic tracking-tight text-white mb-6">
              <span className="text-[#3b82f6]">STEP 3:</span> POST YOUR MESSAGE
            </h3>
            <ul className="space-y-3">
              {[
                'Click "Write something..." in the group. Paste your copied message. Click "Post". That\'s it!',
                'Best times to post: 7-9 AM (before work), 12-1 PM (lunch break), 7-9 PM (after work). People are most active then!',
                'Post in 3-5 different groups per day. DON\'T post in all groups at once or Facebook might think you\'re spamming',
                'When people comment, reply within 1 hour! Be friendly and helpful. This makes your post show up more in the group'
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Money Math Section */}
      <div className="rounded-2xl border border-white/5 bg-[#0a1118] p-8 mt-12">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-[#eab308]" />
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
            HOW MUCH CAN YOU MAKE?
          </h2>
        </div>
        <p className="text-sm text-white font-bold uppercase tracking-wider leading-relaxed mb-6">
          EACH POST CAN GENERATE <span className="text-[#D946EF]">$40-$400</span> PER DAY DEPENDING ON THE NICHE AND HOW MANY GROUPS YOU POST IN. HERE&apos;S THE MATH:
        </p>
        <div className="space-y-4">
          {[
            "Post in 5 groups per day = 5 posts. If each post makes $50/day, that's $250/day total!",
            "Do this for 30 days = $7,500/month. Just from copying and pasting!",
            "The more groups you join and post in, the more money you make. It's that simple!"
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-[#D946EF] shrink-0" />
              <p className="text-zinc-300 text-sm font-semibold">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Niche Selection / Getting Started */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8">
          GET YOUR POSTS NOW
        </h2>
        
        <div className="rounded-4xl border border-white/5 bg-[#111111] p-8 md:p-12 text-left">
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-white mb-6">
            STEP 1: CHOOSE YOUR NICHE
          </h3>
          <div className="flex flex-wrap gap-3 mb-12">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={`px-5 py-2.5 rounded-full text-xs font-black italic tracking-widest uppercase transition-all
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

          {/* Partner Box */}
          <div className="rounded-2xl border border-blue-900/40 bg-[#0a1128] p-8">
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#60a5fa] mb-4">
              <CheckCircle2 className="w-4 h-4" /> WHERE TO GET YOUR AFFILIATE LINK
            </h4>
            <p className="text-zinc-300 text-sm mb-6 max-w-3xl">
              We recommend using <span className="text-[#60a5fa] font-semibold">DigiStore24</span> - a free affiliate marketplace where you can find thousands of products to promote and earn commissions.
            </p>
            <p className="text-xs text-white font-bold uppercase tracking-widest mb-4">HOW TO GET STARTED (3 EASY STEPS):</p>
            <ol className="space-y-3 mb-8">
              {[
                { step: "1.", text: "Go to", link: "digistore24.com", text2: "and create a FREE account (takes 2 minutes)" },
                { step: "2.", text: "Browse products in your chosen niche above and click \"Promote\" on any product", link: null, text2: null },
                { step: "3.", text: "Copy your unique affiliate link and paste it in the box below", link: null, text2: null }
              ].map((item, i) => (
                <li key={i} className="flex gap-4 text-sm font-semibold text-zinc-300">
                  <span className="text-[#60a5fa] font-black">{item.step}</span>
                  <div>
                    {item.text} 
                    {item.link && <a href="#" className="text-[#60a5fa] hover:underline mx-1">{item.link}</a>}
                    {item.text2}
                  </div>
                </li>
              ))}
            </ol>
            
            <button className="w-full bg-[#1e293b] hover:bg-[#334155] border border-blue-800/50 text-[#60a5fa] py-4 rounded-xl text-sm font-black italic tracking-widest uppercase transition-colors">
              CREATE FREE DIGISTORE24 ACCOUNT &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
