import {
  TrendingUp,
  MousePointerClick,
  ClipboardCopy
} from 'lucide-react'

/** Shared exclusive-offer links used by sidebar + mobile More sheet */
export const EXCLUSIVE_OFFERS = [
  {
    key: 'fast-cash',
    externalUrl: 'https://the7figuresociety.com/earn-1k-2k-per-day',
    line1: 'Fast Cash Training',
    line2: 'Claim Now',
    icon: TrendingUp
  },
  {
    key: 'p-55',
    externalUrl: 'https://scribble.a.explodely.com/?aff=neomedia&pid=47110198&tid=backend',
    line1: 'Create your P-55 account',
    line2: 'Create Now',
    icon: MousePointerClick
  },
  {
    key: 'copy-paste',
    externalUrl: 'https://jvz5.com/c/3542829/433243/',
    line1: 'Get Paid To Copy & Paste',
    line2: 'Claim Now',
    icon: ClipboardCopy
  }
] as const
