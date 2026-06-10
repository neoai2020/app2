'use client'

import { createElement, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Flame } from 'lucide-react'

const SHOW_BONUS_VIDEO = false

const PLAYER_ID = 'vid-69f1dc322e62e594e34823df'
const PLAYER_SCRIPT_SRC =
  'https://scripts.converteai.net/e9cd97bc-7bc8-4a23-bb2f-224a56a84d6b/players/69f1dc322e62e594e34823df/v4/player.js'
const CTA_URL = 'https://7figuresociety.a.explodely.com/?aff=neomedia&pid=1731454257'

function useBonusTrainingPlayer(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PLAYER_SCRIPT_SRC}"]`
    )
    if (existing) return

    const s = document.createElement('script')
    s.src = PLAYER_SCRIPT_SRC
    s.async = true
    document.head.appendChild(s)
  }, [enabled])
}

function TrainingCtaLink() {
  return (
    <div className="flex justify-center">
      <motion.a
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex w-full max-w-xl items-center justify-center gap-2 rounded-lg bg-[#FFC107] px-6 py-3 text-center text-sm font-bold text-black shadow-lg transition-all hover:bg-[#FFD54F] sm:w-auto"
      >
        Yes! Show Me How To Earn $1,000-$5,000 A Day
        <ArrowRight className="h-4 w-4 shrink-0" />
      </motion.a>
    </div>
  )
}

function BonusTrainingPlayer() {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
      {createElement('vturb-smartplayer', {
        id: PLAYER_ID,
        style: { display: 'block', margin: '0 auto', width: '100%' }
      })}
    </div>
  )
}

function BonusTrainingCopy() {
  return (
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
        Click the button below and discover how you can wake up to an extra
        <span className="font-semibold text-white"> $1,000-$5,000 </span>
        in your bank account every single day!
      </p>
    </div>
  )
}

interface BonusTrainingCardProps {
  variant?: 'full' | 'compact'
}

export function BonusTrainingCard(_props: BonusTrainingCardProps) {
  useBonusTrainingPlayer(SHOW_BONUS_VIDEO)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="space-y-5 p-5">
        <BonusTrainingCopy />
        <TrainingCtaLink />
      </div>

      {SHOW_BONUS_VIDEO && (
        <div className="mx-5 mb-5 mt-1">
          <BonusTrainingPlayer />
        </div>
      )}
    </motion.div>
  )
}
