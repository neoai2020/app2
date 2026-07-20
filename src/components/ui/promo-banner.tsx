'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface PromoBannerProps {
  title?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  className?: string
}

/**
 * Contextual training offer — Robinhood EarningsBanner design.
 * Shown during/after Find Customers, Write Emails, and Offer generation — not globally.
 */
export function PromoBanner({
  title = 'Wake Up With An Extra $1,000–$5,000 In Your Bank Account Tomorrow',
  description = 'Discover how to scale to $1,000–$5,000 every single day — without doing any extra work.',
  ctaText = 'Watch The Free Training >>',
  ctaLink = 'https://the7figuresociety.com/earn-1k-2k-per-day',
  className = ''
}: PromoBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  // Split title so the dollar range can be highlighted like Robinhood
  const highlightMatch = title.match(/(\$1,000[–\-]\s*\$5,000)/i)
  const before = highlightMatch ? title.slice(0, highlightMatch.index) : title
  const highlight = highlightMatch?.[1]
  const after = highlightMatch
    ? title.slice((highlightMatch.index ?? 0) + highlightMatch[0].length)
    : ''

  return (
    <div
      className={`relative mb-4 w-full rounded-2xl border-2 border-[#fbbf24]/50 bg-gradient-to-b from-[#101726] to-[#0b0f18] px-6 py-10 text-center md:px-12 md:py-12 ${className}`}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close banner"
        className="absolute right-3 top-3 rounded-lg p-1.5 text-[#7dd3fc]/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>

      <span className="mb-5 inline-block rounded-md bg-[#ef4444] px-4 py-1.5 text-sm font-black uppercase tracking-widest text-white md:text-base">
        Free Training
      </span>

      <h2 className="mx-auto mb-4 max-w-4xl text-3xl font-black uppercase leading-tight text-white md:text-5xl">
        {highlight ? (
          <>
            {before}
            <span className="text-[#fbbf24]">{highlight}</span>
            {after}
          </>
        ) : (
          title
        )}
      </h2>

      <p className="mx-auto mb-8 max-w-3xl text-lg font-bold leading-snug text-[#d8e9fb] md:text-2xl">
        {description}
      </p>

      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-10 py-5 text-xl font-black uppercase text-[#1a1305] shadow-xl shadow-[#fbbf24]/40 transition-all duration-200 hover:scale-[1.04] hover:shadow-[#fbbf24]/60 md:text-2xl"
      >
        {ctaText}
      </a>

      <p className="mt-4 text-sm font-black uppercase tracking-wide text-[#ef4444] md:text-base">
        Warning: This will be taken down soon
      </p>
    </div>
  )
}
