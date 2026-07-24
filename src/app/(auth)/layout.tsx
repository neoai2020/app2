import { ReactNode } from 'react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { AuthSupportButton } from '@/components/ui/auth-support-button'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
      <AuthSupportButton />
    </div>
  )
}
