'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Mail, Users, CheckCircle, Gift, Lightbulb, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type FeedIcon = 'email' | 'lead' | 'success' | 'offer' | 'tip'

interface FeedItem {
  id: string
  title: string
  body: string
  icon: FeedIcon
  timeLabel: string
  kind: 'activity' | 'tip'
}

const TIPS: Omit<FeedItem, 'id' | 'timeLabel'>[] = [
  {
    title: 'What to do next',
    body: 'Find a few local businesses, then generate one email and copy it into your own inbox.',
    icon: 'tip',
    kind: 'tip'
  },
  {
    title: 'Tip',
    body: 'Keep your first outreach short and clear. You stay in control — Profit Loop does not send emails for you.',
    icon: 'tip',
    kind: 'tip'
  },
  {
    title: 'Tip',
    body: 'Save strong emails to reuse later. Consistency beats volume for most members.',
    icon: 'tip',
    kind: 'tip'
  },
  {
    title: 'Tip',
    body: 'Start with an industry you understand — your messages will sound more natural.',
    icon: 'tip',
    kind: 'tip'
  }
]

const iconComponents = {
  email: Mail,
  lead: Users,
  success: CheckCircle,
  offer: Gift,
  tip: Lightbulb
}

const iconColors = {
  email: 'text-[#D946EF] bg-[#D946EF]/20',
  lead: 'text-indigo-400 bg-indigo-400/20',
  success: 'text-emerald-400 bg-emerald-400/20',
  offer: 'text-amber-300 bg-amber-400/15',
  tip: 'text-zinc-300 bg-white/10'
}

function mapActionToFeed(row: {
  id: string
  action: string
  description: string
  created_at: string
}): FeedItem {
  const action = row.action
  let icon: FeedIcon = 'success'
  let title = 'Your activity'

  if (action === 'lead_allocated') {
    icon = 'lead'
    title = 'Leads found'
  } else if (action === 'email_generated') {
    icon = 'email'
    title = 'Email generated'
  } else if (action === 'email_saved') {
    icon = 'success'
    title = 'Email saved'
  } else if (action === 'offer_created' || action === 'offer_updated') {
    icon = 'offer'
    title = action === 'offer_created' ? 'Offer created' : 'Offer updated'
  }

  let timeLabel = 'recently'
  try {
    timeLabel = formatDistanceToNow(new Date(row.created_at), { addSuffix: true })
  } catch {
    // keep default
  }

  return {
    id: row.id,
    title,
    body: row.description || 'You made progress in Profit Loop.',
    icon,
    timeLabel,
    kind: 'activity'
  }
}

/**
 * Toast feed: rotates the signed-in user's real activity_logs.
 * Falls back to useful tips — never fabricated names, earnings, or "Verified" badges.
 */
export function SocialProofNotifications() {
  const [queue, setQueue] = useState<FeedItem[]>([])
  const [current, setCurrent] = useState<FeedItem | null>(null)
  const supabase = useMemo(() => createClient(), [])

  const tipQueue = useMemo(
    (): FeedItem[] =>
      TIPS.map((t, i) => ({
        ...t,
        id: `tip-${i}`,
        timeLabel: 'Tip'
      })),
    []
  )

  const loadFeed = useCallback(async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      setQueue(tipQueue)
      return
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .select('id, action, description, created_at')
      .eq('user_id', user.id)
      .in('action', [
        'lead_allocated',
        'email_generated',
        'email_saved',
        'offer_created',
        'offer_updated'
      ])
      .order('created_at', { ascending: false })
      .limit(12)

    if (error || !data || data.length === 0) {
      setQueue(tipQueue)
      return
    }

    setQueue(data.map((row) => mapActionToFeed(row as Parameters<typeof mapActionToFeed>[0])))
  }, [supabase, tipQueue])

  useEffect(() => {
    void loadFeed()
  }, [loadFeed])

  useEffect(() => {
    if (queue.length === 0) return

    let i = 0
    const showNext = () => {
      setCurrent(queue[i % queue.length])
      i += 1
    }

    const initial = window.setTimeout(showNext, 4000)
    const interval = window.setInterval(showNext, 18000)
    return () => {
      window.clearTimeout(initial)
      window.clearInterval(interval)
    }
  }, [queue])

  useEffect(() => {
    if (!current) return
    const t = window.setTimeout(() => setCurrent(null), 7000)
    return () => window.clearTimeout(t)
  }, [current])

  // Desktop only: floating toasts cover content and the tab bar on phones,
  // and this feed is passive reinforcement — not worth blocking the UI for.
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden max-w-[320px] flex-col gap-3 lg:flex">
      <AnimatePresence mode="popLayout">
        {current && (
          <motion.div
            key={current.id + current.timeLabel}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="rounded-xl border border-zinc-700/50 p-4 shadow-2xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(24, 24, 27, 0.98) 0%, rgba(39, 39, 42, 0.98) 100%)'
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-2.5 ${iconColors[current.icon]}`}>
                {(() => {
                  const Icon = iconComponents[current.icon]
                  return <Icon size={18} />
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{current.title}</p>
                <p className="mt-1 text-sm leading-snug text-zinc-300">{current.body}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-zinc-700/50 pt-2">
                  <Activity size={12} className="text-zinc-500" />
                  <p className="text-xs text-zinc-500">{current.timeLabel}</p>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">
                    {current.kind === 'activity' ? 'Your activity' : 'Helpful tip'}
                  </span>
                </div>
                <p className="mt-2 text-[10px] leading-snug text-zinc-600">
                  Individual results vary.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Dashboard side panel: rotating helpful tips only.
 */
export function DashboardTipsWidget() {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const t = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, 12000)
    return () => window.clearInterval(t)
  }, [])

  const tip = TIPS[tipIndex]

  return (
    <div className="ds-well p-4">
      <p className="text-sm font-semibold text-zinc-300">{tip.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tip.body}</p>
      <p className="mt-3 text-xs leading-snug text-zinc-600">Individual results vary.</p>
    </div>
  )
}

/**
 * Dashboard side panel: your real usage today + rotating tips.
 * No fabricated community earnings or fake counters.
 */
export function LiveActivityCounter({
  orientation = 'horizontal'
}: {
  orientation?: 'horizontal' | 'vertical'
}) {
  const [leadsToday, setLeadsToday] = useState(0)
  const [emailsToday, setEmailsToday] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    void (async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('usage_limits')
        .select('leads_allocated, emails_generated')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()
      if (data) {
        setLeadsToday((data as { leads_allocated: number }).leads_allocated ?? 0)
        setEmailsToday((data as { emails_generated: number }).emails_generated ?? 0)
      }
    })()
  }, [supabase])

  useEffect(() => {
    const t = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, 12000)
    return () => window.clearInterval(t)
  }, [])

  const tip = TIPS[tipIndex]
  const stack = orientation === 'vertical'

  return (
    <div className={stack ? 'flex flex-col gap-3' : 'grid grid-cols-1 gap-3 md:grid-cols-3'}>
      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
        <p className="font-mono text-lg font-semibold text-white">{leadsToday}</p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Leads found today
        </p>
      </div>
      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
        <p className="font-mono text-lg font-semibold text-white">{emailsToday}</p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Emails generated today
        </p>
      </div>
      <div className={`rounded-lg border border-white/5 bg-white/[0.02] p-3 ${stack ? '' : ''}`}>
        <p className="text-xs font-semibold text-zinc-300">{tip.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{tip.body}</p>
        <p className="mt-2 text-[10px] leading-snug text-zinc-600">Individual results vary.</p>
      </div>
    </div>
  )
}
