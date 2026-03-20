'use client'

import { motion } from 'framer-motion'
import { Facebook, Play, Video, BookOpen, DollarSign, CheckCircle2, ExternalLink, Lightbulb, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const niches = [
  "ALL NICHES", "WEIGHT LOSS", "MAKE MONEY ONLINE", "HEALTH & FITNESS",
  "BEAUTY & SKINCARE", "RELATIONSHIPS", "TECH & GADGETS", "PETS", "HOME & GARDEN"
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function InstantIncomePage() {
  const [activeNiche, setActiveNiche] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [showPosts, setShowPosts] = useState(false)
  const [copiedPost, setCopiedPost] = useState<number | null>(null)

  const currentStep = !activeNiche ? 1 : !affiliateLink ? 2 : !showPosts ? 3 : 4

  const samplePosts: { title: string; text: string }[] = activeNiche ? [
    {
      title: `${activeNiche} Success Story`,
      text: `I used to struggle so much with ${activeNiche.toLowerCase()}... I tried everything and nothing worked. Then a friend recommended this and honestly it changed everything for me 🙌\n\nIf anyone is going through the same thing, check this out — it seriously helped me more than anything else I've tried:\n\n${affiliateLink || '[YOUR LINK]'}\n\nHappy to answer any questions! 💬`
    },
    {
      title: `Quick ${activeNiche} Tip`,
      text: `Hey everyone! 👋 Just wanted to share something that's been a game changer for me in the ${activeNiche.toLowerCase()} space.\n\nI've been using this resource and the results have been incredible. Honestly wish I found it sooner.\n\nHere it is if anyone wants to check it out: ${affiliateLink || '[YOUR LINK]'}\n\nLet me know what you think! 🔥`
    },
    {
      title: `My ${activeNiche} Journey`,
      text: `Can I be real for a second? 6 months ago I was ready to give up on ${activeNiche.toLowerCase()}. Nothing was working.\n\nThen I stumbled on this and everything clicked. I'm not saying it's magic, but the difference has been night and day.\n\nIf you're where I was, give this a look: ${affiliateLink || '[YOUR LINK]'}\n\nWould love to hear your experiences too! ❤️`
    },
  ] : []

  const handleCopyPost = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPost(index)
    setTimeout(() => setCopiedPost(null), 2000)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto pb-20"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden flex flex-col lg:flex-row shadow-2xl mb-8">
          {/* Left: Video */}
          <div className="lg:w-1/2 relative min-h-[280px] lg:min-h-[380px] bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-white/5 flex items-center justify-center p-8 group overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D946EF]/20 via-[#111111]/80 to-[#111111] opacity-80" />

            <button className="relative z-10 w-20 h-20 bg-[#D946EF] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.4)] transform group-hover:scale-110 transition-all duration-300">
              <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
            </button>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-white text-xs font-black uppercase tracking-widest bg-black/60 py-2 px-5 rounded-full backdrop-blur-md border border-white/10">
                <Video className="w-3 h-3 inline-block mr-2 -mt-0.5" /> WATCH TUTORIAL
              </span>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D946EF]/5 to-transparent pointer-events-none" />

            <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center mb-4">
              <Facebook className="w-6 h-6 text-[#1877F2]" fill="currentColor" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white mb-1 leading-tight">
              INSTANT INCOME:<br /> <span className="text-[#D946EF]">FACEBOOK POSTS</span>
            </h1>

            <h2 className="text-xs font-black uppercase text-[#D946EF] tracking-widest mb-4">
              200+ READY-TO-POST MESSAGES
            </h2>

            <p className="text-zinc-400 text-sm font-medium tracking-wide leading-relaxed max-w-md">
              Copy proven posts, paste them in Facebook groups, and start generating income today. No tech skills needed.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Facebook Group Guide — Horizontal */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-4 pl-1">
          <BookOpen className="w-5 h-5 text-[#D946EF]" />
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
            HOW TO FIND & POST IN FACEBOOK GROUPS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/5 bg-[#111111] p-5">
            <h3 className="text-sm font-black italic tracking-tight text-white mb-3">
              <span className="text-[#3b82f6]">STEP 1:</span> FIND GROUPS
            </h3>
            <ul className="space-y-2">
              {[
                'Search keywords like "weight loss support" or "make money online" on Facebook',
                'Click "Groups" in the sidebar to filter results',
                'Join 10–15 groups with 5,000+ members',
              ].map((text, i) => (
                <li key={i} className="flex gap-2 text-xs text-zinc-400 font-medium">
                  <div className="w-1 h-1 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111111] p-5">
            <h3 className="text-sm font-black italic tracking-tight text-white mb-3">
              <span className="text-[#3b82f6]">STEP 2:</span> CHECK RULES
            </h3>
            <ul className="space-y-2">
              {[
                'Click "About" in each group to read the rules',
                'Our posts are written as personal stories — usually allowed',
                'If a group says "no links", send the link via DM to people who ask',
              ].map((text, i) => (
                <li key={i} className="flex gap-2 text-xs text-zinc-400 font-medium">
                  <div className="w-1 h-1 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111111] p-5">
            <h3 className="text-sm font-black italic tracking-tight text-white mb-3">
              <span className="text-[#3b82f6]">STEP 3:</span> POST & ENGAGE
            </h3>
            <ul className="space-y-2">
              {[
                'Paste your copied message and hit "Post"',
                'Best times: 7–9 AM, 12–1 PM, 7–9 PM',
                'Post in 3–5 groups/day. Reply to comments within 1 hour!',
              ].map((text, i) => (
                <li key={i} className="flex gap-2 text-xs text-zinc-400 font-medium">
                  <div className="w-1 h-1 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Money Math — Compact */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="rounded-xl border border-white/5 bg-[#0a1118] p-6">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-5 h-5 text-[#eab308]" />
            <h2 className="text-base font-black italic uppercase tracking-tighter text-white">
              HOW MUCH CAN YOU MAKE?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Post in 5 groups/day → if each makes $50/day = $250/day",
              "Do this for 30 days = $7,500/month from copy & paste!",
              "More groups = more income. Scale at your own pace."
            ].map((text, i) => (
              <div key={i} className="flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 text-[#D946EF] shrink-0 mt-0.5" />
                <p className="text-zinc-300 text-xs font-semibold leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* GET YOUR POSTS — Stepped Flow */}
      <motion.div variants={itemVariants}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            GET YOUR POSTS NOW
          </h2>
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= step
                    ? 'bg-[#D946EF] text-black'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}>
                  {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 transition-colors ${
                    currentStep > step ? 'bg-[#D946EF]' : 'bg-zinc-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 md:p-8 space-y-8">
          {/* Step 1: Choose Niche */}
          <div>
            <h3 className="text-sm font-black italic uppercase tracking-tighter text-white mb-4">
              <span className="text-[#D946EF]">STEP 1:</span> CHOOSE YOUR NICHE
            </h3>
            <div className="flex flex-wrap gap-2">
              {niches.map((niche) => (
                <button
                  key={niche}
                  onClick={() => { setActiveNiche(niche); setShowPosts(false) }}
                  className={`px-4 py-2 rounded-full text-xs font-black italic tracking-widest uppercase transition-all
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

          {/* Step 2: Add Your Product Link */}
          {activeNiche && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-black italic uppercase tracking-tighter text-white mb-4">
                <span className="text-[#D946EF]">STEP 2:</span> ADD YOUR PRODUCT / AFFILIATE LINK
              </h3>

              <input
                type="text"
                value={affiliateLink}
                onChange={(e) => { setAffiliateLink(e.target.value); setShowPosts(false) }}
                placeholder="Paste your affiliate link here (e.g. https://digistore24.com/redir/...)"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D946EF]/50 transition-colors mb-4"
              />

              {/* DigiStore Tips */}
              <div className="rounded-xl border border-blue-900/30 bg-[#0a1128]/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-[#60a5fa]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#60a5fa]">
                    Don&apos;t have a link yet? Try DigiStore24
                  </span>
                </div>
                <ol className="space-y-2 mb-4">
                  {[
                    'Create a FREE account at digistore24.com (takes 2 minutes)',
                    'Browse products in your chosen niche and click "Promote"',
                    'Copy your unique affiliate link and paste it above',
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3 text-xs font-medium text-zinc-400">
                      <span className="text-[#60a5fa] font-black">{i + 1}.</span>
                      <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ol>
                <a
                  href="https://www.digistore24.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#60a5fa] hover:text-[#93c5fd] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open DigiStore24
                </a>
              </div>
            </motion.div>
          )}

          {/* Step 3: Get Posts */}
          {activeNiche && affiliateLink && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-black italic uppercase tracking-tighter text-white mb-4">
                <span className="text-[#D946EF]">STEP 3:</span> GET YOUR POSTS
              </h3>

              {!showPosts ? (
                <button
                  onClick={() => setShowPosts(true)}
                  className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-black font-black italic uppercase tracking-widest text-sm py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(217,70,239,0.3)]"
                >
                  🚀 GENERATE MY POSTS NOW
                </button>
              ) : (
                <div className="space-y-4">
                  {samplePosts.map((post, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/5 bg-[#0a0a0a] p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#D946EF]">
                          {post.title}
                        </span>
                        <button
                          onClick={() => handleCopyPost(index, post.text)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            copiedPost === index
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                          }`}
                        >
                          {copiedPost === index ? (
                            <><Check className="w-3 h-3" /> Copied</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy Post</>
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                        {post.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
