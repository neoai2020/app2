/**
 * Profit Loop onboarding — edit copy and URLs here only.
 * Product terms mirror the live sidebar (see sidebar.tsx).
 */

export const ONBOARDING_PRODUCT_NAME = 'Profit Loop AI'

/** Final partner CTA after qualification (empty string = dashboard only on click) */
export const ONBOARDING_BETA_QUALIFICATION_CTA_URL =
  'https://scribble.a.explodely.com/?aff=scribble&pid=neomedia&tid=backend'

export const onboardingContent = {
  preparing: {
    title: 'Setting up your workspace',
    rows: [
      {
        label: 'Loading your Lead Magnet & daily lead allocation',
        description: 'Preparing verified B2B leads you can email today.'
      },
      {
        label: 'Connecting your Email Blast & Saved Emails workflow',
        description: 'Syncing AI email generation and your personal swipe file.'
      },
      {
        label: 'Unlocking Training, Support & Premium Features',
        description: 'Accelerator, Recurring Streams, Social Payouts, and Protector — when your plan includes them.'
      }
    ],
    tip: 'Start with Lead Magnet first — it walks you from niche pick to fresh leads you can mail in minutes.',
    continueCta: 'Continue'
  },
  congratulations: {
    badge: '🎉 CONGRATULATIONS!',
    headline: "You've Been Randomly Selected",
    continueCta: 'Continue'
  },
  beta: {
    headline:
      'Out of thousands of new members today, your account was flagged for our private Beta Tester program.',
    subcopy: `This is a separate, optional opportunity — not part of ${ONBOARDING_PRODUCT_NAME}. But we highly recommend checking it out.`,
    infoCard:
      "Don't panic! This is a good thing. You've been chosen to test a brand-new system — and testers get paid.",
    payLabel: 'Beta Tester Pay:',
    payAmount: '$500/day',
    cta: 'See If You Qualify >'
  },
  qualification: {
    badge: '✅ QUALIFICATION CHECK',
    headline: 'Do You Meet These Requirements?',
    requirements: ['A phone or a computer', 'Speaks English', 'No tech skills required'],
    footer: 'If you checked all three — you qualify!',
    primaryCta: '🎯 Claim My Beta Tester Spot >',
    noThanksCta: 'No thanks, skip this optional offer →',
    finePrint: `This is an optional partner offer, separate from your ${ONBOARDING_PRODUCT_NAME} membership. Spots are limited.`
  }
} as const
