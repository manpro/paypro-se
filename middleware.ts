import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get pathname of request (e.g. /blog, /dashboards/makro)
  const pathname = request.nextUrl.pathname
  
  // Skip if path already has a locale or is a static file
  if (pathname.startsWith('/sv/') || pathname.startsWith('/en/') || 
      pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = ['sv', 'en'].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Default to Swedish locale
    const redirectPath = pathname === '/' ? '/sv' : `/sv${pathname}`
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.css|.*\\.js).*)',
  ],
} 