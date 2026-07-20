import { ReactNode } from 'react'
import { Sidebar } from '@/components/ui/sidebar'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { SocialProofNotifications } from '@/components/ui/social-proof'
import { AccountVerifiedModal } from '@/components/dashboard/AccountVerifiedModal'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Sidebar />
      <SocialProofNotifications />
      <main className="lg:pl-[280px]">
        <div className="min-h-screen bg-black p-4 pt-20 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>
      <AccountVerifiedModal />
    </div>
  )
}
