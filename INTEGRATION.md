# App Mode — Integration Guide

## Step 1: Copy these files into your project

```
lib/appMode.ts                    ← utility functions
hooks/useAppMode.ts               ← primary hook
components/AppHeader.tsx          ← lightweight app header
components/AppModeStyles.tsx      ← CSS injector
components/AppModeProvider.tsx    ← context provider
middleware.ts                     ← edge middleware (root level)
```

## Step 2: Update pages/_app.js

Replace your existing `pages/_app.js` content with this:

```tsx
import { AuthProvider } from '../context/AuthContext';  // your existing
import '../styles/globals.css';                          // your existing
import Navbar from '../components/Navbar';               // your existing
import Footer from '../components/Footer';               // your existing
import { AppModeProvider, useAppModeContext } from '../components/AppModeProvider';
import { AppHeader }     from '../components/AppHeader';
import { AppModeStyles } from '../components/AppModeStyles';
import Head from 'next/head';

function AppShell({ Component, pageProps }) {
  const { appMode } = useAppModeContext();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content={
            appMode
              ? 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
              : 'width=device-width,initial-scale=1'
          }
        />
      </Head>

      {appMode && <AppModeStyles />}

      {!appMode && <Navbar />}
      {appMode  && <AppHeader showBack showSearch showNotifications />}

      <Component {...pageProps} />

      {!appMode && <Footer />}

      {appMode && (
        <div aria-hidden style={{ height: 'env(safe-area-inset-bottom, 16px)' }} />
      )}
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <AppModeProvider>
      <AuthProvider>
        <AppShell Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </AppModeProvider>
  );
}
```

## Step 3: Update your Android WebView

In MainActivity.java, update the User-Agent:

```java
WebSettings settings = webView.getSettings();
settings.setUserAgentString(
    settings.getUserAgentString() + " SagecoApp/1.0"
);
```

## Step 4: Test App Mode

Open in browser:
https://sageco-evergreen.vercel.app/?app=true

You should see:
✅ AppHeader (no desktop nav)
✅ No footer
✅ No newsletter/testimonials
✅ Full screen content
✅ Gold SAGECO logo in header
✅ Back / Search / Notifications buttons

## Step 5: Deploy to Vercel

```bash
git add .
git commit -m "feat: App Mode for Android WebView"
git push
```

Vercel auto-deploys within ~60 seconds.
