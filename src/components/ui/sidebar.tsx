'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Mail,
  Gift,
  Archive,
  GraduationCap,
  HelpCircle,
  LogOut,
  TrendingUp,
  Diamond,
  Sparkles,
  Zap,
  ShieldCheck,
  MousePointerClick,
  ClipboardCopy
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/offers', label: 'Offer Library', icon: Gift },
  { href: '/leads', label: 'Find Customers', icon: Users },
  { href: '/email-builder', label: 'Write Emails', icon: Mail },
  { href: '/saved-emails', label: 'Saved Emails', icon: Archive }
]

type TrainingOfferNavItem = {
  key: string
  line1: string
  line2: string
  icon: typeof TrendingUp
} & ({ externalUrl: string } | { href: string })

const trainingOfferNav: TrainingOfferNavItem[] = [
  {
    key: 'fast-cash',
    externalUrl: 'https://the7figuresociety.com/earn-1k-2k-per-day',
    line1: 'Fast Cash Training,',
    line2: 'Claim Now',
    icon: TrendingUp
  },
  {
    key: 'p-55',
    externalUrl: 'https://scribble.a.explodely.com/?aff=neomedia&pid=47110198&tid=backend',
    line1: 'Create your P-55 account,',
    line2: 'Create Now',
    icon: MousePointerClick
  },
  {
    key: 'copy-paste',
    externalUrl: 'https://jvz5.com/c/3542829/433243/',
    line1: 'Get Paid To Copy & Paste,',
    line2: 'Claim Now',
    icon: ClipboardCopy
  }
]

const lowerNavItems = [
  { href: '/training', label: 'Training', icon: GraduationCap },
  { href: '/support', label: 'Support', icon: HelpCircle }
]

const navCountBeforePremium =
  mainNavItems.length + trainingOfferNav.length + lowerNavItems.length

const premiumFeatures = [
  { href: '/dfy', label: 'Accelerator', icon: Diamond },
  { href: '/instant-income', label: 'Recurring Streams', icon: Sparkles },
  { href: '/autopilot', label: 'Social Payouts', icon: Zap },
  { href: '/protector', label: 'Protector', icon: ShieldCheck }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Profit Loop" width={40} height={40} className="rounded-lg" />
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">
              PROFIT LOOP
            </h1>
            <p className="text-[10px] text-[#D946EF]/50 uppercase tracking-[0.2em] font-bold">
              AI
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest px-4 mb-2">
            Navigation
          </p>
        </div>
        <ul className="space-y-1">
          {mainNavItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}

                  className={`
                    cyber-sidebar-item
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-300
                    ${isActive
                      ? 'active bg-[#D946EF]/5 text-[#D946EF]'
                      : 'text-zinc-400 hover:text-[#D946EF]/80'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 shrink-0 rounded-full bg-[#D946EF]"
                      style={{ boxShadow: '0 0 10px rgba(217, 70, 239, 0.5)' }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>

        <div className="mt-4 mb-2 px-1">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2 text-[#00B894]">
            Exclusive offers
          </p>
          <ul className="space-y-1.5 rounded-xl border border-[#00B894]/35 bg-[#00B894]/[0.1] p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_28px_rgba(0,184,148,0.12)]">
            {trainingOfferNav.map((item, index) => {
              const Icon = item.icon
              const baseIndex = mainNavItems.length + index
              const label = `${item.line1} ${item.line2}`
              const isActive = 'href' in item && pathname === item.href
              const offerClassName = `cyber-sidebar-item flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-zinc-100 transition-all duration-300 ${
                isActive
                  ? 'active border-[#D946EF]/45 bg-[#D946EF]/20 text-white shadow-[0_0_16px_rgba(217,70,239,0.25)]'
                  : 'border-transparent hover:border-[#00B894]/40 hover:bg-[#00B894]/25'
              }`
              const offerContent = (
                <>
                  <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#FFC107]" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[11px] font-semibold leading-snug tracking-wide text-white/95">
                      {item.line1}
                    </span>
                    <span className="text-[11px] font-bold leading-snug tracking-wide text-[#FFC107]">
                      {item.line2}
                    </span>
                  </span>
                </>
              )
              return (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: baseIndex * 0.05 }}
                >
                  {'href' in item ? (
                    <Link
                      href={item.href}

                      aria-label={label}
                      className={offerClassName}
                    >
                      {offerContent}
                    </Link>
                  ) : (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"

                      aria-label={`${label} (opens in new tab)`}
                      className={offerClassName}
                    >
                      {offerContent}
                    </a>
                  )}
                </motion.li>
              )
            })}
          </ul>
        </div>

        <ul className="mt-3 space-y-1">
          {lowerNavItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const baseIndex = mainNavItems.length + trainingOfferNav.length + index
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: baseIndex * 0.05 }}
              >
                <Link
                  href={item.href}

                  className={`
                    cyber-sidebar-item
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-300
                    ${isActive
                      ? 'active bg-[#D946EF]/5 text-[#D946EF]'
                      : 'text-zinc-400 hover:text-[#D946EF]/80'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#D946EF]"
                      style={{ boxShadow: '0 0 10px rgba(217, 70, 239, 0.5)' }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>

        {/* Premium Features */}
        <div className="mt-8 mb-4">
          <p className="text-[10px] text-[#D946EF] font-bold uppercase tracking-widest px-4 mb-2">
            Premium Features
          </p>
        </div>
        <ul className="space-y-1">
          {premiumFeatures.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <motion.li 
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navCountBeforePremium + index) * 0.05 }}
              >
                <Link
                  href={item.href}

                  className={`
                    cyber-sidebar-item
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-300
                    ${isActive
                      ? 'active bg-[#D946EF] text-black shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                      : 'text-zinc-400 hover:text-[#D946EF]/80 hover:bg-[#D946EF]/5'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={1.5} className={isActive ? "text-black" : ""} />
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activePremiumIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-black"
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Status indicator */}
      <div className="px-4 py-3 mx-4 mb-4 rounded-lg bg-[#D946EF]/5 border border-white/5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs text-zinc-400 uppercase tracking-wider">System Online</span>
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-[#D946EF]/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/5 w-full transition-all duration-300"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="tracking-wide">Disconnect</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Slim mobile top bar — logo + title (hamburger replaced by BottomNav More) */}
      <div
        className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center gap-3 border-b border-white/5 bg-[#0c0a0e]/90 px-4 backdrop-blur lg:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Image src="/logo.png" alt="Profit Loop" width={32} height={32} className="rounded-lg" />
        <span className="text-sm font-black italic uppercase tracking-tighter text-white">
          Profit Loop
        </span>
      </div>

      {/* Desktop sidebar */}
      <aside className="cyber-sidebar fixed top-0 left-0 z-40 hidden h-full w-[280px] lg:block">
        {sidebarContent}
      </aside>
    </>
  )
}
