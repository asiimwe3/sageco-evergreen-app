/**
 * components/AppModeProvider.tsx
 * 
 * React Context provider so any component can read appMode
 * without calling useAppMode() repeatedly (avoids multiple useEffect calls).
 * 
 * Wrap _app.tsx with <AppModeProvider> instead of calling useAppMode() directly.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectAppModeClient } from '../lib/appMode';

const SESSION_KEY = 'sageco_app_mode';

interface AppModeContextValue {
  appMode: boolean;
  isReady: boolean; // false until client-side detection completes
}

const AppModeContext = createContext<AppModeContextValue>({
  appMode: false,
  isReady: false,
});

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const [appMode, setAppMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const detected = detectAppModeClient();
    if (detected) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAppMode(true);
    } else {
      const persisted = sessionStorage.getItem(SESSION_KEY) === '1';
      setAppMode(persisted);
    }
    setIsReady(true);
  }, []);

  return (
    <AppModeContext.Provider value={{ appMode, isReady }}>
      {children}
    </AppModeContext.Provider>
  );
}

/** Fast hook — reads from context, no extra useEffect */
export function useAppModeContext(): AppModeContextValue {
  return useContext(AppModeContext);
}
