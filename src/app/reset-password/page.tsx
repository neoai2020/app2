'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [ready, setReady] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const urlParams = new URLSearchParams(window.location.search)

      const urlError = urlParams.get('error')
      if (urlError) {
        setError(urlError)
        setChecking(false)
        return
      }

      const tokenHash = urlParams.get('token_hash')
      const type = urlParams.get('type')
      if (tokenHash && type === 'recovery') {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          })
          if (verifyError) {
            setError(verifyError.message)
          } else {
            setReady(true)
          }
        } catch {
          setError('Failed to verify reset link. Please request a new one.')
        }
        setChecking(false)
        return
      }

      const code = urlParams.get('code')
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setError(exchangeError.message)
          } else {
            setReady(true)
          }
        } catch {
          setError('Failed to verify reset code. Please request a new link.')
        }
        setChecking(false)
        return
      }

      const hash = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const hashError = hashParams.get('error_description')
      if (hashError) {
        setError(hashError.replace(/\+/g, ' '))
        setChecking(false)
        return
      }
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (sessionError) {
            setError(sessionError.message)
          } else {
            setReady(true)
          }
        } catch {
          setError('Failed to verify reset link. Please request a new one.')
        }
        setChecking(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      } else {
        setError('No active reset session. Please request a new password reset link.')
      }
      setChecking(false)
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="Profit Loop" width={64} height={64} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">PROFIT LOOP</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">AI-Powered Outreach Platform</p>
        </div>
        <Card glow>
          <CardContent className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-[#D946EF] animate-spin mx-auto mb-4" />
            <p className="text-zinc-400 text-sm">Verifying your reset link...</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="Profit Loop" width={64} height={64} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">PROFIT LOOP</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">AI-Powered Outreach Platform</p>
        </div>
        <Card glow>
          <CardContent className="py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Password Updated!</h2>
            <p className="text-zinc-400 text-sm mb-8">
              Your password has been changed successfully. You can now log in with your new password.
            </p>
            <Link href="/login">
              <Button className="w-full group" size="lg" glow>
                <span>Go to Login</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!ready && error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="Profit Loop" width={64} height={64} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">PROFIT LOOP</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">AI-Powered Outreach Platform</p>
        </div>
        <Card glow>
          <CardContent className="py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Reset Failed</h2>
            <p className="text-zinc-400 text-sm mb-8">{error}</p>
            <div className="space-y-3">
              <Link href="/forgot-password">
                <Button className="w-full group" size="lg" glow>
                  <span>Request New Link</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <Image src="/logo.png" alt="Profit Loop" width={64} height={64} />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">PROFIT LOOP</h1>
        <p className="text-zinc-500 text-sm uppercase tracking-widest">AI-Powered Outreach Platform</p>
      </div>

      <Card glow>
        <CardHeader className="text-center">
          <CardTitle className="text-xl gradient-text flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            Set New Password
          </CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  {error}
                </span>
              </motion.div>
            )}

            <Input
              type="password"
              label="New Password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full group"
              size="lg"
              loading={loading}
              glow
            >
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-zinc-600 text-xs mt-4 uppercase tracking-widest">
        Secure Connection • v2.0.1
      </p>
    </motion.div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 text-[#D946EF] animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
