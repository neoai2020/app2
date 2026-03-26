import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/leads', '/email-builder', '/send-instructions', '/activity', '/offers', '/saved-emails', '/training', '/protector']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Clear any problematic cookies before redirecting
    const response = NextResponse.redirect(url)
    return response
  }

  // Allow password reset routes through without any redirect
  const passwordResetPaths = ['/forgot-password', '/reset-password']
  const isPasswordResetPath = passwordResetPaths.some(path => request.nextUrl.pathname.startsWith(path))
  if (isPasswordResetPath) {
    return supabaseResponse
  }

  // Redirect authenticated users away from auth/landing pages to dashboard
  const authPaths = ['/login', '/signup', '/signup-pro']
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname === path)
  const isLandingPage = request.nextUrl.pathname === '/'

  if ((isAuthPath || isLandingPage) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
