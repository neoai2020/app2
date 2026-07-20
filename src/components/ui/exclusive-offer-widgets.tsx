'use client'

import {
  TrendingUp,
  MousePointerClick,
  ClipboardCopy,
  ExternalLink
} from 'lucide-react'

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

/**
 * Compact exclusive-offer widgets for the right-side activity stack (desktop).
 */
export function ExclusiveOfferWidgets() {
  return (
    <div className="w-full max-w-[320px] space-y-2">
      <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-[#FFC107]">
        Quick Actions
      </p>
      {EXCLUSIVE_OFFERS.map((item) => {
        const Icon = item.icon
        return (
          <a
            key={item.key}
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 rounded-xl border border-[#FFC107]/25 bg-[rgba(24,24,27,0.96)] p-3 shadow-xl transition-all hover:border-[#FFC107]/50 hover:bg-[#FFC107]/10"
          >
            <div className="rounded-lg bg-[#FFC107]/15 p-2">
              <Icon size={14} className="text-[#FFC107]" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold leading-snug text-white/95">{item.line1}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-[#FFC107]">
                {item.line2}
                <ExternalLink size={10} className="opacity-70" />
              </p>
            </div>
          </a>
        )
      })}
    </div>
  )
}
