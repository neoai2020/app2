'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  onboardingContent,
  ONBOARDING_BETA_QUALIFICATION_CTA_URL,
  ONBOARDING_PRODUCT_NAME,
  ONBOARDING_UPGRADES_VIDEO_SRC
} from '@/config/onboarding-content'
import { ONBOARDING_META_KEY, resolveOnboardingGate } from '@/lib/onboarding-gate'

const FINAL_STEP_INDEX = 4

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

  // Step 0 — sequential loading rows
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
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <AnimatedBackground />
      </div>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-8 sm:py-10">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 sm:max-w-xl">
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.png" alt={ONBOARDING_PRODUCT_NAME} width={56} height={56} className="rounded-lg" />
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">
              {ONBOARDING_PRODUCT_NAME}
            </p>
          </div>

          {loadError ? (
            <Card className="w-full border-red-500/30 bg-zinc-950/90">
              <CardContent className="p-6 text-center text-sm text-red-300">{loadError}</CardContent>
            </Card>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {step === 0 && (
                  <Card className="w-full border-white/10 bg-zinc-950/95 shadow-[0_0_40px_rgba(217,70,239,0.12)]">
                    <CardContent className="space-y-6 p-6 sm:p-8">
                      <div className="text-center">
                        <h1 className="text-xl font-bold text-white sm:text-2xl">{onboardingContent.preparing.title}</h1>
                      </div>
                      <ul className="space-y-3">
                        {onboardingContent.preparing.rows.map((row, i) => (
                          <li
                            key={row.label}
                            className="flex gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3"
                          >
                            <div className="mt-0.5 shrink-0">
                              {prepDone[i] ? (
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00B894]/20 text-[#00B894]">
                                  <Check className="h-4 w-4" strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                                  <Loader2 className="h-4 w-4 animate-spin text-[#D946EF]" />
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{row.label}</p>
                              <p className="text-xs text-zinc-500">{row.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <p className="rounded-lg border border-[#D946EF]/20 bg-[#D946EF]/5 px-4 py-3 text-xs leading-relaxed text-zinc-300">
                        <span className="font-bold text-[#D946EF]">Tip: </span>
                        {onboardingContent.preparing.tip}
                      </p>
                      <div className="flex justify-center pt-2">
                        <Button
                          type="button"
                          disabled={!prepReady || !prepDone.every(Boolean)}
                          glow={prepReady && prepDone.every(Boolean)}
                          className="min-w-[200px]"
                          onClick={() => setStep(1)}
                        >
                          {onboardingContent.preparing.continueCta}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === 1 && (
                  <Card className="w-full border-white/10 bg-zinc-950/95">
                    <CardContent className="space-y-5 p-6 sm:p-8">
                      <h1 className="text-center text-xl font-bold text-white sm:text-2xl">
                        {onboardingContent.upgrades.title}
                      </h1>
                      <p className="text-center text-sm text-zinc-400">{onboardingContent.upgrades.intro}</p>
                      <ol className="list-decimal space-y-3 pl-5 text-sm text-zinc-300">
                        {onboardingContent.upgrades.stepsNumbered.map((line) => (
                          <li key={line} className="leading-relaxed">
                            {line}
                          </li>
                        ))}
                      </ol>
                      <p className="text-center text-xs text-zinc-500">{onboardingContent.upgrades.videoCaption}</p>
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
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
                      <div className="flex justify-center pt-2">
                        <Button type="button" glow onClick={() => setStep(2)}>
                          {onboardingContent.upgrades.continueCta}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card className="relative w-full overflow-hidden border-[#D946EF]/30 bg-zinc-950/95">
                    <ConfettiBackdrop />
                    <CardContent className="relative space-y-6 p-6 sm:p-8">
                      <p className="text-center text-sm font-black uppercase tracking-widest text-[#FFC107]">
                        {onboardingContent.congratulations.badge}
                      </p>
                      <h1 className="text-center text-2xl font-black italic uppercase tracking-tighter text-white sm:text-3xl">
                        {onboardingContent.congratulations.headline}
                      </h1>
                      <div className="flex justify-center">
                        <Button type="button" glow className="px-8" onClick={() => setStep(3)}>
                          {onboardingContent.congratulations.continueCta}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === 3 && (
                  <Card className="w-full border-white/10 bg-zinc-950/95">
                    <CardContent className="space-y-5 p-6 sm:p-8">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#D946EF]/30 bg-[#D946EF]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e879f9]">
                          <Sparkles className="h-3.5 w-3.5" />
                          Limited
                        </span>
                      </div>
                      <p className="text-center text-base font-semibold leading-snug text-white">
                        {onboardingContent.beta.headline}
                      </p>
                      <p className="text-center text-sm text-zinc-400">{onboardingContent.beta.subcopy}</p>
                      <div className="space-y-4 rounded-xl border border-white/10 bg-black/50 p-4">
                        <p className="text-sm leading-relaxed text-zinc-300">{onboardingContent.beta.infoCard}</p>
                        <div className="rounded-lg border border-[#FFC107]/40 bg-[#FFC107]/10 px-4 py-3 text-center">
                          <p className="text-xs font-bold uppercase tracking-widest text-[#FFC107]">
                            {onboardingContent.beta.payLabel}
                          </p>
                          <p className="text-2xl font-black text-white">{onboardingContent.beta.payAmount}</p>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button type="button" glow onClick={() => setStep(4)}>
                          {onboardingContent.beta.cta}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === FINAL_STEP_INDEX && (
                  <Card className="w-full border-white/10 bg-zinc-950/95">
                    <CardContent className="space-y-6 p-6 sm:p-8">
                      <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-[#00B894]">
                        {onboardingContent.qualification.badge}
                      </p>
                      <h1 className="text-center text-xl font-bold text-white sm:text-2xl">
                        {onboardingContent.qualification.headline}
                      </h1>
                      <ul className="space-y-3">
                        {onboardingContent.qualification.requirements.map((req) => (
                          <li
                            key={req}
                            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center text-sm font-medium text-zinc-200"
                          >
                            {req}
                          </li>
                        ))}
                      </ul>
                      <p className="text-center text-sm font-semibold text-white">
                        {onboardingContent.qualification.footer}
                      </p>
                      <p className="text-center text-[11px] leading-relaxed text-zinc-500">
                        {onboardingContent.qualification.finePrint}
                      </p>
                      <div className="flex flex-col items-center gap-3 pt-1">
                        <motion.button
                          type="button"
                          disabled={finishing}
                          whileHover={finishing ? undefined : { scale: 1.03 }}
                          whileTap={finishing ? undefined : { scale: 0.97 }}
                          onClick={() => void handleClaimBeta()}
                          className="rounded-lg bg-[#FFC107] px-6 py-3 text-sm font-bold text-black shadow-lg transition-colors hover:bg-[#FFD54F] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {onboardingContent.qualification.primaryCta}
                        </motion.button>
                        <button
                          type="button"
                          disabled={finishing}
                          onClick={() => void handleNoThanks()}
                          className="text-sm font-medium text-zinc-500 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {onboardingContent.qualification.noThanksCta}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
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
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 53) % 100}%`,
        top: `${(i * 71) % 80}%`,
        delay: (i % 5) * 0.12,
        hue: i % 2 === 0 ? '#D946EF' : '#00B894'
      })),
    []
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute h-2 w-2 rounded-full opacity-60"
          style={{ left: d.left, top: d.top, backgroundColor: d.hue }}
          animate={{ y: [0, 14, 0], opacity: [0.35, 1, 0.35], scale: [1, 1.4, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
