'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'

const ACCOUNT_VERIFIED_WITHDRAW_URL = 'https://jvz5.com/c/3542829/433243/'

const ENTRANCE_DELAY_MS = 600

export function AccountVerifiedModal() {
  const titleId = useId()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = window.setTimeout(() => setVisible(true), ENTRANCE_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  const close = useCallback(() => {
    setDismissed(true)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const handleWithdraw = useCallback(() => {
    const url = ACCOUNT_VERIFIED_WITHDRAW_URL.trim()
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  if (dismissed) return null

  const showButton = ACCOUNT_VERIFIED_WITHDRAW_URL.trim().length > 0
  const transformShown = visible && mounted ? 'translateY(0)' : 'translateY(12px)'
  const opacityShown = visible && mounted ? 1 : 0

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-hidden={!visible}
      className="fixed bottom-4 left-4 z-[110] sm:bottom-5 sm:left-5"
      style={{
        width: 'min(420px, calc(100vw - 2rem))',
        opacity: opacityShown,
        transform: transformShown,
        transition: 'opacity 360ms ease-out, transform 360ms ease-out',
        pointerEvents: visible && mounted ? 'auto' : 'none'
      }}
    >
      <div
        className="border border-emerald-400/15 p-6 sm:p-8"
        style={{
          backgroundColor: 'rgba(5, 10, 8, 0.95)',
          borderRadius: '1.35rem',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow:
            'inset 0 0 0 1px rgba(0,163,108,0.12), 0 22px 70px rgba(0,0,0,0.62), 0 0 44px rgba(0,163,108,0.24)'
        }}
      >
        <div className="mb-7 flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: '#00a36c', boxShadow: '0 0 22px rgba(0,163,108,0.45)' }}
          >
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          </span>
          <h2
            id={titleId}
            className="flex-1 text-[14px] font-extrabold uppercase"
            style={{ color: '#22d38b', letterSpacing: '0.18em' }}
          >
            Account Verified
          </h2>
          <button
            type="button"
            aria-label="Close account verified modal"
            onClick={close}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 outline-none transition-colors hover:bg-white/10 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: '#22d38b' }}
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <p className="mb-4 text-[1.05rem] font-semibold leading-relaxed text-white">
          Congratulations! You&apos;re Eligible To Withdraw
        </p>

        <p
          className="mb-2 flex items-baseline"
          aria-label="416 dollars and 34 cents"
        >
          <span className="text-4xl font-extrabold" style={{ color: '#22d38b' }}>
            $
          </span>
          <span className="text-6xl font-extrabold tracking-tight text-white">416</span>
          <span className="text-2xl font-bold text-zinc-300">.34</span>
        </p>

        <p className="mb-8 text-sm font-medium text-emerald-100/55">
          Available balance from your activity
        </p>

        {showButton && (
          <button
            type="button"
            onClick={handleWithdraw}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-bold text-white outline-none transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0"
            style={{
              backgroundColor: '#00a36c',
              boxShadow: '0 16px 34px rgba(0,163,108,0.32)',
              outlineColor: '#22d38b'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#03b879'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#00a36c'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>Withdraw Now</span>
            <ArrowRight className="h-[19px] w-[19px]" strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  )
}
