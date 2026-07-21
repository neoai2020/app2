'use client'

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  ReactNode,
  useCallback
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Info, Lightbulb, BookOpen, ExternalLink } from 'lucide-react'

interface HelpTooltipProps {
  content: string
  title?: string
  learnMoreLink?: string
  variant?: 'help' | 'info' | 'tip'
  /** Preferred side; auto-flips if it would leave the viewport */
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

type Side = 'top' | 'bottom' | 'left' | 'right'

const PAD = 12
const GAP = 10

function pickSide(
  preferred: Side,
  trigger: DOMRect,
  tipW: number,
  tipH: number,
  vw: number,
  vh: number
): Side {
  const space = {
    top: trigger.top - PAD,
    bottom: vh - trigger.bottom - PAD,
    left: trigger.left - PAD,
    right: vw - trigger.right - PAD
  }

  const fits = (side: Side) => {
    if (side === 'top' || side === 'bottom') {
      return space[side] >= tipH + GAP
    }
    return space[side] >= tipW + GAP
  }

  if (fits(preferred)) return preferred

  const order: Side[] =
    preferred === 'top' || preferred === 'bottom'
      ? [preferred === 'top' ? 'bottom' : 'top', 'right', 'left', preferred]
      : [preferred === 'left' ? 'right' : 'left', 'bottom', 'top', preferred]

  return order.find(fits) ?? (space.bottom >= space.top ? 'bottom' : 'top')
}

function computeCoords(
  side: Side,
  trigger: DOMRect,
  tipW: number,
  tipH: number,
  vw: number,
  vh: number
) {
  let top = 0
  let left = 0

  if (side === 'top') {
    top = trigger.top - tipH - GAP
    left = trigger.left + trigger.width / 2 - tipW / 2
  } else if (side === 'bottom') {
    top = trigger.bottom + GAP
    left = trigger.left + trigger.width / 2 - tipW / 2
  } else if (side === 'left') {
    top = trigger.top + trigger.height / 2 - tipH / 2
    left = trigger.left - tipW - GAP
  } else {
    top = trigger.top + trigger.height / 2 - tipH / 2
    left = trigger.right + GAP
  }

  left = Math.min(Math.max(PAD, left), Math.max(PAD, vw - tipW - PAD))
  top = Math.min(Math.max(PAD, top), Math.max(PAD, vh - tipH - PAD))

  return { top, left }
}

export function HelpTooltip({
  content,
  title,
  learnMoreLink,
  variant = 'help',
  position = 'bottom',
  children
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; side: Side } | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const pointerTypeRef = useRef<string>('mouse')
  const closeTimerRef = useRef<number | null>(null)
  const Icon = icons[variant]

  useEffect(() => {
    setMounted(true)
  }, [])

  const clearCloseTimer = () => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const open = () => {
    clearCloseTimer()
    setIsOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 120)
  }

  const updatePosition = useCallback(() => {
    const trigger = containerRef.current?.getBoundingClientRect()
    const tipEl = tipRef.current
    if (!trigger || !tipEl) return

    const tipW = tipEl.offsetWidth
    const tipH = tipEl.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    const side = pickSide(position, trigger, tipW, tipH, vw, vh)
    const next = computeCoords(side, trigger, tipW, tipH, vw, vh)
    setCoords({ ...next, side })
  }, [position])

  useLayoutEffect(() => {
    if (!isOpen) {
      setCoords(null)
      return
    }
    updatePosition()
  }, [isOpen, updatePosition, content, title])

  useEffect(() => {
    if (!isOpen) return
    const onScrollOrResize = () => updatePosition()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (containerRef.current?.contains(t)) return
      if (tipRef.current?.contains(t)) return
      setIsOpen(false)
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

  useEffect(() => () => clearCloseTimer(), [])

  const arrowClass: Record<Side, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-zinc-800',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-zinc-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-zinc-800',
    right:
      'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-zinc-800'
  }

  const tooltip = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tipRef}
          role="tooltip"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: coords ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          onPointerEnter={() => {
            if (pointerTypeRef.current === 'mouse') open()
          }}
          onPointerLeave={() => {
            if (pointerTypeRef.current === 'mouse') scheduleClose()
          }}
          style={
            coords
              ? { position: 'fixed', top: coords.top, left: coords.left }
              : { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }
          }
          className="z-[200] w-64 max-w-[calc(100vw-1.5rem)]"
        >
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-left normal-case tracking-normal shadow-2xl">
            {title && (
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Icon size={14} className={colors[variant].split(' ')[0]} />
                {title}
              </div>
            )}
            <p className="text-xs leading-relaxed text-zinc-300">{content}</p>
            {learnMoreLink && (
              <a
                href={learnMoreLink}
                className="mt-3 flex items-center gap-1 text-xs text-[#D946EF] transition-colors hover:text-[#e879f9]"
              >
                <BookOpen size={12} />
                Learn more
                <ExternalLink size={10} />
              </a>
            )}
          </div>
          {coords && (
            <span className={`pointer-events-none absolute h-0 w-0 border-8 ${arrowClass[coords.side]}`} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center align-middle"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') open()
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') scheduleClose()
      }}
    >
      {children}
      <button
        type="button"
        aria-label={title || 'More info'}
        aria-expanded={isOpen}
        onPointerDown={(e) => {
          pointerTypeRef.current = e.pointerType
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (pointerTypeRef.current !== 'mouse') setIsOpen((prev) => !prev)
        }}
        className={`ml-1.5 inline-flex ${colors[variant]} transition-colors`}
      >
        <Icon size={14} />
      </button>

      {mounted ? createPortal(tooltip, document.body) : null}
    </span>
  )
}

interface HelpButtonProps {
  topic: string
  className?: string
}

export function HelpButton({ topic, className = '' }: HelpButtonProps) {
  return (
    <button
      onClick={() => {
        window.open(`/support#${topic}`, '_blank')
      }}
      className={`inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-[#D946EF] ${className}`}
    >
      <HelpCircle size={12} />
      Need help?
    </button>
  )
}

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
      className="mb-4 flex items-start gap-3 rounded-lg border border-[#D946EF]/20 bg-[#D946EF]/5 p-3"
    >
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#D946EF]" />
      <p className="flex-1 text-sm text-purple-200/80">{tip}</p>
      <button
        onClick={() => {
          setDismissed(true)
          onDismiss?.()
        }}
        className="shrink-0 rounded-full border border-[#D946EF]/40 bg-[#D946EF]/10 px-3.5 py-1.5 text-xs font-semibold text-[#D946EF] transition-colors hover:bg-[#D946EF]/25 hover:text-white"
      >
        Got it
      </button>
    </motion.div>
  )
}
