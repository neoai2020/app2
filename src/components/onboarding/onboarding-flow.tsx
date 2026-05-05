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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <header className="shrink-0 px-6 pt-10 pb-6 text-center md:px-12 md:pt-14 md:pb-8">
          <Image
            src="/logo.png"
            alt={ONBOARDING_PRODUCT_NAME}
            width={80}
            height={80}
            className="mx-auto rounded-xl md:h-[96px] md:w-[96px]"
          />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-zinc-500 md:text-sm">
            {ONBOARDING_PRODUCT_NAME}
          </p>
        </header>

        <div className="flex flex-1 flex-col justify-center px-6 pb-16 pt-2 md:px-12 md:pb-24 lg:px-16 xl:px-24">
          {loadError ? (
            <div className={`${shell} rounded-2xl border border-red-500/40 bg-red-950/20 px-8 py-10 text-center`}>
              <p className="text-lg leading-relaxed text-red-300 md:text-xl">{loadError}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className={`${shell} w-full`}
              >
                {step === 0 && (
                  <section className="flex w-full flex-col space-y-10 md:space-y-12">
                    <h1 className="text-center text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                      {onboardingContent.preparing.title}
                    </h1>
                    <ul className="divide-y divide-white/10 border-y border-white/10">
                      {onboardingContent.preparing.rows.map((row, i) => (
                        <li key={row.label} className="flex gap-5 py-8 md:gap-6 md:py-10">
                          <div className="mt-1 shrink-0">
                            {prepDone[i] ? (
                              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00B894]/25 text-[#00B894] md:h-14 md:w-14">
                                <Check className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
                              </span>
                            ) : (
                              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 md:h-14 md:w-14">
                                <Loader2 className="h-6 w-6 animate-spin text-[#D946EF] md:h-7 md:w-7" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <p className="text-xl font-semibold leading-snug text-white md:text-2xl lg:text-[1.65rem]">
                              {row.label}
                            </p>
                            <p className="text-lg leading-relaxed text-zinc-400 md:text-xl">{row.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="border-l-4 border-[#D946EF] bg-[#D946EF]/5 py-5 pl-6 pr-4 text-lg leading-relaxed text-zinc-200 md:py-6 md:pl-8 md:text-xl">
                      <span className="font-bold text-[#D946EF]">Tip: </span>
                      {onboardingContent.preparing.tip}
                    </p>
                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        size="lg"
                        disabled={!prepReady || !prepDone.every(Boolean)}
                        glow={prepReady && prepDone.every(Boolean)}
                        className="min-h-[3.25rem] min-w-[240px] px-10 text-base md:min-h-14 md:text-lg"
                        onClick={() => setStep(1)}
                      >
                        {onboardingContent.preparing.continueCta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === 1 && (
                  <section className="flex w-full flex-col space-y-10 md:space-y-12">
                    <h1 className="text-center text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                      {onboardingContent.upgrades.title}
                    </h1>
                    <p className="text-center text-lg leading-relaxed text-zinc-300 md:text-xl lg:text-2xl">
                      {onboardingContent.upgrades.intro}
                    </p>
                    <ol className="list-decimal space-y-5 pl-7 text-lg leading-relaxed text-zinc-200 marker:text-[#D946EF] md:space-y-6 md:pl-8 md:text-xl lg:pl-10 lg:text-2xl">
                      {onboardingContent.upgrades.stepsNumbered.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ol>
                    <p className="text-center text-base text-zinc-500 md:text-lg">{onboardingContent.upgrades.videoCaption}</p>
                    <div className="w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
                      <video
                        key={ONBOARDING_UPGRADES_VIDEO_SRC}
                        className="aspect-video w-full bg-black"
                        controls
                        playsInline
                        preload="metadata"
                        src={ONBOARDING_UPGRADES_VIDEO_SRC}
                      >
                        Your browser does not support embedded video.
                      </video>
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        size="lg"
                        glow
                        className="min-h-[3.25rem] min-w-[240px] px-10 text-base md:min-h-14 md:text-lg"
                        onClick={() => setStep(2)}
                      >
                        {onboardingContent.upgrades.continueCta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="relative flex w-full flex-col items-center space-y-10 py-4 md:space-y-12 md:py-8">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                      <ConfettiBackdrop />
                    </div>
                    <p className="relative text-center text-base font-black uppercase tracking-[0.2em] text-[#FFC107] md:text-lg">
                      {onboardingContent.congratulations.badge}
                    </p>
                    <h1 className="relative text-center text-4xl font-black uppercase leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
                      {onboardingContent.congratulations.headline}
                    </h1>
                    <div className="relative flex justify-center pt-4">
                      <Button
                        type="button"
                        size="lg"
                        glow
                        className="min-h-[3.25rem] min-w-[240px] px-10 text-base md:min-h-14 md:text-lg"
                        onClick={() => setStep(3)}
                      >
                        {onboardingContent.congratulations.continueCta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="flex w-full flex-col space-y-10 md:space-y-12">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-3 rounded-full border border-[#D946EF]/40 bg-[#D946EF]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#e879f9] md:px-6 md:py-3 md:text-sm">
                        <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
                        Limited
                      </span>
                    </div>
                    <p className="text-center text-2xl font-semibold leading-snug text-white md:text-3xl lg:text-4xl">
                      {onboardingContent.beta.headline}
                    </p>
                    <p className="text-center text-lg leading-relaxed text-zinc-300 md:text-xl lg:text-2xl">
                      {onboardingContent.beta.subcopy}
                    </p>
                    <div className="space-y-8 border-y border-white/10 py-10 md:space-y-10 md:py-12">
                      <p className="text-lg leading-relaxed text-zinc-200 md:text-xl lg:text-2xl">
                        {onboardingContent.beta.infoCard}
                      </p>
                      <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-widest text-[#FFC107] md:text-base">
                          {onboardingContent.beta.payLabel}
                        </p>
                        <p className="mt-2 text-5xl font-black text-white md:text-6xl lg:text-7xl">
                          {onboardingContent.beta.payAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        size="lg"
                        glow
                        className="min-h-[3.25rem] min-w-[280px] px-10 text-base md:min-h-14 md:text-lg"
                        onClick={() => setStep(4)}
                      >
                        {onboardingContent.beta.cta}
                      </Button>
                    </div>
                  </section>
                )}

                {step === FINAL_STEP_INDEX && (
                  <section className="flex w-full flex-col space-y-10 md:space-y-12">
                    <p className="text-center text-sm font-black uppercase tracking-[0.25em] text-[#00B894] md:text-base">
                      {onboardingContent.qualification.badge}
                    </p>
                    <h1 className="text-center text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                      {onboardingContent.qualification.headline}
                    </h1>
                    <ul className="grid gap-4 sm:grid-cols-1 md:gap-5">
                      {onboardingContent.qualification.requirements.map((req) => (
                        <li
                          key={req}
                          className="border-b border-white/10 py-6 text-center text-lg font-medium text-zinc-100 md:py-8 md:text-xl lg:text-2xl"
                        >
                          {req}
                        </li>
                      ))}
                    </ul>
                    <p className="text-center text-xl font-semibold text-white md:text-2xl">
                      {onboardingContent.qualification.footer}
                    </p>
                    <p className="text-center text-base leading-relaxed text-zinc-500 md:text-lg lg:text-xl">
                      {onboardingContent.qualification.finePrint}
                    </p>
                    <div className="flex flex-col items-center gap-5 pt-6 md:gap-6">
                      <motion.button
                        type="button"
                        disabled={finishing}
                        whileHover={finishing ? undefined : { scale: 1.02 }}
                        whileTap={finishing ? undefined : { scale: 0.98 }}
                        onClick={() => void handleClaimBeta()}
                        className="min-h-[3.5rem] w-full max-w-xl rounded-xl bg-[#FFC107] px-8 py-4 text-base font-bold text-black shadow-[0_0_40px_rgba(255,193,7,0.25)] transition-colors hover:bg-[#FFD54F] disabled:cursor-not-allowed disabled:opacity-60 md:min-h-16 md:text-lg lg:text-xl"
                      >
                        {onboardingContent.qualification.primaryCta}
                      </motion.button>
                      <button
                        type="button"
                        disabled={finishing}
                        onClick={() => void handleNoThanks()}
                        className="text-base font-medium text-zinc-500 underline decoration-zinc-600 underline-offset-[6px] transition-colors hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
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
