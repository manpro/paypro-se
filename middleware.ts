import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get pathname of request (e.g. /blog, /dashboards/makro)
  const pathname = request.nextUrl.pathname

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = ['sv', 'en'].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Default to Swedish locale
    return NextResponse.redirect(
      new URL(`/sv${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.css|.*\\.js).*)',
  ],
} 