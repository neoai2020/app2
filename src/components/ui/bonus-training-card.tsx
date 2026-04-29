'use client'

import { createElement, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Flame } from 'lucide-react'

const PLAYER_ID = 'vid-69f1dc322e62e594e34823df'
const PLAYER_SCRIPT_SRC =
  'https://scripts.converteai.net/e9cd97bc-7bc8-4a23-bb2f-224a56a84d6b/players/69f1dc322e62e594e34823df/v4/player.js'
const CTA_URL = 'https://freedomescapexcelerator.com/5k-daily-14'

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
      <div className="px-5 pt-5">
        <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
          Step 2: Watch The Bonus Training That Took Me To Earnings 1,000 to 5,000 Per Day
        </h3>
      </div>

      <div className="relative aspect-video bg-zinc-900 mt-4 mx-5 rounded-xl overflow-hidden">
        {createElement('vturb-smartplayer', {
          id: PLAYER_ID,
          style: { display: 'block', margin: '0 auto', width: '100%' }
        })}
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-4 text-sm md:text-[15px] text-zinc-300 leading-relaxed">
          <p>
            Imagine rolling out of bed, checking your phone, and seeing an extra
            <span className="text-white font-semibold"> $1,000, $3,000, or even $5,000 </span>
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
            The best part? <span className="text-white font-semibold">It runs 24/7, even while you sleep.</span>
          </p>
          <p className="flex items-start gap-2 text-white font-semibold">
            <Flame className="w-5 h-5 text-[#FFC107] shrink-0 mt-0.5" />
            <span>
              Ready to break free from financial stress and start living life on your terms?
            </span>
            <Flame className="w-5 h-5 text-[#FFC107] shrink-0 mt-0.5" />
          </p>
          <p>
            Click the button below and discover how you can wake up to an extra
            <span className="text-white font-semibold"> $1,000-$5,000 </span>
            in your bank account every single day!
          </p>
        </div>

        <motion.a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-black italic uppercase tracking-widest rounded-xl transition-colors shadow-[0_0_30px_rgba(255,193,7,0.35)]"
        >
          Yes! Show Me How To Earn $1,000-$5,000 A Day
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
    </motion.div>
  )
}
