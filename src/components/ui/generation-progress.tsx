'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PromoBanner } from '@/components/ui/promo-banner'

/**
 * Shown while a premium CTA is “working” (fake or real load).
 * Loading bar + Free Training banner; after load, parents keep showing PromoBanner alone.
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
    <div className="mb-4 space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#D946EF]" />
        <p className="text-base font-semibold text-white">{label}</p>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-[#D946EF]/30 bg-zinc-900">
        <div
          className="h-full bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <PromoBanner />
    </div>
  )
}
