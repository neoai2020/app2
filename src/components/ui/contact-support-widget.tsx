'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Headphones, Loader2, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { FREE_TRAINING_URL, SUPPORT_EMAIL } from '@/lib/constants'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const fieldClassName =
  'cyber-input w-full min-w-0 rounded-lg px-3.5 py-3 text-sm leading-normal text-white placeholder:text-white/30'

const labelClassName =
  'mb-2 block text-xs font-semibold uppercase tracking-wide text-[#D946EF]/90'

function openSupportMailto(email: string, message: string) {
  const subject = 'Profit Loop AI — Support Request'
  const body = `Please reply to: ${email}\n\n${message}`
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function finishWithMailto(
  email: string,
  message: string,
  setSubmittedEmail: (value: string) => void,
  setSentViaMailto: (value: boolean) => void,
  setFormState: (value: FormState) => void
) {
  openSupportMailto(email, message)
  setSubmittedEmail(email)
  setSentViaMailto(true)
  setFormState('success')
}

async function parseJsonResponse(res: Response): Promise<{
  error?: string
  useMailto?: boolean
  success?: boolean
} | null> {
  const text = await res.text()
  if (!text.trim()) return {}

  try {
    return JSON.parse(text) as { error?: string; useMailto?: boolean; success?: boolean }
  } catch {
    return null
  }
}

export function ContactSupportWidget() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [sentViaMailto, setSentViaMailto] = useState(false)
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
          credentials: 'same-origin',
          body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage })
        })

        const data = await parseJsonResponse(res)

        if (data === null) {
          finishWithMailto(
            trimmedEmail,
            trimmedMessage,
            setSubmittedEmail,
            setSentViaMailto,
            setFormState
          )
          return
        }

        if (res.status === 401) {
          throw new Error('Your session expired. Please refresh the page and try again.')
        }

        if (res.ok && data.success) {
          setSubmittedEmail(trimmedEmail)
          setSentViaMailto(false)
          setFormState('success')
          return
        }

        if (data.useMailto) {
          finishWithMailto(
            trimmedEmail,
            trimmedMessage,
            setSubmittedEmail,
            setSentViaMailto,
            setFormState
          )
          return
        }

        throw new Error(data.error || 'Something went wrong. Please try again.')
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
    setSentViaMailto(false)
    setErrorMessage('')
  }

  if (formState === 'success') {
    return (
      <Card hover={false} className="min-w-0 overflow-hidden border-[#D946EF]/20">
        <CardContent className="space-y-5 px-5 py-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 rounded-full border border-green-500/30 bg-green-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-base font-black italic uppercase tracking-tight text-white">
              {sentViaMailto ? 'Check your email app' : 'Message sent'}
            </h3>
            <p className="mt-3 w-full text-sm leading-relaxed text-zinc-300">
              {sentViaMailto ? (
                <>
                  Your email app should open with your message ready to send. Tap{' '}
                  <span className="font-semibold text-white">Send</span> to deliver it — then
                  we&apos;ll reply to{' '}
                  <span className="break-all font-semibold text-white">{submittedEmail}</span>. We
                  usually respond within about 2 hours — during busy periods, please allow 24–48
                  hours.
                </>
              ) : (
                <>
                  We&apos;ll reply to{' '}
                  <span className="break-all font-semibold text-white">{submittedEmail}</span>. We
                  usually respond within about 2 hours — during busy periods, please allow 24–48
                  hours.
                </>
              )}
            </p>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-sm leading-relaxed text-zinc-300">
              While you wait, start with our{' '}
              <span className="font-semibold text-[#fbbf24]">free training</span> — discover how to
              wake up with an extra{' '}
              <span className="font-semibold text-[#fbbf24]">$1,000–$5,000</span> in your account and
              scale to $1k–$5k per day without extra grind.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#ef4444]">
              Warning: This may be taken down soon
            </p>
            <a
              href={FREE_TRAINING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full rounded-lg bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-4 py-3 text-center text-xs font-black uppercase text-[#1a1305] shadow-lg shadow-[#fbbf24]/20 transition-all hover:scale-[1.01]"
            >
              Watch The Free Training &gt;&gt;
            </a>
          </div>

          <button type="button" onClick={resetForm} className="btn btn-accent-soft btn-md w-full">
            Send another message
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card hover={false} className="min-w-0 overflow-hidden border-[#D946EF]/20">
      <CardHeader className="pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl border border-[#D946EF]/20 bg-[#D946EF]/10 p-2.5">
            <Headphones className="h-5 w-5 text-[#D946EF]" />
          </div>
          <CardTitle className="text-sm font-black italic uppercase tracking-widest text-white">
            Contact Support
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-0">
        <p className="text-sm leading-relaxed text-zinc-300">
          We usually reply within about 2 hours. Because of high email volume, please allow{' '}
          <span className="font-medium text-white">24–48 hours</span> during busy periods. Your
          answer will go to the email you enter below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="min-w-0">
            <label htmlFor="support-email" className={labelClassName}>
              Your email
            </label>
            <input
              id="support-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={formState === 'submitting'}
              className={fieldClassName}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="support-message" className={labelClassName}>
              Your message
            </label>
            <textarea
              id="support-message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you need help with..."
              required
              disabled={formState === 'submitting'}
              rows={4}
              className={`${fieldClassName} min-h-[112px] resize-y`}
            />
          </div>

          {formState === 'error' && errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="btn btn-primary btn-md w-full"
          >
            {formState === 'submitting' ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send message'
            )}
          </button>
        </form>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3.5">
          <div className="flex min-w-0 items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
            <div className="min-w-0 space-y-1">
              <p className="text-xs leading-relaxed text-zinc-400">
                If the form doesn&apos;t work, email us directly:
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="block break-all text-sm font-semibold leading-snug text-[#D946EF] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
