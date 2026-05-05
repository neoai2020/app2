'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  onboardingContent,
  ONBOARDING_BETA_QUALIFICATION_CTA_URL,
  ONBOARDING_PRODUCT_NAME,
  ONBOARDING_UPGRADES_VIDEO_SRC
} from '@/config/onboarding-content'
import { resolveOnboardingGate } from '@/lib/onboarding-gate'

const STEP_COUNT = 7

export function OnboardingFlow() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [step, setStep] = useState(0)
  const [prepDone, setPrepDone] = useState<boolean[]>(() =>
    onboardingContent.preparing.rows.map(() => false)
  )
  const [prepReady, setPrepReady] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const verifyNotCompleted = useCallback(async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }
    const gate = await resolveOnboardingGate(supabase, user.id)
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

  // Step 0 — sequential “loading” rows
  useEffect(() => {
    if (step !== 0 || prepReady) return
    let cancelled = false
    const delays = [650, 800, 900]
    let i = 0
    const tick = () => {
      if (cancelled || i >= onboardingContent.preparing.rows.length) {
        if (!cancelled) setPrepReady(true)
        return
      }
      setPrepDone((prev) => {
        const next = [...prev]
        next[i] = true
        return next
      })
      i += 1
      window.setTimeout(tick, delays[i - 1] ?? 700)
    }
    const t = window.setTimeout(tick, 500)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [step, prepReady])

  // Step 5 — branded loading, auto-advance
  useEffect(() => {
    if (step !== 5) return
    const t = window.setTimeout(() => setStep(6), 2400)
    return () => window.clearTimeout(t)
  }, [step])

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = firstName.trim()
    if (!trimmed) return
    setSubmitting(true)
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
          onboarding_completed_at: new Date().toISOString(),
          onboarding_first_name: trimmed
        })
        .eq('id', user.id)

      if (error) {
        setLoadError(error.message)
        setSubmitting(false)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setLoadError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const goQualificationCta = () => {
    const url = ONBOARDING_BETA_QUALIFICATION_CTA_URL.trim()
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
    setStep(5)
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
                    disabled={!prepReady}
                    glow={prepReady}
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
                <h1 className="text-center text-xl font-bold text-white sm:text-2xl">{onboardingContent.upgrades.title}</h1>
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

          {step === 4 && (
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
                <p className="text-center text-sm font-semibold text-white">{onboardingContent.qualification.footer}</p>
                <p className="text-center text-[11px] leading-relaxed text-zinc-500">
                  {onboardingContent.qualification.finePrint}
                </p>
                <div className="flex justify-center">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={goQualificationCta}
                    className="rounded-lg bg-[#FFC107] px-6 py-3 text-sm font-bold text-black shadow-lg transition-colors hover:bg-[#FFD54F]"
                  >
                    {onboardingContent.qualification.primaryCta}
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 5 && (
            <Card className="w-full border-white/10 bg-zinc-950/95">
              <CardContent className="flex flex-col items-center gap-8 py-14 sm:py-16">
                <Image src="/logo.png" alt="" width={48} height={48} className="opacity-90" />
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#D946EF"
                      strokeWidth="8"
                      strokeDasharray={`${0.66 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-lg font-black text-white">
                    {onboardingContent.loading.percentLabel}
                  </span>
                </div>
                <p className="text-center text-sm text-zinc-400">{onboardingContent.loading.subline}</p>
              </CardContent>
            </Card>
          )}

          {step === 6 && (
            <Card className="w-full border-white/10 bg-zinc-950/95">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleActivation} className="space-y-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <aside className="shrink-0 space-y-3 rounded-xl border border-[#D946EF]/20 bg-[#D946EF]/5 p-4 text-xs text-zinc-400 lg:max-w-[200px]">
                      <p className="font-bold uppercase tracking-widest text-[#D946EF]">Status</p>
                      <p>
                        Step {STEP_COUNT} of {STEP_COUNT}
                      </p>
                      <p>Workspace lock: active until activation is submitted.</p>
                    </aside>
                    <div className="min-w-0 flex-1 space-y-4">
                      <h1 className="text-xl font-bold text-white sm:text-2xl">
                        {onboardingContent.activation.headline}
                      </h1>
                      <p className="text-sm text-zinc-400">{onboardingContent.activation.subheadline}</p>
                      <Input
                        label="First name"
                        placeholder={onboardingContent.activation.namePlaceholder}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        required
                      />
                      <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
                          {onboardingContent.activation.infoTitle}
                        </p>
                        <ol className="list-decimal space-y-2 pl-4 text-sm text-zinc-300">
                          {onboardingContent.activation.infoSteps.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                      </div>
                      <p className="text-xs text-zinc-500">{onboardingContent.activation.note}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button type="submit" glow disabled={submitting || !firstName.trim()}>
                      {submitting ? 'Saving…' : onboardingContent.activation.cta}
                    </Button>
                  </div>
                </form>
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
