'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
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
            <h2 className="text-xl font-bold text-white mb-3">Check Your Email</h2>
            <p className="text-zinc-400 text-sm mb-2">
              We sent a password reset link to
            </p>
            <p className="text-white font-semibold mb-6">{email}</p>
            <p className="text-zinc-500 text-xs mb-8">
              Don&apos;t see it? Check your spam folder.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Button>
            </Link>
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
            <Mail className="w-5 h-5" />
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-5">
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
              type="email"
              label="Email Address"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              className="w-full group"
              size="lg"
              loading={loading}
              glow
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs text-zinc-600 bg-[#0a0a0f] uppercase tracking-widest">
                  Remember your password?
                </span>
              </div>
            </div>

            <Link href="/login">
              <Button type="button" variant="outline" className="w-full group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-zinc-600 text-xs mt-4 uppercase tracking-widest">
        Secure Connection • v2.0.1
      </p>
    </motion.div>
  )
}
