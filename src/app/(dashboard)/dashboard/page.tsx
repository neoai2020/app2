'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoCard } from '@/components/ui/video-card'
import { BonusTrainingCard } from '@/components/ui/bonus-training-card'
import { DashboardTipsWidget } from '@/components/ui/social-proof'
import { ContactSupportWidget } from '@/components/ui/contact-support-widget'
import { PremiumUpgradesWidget } from '@/components/ui/premium-upgrades-widget'
import { HowItWorks } from '@/components/ui/how-it-works'
import { createClient } from '@/lib/supabase/client'
import { Headphones, Play } from 'lucide-react'

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
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState<string | null>(null)

  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
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

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

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
              className="btn btn-primary btn-lg w-full"
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
                    className="btn btn-primary btn-md px-8"
                  >
                    Contact Support
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="min-w-0 space-y-6 xl:col-span-1">
          <motion.div variants={itemVariants}>
            <ContactSupportWidget />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-[#D946EF]/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black italic uppercase tracking-widest text-zinc-500">
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <DashboardTipsWidget />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <PremiumUpgradesWidget />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
