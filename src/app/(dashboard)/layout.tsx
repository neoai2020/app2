import { ReactNode } from 'react'
import { Sidebar } from '@/components/ui/sidebar'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BottomNav } from '@/components/ui/bottom-nav'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <AnimatedBackground />
      <Sidebar />
      <main
        className="transition-[padding] duration-300 lg:pl-[var(--sidebar-w)]"
      >
        <div className="min-h-dvh bg-transparent p-4 pb-24 pt-[calc(env(safe-area-inset-top)+3.5rem)] lg:p-8 lg:pb-8 lg:pt-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
