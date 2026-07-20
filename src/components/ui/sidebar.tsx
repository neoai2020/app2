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
  ClipboardCopy,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import { useEffect, useState } from 'react'
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

const premiumFeatures = [
  { href: '/dfy', label: 'Accelerator', icon: Diamond },
  { href: '/instant-income', label: 'Recurring Streams', icon: Sparkles },
  { href: '/autopilot', label: 'Social Payouts', icon: Zap },
  { href: '/protector', label: 'Protector', icon: ShieldCheck }
]

const COLLAPSE_KEY = 'pl_sidebar_collapsed'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY) === '1'
    setCollapsed(saved)
    document.documentElement.dataset.sidebar = saved ? 'collapsed' : 'expanded'
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      document.documentElement.dataset.sidebar = next ? 'collapsed' : 'expanded'
      return next
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navLinkClass = (isActive: boolean) =>
    `cyber-sidebar-item flex items-center gap-3 rounded-lg py-3 text-sm font-medium transition-all duration-300 ${
      collapsed ? 'justify-center px-0' : 'px-4'
    } ${isActive ? 'active bg-[#D946EF]/5 text-[#D946EF]' : 'text-zinc-400 hover:text-[#D946EF]/80'}`

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo + collapse */}
      <div className={`border-b border-white/5 ${collapsed ? 'px-3 py-5' : 'p-6'}`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'gap-3'}`}>
          <Image src="/logo.png" alt="Profit Loop" width={40} height={40} className="rounded-lg" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">
                PROFIT LOOP
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D946EF]/50">
                AI
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-[#D946EF]"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'px-2 py-4' : 'p-4'}`}>
        {!collapsed && (
          <p className="mb-2 px-4 text-[10px] uppercase tracking-widest text-zinc-500">
            Navigation
          </p>
        )}
        <ul className="space-y-1">
          {mainNavItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={navLinkClass(isActive)}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {!collapsed && <span className="tracking-wide">{item.label}</span>}
                  {!collapsed && isActive && (
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

        {/* Exclusive offers */}
        <div className={`mt-4 mb-2 ${collapsed ? '' : 'px-1'}`}>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#FFC107]">
              Exclusive offers
            </p>
          )}
          <ul
            className={`space-y-1.5 rounded-xl border border-[#FFC107]/25 bg-[#FFC107]/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ${
              collapsed ? 'p-1' : 'p-1.5'
            }`}
          >
            {trainingOfferNav.map((item) => {
              const Icon = item.icon
              const label = `${item.line1} ${item.line2}`
              const isActive = 'href' in item && pathname === item.href
              const offerClassName = `cyber-sidebar-item flex cursor-pointer items-start gap-3 rounded-lg border text-left text-zinc-100 transition-all duration-300 ${
                collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'active border-[#D946EF]/45 bg-[#D946EF]/20 text-white shadow-[0_0_16px_rgba(217,70,239,0.25)]'
                  : 'border-transparent hover:border-[#FFC107]/40 hover:bg-[#FFC107]/15'
              }`
              const offerContent = (
                <>
                  <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#FFC107]" />
                  {!collapsed && (
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[11px] font-semibold leading-snug tracking-wide text-white/95">
                        {item.line1}
                      </span>
                      <span className="text-[11px] font-bold leading-snug tracking-wide text-[#FFC107]">
                        {item.line2}
                      </span>
                    </span>
                  )}
                </>
              )
              return (
                <li key={item.key}>
                  {'href' in item ? (
                    <Link href={item.href} aria-label={label} title={collapsed ? label : undefined} className={offerClassName}>
                      {offerContent}
                    </Link>
                  ) : (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in new tab)`}
                      title={collapsed ? label : undefined}
                      className={offerClassName}
                    >
                      {offerContent}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <ul className="mt-3 space-y-1">
          {lowerNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={navLinkClass(isActive)}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {!collapsed && <span className="tracking-wide">{item.label}</span>}
                  {!collapsed && isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#D946EF]"
                      style={{ boxShadow: '0 0 10px rgba(217, 70, 239, 0.5)' }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Premium Features */}
        {!collapsed && (
          <p className="mt-8 mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-[#D946EF]">
            Premium Features
          </p>
        )}
        <ul className={`space-y-1 ${collapsed ? 'mt-6 border-t border-white/5 pt-4' : ''}`}>
          {premiumFeatures.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`cyber-sidebar-item flex items-center gap-3 rounded-lg py-3 text-sm font-medium transition-all duration-300 ${
                    collapsed ? 'justify-center px-0' : 'px-4'
                  } ${
                    isActive
                      ? 'active bg-[#D946EF] text-black shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                      : 'text-zinc-400 hover:bg-[#D946EF]/5 hover:text-[#D946EF]/80'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} className={isActive ? 'text-black' : ''} />
                  {!collapsed && <span className="tracking-wide">{item.label}</span>}
                  {!collapsed && isActive && (
                    <motion.div
                      layoutId="activePremiumIndicator"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-black"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Status indicator */}
      {!collapsed && (
        <div className="mx-4 mb-4 rounded-lg border border-white/5 bg-[#D946EF]/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-xs uppercase tracking-wider text-zinc-400">System Online</span>
          </div>
        </div>
      )}

      {/* Sign Out */}
      <div className={`border-t border-[#D946EF]/10 ${collapsed ? 'p-2' : 'p-4'}`}>
        <button
          onClick={handleSignOut}
          title={collapsed ? 'Disconnect' : undefined}
          className={`flex w-full items-center gap-3 rounded-lg py-3 text-sm font-medium text-zinc-500 transition-all duration-300 hover:bg-red-400/5 hover:text-red-400 ${
            collapsed ? 'justify-center px-0' : 'px-4'
          }`}
        >
          <LogOut size={18} strokeWidth={1.5} />
          {!collapsed && <span className="tracking-wide">Disconnect</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Slim mobile top bar — logo + title (primary mobile nav is BottomNav) */}
      <div
        className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center gap-3 border-b border-white/5 bg-[#14111a]/90 px-4 backdrop-blur lg:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Image src="/logo.png" alt="Profit Loop" width={32} height={32} className="rounded-lg" />
        <span className="text-sm font-black italic uppercase tracking-tighter text-white">
          Profit Loop
        </span>
      </div>

      {/* Desktop sidebar */}
      <aside
        className="cyber-sidebar fixed top-0 left-0 z-40 hidden h-full transition-[width] duration-300 lg:block"
        style={{ width: 'var(--sidebar-w)' }}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
