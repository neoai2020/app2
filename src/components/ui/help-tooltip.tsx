'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Info, Lightbulb, BookOpen, ExternalLink } from 'lucide-react'

interface HelpTooltipProps {
  content: string
  title?: string
  learnMoreLink?: string
  variant?: 'help' | 'info' | 'tip'
  position?: 'top' | 'bottom' | 'left' | 'right'
  children?: ReactNode
}

const icons = {
  help: HelpCircle,
  info: Info,
  tip: Lightbulb
}

const colors = {
  help: 'text-zinc-400 hover:text-[#D946EF]',
  info: 'text-[#D946EF] hover:text-[#e879f9]',
  tip: 'text-[#C026D3] hover:text-[#D946EF]'
}

export function HelpTooltip({
  content,
  title,
  learnMoreLink,
  variant = 'help',
  position = 'top',
  children
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const pointerTypeRef = useRef<string>('mouse')
  const Icon = icons[variant]

  // Close on tap/click outside or Escape (mainly for touch devices).
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-zinc-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-zinc-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-zinc-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-zinc-800'
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center align-middle"
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsOpen(true) }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setIsOpen(false) }}
    >
      {children}
      <button
        type="button"
        aria-label={title || 'More info'}
        aria-expanded={isOpen}
        onPointerDown={(e) => { pointerTypeRef.current = e.pointerType }}
        onClick={(e) => {
          e.stopPropagation()
          // On mouse, hover already controls visibility — don't fight it.
          // On touch/pen/keyboard, toggle so it can be opened and closed by tap.
          if (pointerTypeRef.current !== 'mouse') setIsOpen((prev) => !prev)
        }}
        className={`ml-1.5 inline-flex ${colors[variant]} transition-colors`}
      >
        <Icon size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 block ${positions[position]} w-64 max-w-[calc(100vw-2rem)]`}
          >
            <span className="block p-4 rounded-lg bg-zinc-800 border border-zinc-700 shadow-2xl text-left normal-case tracking-normal">
              {title && (
                <span className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                  <Icon size={14} className={colors[variant].split(' ')[0]} />
                  {title}
                </span>
              )}
              <span className="block text-zinc-300 text-xs leading-relaxed">
                {content}
              </span>
              {learnMoreLink && (
                <a
                  href={learnMoreLink}
                  className="mt-3 flex items-center gap-1 text-[#D946EF] text-xs hover:text-[#e879f9] transition-colors"
                >
                  <BookOpen size={12} />
                  Learn more
                  <ExternalLink size={10} />
                </a>
              )}
            </span>
            {/* Arrow */}
            <span className={`absolute w-0 h-0 border-8 ${arrows[position]}`} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// Contextual help button that opens a modal/sidebar
interface HelpButtonProps {
  topic: string
  className?: string
}

export function HelpButton({ topic, className = '' }: HelpButtonProps) {
  return (
    <button
      onClick={() => {
        // Could open a help modal or navigate to docs
        window.open(`/support#${topic}`, '_blank')
      }}
      className={`inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-[#D946EF] transition-colors ${className}`}
    >
      <HelpCircle size={12} />
      Need help?
    </button>
  )
}

// Quick tip banner
interface QuickTipProps {
  tip: string
  onDismiss?: () => void
}

export function QuickTip({ tip, onDismiss }: QuickTipProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-4 p-3 rounded-lg bg-[#D946EF]/5 border border-[#D946EF]/20 flex items-start gap-3"
    >
      <Lightbulb className="w-4 h-4 text-[#D946EF] shrink-0 mt-0.5" />
      <p className="text-sm text-purple-200/80 flex-1">{tip}</p>
      <button
        onClick={() => {
          setDismissed(true)
          onDismiss?.()
        }}
        className="text-zinc-500 hover:text-zinc-300 text-xs"
      >
        Got it
      </button>
    </motion.div>
  )
}
