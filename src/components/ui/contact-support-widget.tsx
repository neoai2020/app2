'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Headphones, Loader2, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { FREE_TRAINING_URL, SUPPORT_EMAIL } from '@/lib/constants'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function ContactSupportWidget() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    void (async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    })()
  }, [supabase])

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setErrorMessage('')

      const trimmedEmail = email.trim()
      const trimmedMessage = message.trim()

      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setErrorMessage('Please enter a valid email address.')
        setFormState('error')
        return
      }

      if (trimmedMessage.length < 10) {
        setErrorMessage('Please add a bit more detail so we can help you.')
        setFormState('error')
        return
      }

      setFormState('submitting')

      try {
        const res = await fetch('/api/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage })
        })

        const data = (await res.json()) as { error?: string }

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong. Please try again.')
        }

        setSubmittedEmail(trimmedEmail)
        setFormState('success')
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
        setFormState('error')
      }
    },
    [email, message]
  )

  const resetForm = () => {
    setFormState('idle')
    setMessage('')
    setErrorMessage('')
  }

  if (formState === 'success') {
    return (
      <Card className="border-[#D946EF]/20">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-black italic uppercase tracking-tighter text-white">
                Message sent
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-400">
                We&apos;ll reply to{' '}
                <span className="font-semibold text-white">{submittedEmail}</span>. We usually
                respond within about 2 hours — during busy periods, please allow 24–48 hours.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#fbbf24]/30 bg-gradient-to-b from-[#101726] to-[#0b0f18] px-4 py-4 text-center">
            <span className="mb-2 inline-block rounded-md bg-[#ef4444] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
              Free Training
            </span>
            <p className="mb-1 text-xs font-black uppercase leading-snug text-white">
              Wake up with an extra{' '}
              <span className="text-[#fbbf24]">$1,000–$5,000</span> in your account
            </p>
            <p className="mb-3 text-[11px] leading-snug text-[#d8e9fb]">
              While you wait, watch how members scale to $1,000–$5,000 per day — without extra
              grind.
            </p>
            <a
              href={FREE_TRAINING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-4 py-2 text-[11px] font-black uppercase text-[#1a1305] shadow-lg shadow-[#fbbf24]/20 transition-all hover:scale-[1.02]"
            >
              Watch The Free Training &gt;&gt;
            </a>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-[#ef4444]">
              Warning: This may be taken down soon
            </p>
          </div>

          <button type="button" onClick={resetForm} className="btn btn-accent-soft btn-sm w-full">
            Send another message
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#D946EF]/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-[#D946EF]/20 bg-[#D946EF]/10 p-2">
            <Headphones className="h-4 w-4 text-[#D946EF]" />
          </div>
          <CardTitle className="text-xs font-black italic uppercase tracking-widest text-white">
            Contact Support
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <p className="text-[11px] leading-relaxed text-zinc-400">
          We usually reply within about 2 hours. Because of high email volume, please allow{' '}
          <span className="text-zinc-300">24–48 hours</span> during busy periods. Your answer will
          go to the email you enter below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Your email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={formState === 'submitting'}
            className="text-sm py-2.5"
          />

          <Textarea
            label="Your message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you need help with..."
            required
            disabled={formState === 'submitting'}
            className="min-h-[100px] text-sm"
          />

          {formState === 'error' && errorMessage && (
            <p className="text-xs text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="btn btn-primary btn-sm w-full"
          >
            {formState === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send message'
            )}
          </button>
        </form>

        <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
          <p className="text-[10px] leading-relaxed text-zinc-500">
            If the form doesn&apos;t work, email us directly at{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold text-[#D946EF] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
