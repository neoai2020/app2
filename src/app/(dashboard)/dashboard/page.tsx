'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoCard } from '@/components/ui/video-card'
import { BonusTrainingCard } from '@/components/ui/bonus-training-card'
import { LiveActivityCounter } from '@/components/ui/social-proof'
import { HowItWorks } from '@/components/ui/how-it-works'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  Mail,
  Clock,
  Zap,
  Activity,
  TrendingUp,
  HelpCircle,
  Headphones,
  Play
} from 'lucide-react'
import { DAILY_LEAD_LIMIT, DAILY_EMAIL_LIMIT } from '@/lib/constants'
import { UsageLimit } from '@/types/database'

interface DashboardStats {
  leadsAllocatedToday: number
  emailsGeneratedToday: number
  leadsRemaining: number
  emailsRemaining: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    leadsAllocatedToday: 0,
    emailsGeneratedToday: 0,
    leadsRemaining: DAILY_LEAD_LIMIT,
    emailsRemaining: DAILY_EMAIL_LIMIT
  })
  const [timeUntilReset, setTimeUntilReset] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState<string | null>(null)

  const supabase = createClient()

  const fetchStats = useCallback(async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    const name = (profile as { full_name?: string | null } | null)?.full_name
    if (name?.trim()) {
      setFirstName(name.trim().split(/\s+/)[0] ?? null)
    }

    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()

    const usage = data as UsageLimit | null
    if (usage) {
      setStats({
        leadsAllocatedToday: usage.leads_allocated,
        emailsGeneratedToday: usage.emails_generated,
        leadsRemaining: DAILY_LEAD_LIMIT - usage.leads_allocated,
        emailsRemaining: DAILY_EMAIL_LIMIT - usage.emails_generated
      })
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    void fetchStats()
  }, [fetchStats])

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      setTimeUntilReset({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-2 border-[#D946EF]/30 border-t-[#D946EF]"
        />
      </div>
    )
  }

  const leadsPercentage = (stats.leadsRemaining / DAILY_LEAD_LIMIT) * 100
  const emailsPercentage = (stats.emailsRemaining / DAILY_EMAIL_LIMIT) * 100

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl space-y-8"
    >
      {/* Welcome — Robinhood pattern, Profit Loop copy */}
      <motion.div variants={itemVariants} className="pt-1">
        <p className="page-eyebrow mb-3">Home</p>
        <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-6xl">
          Welcome to Profit Loop{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--muted-strong)] sm:text-lg lg:text-xl">
          Find local customers, generate personalized emails, and send them from your own inbox.
          You only need to do three things — each one takes just a few minutes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <div className="space-y-8 xl:col-span-3">
          {/* Featured training video */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-3">
              <Play className="h-7 w-7 text-[#D946EF]" />
              <h2 className="ds-h2">
                Welcome &amp; Getting Started
              </h2>
            </div>
            <VideoCard
              title="Welcome & Getting Started"
              description="This short video shows you exactly how to use Profit Loop to find customers and write emails that get replies."
              duration="4:32"
              views="2,847"
              videoUrl="https://player.vimeo.com/video/1177396372"
            />
            <Link
              href="/training"
              className="touch-cta flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-base font-black text-black shadow-lg shadow-[#D946EF]/25 transition-all hover:from-[#8B5CF6] hover:to-[#D946EF]"
            >
              Open Training Academy
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BonusTrainingCard />
          </motion.div>

          <motion.div variants={itemVariants}>
            <HowItWorks />
          </motion.div>

          {/* Usage stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card className="group h-full" glow>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-[#D946EF]/20 bg-[#D946EF]/10 p-3 transition-colors group-hover:border-[#D946EF]/50">
                        <Users className="h-6 w-6 text-[#D946EF]" />
                      </div>
                      <CardTitle className="text-sm font-black italic uppercase tracking-widest text-zinc-500">
                        Find Customers
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono text-[#D946EF]">
                        {String(timeUntilReset.hours).padStart(2, '0')}:
                        {String(timeUntilReset.minutes).padStart(2, '0')}:
                        {String(timeUntilReset.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-5xl font-black italic tracking-tighter text-white sm:text-6xl">
                        {stats.leadsRemaining}
                      </span>
                      <span className="text-sm font-bold uppercase text-zinc-500">
                        / {DAILY_LEAD_LIMIT} LEFT
                      </span>
                    </div>
                  </div>
                  <div className="relative h-4 overflow-hidden rounded-full border border-white/10 bg-white/5 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${leadsPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 rounded-full bg-[#D946EF] shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                    />
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Allocated Today
                      </p>
                      <p className="text-2xl font-black italic text-white">
                        {stats.leadsAllocatedToday}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Usage Rate
                      </p>
                      <p className="text-2xl font-black italic text-[#D946EF]">
                        {Math.round((stats.leadsAllocatedToday / DAILY_LEAD_LIMIT) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="group h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors group-hover:border-white/20">
                        <Mail className="h-6 w-6 text-zinc-400" />
                      </div>
                      <CardTitle className="text-sm font-black italic uppercase tracking-widest text-zinc-500">
                        Email Generation
                      </CardTitle>
                    </div>
                    <Zap className="h-5 w-5 text-white/20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-5xl font-black italic tracking-tighter text-white sm:text-6xl">
                        {stats.emailsRemaining}
                      </span>
                      <span className="text-sm font-bold uppercase text-zinc-500">
                        / {DAILY_EMAIL_LIMIT} LEFT
                      </span>
                    </div>
                  </div>
                  <div className="relative h-4 overflow-hidden rounded-full border border-white/10 bg-white/5 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${emailsPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                    />
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Generated Today
                      </p>
                      <p className="text-2xl font-black italic text-white">
                        {stats.emailsGeneratedToday}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Usage Rate
                      </p>
                      <p className="text-2xl font-black italic text-white/50">
                        {Math.round((stats.emailsGeneratedToday / DAILY_EMAIL_LIMIT) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="ds-h2 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <Link
                href="/leads"
                className="group min-h-[120px] rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#D946EF]/30 hover:bg-white/5 sm:p-6"
              >
                <Users className="mb-4 h-8 w-8 text-[#D946EF] transition-transform group-hover:scale-110" />
                <h3 className="mb-1 text-lg font-black italic uppercase tracking-tighter text-white">
                  Find Customers
                </h3>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Generate new business leads
                </p>
              </Link>
              <Link
                href="/email-builder"
                className="group min-h-[120px] rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/5 sm:p-6"
              >
                <Mail className="mb-4 h-8 w-8 text-white transition-transform group-hover:scale-110" />
                <h3 className="mb-1 text-lg font-black italic uppercase tracking-tighter text-white">
                  Write Emails
                </h3>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Create AI-powered outreach
                </p>
              </Link>
              <Link
                href="/offers"
                className="group min-h-[120px] rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/5 sm:p-6"
              >
                <Activity className="mb-4 h-8 w-8 text-white transition-transform group-hover:scale-110" />
                <h3 className="mb-1 text-lg font-black italic uppercase tracking-tighter text-white">
                  Offer Library
                </h3>
                <p className="text-xs font-bold uppercase text-zinc-500">Manage offer templates</p>
              </Link>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <Card className="border-[#D946EF]/25">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col items-stretch justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D946EF] to-[#8B5CF6] shadow-lg">
                      <Headphones className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-0.5 text-xl font-extrabold text-white">Need Help?</h3>
                      <p className="text-sm text-[var(--muted-strong)]">
                        Talk to your success manager
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/support"
                    className="touch-cta flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] px-8 text-base font-extrabold text-black shadow-lg shadow-[#D946EF]/30 transition-all"
                  >
                    Contact Support
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-6 xl:col-span-1">
          <p className="px-2 text-xs font-black italic uppercase tracking-widest text-zinc-500">
            Notifications
          </p>

          <motion.div variants={itemVariants}>
            <Card className="glass-strong border-l-4 border-l-[#D946EF]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#D946EF]" />
                  <CardTitle className="text-xs font-black italic uppercase tracking-widest text-[#D946EF]">
                    Next step
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-zinc-300">
                  Find a few customers, then write one email.
                </p>
                <p className="text-[11px] leading-relaxed text-zinc-600">
                  Your own progress shows in Your activity below — we never invent community
                  earnings.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none bg-white/[0.02]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-white/40" />
                  <CardTitle className="text-xs font-black italic uppercase tracking-widest text-zinc-500">
                    Your activity
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6 py-4">
                  <LiveActivityCounter orientation="vertical" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="xl:hidden">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <HelpCircle className="h-6 w-6 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="font-black italic uppercase tracking-tighter text-white">
                      Need Help?
                    </h4>
                    <p className="text-[10px] font-bold uppercase text-zinc-500">
                      Talk to Success Manager
                    </p>
                  </div>
                </div>
                <Link
                  href="/support"
                  className="mt-4 flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 py-3 text-xs font-black italic uppercase tracking-widest text-white transition-all hover:bg-white/10"
                >
                  Open Ticket
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
