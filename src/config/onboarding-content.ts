/**
 * Profit Loop onboarding — edit copy here only.
 * Plain language, no product/page names, no ads.
 */

export const ONBOARDING_PRODUCT_NAME = 'Profit Loop'

export const onboardingContent = {
  productTagline: 'Find customers. Write emails. Get replies.',
  dashboardRoute: '/dashboard',

  activation: {
    headline: "Let's Activate Your System",
    subheadline: 'First, tell us your name so we can personalize things for you.',
    inputPlaceholder: 'Enter your first name',
    infoTitle: 'What happens next:',
    infoSteps: [
      "We'll save your name so everything feels personal",
      'Your home screen shows you exactly what to do first',
      'Finding people to email takes just a few minutes',
      'Help is always one click away if you get stuck'
    ],
    note: "You're almost there 🔥 — everything stays saved so you can pick up anytime",
    ctaLabel: 'Activate My System >',
    sidebarStatus: [
      { label: 'Your account', status: 'Ready' },
      { label: 'Daily emails', status: 'Set up' },
      { label: 'Help & tips', status: 'Available' }
    ]
  }
} as const
