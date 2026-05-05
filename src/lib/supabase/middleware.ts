import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { resolveOnboardingGate } from '@/lib/onboarding-gate'

/** Authenticated app routes (must be logged in). Includes onboarding. */
const AUTH_REQUIRED_ROUTES = [
  '/dashboard',
  '/onboarding',
  '/leads',
  '/offers',
  '/email-builder',
  '/saved-emails',
  '/training',
  '/support',
  '/send-instructions',
  '/activity',
  '/protector',
  '/dfy',
  '/instant-income',
  '/autopilot',
  '/scale',
  '/earn-400',
  '/copy-paste'
]

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

function requiresAuth(pathname: string) {
  return AUTH_REQUIRED_ROUTES.some((r) => matchesRoute(pathname, r))
}

/** Logged-in app areas that require finished onboarding (excludes /onboarding). */
function requiresFinishedOnboarding(pathname: string) {
  if (matchesRoute(pathname, '/onboarding')) return false
  return AUTH_REQUIRED_ROUTES.filter((r) => r !== '/onboarding').some((r) => matchesRoute(pathname, r))
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const authPaths = ['/login', '/signup', '/signup-pro']
  const isAuthPath = authPaths.some((path) => pathname === path)
  const isLandingPage = pathname === '/'

  if (requiresAuth(pathname) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const passwordResetPaths = ['/forgot-password', '/reset-password']
  const isPasswordResetPath = passwordResetPaths.some((path) => pathname.startsWith(path))
  if (isPasswordResetPath) {
    return supabaseResponse
  }

  let onboardingComplete: boolean | undefined
  if (user) {
    const shouldLoadOnboarding =
      requiresFinishedOnboarding(pathname) ||
      matchesRoute(pathname, '/onboarding') ||
      isAuthPath ||
      isLandingPage
    if (shouldLoadOnboarding) {
      const gate = await resolveOnboardingGate(supabase, user.id)
      onboardingComplete = gate.ok ? gate.isComplete : true
    }
  }

  if (user && requiresFinishedOnboarding(pathname) && onboardingComplete === false) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  if (user && matchesRoute(pathname, '/onboarding') && onboardingComplete === true) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if ((isAuthPath || isLandingPage) && user) {
    const url = request.nextUrl.clone()
    url.pathname = onboardingComplete ? '/dashboard' : '/onboarding'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
