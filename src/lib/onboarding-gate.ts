import type { SupabaseClient } from '@supabase/supabase-js'

export type OnboardingGateResult =
  | { ok: true; isComplete: boolean }
  | { ok: false; message: string }

/**
 * Resolves whether the user should be treated as past onboarding.
 * - Normal: `onboarding_completed_at` is set on the `users` row.
 * - Legacy DB (migration not applied): selecting `onboarding_completed_at` fails;
 *   we fall back to `select('id')`. If that row exists, treat as complete so old
 *   accounts are not trapped on /onboarding.
 */
export async function resolveOnboardingGate(
  supabase: SupabaseClient,
  userId: string
): Promise<OnboardingGateResult> {
  const primary = await supabase
    .from('users')
    .select('onboarding_completed_at')
    .eq('id', userId)
    .maybeSingle()

  if (!primary.error && primary.data) {
    return { ok: true, isComplete: primary.data.onboarding_completed_at != null }
  }

  // Profile exists but no onboarding column yet is still `data` object after migration.
  // Zero rows: still need onboarding once the row exists (or will fail later if no row).
  if (!primary.error && primary.data === null) {
    return { ok: true, isComplete: false }
  }

  const fallback = await supabase.from('users').select('id').eq('id', userId).maybeSingle()

  if (!fallback.error && fallback.data) {
    return { ok: true, isComplete: true }
  }

  if (!fallback.error && fallback.data === null) {
    return { ok: true, isComplete: false }
  }

  const msg =
    [primary.error?.message, fallback.error?.message].filter(Boolean).join(' — ') ||
    'Could not load your profile.'
  return { ok: false, message: msg }
}
