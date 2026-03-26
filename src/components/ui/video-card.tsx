'use client'

import { motion } from 'framer-motion'
import { Clock, Eye } from 'lucide-react'

interface VideoCardProps {
  title?: string
  description?: string
  duration?: string
  views?: string
  thumbnailText?: string
  videoUrl?: string
}

export function VideoCard({
  title = "Getting Started: Your First $100 Day",
  description = "Watch this essential training to understand exactly how to use Profit Loop to generate your first profitable leads and close your first deals.",
  duration = "12:34",
  views = "2,847",
  videoUrl
}: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
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

      <div className="p-5">
        <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
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
