'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Play, Video, Target, Link as LinkIcon, ExternalLink, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

const niches = [
  "ALL", "WEIGHT LOSS", "MAKE MONEY ONLINE", "HEALTH & FITNESS",
  "TECH & GADGETS", "BEAUTY & SKINCARE", "RELATIONSHIPS", "PETS", "HOME & GARDEN"
]

const baseSources = [
  { type: "FORUM", difficulty: "EASY", name: "MYFITNESSPAL COMMUNITY", traffic: "200-500 VISITORS/MONTH", time: "10 MIN", url: "https://community.myfitnesspal.com", instructions: ["Create a free account or log in", "Navigate to the forums section relevant to your niche", "Start a new thread sharing a helpful tip or personal story", "Naturally include your link as a resource in your post", "Engage with any replies to boost visibility"] },
  { type: "FORUM", difficulty: "EASY", name: "SPARKPEOPLE FORUMS", traffic: "150-400 VISITORS/MONTH", time: "10 MIN", url: "https://www.sparkpeople.com", instructions: ["Sign up for a free SparkPeople account", "Browse the community forums and find an active thread in your niche", "Write a genuine, helpful reply or start a new discussion", "Include your link as a helpful resource at the end", "Check back to reply to any comments"] },
  { type: "FORUM", difficulty: "EASY", name: "3FATCHICKS FORUM", traffic: "100-300 VISITORS/MONTH", time: "8 MIN", url: "https://www.3fatchicks.com/forum", instructions: ["Register for a free account", "Find a relevant sub-forum for your topic", "Post a helpful message or share a success story", "Add your link naturally within the content", "Stay active to build credibility"] },
  { type: "SOCIAL", difficulty: "EASY", name: "LOSEIT! REDDIT COMMUNITY", traffic: "300-800 VISITORS/MONTH", time: "5 MIN", url: "https://www.reddit.com/r/loseit", instructions: ["Log into Reddit or create an account", "Read the subreddit rules carefully before posting", "Write a genuine post sharing value or asking a question", "Include your link only if it adds genuine value", "Engage with comments to increase post visibility"] },
  { type: "FORUM", difficulty: "MEDIUM", name: "FITNESS.COM FORUMS", traffic: "100-250 VISITORS/MONTH", time: "12 MIN", url: "https://www.fitness.com/forum", instructions: ["Create an account on fitness.com", "Browse the forums and identify active discussion threads", "Contribute with a helpful and detailed post", "Link to your resource where relevant", "Maintain an active presence over the following days"] },
  { type: "SOCIAL", difficulty: "EASY", name: "WEIGHT WATCHERS CONNECT", traffic: "500-1K VISITORS/MONTH", time: "15 MIN", url: "https://www.weightwatchers.com", instructions: ["Join the Weight Watchers community (free or paid)", "Navigate to the Connect section", "Share a motivational post or helpful tip", "Include your link as a useful resource", "Like and comment on other posts to build connections"] },
  { type: "FORUM", difficulty: "EASY", name: "MYNETDIARY FORUM", traffic: "50-150 VISITORS/MONTH", time: "10 MIN", url: "https://www.mynetdiary.com", instructions: ["Register on MyNetDiary", "Go to the community/forum section", "Start a helpful discussion or reply to existing threads", "Share your link as a supplementary resource", "Follow up on any responses"] },
  { type: "SOCIAL", difficulty: "EASY", name: "EAT THIS MUCH COMMUNITY", traffic: "100-200 VISITORS/MONTH", time: "5 MIN", url: "https://www.eatthismuch.com", instructions: ["Create a free account", "Explore community features and discussions", "Post a helpful tip or share your experience", "Include your link where appropriate", "Engage with the community regularly"] },
  { type: "SOCIAL", difficulty: "EASY", name: "HEALTHY WAGE COMMUNITY", traffic: "80-160 VISITORS/MONTH", time: "10 MIN", url: "https://www.healthywage.com", instructions: ["Sign up on HealthyWage", "Navigate to the community section", "Share your journey or a motivational story", "Add your link as a helpful resource", "Comment on other members' posts"] },
  { type: "FORUM", difficulty: "HARD", name: "T-NATION FORUMS", traffic: "400-900 VISITORS/MONTH", time: "20 MIN", url: "https://forums.t-nation.com", instructions: ["Create a T-Nation account", "Spend time reading existing discussions first", "Post a detailed, well-researched contribution", "Only share your link if it genuinely adds value — this is a strict community", "Build reputation before posting promotional content"] },
  { type: "FORUM", difficulty: "MEDIUM", name: "WARRIOR FORUM", traffic: "500-1.2K VISITORS/MONTH", time: "15 MIN", url: "https://www.warriorforum.com", instructions: ["Sign up for a Warrior Forum account", "Add your link to your forum signature/profile", "Start by replying helpfully to existing threads", "Create a new thread sharing a case study or strategy", "Your signature link will get views on every post you make"] },
  { type: "FORUM", difficulty: "HARD", name: "BLACKHATWORLD", traffic: "1K-3K VISITORS/MONTH", time: "25 MIN", url: "https://www.blackhatworld.com", instructions: ["Register on BlackHatWorld", "Read the posting guidelines carefully", "Add your link to your profile/signature first", "Contribute high-value content to build post count", "Create a detailed thread showcasing your resource once you have credibility"] }
]

