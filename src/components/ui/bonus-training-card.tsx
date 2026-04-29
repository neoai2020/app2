'use client'

import { createElement, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Sparkles } from 'lucide-react'

const PLAYER_ID = 'vid-69f1dc322e62e594e34823df'
const PLAYER_SCRIPT_SRC =
  'https://scripts.converteai.net/e9cd97bc-7bc8-4a23-bb2f-224a56a84d6b/players/69f1dc322e62e594e34823df/v4/player.js'
const CTA_URL = 'https://freedomescapexcelerator.com/5k-daily-14'

function TrainingCtaLink() {
  return (
    <div className="flex justify-center">
      <motion.a
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex w-full max-w-xl items-center justify-center gap-2 px-6 py-3 text-center text-sm font-bold text-black shadow-lg transition-all sm:w-auto rounded-lg bg-[#FFC107] hover:bg-[#FFD54F]"
      >
        Yes! Show Me How To Earn $1,000-$5,000 A Day
        <ArrowRight className="h-4 w-4 shrink-0" />
      </motion.a>
    </div>
  )
}

export function BonusTrainingCard() {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PLAYER_SCRIPT_SRC}"]`
    )
    if (existing) return

    const s = document.createElement('script')
    s.src = PLAYER_SCRIPT_SRC
    s.async = true
    document.head.appendChild(s)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-5 pb-4">
        <div className="relative overflow-hidden rounded-xl border border-[#00B894]/35 bg-gradient-to-br from-[#00B894]/[0.14] via-zinc-950/90 to-[#D946EF]/10 p-5 md:p-6">
          <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#00B894]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[#D946EF]/15 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#FFC107]/50 bg-[#FFC107]/10 shadow-[0_0_20px_rgba(255,193,7,0.2)]">
              <span className="text-2xl font-black tabular-nums text-[#FFC107]">2</span>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D946EF]/35 bg-[#D946EF]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e879f9]">
                  <Sparkles className="h-3.5 w-3.5 text-[#D946EF]" strokeWidth={2.5} />
                  Step 2
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Bonus training
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-white md:text-xl">
                <span className="gradient-text">
                  Watch The Bonus Training That Took Me To Earnings 1,000 to 5,000 Per Day
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-5 mt-1 aspect-video overflow-hidden rounded-xl bg-zinc-900">
        {createElement('vturb-smartplayer', {
          id: PLAYER_ID,
          style: { display: 'block', margin: '0 auto', width: '100%' }
        })}
      </div>

      <div className="space-y-5 p-5">
        <TrainingCtaLink />

        <div className="space-y-4 text-sm leading-relaxed text-zinc-300 md:text-[15px]">
          <p>
            Imagine rolling out of bed, checking your phone, and seeing an extra
            <span className="font-semibold text-white"> $1,000, $3,000, or even $5,000 </span>
            deposited into your account—without grinding away at a 9-to-5 job, begging
            for overtime, or stressing over side hustles that barely pay the bills.
          </p>
          <p>
            This isn&apos;t some wild fantasy—it&apos;s a real, proven system that countless
            everyday people are using to generate consistent, life-changing income on
            autopilot. No experience? No problem. No tech skills? Doesn&apos;t matter.
            This works for anyone willing to follow a simple, step-by-step process.
          </p>
          <p>
            The best part? <span className="font-semibold text-white">It runs 24/7, even while you sleep.</span>
          </p>
          <p className="flex items-start gap-2 font-semibold text-white">
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC107]" />
            <span>
              Ready to break free from financial stress and start living life on your terms?
            </span>
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC107]" />
          </p>
          <p>
            Use either yellow button above or below and discover how you can wake up to an extra
            <span className="font-semibold text-white"> $1,000-$5,000 </span>
            in your bank account every single day!
          </p>
        </div>

        <TrainingCtaLink />
      </div>
    </motion.div>
  )
}
