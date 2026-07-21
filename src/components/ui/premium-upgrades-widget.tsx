'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PREMIUM_FEATURES } from '@/lib/premium-features'

export function PremiumUpgradesWidget() {
  const pathname = usePathname()

  return (
    <Card className="premium-nav-section overflow-hidden border-[#D946EF]/25">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-black italic uppercase tracking-widest text-[#D946EF]">
          <Sparkles className="h-4 w-4 animate-pulse-glow" />
          Premium Upgrades
        </CardTitle>
        <p className="text-sm leading-relaxed text-[var(--muted-strong)]">
          Unlock the tools that drive the biggest results.
        </p>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {PREMIUM_FEATURES.map((feature, index) => {
          const isActive = pathname === feature.href
          const Icon = feature.icon

          return (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                href={feature.href}
                className={`premium-sidebar-item group flex items-start gap-3 rounded-xl px-3.5 py-3 transition-all duration-300 ${
                  isActive ? 'is-active' : ''
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'border-[#D946EF]/50 bg-[#D946EF]/25 text-white'
                      : 'border-[#D946EF]/20 bg-[#D946EF]/10 text-[#D946EF] group-hover:border-[#D946EF]/40 group-hover:bg-[#D946EF]/15'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold tracking-wide ${
                        isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                      }`}
                    >
                      {feature.label}
                    </span>
                    <ArrowRight
                      size={14}
                      className={`shrink-0 transition-transform duration-300 ${
                        isActive
                          ? 'text-[#D946EF] translate-x-0'
                          : 'text-zinc-500 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}
