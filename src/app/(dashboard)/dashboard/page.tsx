'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoCard } from '@/components/ui/video-card'
import { LiveActivityCounter } from '@/components/ui/social-proof'
import { HelpTooltip } from '@/components/ui/help-tooltip'

import { createClient } from '@/lib/supabase/client'
import { Users, Mail, Clock, Zap, Activity, TrendingUp, HelpCircle } from 'lucide-react'
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
          className="w-12 h-12 border-2 border-[#D946EF]/30 border-t-[#D946EF] rounded-full"
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
      className="max-w-[1700px] mx-auto px-4"
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Area (3 Columns) */}
        <div className="xl:col-span-3 space-y-8">


          {/* Welcome Video */}
          <motion.div variants={itemVariants}>
            <VideoCard
              title="Welcome to Profit Loop - Start Here"
              description="Watch this essential training to understand exactly how to use Profit Loop to generate your first profitable leads and start making money with email outreach."
              duration="12:34"
              views="2,847"
              thumbnailText="START HERE"
            />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Leads Allocation */}
            <motion.div variants={itemVariants}>
              <Card className="h-full group" glow>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-[#D946EF]/10 border border-[#D946EF]/20 group-hover:border-[#D946EF]/50 transition-colors">
                        <Users className="w-6 h-6 text-[#D946EF]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm text-zinc-500 uppercase tracking-widest font-black italic">
                          Lead Magnet
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-[#D946EF]">
                        {String(timeUntilReset.hours).padStart(2, '0')}:{String(timeUntilReset.minutes).padStart(2, '0')}:{String(timeUntilReset.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-6xl font-black italic tracking-tighter text-white">{stats.leadsRemaining}</span>
                      <span className="text-zinc-500 text-sm font-bold uppercase">/ {DAILY_LEAD_LIMIT} LEFT</span>
                    </div>
                  </div>
                  
                  <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${leadsPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-[#D946EF] rounded-full shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                    />
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Allocated Today</p>
                      <p className="text-2xl font-black italic text-white">{stats.leadsAllocatedToday}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Usage Rate</p>
                      <p className="text-2xl font-black italic text-[#D946EF]">
                        {Math.round((stats.leadsAllocatedToday / DAILY_LEAD_LIMIT) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Email Generation */}
            <motion.div variants={itemVariants}>
              <Card className="h-full group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                        <Mail className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm text-zinc-500 uppercase tracking-widest font-black italic">
                          Email Generation
                        </CardTitle>
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-white/20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-6xl font-black italic tracking-tighter text-white">{stats.emailsRemaining}</span>
                      <span className="text-zinc-500 text-sm font-bold uppercase">/ {DAILY_EMAIL_LIMIT} LEFT</span>
                    </div>
                  </div>
                  
                  <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${emailsPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                    />
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Generated Today</p>
                      <p className="text-2xl font-black italic text-white">{stats.emailsGeneratedToday}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Usage Rate</p>
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm text-zinc-500 uppercase tracking-widest font-black italic">
                    Quick Actions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/leads"
                    className="group p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-[#D946EF]/30 transition-all duration-300"
                  >
                    <Users className="w-8 h-8 text-[#D946EF] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-black italic uppercase tracking-tighter text-lg text-white mb-1">Allocate Leads</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase">Generate new business leads</p>
                  </a>
                  
                  <a
                    href="/email-builder"
                    className="group p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    <Mail className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-black italic uppercase tracking-tighter text-lg text-white mb-1">Build Email</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase">Create AI-powered outreach</p>
                  </a>
                  
                  <a
                    href="/offers"
                    className="group p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    <Activity className="w-8 h-8 text-white mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-black italic uppercase tracking-tighter text-lg text-white mb-1">Offer Library</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase">Manage offer templates</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Sidebar Area (1 Column) */}
        <div className="xl:col-span-1 space-y-6">
          {/* Notifications Title (Static) */}
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-black italic px-2">Notifications</p>

          {/* Community Progress */}
          <motion.div variants={itemVariants}>
            <Card className="glass-strong border-l-4 border-l-[#D946EF]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D946EF]" />
                  <CardTitle className="text-xs text-[#D946EF] uppercase tracking-widest font-black italic">
                    Community Progress
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-500">Weekly Goal</span>
                    <span className="text-white">$1M Target</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div className="h-full bg-[#D946EF] rounded-full w-[68%] shadow-[0_0_10px_rgba(217,70,239,0.4)]" />
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                  The Profit Loop community is currently at 68% of the weekly target.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div variants={itemVariants}>
            <Card className="border-none bg-white/2">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white/40" />
                  <CardTitle className="text-xs text-zinc-500 uppercase tracking-widest font-black italic">
                    Live Activity
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


          {/* Manager Support */}
          <motion.div variants={itemVariants}>
            <Card className="hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <HelpCircle className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="font-black italic uppercase tracking-tighter text-white">Need Help?</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Talk to Success Manager</p>
                  </div>
                </div>
                <a
                  href="/support"
                  className="mt-4 flex items-center justify-center w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black italic uppercase tracking-widest rounded-lg border border-white/10 transition-all"
                >
                  Open Ticket
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
