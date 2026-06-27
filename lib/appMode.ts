/**
 * lib/appMode.ts
 * Utility functions for App Mode detection.
 * Works on both server (Node) and client (browser).
 */

export const APP_MODE_PARAM   = 'app';
export const APP_MODE_VALUE   = 'true';
export const SAGECO_UA_MARKER = 'SagecoApp';

/**
 * Server-side detection — pass the raw User-Agent string and full URL.
 * Use this inside getServerSideProps / middleware.
 */
export function detectAppModeServer(
  userAgent: string | undefined,
  urlString: string
): boolean {
  const ua = userAgent ?? '';
  if (ua.includes(SAGECO_UA_MARKER)) return true;
  try {
    const url = new URL(urlString);
    return url.searchParams.get(APP_MODE_PARAM) === APP_MODE_VALUE;
  } catch {
    return false;
  }
}

/**
 * Client-side detection — reads from window.location and navigator.
 * Safe to call only inside useEffect / client components.
 */
export function detectAppModeClient(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent ?? '';
  if (ua.includes(SAGECO_UA_MARKER)) return true;
  const params = new URLSearchParams(window.location.search);
  return params.get(APP_MODE_PARAM) === APP_MODE_VALUE;
}

/**
 * Given an existing href string, append ?app=true so app mode persists.
 */
export function appendAppMode(href: string): string {
  try {
    // Relative paths need a base
    const isRelative = !href.startsWith('http');
    const base = isRelative ? 'https://x.x' : undefined;
    const url  = new URL(href, base);
    url.searchParams.set(APP_MODE_PARAM, APP_MODE_VALUE);
    return isRelative
      ? url.pathname + url.search + url.hash
      : url.toString();
  } catch {
    const sep = href.includes('?') ? '&' : '?';
    return `${href}${sep}${APP_MODE_PARAM}=${APP_MODE_VALUE}`;
  }
}
