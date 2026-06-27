/**
 * middleware.ts  (place at project root, same level as pages/)
 * 
 * Edge Middleware — runs before every request.
 * 
 * If the User-Agent contains "SagecoApp", automatically rewrites
 * the URL to include ?app=true so server components / getServerSideProps
 * can detect app mode without relying on client JS.
 * 
 * Also adds x-app-mode header for any server-side logic.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SAGECO_UA_MARKER, APP_MODE_PARAM, APP_MODE_VALUE } from './lib/appMode';

export function middleware(request: NextRequest) {
  const ua        = request.headers.get('user-agent') ?? '';
  const { searchParams, pathname } = request.nextUrl;

  const isAppUA    = ua.includes(SAGECO_UA_MARKER);
  const hasAppParam = searchParams.get(APP_MODE_PARAM) === APP_MODE_VALUE;

  // If app UA but no param — rewrite URL to add ?app=true
  if (isAppUA && !hasAppParam) {
    const url = request.nextUrl.clone();
    url.searchParams.set(APP_MODE_PARAM, APP_MODE_VALUE);
    const response = NextResponse.rewrite(url);
    response.headers.set('x-app-mode', '1');
    return response;
  }

  // If already has param — just add header for downstream use
  if (hasAppParam) {
    const response = NextResponse.next();
    response.headers.set('x-app-mode', '1');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except static files and API
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
