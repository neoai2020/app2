import { Diamond, Sparkles, Zap, ShieldCheck, type LucideIcon } from 'lucide-react'

export type PremiumFeature = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    href: '/dfy',
    label: 'Accelerator',
    description: 'Done-for-you assets to launch and scale faster.',
    icon: Diamond
  },
  {
    href: '/instant-income',
    label: 'Recurring Streams',
    description: 'Build posts and links that earn on repeat.',
    icon: Sparkles
  },
  {
    href: '/autopilot',
    label: 'Social Payouts',
    description: 'Find communities and copy-paste your way to payouts.',
    icon: Zap
  },
  {
    href: '/protector',
    label: 'Protector',
    description: 'Shield your links, accounts, and commissions.',
    icon: ShieldCheck
  }
]
