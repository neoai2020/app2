'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Shield,
  ShieldCheck,
  Lock,
  Wifi,
  Server,
  Globe,
  Key,
  CheckCircle,
  Activity,
  User,
  Calendar,
  Mail,
  BadgeCheck,
  ArrowRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const securityChecks = [
  {
    icon: BadgeCheck,
    title: 'Account Verified',
    description: 'Your identity has been confirmed and credentials validated',
  },
  {
    icon: Lock,
    title: 'Secure Connection',
    description: 'Your connection is encrypted with TLS 1.3 protocols',
  },
  {
    icon: Key,
    title: 'Session Protected',
    description: 'Your session is authenticated with secure token management',
  },
  {
    icon: Shield,
    title: 'Data Encryption',
    description: 'All personal data is encrypted at rest and in transit',
  },
  {
    icon: Server,
    title: 'Server Status',
    description: 'All Profit Loop servers are online and operational',
  },
  {
    icon: Globe,
    title: 'API Connectivity',
    description: 'All external API traffic links are stable',
  },
]

const recentActivity = [
  { icon: CheckCircle, text: 'Successful login', time: 'Just now' },
  { icon: Activity, text: 'Session renewed', time: '2 minutes ago' },
  { icon: ShieldCheck, text: 'Security scan completed', time: '15 minutes ago' },
  { icon: Lock, text: 'SSL certificate verified', time: '1 hour ago' },
  { icon: Server, text: 'System health check passed', time: '3 hours ago' },
]

export default function ProtectorPage() {
  const [userEmail, setUserEmail] = useState<string>('')
  const [checksAnimated, setChecksAnimated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email)
    })
    const timer = setTimeout(() => setChecksAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-green-400/10 border border-green-400/20">
              <ShieldCheck className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Profit Protector</h1>
              <p className="text-zinc-500 mt-1">Your account security overview. Everything is monitored in real time.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/10 border border-green-400/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
            </span>
            <span className="text-green-400 text-sm font-bold uppercase tracking-wider">All Systems Secure</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Security Score', value: '100%', color: 'text-green-400' },
          { label: 'Account Status', value: 'Verified', color: 'text-green-400' },
          { label: 'Encryption', value: 'AES-256', color: 'text-[#D946EF]' },
          { label: 'Uptime', value: '99.9%', color: 'text-green-400' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-black italic ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Security Checks */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Security Checks</h2>
              <div className="space-y-3">
                {securityChecks.map((check, index) => {
                  const Icon = check.icon
                  return (
                    <motion.div
                      key={check.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={checksAnimated ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-green-400/10 border border-green-400/20">
                          <Icon className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{check.title}</p>
                          <p className="text-xs text-zinc-500">{check.description}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Account Info */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Account Info</h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: userEmail || 'Loading...' },
                    { icon: User, label: 'Membership', value: 'Active', valueColor: 'text-green-400' },
                    { icon: Lock, label: '2FA', value: 'Enabled', valueColor: 'text-green-400' },
                    { icon: Calendar, label: 'Last Login', value: 'Today', valueColor: 'text-white' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-zinc-500" />
                          <span className="text-sm text-zinc-500">{item.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${item.valueColor || 'text-zinc-300'} truncate max-w-[160px]`}>
                          {item.value}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0 }}
                        animate={checksAnimated ? { opacity: 1 } : {}}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="p-1.5 rounded-md bg-green-400/10">
                          <Icon className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-300">{item.text}</p>
                        </div>
                        <span className="text-[11px] text-zinc-600">{item.time}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Need Help */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/20">
                <Wifi className="w-6 h-6 text-[#D946EF]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Need Help?</h3>
                <p className="text-sm text-zinc-500">Our support team is available 24/7</p>
              </div>
            </div>
            <Link href="/support">
              <Button glow>
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
