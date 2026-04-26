'use client'

import { motion } from 'framer-motion'
import { Zap, PlayCircle } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

export interface ExclusiveTrainingOfferProps {
  titleLine1: string
  titleLine2?: string
  subtitle?: string
  ctaHref: string
}

export function ExclusiveTrainingOffer({
  titleLine1,
  titleLine2 = 'Claim Now',
  subtitle = 'Watch this exclusive training to multiply your results',
  ctaHref
}: ExclusiveTrainingOfferProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl space-y-12"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D946EF]/10 border border-[#D946EF]/20 text-[#D946EF] text-xs font-black italic uppercase tracking-widest mb-4 mx-auto"
          >
            <Zap className="w-4 h-4 fill-current" />
            Exclusive Training
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.95]">
            {titleLine1} <br />
            <span className="text-[#D946EF]">{titleLine2}</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 font-bold uppercase tracking-wide max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="relative group pt-4">
          <div className="absolute -inset-4 bg-linear-to-r from-[#D946EF]/20 to-[#C026D3]/20 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />

          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center gap-4 w-full md:w-auto md:min-w-[500px] h-24 bg-white text-[#D946EF] rounded-3xl font-black italic uppercase tracking-widest text-xl md:text-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95 px-8"
          >
            <PlayCircle className="w-8 h-8" strokeWidth={2.5} />
            Click Here To Access Training &gt;&gt;
          </a>
        </div>
      </motion.div>
    </div>
  )
}
