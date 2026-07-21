'use client'

import {
  LayoutDashboard,
  Users,
  Mail,
  GraduationCap,
  Menu,
  Sparkles,
  Gift,
  Archive,
  HelpCircle,
  LogOut,
  ExternalLink,
  X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { EXCLUSIVE_OFFERS } from '@/components/ui/exclusive-offer-widgets'
import { PREMIUM_FEATURES } from '@/lib/premium-features'

const tabs = [
  { title: 'Home', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Customers', url: '/leads', icon: Users },
  { title: 'Emails', url: '/email-builder', icon: Mail },
  { title: 'Training', url: '/training', icon: GraduationCap }
]

const mainMore = [
  { title: 'Offer Library', url: '/offers', icon: Gift },
  { title: 'Saved Emails', url: '/saved-emails', icon: Archive }
]

const premiumItems = PREMIUM_FEATURES.map(({ href, label, icon }) => ({
  title: label,
  url: href,
  icon
}))

/** Fixed bottom tab bar for mobile. Hidden on desktop (lg+) where the sidebar lives. */
export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const moreActive = !tabs.some((t) => t.url === pathname)

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D946EF]/20 bg-[#0c0a0e]/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.url
            const Icon = tab.icon
            return (
              <Link
                key={tab.url}
                href={tab.url}
                className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-[#D946EF]' : 'text-zinc-500 active:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r from-[#D946EF] to-[#8B5CF6]" />
                )}
                <Icon className="h-6 w-6" />
                <span className="text-[11px] font-semibold leading-none">{tab.title}</span>
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
              moreActive ? 'text-[#D946EF]' : 'text-zinc-500 active:text-white'
            }`}
          >
            {moreActive && (
              <span className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r from-[#D946EF] to-[#8B5CF6]" />
            )}
            <Menu className="h-6 w-6" />
            <span className="text-[11px] font-semibold leading-none">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[70] max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-[#D946EF]/20 bg-[#0c0a0e] lg:hidden"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
            >
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/15" />
              <div className="flex items-center justify-between px-4 pt-3">
                <p className="text-sm font-black uppercase tracking-widest text-white">More</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setMoreOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-zinc-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-4">
                <div>
                  <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-widest text-[#D946EF]/70">
                    Main
                  </p>
                  <div className="space-y-1.5">
                    {mainMore.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.url
                      return (
                        <Link
                          key={item.url}
                          href={item.url}
                          onClick={() => setMoreOpen(false)}
                          className={`flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3.5 text-base font-semibold transition-colors ${
                            isActive
                              ? 'border-[#D946EF]/40 bg-[#D946EF]/15 text-white'
                              : 'border-transparent text-zinc-300 active:bg-[#D946EF]/10'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="premium-nav-section rounded-2xl p-2">
                  <p className="mb-2 flex items-center gap-1.5 px-1 text-[12px] font-semibold uppercase tracking-widest text-[#D946EF]">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse-glow" />
                    Premium Upgrades
                  </p>
                  <div className="space-y-1.5">
                    {premiumItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.url
                      return (
                        <Link
                          key={item.url}
                          href={item.url}
                          onClick={() => setMoreOpen(false)}
                          className={`premium-sidebar-item flex min-h-[52px] items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                            isActive ? 'is-active' : ''
                          }`}
                        >
                          <Icon className="h-5 w-5 text-[#D946EF]" />
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-widest text-[#FFC107]">
                    Exclusive offers
                  </p>
                  <div className="space-y-1.5">
                    {EXCLUSIVE_OFFERS.map((item) => {
                      const Icon = item.icon
                      return (
                        <a
                          key={item.key}
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMoreOpen(false)}
                          className="flex min-h-[52px] items-center gap-3 rounded-xl border border-transparent px-4 py-3.5 text-base font-semibold text-zinc-300 active:bg-white/5"
                        >
                          <Icon className="h-5 w-5 text-[#FFC107]" />
                          <span className="flex-1">
                            {item.line1}, {item.line2}
                          </span>
                          <ExternalLink className="h-4 w-4 text-zinc-600" />
                        </a>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-white/10 pt-4">
                  <Link
                    href="/support"
                    onClick={() => setMoreOpen(false)}
                    className="flex min-h-[52px] items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold text-zinc-300 active:bg-white/5"
                  >
                    <HelpCircle className="h-5 w-5" />
                    Support
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMoreOpen(false)
                      void handleSignOut()
                    }}
                    className="flex min-h-[52px] w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold text-red-400 active:bg-red-400/10"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
