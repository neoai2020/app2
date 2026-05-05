'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Button } from '@/components/ui/button'
import {
  onboardingContent,
  ONBOARDING_BETA_QUALIFICATION_CTA_URL,
  ONBOARDING_PRODUCT_NAME,
  ONBOARDING_UPGRADES_VIDEO_SRC
} from '@/config/onboarding-content'
import { ONBOARDING_META_KEY, resolveOnboardingGate } from '@/lib/onboarding-gate'

const FINAL_STEP_INDEX = 4

const shell = 'w-full max-w-5xl xl:max-w-6xl mx-auto'

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
      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        setLoadError(error.message)
        setFinishing(false)
        return
      }

      await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          [ONBOARDING_META_KEY]: true
        }
      })

      router.push('/dashboard')
      router.refresh()
    } catch {
      setLoadError('Something went wrong. Please try again.')
      setFinishing(false)
    }
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

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-black text-zinc-100">
      <div className="pointer-events-none absolute inset-0 opacity-[0.45]">
        <AnimatedBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/92 to-zinc-950/95" />

      <div className="relative z-10 flex h-dvh max-h-dvh min-h-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 px-4 pb-2 pt-4 text-center md:px-8 md:pb-3 md:pt-5">
          <Image
            src="/logo.png"
            alt={ONBOARDING_PRODUCT_NAME}
            width={56}
            height={56}
            className="mx-auto rounded-lg md:h-16 md:w-16"
          />
          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 md:text-xs">
            {ONBOARDING_PRODUCT_NAME}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-0 md:px-10 lg:px-16">
          {loadError ? (
            <div className={`${shell} rounded-xl border border-red-500/40 bg-red-950/20 px-5 py-6 text-center`}>
              <p className="text-sm leading-relaxed text-red-300 md:text-base">{loadError}</p>
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
                    <h1 className="text-center text-xl font-bold leading-snug text-white md:text-2xl lg:text-3xl">
                      {onboardingContent.preparing.title}
                    </h1>
                    <ul className="divide-y divide-white/10 border-y border-white/10">
                      {onboardingContent.preparing.rows.map((row, i) => (
                        <li key={row.label} className="flex gap-3 py-2.5 md:gap-4 md:py-3">
                          <div className="mt-0.5 shrink-0">
                            {prepDone[i] ? (
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00B894]/25 text-[#00B894] md:h-10 md:w-10">
                                <Check className="h-4 w-4 md:h-[18px] md:w-[18px]" strokeWidth={2.5} />
                              </span>
                            ) : (
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 md:h-10 md:w-10">
                                <Loader2 className="h-4 w-4 animate-spin text-[#D946EF] md:h-[18px] md:w-[18px]" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="text-sm font-semibold leading-snug text-white md:text-base">
                              {row.label}
                            </p>
                            <p className="text-xs leading-snug text-zinc-400 md:text-sm">{row.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="border-l-2 border-[#D946EF] bg-[#D946EF]/5 py-2.5 pl-3 pr-2 text-xs leading-snug text-zinc-200 md:py-3 md:pl-4 md:text-sm">
                      <span className="font-bold text-[#D946EF]">Tip: </span>
                      {onboardingContent.preparing.tip}
                    </p>
                    <div className="flex shrink-0 justify-center pt-1">
                      <Button
                        type="button"
                        size="md"
                        disabled={!prepReady || !prepDone.every(Boolean)}
                        glow={prepReady && prepDone.every(Boolean)}
                        className="min-w-[200px]"
                        onClick={() => setStep(1)}
                      >
                        {onboardingContent.preparing.continueCta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === 1 && (
                  <section className="flex min-h-0 flex-1 flex-col gap-2 md:gap-3">
                    <div className="shrink-0 space-y-1.5 md:space-y-2">
                      <h1 className="text-center text-lg font-bold leading-tight text-white md:text-xl lg:text-2xl">
                        {onboardingContent.upgrades.title}
                      </h1>
                      <p className="text-center text-xs leading-snug text-zinc-400 md:text-sm">
                        {onboardingContent.upgrades.intro}
                      </p>
                      <ol className="list-decimal space-y-1 pl-5 text-xs leading-snug text-zinc-300 marker:text-[#D946EF] md:space-y-1.5 md:pl-5 md:text-sm">
                        {onboardingContent.upgrades.stepsNumbered.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ol>
                      <p className="text-center text-[11px] text-zinc-500 md:text-xs">
                        {onboardingContent.upgrades.videoCaption}
                      </p>
                    </div>
                    <div className="relative min-h-0 w-full flex-1">
                      <video
                        key={ONBOARDING_UPGRADES_VIDEO_SRC}
                        className="absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black object-contain ring-1 ring-white/10"
                        controls
                        playsInline
                        preload="metadata"
                        src={ONBOARDING_UPGRADES_VIDEO_SRC}
                      >
                        Your browser does not support embedded video.
                      </video>
                    </div>
                    <div className="flex shrink-0 justify-center pb-0.5 pt-1">
                      <Button type="button" size="md" glow onClick={() => setStep(2)}>
                        {onboardingContent.upgrades.continueCta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 py-2 md:gap-5">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                      <ConfettiBackdrop />
                    </div>
                    <p className="relative text-center text-xs font-black uppercase tracking-[0.18em] text-[#FFC107] md:text-sm">
                      {onboardingContent.congratulations.badge}
                    </p>
                    <h1 className="relative max-w-4xl text-center text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                      {onboardingContent.congratulations.headline}
                    </h1>
                    <div className="relative flex shrink-0 justify-center">
                      <Button type="button" size="md" glow onClick={() => setStep(3)}>
                        {onboardingContent.congratulations.continueCta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="flex min-h-0 flex-1 flex-col justify-center gap-3 md:gap-4">
                    <div className="flex shrink-0 justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#D946EF]/40 bg-[#D946EF]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e879f9] md:px-4 md:text-xs">
                        <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        Limited
                      </span>
                    </div>
                    <p className="text-center text-base font-semibold leading-snug text-white md:text-lg lg:text-xl">
                      {onboardingContent.beta.headline}
                    </p>
                    <p className="text-center text-xs leading-snug text-zinc-400 md:text-sm">
                      {onboardingContent.beta.subcopy}
                    </p>
                    <div className="space-y-3 border-y border-white/10 py-3 md:space-y-4 md:py-4">
                      <p className="text-xs leading-snug text-zinc-200 md:text-sm">{onboardingContent.beta.infoCard}</p>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFC107] md:text-xs">
                          {onboardingContent.beta.payLabel}
                        </p>
                        <p className="text-3xl font-black text-white md:text-4xl">{onboardingContent.beta.payAmount}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 justify-center">
                      <Button type="button" size="md" glow className="max-w-sm" onClick={() => setStep(4)}>
                        {onboardingContent.beta.cta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === FINAL_STEP_INDEX && (
                  <section className="flex min-h-0 flex-1 flex-col justify-center gap-3 md:gap-4">
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#00B894] md:text-xs">
                      {onboardingContent.qualification.badge}
                    </p>
                    <h1 className="text-center text-lg font-bold leading-tight text-white md:text-xl lg:text-2xl">
                      {onboardingContent.qualification.headline}
                    </h1>
                    <ul className="grid gap-0">
                      {onboardingContent.qualification.requirements.map((req) => (
                        <li
                          key={req}
                          className="border-b border-white/10 py-2 text-center text-sm font-medium text-zinc-100 md:py-2.5 md:text-base"
                        >
                          {req}
                        </li>
                      ))}
                    </ul>
                    <p className="text-center text-sm font-semibold text-white md:text-base">
                      {onboardingContent.qualification.footer}
                    </p>
                    <p className="text-center text-[11px] leading-snug text-zinc-500 md:text-xs">
                      {onboardingContent.qualification.finePrint}
                    </p>
                    <div className="flex shrink-0 flex-col items-center gap-2 pt-1 md:gap-3">
                      <motion.button
                        type="button"
                        disabled={finishing}
                        whileHover={finishing ? undefined : { scale: 1.02 }}
                        whileTap={finishing ? undefined : { scale: 0.98 }}
                        onClick={() => void handleClaimBeta()}
                        className="w-full max-w-md rounded-lg bg-[#FFC107] px-5 py-2.5 text-sm font-bold text-black shadow-lg transition-colors hover:bg-[#FFD54F] disabled:cursor-not-allowed disabled:opacity-60 md:py-3 md:text-base"
                      >
                        {onboardingContent.qualification.primaryCta}
                      </motion.button>
                      <button
                        type="button"
                        disabled={finishing}
                        onClick={() => void handleNoThanks()}
                        className="text-xs font-medium text-zinc-500 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        {onboardingContent.qualification.noThanksCta}
                      </button>
                    </div>
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

function ConfettiBackdrop() {
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${(i * 47) % 100}%`,
        top: `${(i * 61) % 90}%`,
        delay: (i % 6) * 0.1,
        hue: i % 2 === 0 ? '#D946EF' : '#00B894'
      })),
    []
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute h-2.5 w-2.5 rounded-full opacity-50 md:h-3 md:w-3"
          style={{ left: d.left, top: d.top, backgroundColor: d.hue }}
          animate={{ y: [0, 18, 0], opacity: [0.3, 0.9, 0.3], scale: [1, 1.35, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
