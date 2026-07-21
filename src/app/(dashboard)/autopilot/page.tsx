'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Play, Target, Link as LinkIcon, ExternalLink, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { VideoOverlay } from '@/components/ui/video-overlay'
import { GenerationProgress } from '@/components/ui/generation-progress'
import { PromoBanner } from '@/components/ui/promo-banner'
import { getVideoThumbnail } from '@/lib/video-thumbnails'
import { scrollToResults } from '@/lib/scroll-to-results'
import { PageHeader } from '@/components/ui/page-header'

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
  const [videoOpen, setVideoOpen] = useState(false)
  const [savingLink, setSavingLink] = useState(false)
  const [loadingNiche, setLoadingNiche] = useState<string | null>(null)
  const [showOfferBanner, setShowOfferBanner] = useState(false)

  const socialVideoUrl = 'https://player.vimeo.com/video/1177396473'
  const socialThumbnail = getVideoThumbnail(socialVideoUrl)
  const nicheLoading = loadingNiche != null

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
    if (!url.trim() || savingLink) return
    setSavingLink(true)
    setShowOfferBanner(true)
    window.setTimeout(() => {
      localStorage.setItem(URL_STORAGE_KEY, url.trim())
      setUrlLocked(true)
      setSavingLink(false)
      scrollToResults()
    }, 4000)
  }

  const handleChangeUrl = () => {
    setUrlLocked(false)
    setShowOfferBanner(false)
    setLoadingNiche(null)
    localStorage.removeItem(URL_STORAGE_KEY)
  }

  const handleSelectNiche = (niche: string) => {
    if (niche === activeNiche || loadingNiche != null || savingLink) return
    setLoadingNiche(niche)
    setShowOfferBanner(true)
    window.setTimeout(() => {
      setActiveNiche(niche)
      setLoadingNiche(null)
    }, 3500)
  }

  const diffColors: Record<string, string> = {
    "EASY": "bg-green-500/10 text-green-500",
    "MEDIUM": "bg-yellow-500/10 text-yellow-500",
    "HARD": "bg-red-500/10 text-red-500"
  }

  const typeColors: Record<string, string> = {
    "FORUM": "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    "SOCIAL": "bg-[#8B5CF6]/10 text-[#8B5CF6]"
  }

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Premium"
        title="Social Payouts"
        subtitle="Submit your link to 100+ free traffic sources once and get ongoing traffic automatically — no daily work required."
      />

      {/* Hero — video + pitch (matches Recurring Streams layout) */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-white/5 bg-[var(--glass-bg)] shadow-2xl flex flex-col lg:flex-row">
        <div className="relative min-h-[280px] overflow-hidden border-b border-white/5 bg-[#0a0a0a] lg:min-h-[380px] lg:w-1/2 lg:border-b-0 lg:border-r">
          {socialThumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={socialThumbnail}
              alt="Social Payouts training thumbnail"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a1f] to-zinc-900" />
          )}
          <div className={`absolute inset-0 ${socialThumbnail ? 'thumb-scrim' : 'bg-black/40'}`} />
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            aria-label="Play Social Payouts training"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white shadow-2xl transition-transform duration-300 hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-white" />
            </span>
            <span className="text-sm font-semibold text-white drop-shadow-lg">
              ▶ Click to Play Video
            </span>
          </button>
        </div>

        <div className="relative flex flex-col justify-center p-8 md:p-10 lg:w-1/2">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#D946EF]/5 to-transparent" />

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D946EF]/20 bg-[#D946EF]/10">
            <TrendingUp className="h-6 w-6 text-[#D946EF]" />
          </div>

          <h2 className="mb-1 ds-h2 italic uppercase leading-tight tracking-tight text-white">
            SOCIAL PAYOUTS:<br /> <span className="text-[#D946EF]">TRAFFIC ON AUTOPILOT</span>
          </h2>

          <p className="page-eyebrow mb-4">
            100+ FREE TRAFFIC SOURCES
          </p>

          <p className="ds-subtitle max-w-md">
            Submit your link once to 100+ free traffic sources and get ongoing traffic automatically. No daily work required.
          </p>
        </div>
      </div>

      {/* How This Works — Horizontal */}
      <div data-generation-results>
        <div className="flex items-center gap-3 pl-1 mb-4">
          <Target className="w-5 h-5 text-[#D946EF]" />
          <h2 className="ds-h2 italic uppercase tracking-tight text-white">
            HOW THIS WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: 1, title: "ENTER YOUR LINK", text: "Paste the URL you want to promote. It gets auto-inserted into every submission." },
            { step: 2, title: "PICK YOUR NICHE", text: "Filter the 100+ traffic sources to find ones relevant to your market." },
            { step: 3, title: "SUBMIT & TRACK", text: "Follow step-by-step instructions for each source. Mark complete to track your progress." }
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-white/5 bg-[var(--glass-bg)] p-5">
              <div className="w-8 h-8 rounded-full bg-[#D946EF] flex items-center justify-center text-black font-black text-sm mb-3">
                {item.step}
              </div>
              <h4 className="ds-h4 italic text-white mb-2">
                {item.title}
              </h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* URL Entry */}
      <div className="rounded-2xl border border-white/5 bg-[var(--glass-bg)] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-5 h-5 text-[#D946EF]" />
          <h3 className="ds-h3 italic uppercase text-white">
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
              disabled={savingLink}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-4 px-5 text-sm text-white focus:outline-none focus:border-[#D946EF]/50 transition-colors mb-3 font-mono disabled:opacity-50"
            />
            <p className="text-zinc-600 text-xs mb-4">
              This link will be auto-inserted into all submission descriptions below.
            </p>

            {savingLink ? (
              <GenerationProgress label="Saving your link and preparing traffic sources..." />
            ) : null}

            {!savingLink ? (
              <button
                onClick={handleSetUrl}
                disabled={!url.trim()}
                className="btn btn-primary btn-md"
              >
                SAVE & CONTINUE
              </button>
            ) : null}
          </>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0 px-4 py-3 ds-well border-[#D946EF]/20">
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

      {urlLocked && showOfferBanner && !nicheLoading && !savingLink ? (
        <PromoBanner />
      ) : null}

      {urlLocked && nicheLoading ? (
        <GenerationProgress
          label={`Loading ${loadingNiche === 'ALL' ? 'all' : (loadingNiche || '').toLowerCase()} traffic sources...`}
        />
      ) : null}

      {/* Niche Filter */}
      {urlLocked && !nicheLoading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap gap-2">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => handleSelectNiche(niche)}
                className={`ds-chip transition-all
                  ${activeNiche === niche
                    ? 'bg-[#D946EF] text-black'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
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
      {urlLocked && !nicheLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-[var(--glass-bg)] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="w-full md:w-3/4">
            <h3 className="ds-h3 italic uppercase text-white mb-1">
              YOUR PROGRESS
            </h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">
              {completedCount} OF {trafficSources.length} SOURCES COMPLETED
            </p>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#D946EF] to-[#8B5CF6]"
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
      {urlLocked && !nicheLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {trafficSources.map((source) => {
            const isExpanded = expandedSource === source.id
            const isDone = completed.has(source.id)
            const submissionText = `Check out this amazing resource that has helped me a lot: ${url}\n\nI highly recommend it for anyone looking to improve in this area. Feel free to ask me any questions!`

            return (
              <div
                key={source.id}
                className={`rounded-xl border bg-[var(--glass-bg)] overflow-hidden transition-colors ${
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

                  <h4 className="ds-h4 italic text-white leading-snug mb-3">
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
                    className={`w-full btn btn-md text-xs font-black italic tracking-widest ${
                      isExpanded ? 'btn-accent-soft' : 'btn-primary'
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
                          className="btn btn-secondary btn-sm flex w-full items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3" /> GO TO {source.name}
                        </a>

                        {/* Submission text preview */}
                        <div className="ds-well p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Submission Text</p>
                          <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line break-all">{submissionText}</p>
                        </div>

                        {/* Copy submission text */}
                        <button
                          onClick={() => handleCopyDesc(source.id, submissionText)}
                          className={`w-full gap-2 ${
                            copiedId === source.id
                              ? 'btn btn-sm bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'btn btn-accent-soft btn-sm'
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
                          className={`btn btn-sm flex w-full items-center justify-center gap-2 ${
                            isDone
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'btn-secondary'
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

      {videoOpen && (
        <VideoOverlay
          videoUrl={socialVideoUrl}
          title="How to Use Social Payouts"
          onClose={() => setVideoOpen(false)}
        />
      )}
    </div>
  )
}
