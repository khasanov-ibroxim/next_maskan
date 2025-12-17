// middleware.ts - FIXED VERSION (Default: Russian)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

function getLocale(request: NextRequest): string {
  // ✅ FIXED: Always return Russian as default for Google AdSense
  return 'ru';
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for:
  // - API routes
  // - Static files
  // - Next.js internals
  // - Public files (robots.txt, sitemap.xml, etc.)
  if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/static/') ||
      pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // ✅ Redirect root to Russian (default)
  if (pathname === '/') {
    const locale = 'ru'; // Force Russian
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // ✅ For other paths without locale, redirect to Russian
  const locale = 'ru'; // Force Russian
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Match all paths except:
    // - api routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, robots.txt, sitemap.xml (public files)
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*|).*)',
  ],
};