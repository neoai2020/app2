/**
 * Profit Loop onboarding — edit copy and URLs here only.
 * Product terms mirror the live sidebar (see sidebar.tsx).
 */

export const ONBOARDING_PRODUCT_NAME = 'Profit Loop AI'

/** Final partner CTA after qualification (empty string = dashboard only on click) */
export const ONBOARDING_BETA_QUALIFICATION_CTA_URL =
  'https://jvz4.com/c/3542829/436309/'

/**
 * Upgrades walkthrough video — place file at this path under /public
 * (default: public/onboarding/upgrades-walkthrough.mp4) or set a remote URL.
 */
export const ONBOARDING_UPGRADES_VIDEO_SRC = '/onboarding/upgrades-walkthrough.mp4'

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
  upgrades: {
    title: 'Did You Purchase Any Upgrades?',
    intro: `If you bought any extras, here is where to find them in ${ONBOARDING_PRODUCT_NAME}:`,
    stepsNumbered: [
      `Open ${ONBOARDING_PRODUCT_NAME} (you are signed in now).`,
      'Look at the left sidebar — scroll through Navigation and note Training and Support.',
      'Under Premium Features, you will see Accelerator, Recurring Streams, Social Payouts, and Protector — those are your premium tools and upgrades when your account has access.'
    ],
    videoCaption: 'Short walkthrough: where upgrades and premium tools live in the sidebar.',
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
    primaryCta: '🚀 Claim My Beta Tester Spot >',
    finePrint: `This is an optional partner offer, separate from your ${ONBOARDING_PRODUCT_NAME} membership. Spots are limited.`
  },
  loading: {
    percentLabel: '66%',
    subline: 'Provisioning your Profit Loop workspace…'
  },
  activation: {
    headline: "Let's Activate Your System",
    subheadline:
      'First, tell us your name so we can personalize your earning system.',
    namePlaceholder: 'Enter your first name',
    infoTitle: 'What happens next:',
    infoSteps: [
      "We'll locate the fastest datacenter near New York",
      'Your personal supercomputer node gets activated',
      'Earning zones light up across the map',
      'You unlock global coverage with one tap'
    ],
    note: "You're getting set up 🔥 — Your links will work overnight while you relax",
    cta: 'Activate My System >'
  }
} as const
