import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';

const nextIntlMiddleware = createMiddleware(routing);

const defaultLocale = routing.defaultLocale;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}/home`, request.url));
  }

  return nextIntlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
