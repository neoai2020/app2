'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Mail,
  Gift,
  Archive,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Hexagon,
  TrendingUp,
  Diamond,
  Sparkles,
  Zap
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/offers', label: 'Offer Library', icon: Gift },
  { href: '/leads', label: 'Lead Allocation', icon: Users },
  { href: '/email-builder', label: 'Email Builder', icon: Mail },
  { href: '/saved-emails', label: 'Saved Emails', icon: Archive },
  { href: '/scale', label: 'Scale to $1,000+/Day', icon: TrendingUp },
  { href: '/support', label: 'Support', icon: HelpCircle }
]

const premiumFeatures = [
  { href: '/dfy', label: 'DFY', icon: Diamond },
  { href: '/instant-income', label: 'Instant Income', icon: Sparkles },
  { href: '/autopilot', label: 'Autopilot', icon: Zap }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Hexagon className="w-10 h-10 text-[#D946EF]" strokeWidth={1.5} />
          </motion.div>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">
              INBOX VAULT
            </h1>
            <p className="text-[10px] text-[#D946EF]/50 uppercase tracking-[0.2em] font-bold">
              Control Hub v2.0
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
          {navItems.map((item, index) => {
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
                  onClick={() => setMobileOpen(false)}
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
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D946EF]"
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
                transition={{ delay: (navItems.length + index) * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
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
      {/* Mobile menu button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 glass-card"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} className="text-[#D946EF]" /> : <Menu size={20} className="text-[#D946EF]" />}
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : -280 }}
        className={`
          fixed top-0 left-0 h-full w-[280px] z-40
          cyber-sidebar
          lg:translate-x-0
        `}
        style={{ transform: 'none' }}
      >
        <div className="hidden lg:block h-full">
          {sidebarContent}
        </div>
        <motion.div 
          className="lg:hidden h-full"
          initial={{ x: -280 }}
          animate={{ x: mobileOpen ? 0 : -280 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          {sidebarContent}
        </motion.div>
      </motion.aside>

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-[280px] z-40 cyber-sidebar">
        {sidebarContent}
      </aside>
    </>
  )
}
