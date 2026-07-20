import Link from 'next/link'
import { ArrowRight, Gift, Mail, Users } from 'lucide-react'

const steps = [
  {
    number: 1,
    time: 'about 2 minutes',
    icon: Gift,
    title: 'Create an offer',
    description:
      'Save a reusable offer template in the Offer Library — your affiliate link or service pitch, ready to reuse.',
    cta: 'Open Offer Library',
    href: '/offers'
  },
  {
    number: 2,
    time: 'about 3 minutes',
    icon: Users,
    title: 'Find customers',
    description:
      'Pull real local businesses by industry and location. You get a fresh batch every day within your limit.',
    cta: 'Find Customers',
    href: '/leads'
  },
  {
    number: 3,
    time: 'about 2 minutes',
    icon: Mail,
    title: 'Write & send emails',
    description:
      'Generate a personalized email, copy it, and send from your own inbox. Profit Loop never sends for you.',
    cta: 'Write Emails',
    href: '/email-builder'
  }
]

export function HowItWorks() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Let&apos;s get started
        </h2>
        <p className="text-base text-[var(--muted-strong)] sm:text-lg">
          You only need to do 3 things. Each one takes just a few minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="glass-strong flex flex-col rounded-2xl border border-[#D946EF]/20 p-5 transition-all hover:border-[#D946EF]/40"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D946EF]/30 bg-[#D946EF]/15 text-lg font-black text-[#D946EF]">
                {step.number}
              </div>
              <span className="text-sm font-bold text-[var(--warning)]">{step.time}</span>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <step.icon className="h-6 w-6 text-[#D946EF]" />
              <h3 className="text-xl font-black text-white">{step.title}</h3>
            </div>

            <p className="mb-6 flex-1 text-base leading-relaxed text-[var(--muted-strong)]">
              {step.description}
            </p>

            <Link
              href={step.href}
              className="touch-cta flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-base font-black text-black shadow-lg shadow-[#D946EF]/20 transition-all hover:from-[#8B5CF6] hover:to-[#D946EF] hover:shadow-[#D946EF]/40"
            >
              {step.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl border border-white/10 p-5 sm:p-6">
        <p className="text-base leading-relaxed text-[var(--muted-strong)] lg:text-lg">
          That&apos;s it. Come back daily for more leads and emails — and if you ever get stuck, open{' '}
          <Link href="/support" className="font-bold text-[#D946EF] hover:underline">
            Support
          </Link>{' '}
          and a real person will help you.
        </p>
      </div>
    </div>
  )
}
