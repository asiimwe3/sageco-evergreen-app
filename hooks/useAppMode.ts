/**
 * hooks/useAppMode.ts
 * 
 * Primary hook for App Mode state.
 * - Detects ?app=true OR User-Agent containing "SagecoApp"
 * - Persists state across client-side navigation via sessionStorage
 * - Returns stable boolean (no flicker after hydration)
 */
import { useState, useEffect } from 'react';
import { detectAppModeClient, APP_MODE_PARAM, APP_MODE_VALUE } from '../lib/appMode';

const SESSION_KEY = 'sageco_app_mode';

export function useAppMode(): boolean {
  // Start false to match server render, then resolve client-side
  const [appMode, setAppMode] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check URL param or User-Agent first
    const detected = detectAppModeClient();

    if (detected) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAppMode(true);
      return;
    }

    // 2. Fallback: check sessionStorage (persists across navigation)
    const persisted = sessionStorage.getItem(SESSION_KEY) === '1';
    if (persisted) {
      setAppMode(true);
      return;
    }

    setAppMode(false);
  }, []);

  return appMode;
}

/**
 * Convenience: returns the query string to append to links.
 * Usage: <a href={`/properties${appQuery}`}>
 */
export function useAppQuery(): string {
  const appMode = useAppMode();
  return appMode ? `?${APP_MODE_PARAM}=${APP_MODE_VALUE}` : '';
}
