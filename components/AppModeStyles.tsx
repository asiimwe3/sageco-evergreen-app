/**
 * components/AppModeStyles.tsx
 * 
 * Injects a <style> tag when App Mode is active.
 * - Removes hero/newsletter/testimonial sections
 * - Kills page-level padding & animations
 * - Adds bottom safe area for Android nav bar
 * - Prevents text size adjustment in WebView
 */
import React from 'react';

export function AppModeStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
          /* ── App Mode Global Reset ── */
          html, body {
            -webkit-text-size-adjust: 100%;
            touch-action: manipulation;
            overscroll-behavior-y: none;
          }

          /* Remove heavy animations for faster WebView rendering */
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }

          /* Full-screen content */
          main, [role="main"], .page-content {
            min-height: calc(100vh - 56px) !important;
            padding-top: 0 !important;
          }

          /* Remove hero section top margin */
          section:first-of-type {
            margin-top: 0 !important;
          }

          /* Hide sections that clutter the app view */
          /* Hero banner large paddings */
          .hero-section { padding-top: 16px !important; padding-bottom: 16px !important; }

          /* Newsletter */
          .newsletter-section,
          [class*="newsletter"],
          [id*="newsletter"] { display: none !important; }

          /* Testimonials */
          .testimonials-section,
          [class*="testimonial"],
          [id*="testimonial"] { display: none !important; }

          /* Ads / promo banners */
          [class*="promo-banner"],
          [class*="ad-banner"],
          [id*="promo"],
          [id*="ad-slot"] { display: none !important; }

          /* Bottom safe area — prevents Android nav bar overlap */
          body {
            padding-bottom: env(safe-area-inset-bottom, 16px) !important;
          }

          /* Tap highlight off for all interactive elements */
          a, button, [role="button"] {
            -webkit-tap-highlight-color: transparent;
          }

          /* Smooth scroll off for performance */
          html { scroll-behavior: auto !important; }
        `,
      }}
    />
  );
}

export default AppModeStyles;
