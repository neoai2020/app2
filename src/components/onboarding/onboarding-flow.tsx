'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  Globe,
  Loader2,
  Shield,
  Smartphone,
  Sparkles,
  Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  onboardingContent,
  ONBOARDING_BETA_QUALIFICATION_CTA_URL,
  ONBOARDING_PRODUCT_NAME
} from '@/config/onboarding-content'
import { ONBOARDING_META_KEY, resolveOnboardingGate } from '@/lib/onboarding-gate'

const FINAL_STEP_INDEX = 2
const shell = 'w-full max-w-2xl mx-auto'

const REQUIREMENT_ICONS = [Smartphone, Globe, CheckCircle2]

const CONFETTI_COLORS = [
  '#F87171',
  '#FBBF24',
  '#34D399',
  '#60A5FA',
  '#A78BFA',
  '#F472B6',
  '#FACC15',
  '#22D3EE'
]

const APP_BG = '#0A0A0F'

export function OnboardingFlow() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [step, setStep] = useState(0)
  const [prepDone, setPrepDone] = useState<boolean[]>(() =>
    onboardingContent.preparing.rows.map(() => false)
  )
  const [prepReady, setPrepReady] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const prepRunGen = useRef(0)

  const verifyNotCompleted = useCallback(async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }
    const gate = await resolveOnboardingGate(supabase, user.id, user.user_metadata)
    if (!gate.ok) {
      setLoadError(gate.message)
      return
    }
    if (gate.isComplete) {
      router.replace('/dashboard')
    }
  }, [router, supabase])

  useEffect(() => {
    void verifyNotCompleted()
  }, [verifyNotCompleted])

  const completeOnboardingAndExit = useCallback(async () => {
    setFinishing(true)
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      // Best-effort: persist completion timestamp in the profile table.
      // Errors (missing column / missing table) are ignored — auth metadata
      // is the source of truth used by the onboarding gate.
      try {
        await supabase
          .from('users')
          .update({ onboarding_completed_at: new Date().toISOString() })
          .eq('id', user.id)
      } catch {
        // swallow
      }

      try {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            [ONBOARDING_META_KEY]: true
          }
        })
      } catch {
        // swallow
      }
    } catch {
      // swallow — we still navigate to the dashboard below
    }

    router.push('/dashboard')
    router.refresh()
  }, [router, supabase])

  useEffect(() => {
    if (step !== 0 || prepReady) return
    const myGen = ++prepRunGen.current
    let cancelled = false
    const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

    const rowCount = onboardingContent.preparing.rows.length
    const pauseAfterEachRowMs = [650, 800, 900]

    const run = async () => {
      setPrepDone(onboardingContent.preparing.rows.map(() => false))
      await delay(500)
      if (cancelled || myGen !== prepRunGen.current) return

      for (let idx = 0; idx < rowCount; idx++) {
        if (cancelled || myGen !== prepRunGen.current) return
        const completedIndex = idx
        setPrepDone((prev) => {
          const next = [...prev]
          next[completedIndex] = true
          return next
        })
        const pauseMs = pauseAfterEachRowMs[idx] ?? 700
        await delay(pauseMs)
      }
      if (!cancelled && myGen === prepRunGen.current) setPrepReady(true)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [step, prepReady])

  const handleClaimBeta = async () => {
    const url = ONBOARDING_BETA_QUALIFICATION_CTA_URL.trim()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    await completeOnboardingAndExit()
  }

  const handleNoThanks = async () => {
    await completeOnboardingAndExit()
  }

  const prepReadyAndDone = prepReady && prepDone.every(Boolean)

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col overflow-hidden text-zinc-100"
      style={{ backgroundColor: APP_BG }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, rgba(10,10,15,0) 60%), radial-gradient(40% 40% at 80% 100%, rgba(217,119,6,0.10) 0%, rgba(10,10,15,0) 60%)'
        }}
      />
      <ConfettiBackdrop />

      <div className="relative z-10 flex h-dvh max-h-dvh min-h-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 px-4 pb-2 pt-5 text-center md:pb-3 md:pt-6">
          <Image
            src="/logo.png"
            alt={ONBOARDING_PRODUCT_NAME}
            width={48}
            height={48}
            className="mx-auto rounded-lg md:h-14 md:w-14"
          />
          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 md:text-xs">
            {ONBOARDING_PRODUCT_NAME}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-5 pt-1 md:px-8 md:pb-8">
          {loadError ? (
            <div className={`${shell} rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-6 text-center`}>
              <p className="text-sm text-red-300 md:text-base">{loadError}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className={`${shell} flex min-h-0 w-full flex-1 flex-col`}
              >
                {step === 0 && (
                  <section className="flex min-h-0 flex-1 flex-col justify-center gap-3 md:gap-4">
                    <h1 className="text-center text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                      {onboardingContent.preparing.title}
                    </h1>

                    <ul className="space-y-2.5 md:space-y-3">
                      {onboardingContent.preparing.rows.map((row, i) => (
                        <li
                          key={row.label}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm md:gap-4 md:px-5 md:py-3.5"
                        >
                          <span
                            className={
                              prepDone[i]
                                ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 md:h-10 md:w-10'
                                : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300 md:h-10 md:w-10'
                            }
                          >
                            {prepDone[i] ? (
                              <Check className="h-5 w-5" strokeWidth={2.5} />
                            ) : (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-snug text-white md:text-base">
                              {row.label}
                            </p>
                            <p className="text-xs leading-snug text-zinc-400 md:text-sm">{row.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-start gap-2.5 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-xs leading-snug text-amber-100 md:px-5 md:py-3.5 md:text-sm">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" fill="currentColor" />
                      <p>
                        <span className="font-bold text-amber-300">Tip:</span> {onboardingContent.preparing.tip}
                      </p>
                    </div>

                    <div className="flex shrink-0 justify-center pt-2">
                      <IndigoButton
                        disabled={!prepReadyAndDone}
                        onClick={() => setStep(1)}
                        className="min-w-[220px]"
                      >
                        {onboardingContent.preparing.continueCta}
                      </IndigoButton>
                    </div>
                  </section>
                )}

                {step === 1 && <BetaSelectedStep onContinue={() => setStep(2)} />}

                {step === FINAL_STEP_INDEX && (
                  <section className="flex min-h-0 flex-1 flex-col justify-center gap-3 md:gap-4">
                    <p className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 md:text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-300 md:h-6 md:w-6">
                        <Check className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={3} />
                      </span>
                      QUALIFICATION CHECK
                    </p>
                    <h1 className="text-center text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
                      {onboardingContent.qualification.headline}
                    </h1>

                    <ul className="space-y-2.5 md:space-y-3">
                      {onboardingContent.qualification.requirements.map((req, i) => {
                        const Icon = REQUIREMENT_ICONS[i] ?? CheckCircle2
                        return (
                          <li
                            key={req}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm md:gap-4 md:px-5 md:py-3.5"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                              <Icon className="h-5 w-5" strokeWidth={2} />
                            </span>
                            <p className="text-sm font-semibold text-white md:text-base">{req}</p>
                          </li>
                        )
                      })}
                    </ul>

                    <p className="text-center text-sm text-zinc-300 md:text-base">
                      {(() => {
                        const parts = onboardingContent.qualification.footer.split('—')
                        return parts.length === 2 ? (
                          <>
                            {parts[0].trim()} <span className="px-1 text-zinc-500">—</span>
                            <strong className="font-bold text-white">{parts[1]}</strong>
                          </>
                        ) : (
                          onboardingContent.qualification.footer
                        )
                      })()}
                    </p>

                    <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
                      <motion.button
                        type="button"
                        disabled={finishing}
                        whileHover={finishing ? undefined : { scale: 1.01 }}
                        whileTap={finishing ? undefined : { scale: 0.98 }}
                        onClick={() => void handleClaimBeta()}
                        className="w-full rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 px-5 py-3.5 text-sm font-bold text-black shadow-[0_10px_40px_rgba(245,158,11,0.45)] transition-shadow hover:shadow-[0_14px_48px_rgba(245,158,11,0.6)] disabled:cursor-not-allowed disabled:opacity-60 md:py-4 md:text-base"
                      >
                        {onboardingContent.qualification.primaryCta}
                      </motion.button>
                      <button
                        type="button"
                        disabled={finishing}
                        onClick={() => void handleNoThanks()}
                        className="text-xs font-medium text-zinc-400 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        {onboardingContent.qualification.noThanksCta}
                      </button>
                    </div>

                    <p className="text-center text-[10px] leading-snug text-zinc-500 md:text-xs">
                      {onboardingContent.qualification.finePrint}
                    </p>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}

function BetaSelectedStep({ onContinue }: { onContinue: () => void }) {
  const headline = onboardingContent.beta.headline
  const flagSplit = headline.split('your account was flagged')

  const info = onboardingContent.beta.infoCard
  const dontPanicMatch = info.startsWith("Don't panic!")
  const infoRest = dontPanicMatch ? info.slice("Don't panic!".length) : info

  const payParts = onboardingContent.beta.payAmount.split('/')
  const payMain = payParts[0]
  const paySuffix = payParts.length > 1 ? `/${payParts.slice(1).join('/')}` : ''

  return (
    <section className="flex min-h-0 flex-1 flex-col justify-center gap-3 md:gap-4">
      <div className="flex justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 shadow-[0_0_44px_rgba(251,191,36,0.45)] ring-4 ring-amber-500/15 md:h-16 md:w-16">
          <Sparkles className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" />
        </span>
      </div>

      <p className="text-center text-xs font-black uppercase tracking-[0.22em] text-amber-400 md:text-sm">
        {onboardingContent.congratulations.badge}
      </p>

      <h1 className="text-center text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
        {onboardingContent.congratulations.headline}
      </h1>

      <div className="relative rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 pb-4 pt-5 md:px-6 md:pb-5 md:pt-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/30 ring-4"
            style={{ boxShadow: `0 0 0 4px ${APP_BG}` }}
          >
            <Star className="h-4 w-4 text-amber-300" fill="currentColor" strokeWidth={1.5} />
          </span>
        </div>
        <p className="text-center text-sm leading-snug text-zinc-100 md:text-base">
          {flagSplit.length === 2 ? (
            <>
              {flagSplit[0]}
              <span className="font-bold text-amber-300">your account was flagged</span>
              {flagSplit[1]}
            </>
          ) : (
            headline
          )}
        </p>
        <p className="mt-2 text-center text-xs text-zinc-400 md:text-sm">{onboardingContent.beta.subcopy}</p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-3 md:px-5 md:py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-indigo-200">
          <Shield className="h-4 w-4" strokeWidth={2} />
        </span>
        <p className="text-xs leading-snug text-zinc-200 md:text-sm">
          <span className="font-bold text-white">Don&apos;t panic!</span>
          {infoRest}
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/15 px-4 py-4 text-center md:py-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 md:text-xs">
          {onboardingContent.beta.payLabel.replace(':', '')}
        </p>
        <p className="mt-1 text-3xl font-black leading-none text-indigo-200 md:text-4xl">
          {payMain}
          {paySuffix && <span className="text-base font-semibold text-indigo-300/80 md:text-lg">{paySuffix}</span>}
        </p>
      </div>

      <div className="flex shrink-0 justify-center pt-1">
        <IndigoButton onClick={onContinue} className="min-w-[260px]">
          {onboardingContent.beta.cta}
        </IndigoButton>
      </div>
    </section>
  )
}

function IndigoButton({
  children,
  onClick,
  disabled,
  className = ''
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      className={`rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(99,102,241,0.45)] transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none md:py-4 md:text-base ${className}`}
    >
      {children}
    </motion.button>
  )
}

function ConfettiBackdrop() {
  const dots = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        const variant = i % 3
        return {
          id: i,
          left: `${(i * 47 + 11) % 100}%`,
          top: `${(i * 31 + 5) % 100}%`,
          rotate: ((i * 37) % 90) - 45,
          delay: ((i * 13) % 30) / 10,
          duration: 2.4 + ((i * 7) % 30) / 10,
          width: 6 + ((i * 11) % 9),
          height: variant === 0 ? 4 : variant === 1 ? 6 : 10,
          radius: variant === 2 ? 999 : 2,
          color
        }
      }),
    []
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute"
          style={{
            left: d.left,
            top: d.top,
            width: d.width,
            height: d.height,
            backgroundColor: d.color,
            borderRadius: d.radius,
            transform: `rotate(${d.rotate}deg)`,
            opacity: 0.85,
            boxShadow: `0 0 8px ${d.color}55`
          }}
          animate={{
            y: [0, 12, 0],
            opacity: [0.6, 1, 0.6],
            rotate: [d.rotate, d.rotate + 14, d.rotate]
          }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
