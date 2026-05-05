-- Onboarding completion + optional first name from activation step
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS onboarding_first_name TEXT;

COMMENT ON COLUMN public.users.onboarding_completed_at IS 'Set when user finishes in-app onboarding (activation step). NULL = show onboarding.';
COMMENT ON COLUMN public.users.onboarding_first_name IS 'First name captured during onboarding activation.';

-- Optional: skip onboarding for accounts created before this feature shipped (adjust timestamp):
-- UPDATE public.users SET onboarding_completed_at = NOW()
-- WHERE onboarding_completed_at IS NULL AND created_at < '2026-04-29T00:00:00Z';
