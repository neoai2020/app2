'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PromoBanner } from '@/components/ui/promo-banner'

/**
 * Branded loading bar (purple→magenta gradient, matching dashboard usage bars).
 * Shown while a generation / premium CTA is working. Embeds a compact PromoBanner.
 */
export function GenerationProgress({
  label = 'Working on it...'
}: {
  label?: string
}) {
  const [progress, setProgress] = useState(4)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) =>
        prev >= 95 ? 95 : prev + Math.max(1, Math.round((95 - prev) / 10))
      )
    }, 400)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="mb-4 space-y-3">
      <div className="rounded-xl border border-[#D946EF]/25 bg-[var(--glass-bg)] p-4">
        <div className="mb-3 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#D946EF]" />
          <p className="text-sm font-semibold text-white sm:text-base">{label}</p>
        </div>
        <div className="relative h-3.5 overflow-hidden rounded-full border border-[#D946EF]/30 bg-white/5 p-0.5">
          <div
            className="absolute inset-y-0.5 left-0.5 rounded-full bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all duration-300"
            style={{ width: `calc(${progress}% - 4px)` }}
          />
        </div>
        <p className="mt-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider text-[#D946EF]/70">
          {progress}%
        </p>
      </div>
      <PromoBanner />
    </div>
  )
}
