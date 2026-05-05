import type { SupabaseClient } from '@supabase/supabase-js'

export type OnboardingGateResult =
  | { ok: true; isComplete: boolean }
  | { ok: false; message: string }

/** Auth metadata key set on signup; set true when activation finishes. */
export const ONBOARDING_META_KEY = 'onboarding_completed' as const

export type UserMetadataInput = Record<string, unknown> | null | undefined

function readOnboardingMetaFlag(authMeta: UserMetadataInput): boolean | undefined {
  const raw = authMeta?.[ONBOARDING_META_KEY]
  return typeof raw === 'boolean' ? raw : undefined
}

/**
 * If JWT says onboarding is done, trust it first (fast path after activation).
 * Otherwise read `users.onboarding_completed_at`.
 * If that column is missing (legacy DB), fall back to `id` + `created_at`:
 * - `onboarding_completed === false` in auth metadata → always treat as NOT done (new signups).
 * - Otherwise, accounts older than `legacySkipMinAccountAgeMs` with a profile row skip onboarding;
 *   newer accounts still see onboarding until migration is applied.
 */
export async function resolveOnboardingGate(
  supabase: SupabaseClient,
  userId: string,
  authMeta?: UserMetadataInput,
  legacySkipMinAccountAgeMs: number = 1000 * 60 * 60 * 24 * 14
): Promise<OnboardingGateResult> {
  const metaFlag = readOnboardingMetaFlag(authMeta)
  if (metaFlag === true) {
    return { ok: true, isComplete: true }
  }

  const primary = await supabase
    .from('users')
    .select('onboarding_completed_at')
    .eq('id', userId)
    .maybeSingle()

  if (!primary.error && primary.data != null) {
    const at = primary.data.onboarding_completed_at
    return { ok: true, isComplete: at != null }
  }

  if (!primary.error && primary.data == null) {
    return { ok: true, isComplete: false }
  }

  const fallback = await supabase
    .from('users')
    .select('id, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (!fallback.error && fallback.data) {
    if (metaFlag === false) {
      return { ok: true, isComplete: false }
    }
    const created = new Date(fallback.data.created_at).getTime()
    const ageMs = Date.now() - created
    if (ageMs < legacySkipMinAccountAgeMs) {
      return { ok: true, isComplete: false }
    }
    return { ok: true, isComplete: true }
  }

  if (!fallback.error && fallback.data == null) {
    return { ok: true, isComplete: false }
  }

  const msg =
    [primary.error?.message, fallback.error?.message].filter(Boolean).join(' — ') ||
    'Could not load your profile.'
  return { ok: false, message: msg }
}
