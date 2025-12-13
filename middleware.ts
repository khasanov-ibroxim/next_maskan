// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

function getLocale(request: NextRequest): string {
  // Check if locale is in pathname
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = i18n.locales.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return pathnameLocale;

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLang = acceptLanguage.split(',')[0].split('-')[0];
    const matchedLocale = i18n.locales.find(locale => locale.startsWith(browserLang));
    if (matchedLocale) return matchedLocale;
  }

  return i18n.defaultLocale;
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

  // Redirect root to default locale
  if (pathname === '/') {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // For other paths without locale, redirect to default locale
  const locale = getLocale(request);
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