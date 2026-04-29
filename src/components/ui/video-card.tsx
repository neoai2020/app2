'use client'

import { motion } from 'framer-motion'
import { Clock, Eye, PlayCircle } from 'lucide-react'

interface VideoCardProps {
  title?: string
  description?: string
  duration?: string
  views?: string
  thumbnailText?: string
  videoUrl?: string
  /** When set, renders a featured “Step N” header above the video */
  stepNumber?: 1 | 2
  /** Headline without the “Step N:” prefix (used with stepNumber) */
  stepHeadline?: string
}

export function VideoCard({
  title = "Getting Started: Your First $100 Day",
  description = "Watch this essential training to understand exactly how to use Profit Loop to generate your first profitable leads and close your first deals.",
  duration = "12:34",
  views = "2,847",
  videoUrl,
  stepNumber,
  stepHeadline
}: VideoCardProps) {
  const showStepHeader = stepNumber != null && stepHeadline

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-5 pb-4">
        {showStepHeader ? (
          <div className="relative overflow-hidden rounded-xl border border-[#D946EF]/30 bg-gradient-to-br from-[#D946EF]/[0.12] via-zinc-950/80 to-[#00B894]/10 p-5 md:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D946EF]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-[#00B894]/15 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D946EF]/40 bg-[#D946EF]/15 shadow-[0_0_24px_rgba(217,70,239,0.25)]">
                <span className="text-2xl font-black tabular-nums text-white">{stepNumber}</span>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00B894]/40 bg-[#00B894]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5ee9c5]">
                    <PlayCircle className="h-3.5 w-3.5 text-[#00B894]" strokeWidth={2.5} />
                    Step {stepNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Quick win
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-snug text-white md:text-2xl">
                  <span className="gradient-text">{stepHeadline}</span>
                </h3>
              </div>
            </div>
          </div>
        ) : (
          <h3 className="mb-1 text-lg font-bold text-white">{title}</h3>
        )}
      </div>

      <div className="relative aspect-video bg-zinc-900">
        {videoUrl ? (
          <iframe
            src={`${videoUrl}?title=0&byline=0&portrait=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
            <span className="text-zinc-500 text-sm">No video available</span>
          </div>
        )}
      </div>

      <div className="p-5 pt-4">
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">{description}</p>

        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {views} views
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
