'use client'

import { motion } from 'framer-motion'
import { Smartphone, ArrowRight, Zap } from 'lucide-react'

interface PromoBannerProps {
  title?: string
  description?: string
  extraLine?: string
  ctaText?: string
  ctaLink?: string
}

export function PromoBanner({
  title = "Want To Multiply Your Earnings To $1,000 - $5,000 A Day?",
  description = "AI Wealth OS is powerful, but if you want to scale to truly life-changing income, you need to watch this training which shows how to automate your entire workflow. And guess what?",
  extraLine = "This training is free for all AI Wealth members. So, if you want to unlock your full potential, just tap the yellow button below.",
  ctaText = "Click Here To Learn How",
  ctaLink = "https://www.jvzoo.com/c/86517/415009"
}: PromoBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl overflow-hidden"
      style={{
        background: '#00B894'
      }}
    >
      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="relative flex flex-col md:flex-row items-start gap-6">
          {/* Icon */}
          <div className="shrink-0 mt-1">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FFC107] rounded-full flex items-center justify-center shadow-lg"
              >
                <Zap className="w-3 h-3 text-white fill-white" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
              {title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed mb-1">
              {description}
            </p>
            <p className="text-white/90 text-sm leading-relaxed mb-5">
              {extraLine}
            </p>
            <motion.a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-lg transition-all shadow-lg text-sm"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
