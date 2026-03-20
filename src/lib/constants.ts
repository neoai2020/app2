// Usage Limits
export const DAILY_LEAD_LIMIT = parseInt(process.env.NEXT_PUBLIC_DAILY_LEAD_LIMIT || '25', 10)
export const DAILY_EMAIL_LIMIT = parseInt(process.env.NEXT_PUBLIC_DAILY_EMAIL_LIMIT || '10', 10)

// Industry Options
export const INDUSTRIES = [
  'Restaurants & Cafes',
  'Retail Stores',
  'Professional Services',
  'Health & Wellness',
  'Home Services',
  'Automotive',
  'Real Estate',
  'Legal Services',
  'Financial Services',
  'Education & Training',
  'Technology Services',
  'Marketing & Advertising',
  'Construction',
  'Manufacturing',
  'Other'
] as const

// Email Tones
export const EMAIL_TONES = [
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'direct', label: 'Direct', description: 'Clear and to the point' }
] as const

// Lead Status
export const LEAD_STATUS = {
  allocated: { label: 'Allocated', color: 'bg-blue-100 text-blue-800' },
  used: { label: 'Used', color: 'bg-green-100 text-green-800' },
  invalid: { label: 'Invalid', color: 'bg-red-100 text-red-800' }
} as const

// Activity Actions
export const ACTIVITY_ACTIONS = {
  lead_allocated: { label: 'Lead Acquired', icon: 'UserPlus' },
  email_generated: { label: 'Email Generated', icon: 'Mail' },
  email_saved: { label: 'Email Saved', icon: 'Save' },
  offer_created: { label: 'Offer Created', icon: 'Plus' },
  offer_updated: { label: 'Offer Updated', icon: 'Edit' }
} as const
