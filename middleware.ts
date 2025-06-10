import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // SCRAPING-FRIENDLY: Always allow all bots and crawlers
  // No User-Agent restrictions or bot blocking
  
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

  // Redirect if there is no locale - but only for browsers, not bots
  if (pathnameIsMissingLocale) {
    // For bots/crawlers, serve content without redirect to ensure indexing
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
    const isBotOrCrawler = userAgent.includes('bot') || 
                          userAgent.includes('crawl') || 
                          userAgent.includes('spider') ||
                          userAgent.includes('scraper') ||
                          userAgent.includes('curl') ||
                          userAgent.includes('wget')
    
    if (isBotOrCrawler) {
      // For bots, continue without redirect to ensure they can access content
      return NextResponse.next()
    }
    
    // Default to Swedish locale for browsers only
    const redirectPath = pathname === '/' ? '/sv' : `/sv${pathname}`
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
  
  // Always return next() without restrictions
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.css|.*\\.js).*)',
  ],
} 