const trafficSources = Array.from({ length: 102 }).map((_, i) => ({
  id: i + 1,
  ...baseSources[i % baseSources.length]
}))

const STORAGE_KEY = 'autopilot_completed'
const URL_STORAGE_KEY = 'autopilot_url'

function getCompleted(): Set<number> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveCompleted(set: Set<number>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export default function AutopilotPage() {
  const [activeNiche, setActiveNiche] = useState("ALL")
  const [url, setUrl] = useState("")
  const [expandedSource, setExpandedSource] = useState<number | null>(null)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [urlLocked, setUrlLocked] = useState(false)

  useEffect(() => {
    setCompleted(getCompleted())
    const savedUrl = localStorage.getItem(URL_STORAGE_KEY)
    if (savedUrl) {
      setUrl(savedUrl)
      setUrlLocked(true)
    }
  }, [])

  const completedCount = completed.size
  const progressPercent = Math.round((completedCount / trafficSources.length) * 100)

  const toggleComplete = (id: number) => {
    const next = new Set(completed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCompleted(next)
    saveCompleted(next)
  }

  const handleCopyDesc = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSetUrl = () => {
    if (url.trim()) {
      localStorage.setItem(URL_STORAGE_KEY, url.trim())
      setUrlLocked(true)
    }
  }

  const handleChangeUrl = () => {
    setUrlLocked(false)
    localStorage.removeItem(URL_STORAGE_KEY)
  }

  const diffColors: Record<string, string> = {
    "EASY": "bg-green-500/10 text-green-500",
    "MEDIUM": "bg-yellow-500/10 text-yellow-500",
    "HARD": "bg-red-500/10 text-red-500"
  }

  const typeColors: Record<string, string> = {
    "FORUM": "bg-blue-500/10 text-blue-500",
    "SOCIAL": "bg-purple-500/10 text-purple-500"
  }

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a1118] p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D946EF]/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D946EF]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-[#D946EF] flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(217,70,239,0.4)]">
            <TrendingUp className="w-7 h-7 text-black" strokeWidth={3} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white mb-1 leading-tight">
            AUTOMATED INCOME — <span className="text-[#D946EF]">TRAFFIC ON AUTOPILOT</span>
          </h1>
          <h2 className="text-xs font-black uppercase text-[#D946EF] tracking-widest mt-3 mb-4">
            100+ FREE TRAFFIC SOURCES — SUBMIT ONCE, GET TRAFFIC FOREVER
          </h2>
          <p className="text-zinc-400 text-xs font-medium tracking-wide uppercase max-w-2xl mx-auto leading-loose">
            SUBMIT YOUR LINK TO THESE 100+ SITES ONCE AND GET ONGOING TRAFFIC AUTOMATICALLY. NO DAILY WORK REQUIRED.
          </p>
        </div>
      </div>

      {/* Video Tutorial — Compact */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-2/5 min-h-[200px] relative bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          <button className="relative z-10 w-14 h-14 bg-[#D946EF] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.5)] transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
          </button>
        </div>
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[#D946EF] font-bold text-xs uppercase tracking-widest mb-2">
            <Video className="w-4 h-4" /> WATCH FIRST
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2">
            HOW TO USE AUTOMATED INCOME
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Learn how to submit your link to 100+ traffic sources and get automated traffic forever.
          </p>
        </div>
      </div>

      {/* How This Works — Horizontal */}
      <div>
        <div className="flex items-center gap-3 pl-1 mb-4">
          <Target className="w-5 h-5 text-[#D946EF]" />
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
            HOW THIS WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: 1, title: "ENTER YOUR LINK", text: "Paste the URL you want to promote. It gets auto-inserted into every submission." },
            { step: 2, title: "PICK YOUR NICHE", text: "Filter the 100+ traffic sources to find ones relevant to your market." },
            { step: 3, title: "SUBMIT & TRACK", text: "Follow step-by-step instructions for each source. Mark complete to track your progress." }
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-white/5 bg-[#111111] p-5">
              <div className="w-8 h-8 rounded-full bg-[#D946EF] flex items-center justify-center text-black font-black text-sm mb-3">
                {item.step}
              </div>
              <h4 className="text-white font-black italic uppercase tracking-widest text-xs mb-2">
                {item.title}
              </h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* URL Entry */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-5 h-5 text-[#D946EF]" />
          <h3 className="text-base font-black italic tracking-wide text-white uppercase">
            YOUR PROMOTION LINK
          </h3>
        </div>

        {!urlLocked ? (
          <>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-page-url.com"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-4 px-5 text-sm text-white focus:outline-none focus:border-[#D946EF]/50 transition-colors mb-3 font-mono"
            />
            <p className="text-zinc-600 text-xs mb-4">
              This link will be auto-inserted into all submission descriptions below.
            </p>
            <button
              onClick={handleSetUrl}
              disabled={!url.trim()}
              className="bg-[#D946EF] hover:bg-[#c026d3] disabled:opacity-40 disabled:cursor-not-allowed text-black font-black italic uppercase tracking-widest text-xs py-3 px-8 rounded-xl transition-all"
            >
              SAVE & CONTINUE
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0 px-4 py-3 bg-[#0a0a0a] border border-[#D946EF]/20 rounded-xl">
              <p className="text-sm text-[#D946EF] font-mono truncate">{url}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                <CheckCircle2 className="w-4 h-4" /> Link saved
              </span>
              <button
                onClick={handleChangeUrl}
                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors underline"
              >
                Change
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Niche Filter */}
      {urlLocked && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap gap-2">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-black italic tracking-widest uppercase transition-all
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
        </motion.div>
      )}

      {/* Progress */}
      {urlLocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-[#0a1118] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="w-full md:w-3/4">
            <h3 className="text-base font-black italic tracking-tight text-white uppercase mb-1">
              YOUR PROGRESS
            </h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">
              {completedCount} OF {trafficSources.length} SOURCES COMPLETED
            </p>
            <div className="w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#D946EF] to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-[#D946EF] italic -mb-1">{progressPercent}%</p>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">COMPLETE</p>
          </div>
        </motion.div>
      )}

      {/* Traffic Sources Grid */}
      {urlLocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {trafficSources.map((source) => {
            const isExpanded = expandedSource === source.id
            const isDone = completed.has(source.id)
            const submissionText = `Check out this amazing resource that has helped me a lot: ${url}\n\nI highly recommend it for anyone looking to improve in this area. Feel free to ask me any questions!`

            return (
              <div
                key={source.id}
                className={`rounded-xl border bg-[#111111] overflow-hidden transition-colors ${
                  isDone ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 hover:border-[#D946EF]/30'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${typeColors[source.type]}`}>
                        {source.type}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${diffColors[source.difficulty]}`}>
                        {source.difficulty}
                      </span>
                    </div>
                    {isDone && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                  </div>

                  <h4 className="text-white font-black italic uppercase text-sm leading-snug mb-3">
                    {source.name}
                  </h4>

                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {source.traffic}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" /> {source.time}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpandedSource(isExpanded ? null : source.id)}
                    className={`w-full py-3 rounded-lg text-xs font-black italic uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                      isExpanded
                        ? 'bg-[#D946EF]/10 text-[#D946EF] border border-[#D946EF]/30'
                        : 'bg-[#D946EF] text-black hover:bg-[#D946EF]/90'
                    }`}
                  >
                    {isExpanded ? (
                      <><ChevronUp className="w-4 h-4" /> HIDE INSTRUCTIONS</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> VIEW INSTRUCTIONS</>
                    )}
                  </button>
                </div>

                {/* Expanded Instructions */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                        {/* Steps */}
                        <ol className="space-y-2">
                          {source.instructions.map((step, i) => (
                            <li key={i} className="flex gap-3 text-xs text-zinc-400 leading-relaxed">
                              <span className="text-[#D946EF] font-black shrink-0">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>

                        {/* Go to site */}
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 uppercase tracking-wider transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> GO TO {source.name}
                        </a>

                        {/* Copy submission text */}
                        <button
                          onClick={() => handleCopyDesc(source.id, submissionText)}
                          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            copiedId === source.id
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
                          }`}
                        >
                          {copiedId === source.id ? (
                            <><Check className="w-3 h-3" /> COPIED TO CLIPBOARD</>
                          ) : (
                            <><Copy className="w-3 h-3" /> COPY SUBMISSION TEXT (WITH YOUR LINK)</>
                          )}
                        </button>

                        {/* Mark complete */}
                        <button
                          onClick={() => toggleComplete(source.id)}
                          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            isDone
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isDone ? 'COMPLETED ✓' : 'MARK AS DONE'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
