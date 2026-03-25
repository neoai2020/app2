'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  Mail,
  Users,
  Gift,
  TrendingUp,
  Shield,
  CheckCircle2,
  Sparkles,
  Star,
  Brain,
  Facebook,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Lead Magnet',
    description: 'Pull real business leads by industry and location. Up to 25 fresh leads per day, validated and ready for outreach.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: Gift,
    title: 'Offer Library',
    description: 'Create AI-powered offer templates for affiliates, services, or partnerships. Generate up to 5 templates daily.',
    color: 'text-[#D946EF]',
    bg: 'bg-[#D946EF]/10',
    border: 'border-[#D946EF]/20',
  },
  {
    icon: Mail,
    title: 'Email Blast',
    description: 'AI generates personalized subject lines, email bodies, and follow-ups tailored to each lead. 10 emails per day.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  {
    icon: Facebook,
    title: 'Instant Income',
    description: 'Ready-to-post Facebook messages with your affiliate link. Copy, paste into groups, and start earning immediately.',
    color: 'text-[#1877F2]',
    bg: 'bg-[#1877F2]/10',
    border: 'border-[#1877F2]/20',
  },
  {
    icon: Globe,
    title: 'Autopilot Traffic',
    description: '100+ free traffic sources with step-by-step instructions. Submit once, get visitors forever — no daily work needed.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  {
    icon: Brain,
    title: 'AI-Powered Everything',
    description: 'From offer creation to email writing, our AI handles the heavy lifting so you can focus on scaling your income.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
  },
]

const stats = [
  { value: '2.8M+', label: 'Leads Generated' },
  { value: '500K+', label: 'Emails Created' },
  { value: '10K+', label: 'Active Members' },
  { value: '$4.2M+', label: 'Revenue Generated' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Digital Marketer', text: 'Profit Loop completely changed my outreach game. I went from struggling to find leads to generating $3K/month in just 6 weeks.', stars: 5 },
  { name: 'James R.', role: 'Affiliate Marketer', text: 'The Instant Income feature alone paid for itself in the first week. Copy-paste Facebook posts that actually convert.', stars: 5 },
  { name: 'Maria L.', role: 'Agency Owner', text: 'I use the Email Blast feature every day. The AI writes better cold emails than my entire team used to. Absolute game-changer.', stars: 5 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Profit Loop" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-black italic uppercase tracking-tighter">Profit Loop</span>
            <span className="text-xs font-bold text-[#D946EF]/60 uppercase tracking-widest">AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold text-black bg-[#D946EF] hover:bg-[#c026d3] px-5 py-2.5 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D946EF]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D946EF]/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D946EF]/30 bg-[#D946EF]/5 mb-8">
              <Sparkles className="w-4 h-4 text-[#D946EF]" />
              <span className="text-sm font-medium text-[#D946EF]">AI-Powered Outreach Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">
              Turn Cold Leads Into
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] via-indigo-400 to-[#D946EF]">
                Profit On Autopilot
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI finds your leads, writes your emails, and builds your offers.
              You just hit send and watch the income flow in.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group flex items-center gap-2 bg-[#D946EF] hover:bg-[#c026d3] text-black font-black italic uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(217,70,239,0.3)]"
              >
                Start Free Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-sm px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <Shield className="w-4 h-4" />
                Sign In to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-[#111111]/50 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-black italic text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">
              Everything You Need to <span className="text-[#D946EF]">Profit</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              A complete AI-powered system for lead generation, email outreach, and automated traffic — all in one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-white/5 bg-[#111111] p-6 hover:border-[#D946EF]/20 transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">
              Three Steps to <span className="text-[#D946EF]">Income</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Create Your Offer', text: 'Use the Offer Library to build AI-generated templates tailored to your niche. Affiliate, service, or partnership — the AI crafts it for you.' },
              { step: 2, title: 'Pull Leads & Generate Emails', text: 'Lead Magnet finds real business leads. Email Blast writes personalized outreach emails with AI. Copy, paste, send.' },
              { step: 3, title: 'Scale & Automate', text: 'Use Instant Income for Facebook group posts, and Autopilot to submit your link to 100+ free traffic sources. Passive income, unlocked.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#D946EF] flex items-center justify-center text-black font-black text-xl mx-auto mb-5 shadow-[0_0_25px_rgba(217,70,239,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">
              What Our <span className="text-[#D946EF]">Members</span> Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/5 bg-[#111111] p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-600">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap className="w-12 h-12 text-[#D946EF] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">
              Ready to Start Your <span className="text-[#D946EF]">Profit Loop</span>?
            </h2>
            <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
              Join thousands of members already using AI to generate leads, write emails, and build income streams on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group flex items-center gap-2 bg-[#D946EF] hover:bg-[#c026d3] text-black font-black italic uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(217,70,239,0.3)]"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white font-bold text-sm px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                Already a Member? Sign In
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-zinc-600 text-xs">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> 30-day money-back guarantee</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Instant access</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Profit Loop" width={24} height={24} className="rounded" />
            <span className="text-sm font-bold text-zinc-500">Profit Loop AI</span>
          </div>
          <p className="text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} Profit Loop AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-zinc-600 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="text-xs text-zinc-600 hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
