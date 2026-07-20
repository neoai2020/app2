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
 * Compact contextual training offer.
 * Sized so it never blocks results below — parents should scroll to results after generation.
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

  const highlightMatch = title.match(/(\$1,000[–\-]\s*\$5,000)/i)
  const before = highlightMatch ? title.slice(0, highlightMatch.index) : title
  const highlight = highlightMatch?.[1]
  const after = highlightMatch
    ? title.slice((highlightMatch.index ?? 0) + highlightMatch[0].length)
    : ''

  return (
    <div
      className={`relative mb-3 w-full rounded-xl border border-[#fbbf24]/40 bg-gradient-to-b from-[#101726] to-[#0b0f18] px-4 py-4 text-center sm:px-6 sm:py-5 ${className}`}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close banner"
        className="absolute right-2 top-2 rounded-lg p-1 text-[#7dd3fc]/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <span className="mb-2 inline-block rounded-md bg-[#ef4444] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white sm:text-xs">
        Free Training
      </span>

      <h2 className="mx-auto mb-1.5 max-w-3xl text-base font-black uppercase leading-snug text-white sm:text-xl md:text-2xl">
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

      <p className="mx-auto mb-3 max-w-2xl text-xs font-semibold leading-snug text-[#d8e9fb] sm:text-sm">
        {description}
      </p>

      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-5 py-2.5 text-sm font-black uppercase text-[#1a1305] shadow-lg shadow-[#fbbf24]/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-[#fbbf24]/50 sm:text-base"
      >
        {ctaText}
      </a>

      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#ef4444] sm:text-xs">
        Warning: This will be taken down soon
      </p>
    </div>
  )
}
