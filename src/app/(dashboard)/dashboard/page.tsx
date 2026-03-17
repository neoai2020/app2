'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoCard } from '@/components/ui/video-card'
import { LiveActivityCounter } from '@/components/ui/social-proof'
import { HelpTooltip, QuickTip } from '@/components/ui/help-tooltip'
import { createClient } from '@/lib/supabase/client'
import { Users, Mail, Clock, Zap, Activity, TrendingUp } from 'lucide-react'
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
    transition: {
      staggerChildren: 0.1
    }
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
  const [showTip, setShowTip] = useState(true)
  const supabase = createClient()

  const fetchStats = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

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
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilReset({ hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-blue-400/30 border-t-blue-400 rounded-full"
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
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold gradient-text">Command Center</h1>
          <HelpTooltip
            variant="info"
            title="Your Dashboard"
            content="This is your central hub for monitoring lead allocations, email generations, and system activity. All metrics refresh in real-time."
            learnMoreLink="/support#dashboard"
          />
        </div>
        <p className="text-zinc-500 mt-2">Real-time allocation monitoring and community activity</p>
      </motion.div>

      {/* Quick Tip */}
      {showTip && (
        <motion.div variants={itemVariants}>
          <QuickTip
            tip="Pro tip: Allocate leads in the morning when business owners are most likely to check their emails. This can increase your response rate by up to 40%!"
            onDismiss={() => setShowTip(false)}
          />
        </motion.div>
      )}

      {/* Welcome Video - Centered */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="max-w-3xl mx-auto">
          <VideoCard
            title="Welcome to Inbox Money Vault - Start Here"
            description="Watch this essential training to understand exactly how to use Inbox Money Vault to generate your first profitable leads and start making money with email outreach."
            duration="12:34"
            views="2,847"
            thumbnailText="START HERE"
          />
        </div>
      </motion.div>

      {/* Live Community Stats */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base text-zinc-400 uppercase tracking-wider">
                  Live Community Activity
                </CardTitle>
                <HelpTooltip
                  variant="info"
                  content="These numbers represent the combined activity of all Inbox Money Vault members worldwide. Updated in real-time."
                />
              </div>
              <span className="ml-auto flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <LiveActivityCounter />
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Leads Allocation */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-400/10 border border-blue-400/20">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base text-zinc-400 uppercase tracking-wider">
                      Lead Allocation
                    </CardTitle>
                    <HelpTooltip
                      variant="help"
                      content="Leads are pre-verified business contacts ready for outreach. Each lead includes email, business name, and industry data."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono text-blue-400">
                    {String(timeUntilReset.hours).padStart(2, '0')}:{String(timeUntilReset.minutes).padStart(2, '0')}:{String(timeUntilReset.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-5xl font-bold text-white">{stats.leadsRemaining}</span>
                  <span className="text-zinc-500 text-sm">/ {DAILY_LEAD_LIMIT} remaining</span>
                </div>
              </div>
              
              <div className="relative h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${leadsPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 data-bar rounded-full"
                />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Allocated Today</p>
                  <p className="text-2xl font-bold text-white">{stats.leadsAllocatedToday}</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Usage Rate</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {Math.round((stats.leadsAllocatedToday / DAILY_LEAD_LIMIT) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Email Generation */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                    <Mail className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base text-zinc-400 uppercase tracking-wider">
                      Email Generation
                    </CardTitle>
                    <HelpTooltip
                      variant="help"
                      content="AI-powered email generation creates personalized outreach messages. Each generation includes subject line, body, and follow-up."
                    />
                  </div>
                </div>
                <Zap className="w-5 h-5 text-zinc-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-5xl font-bold text-white">{stats.emailsRemaining}</span>
                  <span className="text-zinc-500 text-sm">/ {DAILY_EMAIL_LIMIT} remaining</span>
                </div>
              </div>
              
              <div className="relative h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${emailsPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #10b981, #f59e0b)',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                  }}
                />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Generated Today</p>
                  <p className="text-2xl font-bold text-white">{stats.emailsGeneratedToday}</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Usage Rate</p>
                  <p className="text-2xl font-bold text-indigo-400">
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-zinc-400 uppercase tracking-wider">
                Quick Actions
              </CardTitle>
              <HelpTooltip
                variant="tip"
                title="Quick Start"
                content="Use these shortcuts to quickly access the most important features. Start with Lead Allocation, then build your emails."
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/leads"
                className="group p-4 rounded-lg bg-blue-400/5 border border-blue-400/20 hover:bg-blue-400/10 hover:border-blue-400/40 transition-all duration-300"
              >
                <Users className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Allocate Leads</h3>
                <p className="text-sm text-zinc-500">Generate new business leads</p>
              </a>
              
              <a
                href="/email-builder"
                className="group p-4 rounded-lg bg-indigo-400/5 border border-indigo-400/20 hover:bg-indigo-400/10 hover:border-indigo-400/40 transition-all duration-300"
              >
                <Mail className="w-8 h-8 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">Build Email</h3>
                <p className="text-sm text-zinc-500">Create AI-powered outreach</p>
              </a>
              
              <a
                href="/activity"
                className="group p-4 rounded-lg bg-blue-400/5 border border-blue-400/20 hover:bg-blue-400/10 hover:border-blue-400/40 transition-all duration-300"
              >
                <Activity className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-white mb-1">View Activity</h3>
                <p className="text-sm text-zinc-500">Monitor system logs</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
