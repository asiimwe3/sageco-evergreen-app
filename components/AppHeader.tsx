/**
 * components/AppHeader.tsx
 * 
 * Lightweight header shown ONLY in App Mode (inside Android WebView).
 * Replaces the full desktop Navbar with: Back | Logo | Search | Notifications
 */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AppLink from './AppLink';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export function AppHeader({
  title,
  showBack = true,
  showSearch = true,
  showNotifications = true,
}: AppHeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isHome = router.pathname === '/';

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/?app=true');
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}&app=true`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      {/* ── Main App Header Bar ── */}
      <header
        style={{
          position:        'sticky',
          top:             0,
          zIndex:          999,
          background:      '#0a3d1f',
          borderBottom:    '1px solid rgba(255,255,255,0.08)',
          boxShadow:       '0 1px 8px rgba(0,0,0,0.3)',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '0 12px',
            height:         '56px',
            maxWidth:       '100%',
          }}
        >
          {/* Left: Back button */}
          <div style={{ width: '40px' }}>
            {showBack && !isHome && (
              <button
                onClick={handleBack}
                aria-label="Go back"
                style={iconBtnStyle}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            )}
          </div>

          {/* Center: Logo or page title */}
          <AppLink href="/" style={{ textDecoration: 'none', flex: 1, textAlign: 'center' }}>
            {title ? (
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                {title}
              </span>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>🌿</span>
                <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                  <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '15px', letterSpacing: '0.05em' }}>
                    SAGECO
                  </div>
                  <div style={{ color: '#86efac', fontWeight: 600, fontSize: '9px', letterSpacing: '0.2em' }}>
                    EVERGREEN
                  </div>
                </div>
              </div>
            )}
          </AppLink>

          {/* Right: Search + Notifications */}
          <div style={{ display: 'flex', gap: '4px', width: '80px', justifyContent: 'flex-end' }}>
            {showSearch && (
              <button
                onClick={() => setSearchOpen(v => !v)}
                aria-label="Search"
                style={iconBtnStyle}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            )}
            {showNotifications && (
              <AppLink href="/account" aria-label="Account" style={{ display: 'flex' }}>
                <button style={iconBtnStyle} aria-label="Account">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </button>
              </AppLink>
            )}
          </div>
        </div>

        {/* ── Expandable Search Bar ── */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            style={{
              padding:     '8px 12px 12px',
              borderTop:   '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search properties, location…"
                autoFocus
                style={{
                  flex:            1,
                  padding:         '10px 14px',
                  borderRadius:    '8px',
                  border:          '1px solid rgba(255,255,255,0.2)',
                  background:      'rgba(255,255,255,0.1)',
                  color:           '#fff',
                  fontSize:        '14px',
                  outline:         'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding:         '10px 16px',
                  borderRadius:    '8px',
                  background:      '#16a34a',
                  color:           '#fff',
                  fontWeight:      700,
                  fontSize:        '14px',
                  border:          'none',
                  cursor:          'pointer',
                }}
              >
                Go
              </button>
            </div>
          </form>
        )}
      </header>
    </>
  );
}

const iconBtnStyle: React.CSSProperties = {
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  width:           '38px',
  height:          '38px',
  borderRadius:    '50%',
  background:      'rgba(255,255,255,0.08)',
  border:          'none',
  cursor:          'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition:      'background 0.15s',
};

export default AppHeader;
