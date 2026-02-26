import { useState, useRef, useEffect } from 'react';
import { useStore } from './StoreContext';
import { useLang } from './LanguageContext';
import { useLocation } from 'wouter';

export default function StoreHeader() {
  const { categories, getCartCount, searchQuery, setSearchQuery, searchProducts, setCartDrawerOpen } = useStore();
  const { lang, toggleLang, t, dir, isRTL } = useLang();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const cartCount = getCartCount();
  const megaTimeoutRef = useRef<any>(null);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      setSearchResults(searchProducts(q).slice(0, 8));
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchResults([]);
    }
  };

  const openMega = (key: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaMenuOpen(key);
  };

  const closeMega = () => {
    megaTimeoutRef.current = setTimeout(() => setMegaMenuOpen(null), 150);
  };

  const megaMenuKeys = ['dairy', 'yoghurt-laban'];

  // Helper to get category/subcategory title based on language
  const getCatTitle = (item: any) => {
    if (lang === 'en' && item.titleEn) return item.titleEn;
    return item.title;
  };

  // Helper to get product title based on language
  const getProductTitle = (p: any) => {
    if (lang === 'ar') return p.titleAr || p.title;
    return p.title;
  };

  return (
    <header className="store-header" dir={dir} style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top announcement bar - Dark Navy Blue like Al Ain Farms */}
      <div className="store-announcement-bar" style={{ background: '#1a2744', color: 'white', padding: '8px 20px', fontSize: '13px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <a onClick={() => navigate('/store')} style={{ color: 'white', textDecoration: 'none', cursor: 'pointer', fontWeight: 700 }}>
          {t('header.freeShippingBanner')}
        </a>
        <button
          className="store-lang-btn"
          onClick={toggleLang}
          style={{
            position: 'absolute',
            right: '20px',
            fontSize: '13px',
            cursor: 'pointer',
            color: 'white',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            padding: '3px 12px',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
        >
          {lang === 'ar' ? 'English' : 'عربي'}
        </button>
      </div>

      {/* Main header - White background with Al Ain Farms branding */}
      <div className="store-main-header" style={{ background: 'white', padding: '12px 0', borderBottom: '3px solid #1a2744' }}>
        <div className="store-main-header-inner" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a onClick={() => navigate('/store')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/alainfarms-logo.png" alt="مزارع العين" style={{ height: '110px', width: 'auto' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isRTL ? 'flex-start' : 'flex-start' }}>
              <span className="store-logo-name" style={{ color: '#1a2744', fontSize: '22px', fontWeight: 800, lineHeight: 1.2 }}>{t('header.logoName')}</span>
              <span className="store-logo-tagline" style={{ color: '#1a2744', fontSize: '11px', fontWeight: 500 }}>{t('header.logoTagline')}</span>
            </div>
          </a>

          {/* Navigation - desktop */}
          <nav className="store-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <a onClick={() => navigate('/store/collection/dairy')}
              style={{ padding: '10px 14px', color: '#1a2744', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              {t('header.dairy')}
            </a>
            <a onClick={() => navigate('/store/collection/yoghurt-laban')}
              style={{ padding: '10px 14px', color: '#1a2744', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              {t('header.yoghurtLaban')}
            </a>
            <a onClick={() => navigate('/store/collection/cheese')}
              style={{ padding: '10px 14px', color: '#1a2744', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              {t('header.cheese')}
            </a>
            <a onClick={() => navigate('/store/collection/juices')}
              style={{ padding: '10px 14px', color: '#1a2744', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              {t('header.juices')}
            </a>
            <a onClick={() => navigate('/store/collection/poultry-eggs')}
              style={{ padding: '10px 14px', color: '#1a2744', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              {t('header.poultryEggs')}
            </a>
            <a onClick={() => navigate('/store/collection/promotion')}
              style={{ padding: '10px 14px', color: '#1a2744', cursor: 'pointer', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              {t('header.offers')}
            </a>
          </nav>

          {/* Icons */}
          <div className="store-icons" style={{ display: 'flex', alignItems: 'center', gap: '18px', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <a onClick={() => setCartDrawerOpen(true)} style={{ cursor: 'pointer', position: 'relative', padding: '4px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', [isRTL ? 'right' : 'left']: '-6px', background: '#1a2744', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  {cartCount}
                </span>
              )}
            </a>
            <button className="store-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', padding: '4px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Categories Bar */}
      <div className="store-mobile-categories" style={{ background: '#1a2744', padding: '0', display: 'none', overflowX: 'auto', overflowY: 'hidden' }}>
        <div style={{ display: 'flex', gap: '0', padding: '0', whiteSpace: 'nowrap' }}>
          <a onClick={() => navigate('/store/collection/dairy')} style={{ flex: '0 0 auto', padding: '12px 16px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            {t('header.dairy')}
          </a>
          <a onClick={() => navigate('/store/collection/yoghurt-laban')} style={{ flex: '0 0 auto', padding: '12px 16px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            {t('header.yoghurtLaban')}
          </a>
          <a onClick={() => navigate('/store/collection/cheese')} style={{ flex: '0 0 auto', padding: '12px 16px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            {t('header.cheese')}
          </a>
          <a onClick={() => navigate('/store/collection/juices')} style={{ flex: '0 0 auto', padding: '12px 16px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            {t('header.juices')}
          </a>
          <a onClick={() => navigate('/store/collection/poultry-eggs')} style={{ flex: '0 0 auto', padding: '12px 16px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            {t('header.poultryEggs')}
          </a>
          <a onClick={() => navigate('/store/collection/promotion')} style={{ flex: '0 0 auto', padding: '12px 16px', color: '#ff6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            {t('header.offers')}
          </a>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          zIndex: 99,
          maxHeight: '500px', overflowY: 'auto',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 30px' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder={t('header.search') || 'Search products...'}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  outline: 'none',
                }}
                autoFocus
              />
              <button type="submit" style={{ background: '#1a2744', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                {t('header.search') || 'Search'}
              </button>
            </form>
            {searchResults.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                {searchResults.map(p => (
                  <a
                    key={p.id}
                    onClick={() => { navigate(`/store/product/${p.handle}`); setSearchOpen(false); }}
                    style={{
                      cursor: 'pointer', textDecoration: 'none', color: '#333',
                      padding: '10px', borderRadius: '4px', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>
                      {getProductTitle(p)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      AED {p.variants[0]?.price || 'N/A'}
                    </div>
                  </a>
                ))}
              </div>
            ) : searchQuery ? (
              <p style={{ textAlign: 'center', color: '#999' }}>{t('header.noResults')}</p>
            ) : null}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <>
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
          <div style={{ position: 'fixed', top: 0, [isRTL ? 'right' : 'left']: 0, width: '280px', height: '100%', background: 'white', zIndex: 201, overflowY: 'auto', boxShadow: '2px 0 15px rgba(0,0,0,0.2)', direction: dir }}>
            <div style={{ background: '#1a2744', padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/alainfarms-logo.png" alt="" style={{ height: '35px' }} />
                <span style={{ color: 'white', fontSize: '18px', fontWeight: 800 }}>{t('header.logoName')}</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {[
                { label: t('header.dairy'), path: '/store/collection/dairy' },
                { label: t('header.yoghurtLaban'), path: '/store/collection/yoghurt-laban' },
                { label: t('header.cheese'), path: '/store/collection/cheese' },
                { label: t('header.juices'), path: '/store/collection/juices' },
                { label: t('header.poultryEggs'), path: '/store/collection/poultry-eggs' },
              ].map((item, i) => (
                <a key={i} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} style={{ display: 'block', padding: '14px 20px', fontSize: '15px', fontWeight: 700, color: '#1a2744', cursor: 'pointer', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>
                  {item.label}
                </a>
              ))}
              <a onClick={() => { navigate('/store/collection/new-arrivals'); setMobileMenuOpen(false); }} style={{ display: 'block', padding: '14px 20px', fontSize: '15px', fontWeight: 700, color: '#1a2744', cursor: 'pointer', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>
                {t('header.newArrivals')}
              </a>
              <a onClick={() => { navigate('/store/collection/promotion'); setMobileMenuOpen(false); }} style={{ display: 'block', padding: '14px 20px', fontSize: '15px', fontWeight: 700, color: '#1a2744', cursor: 'pointer', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>
                {t('header.offers')}
              </a>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .store-nav-desktop { display: none !important; }
          .store-mobile-menu-btn { display: block !important; }
        }
        @media (max-width: 768px) {
          .store-header .store-announcement-bar {
            font-size: 10px !important;
            padding: 5px 60px 5px 10px !important;
          }
          .store-header .store-announcement-bar a {
            font-size: 10px !important;
          }
          .store-header .store-lang-btn {
            font-size: 10px !important;
            padding: 2px 8px !important;
            right: 6px !important;
            position: absolute !important;
          }
          .store-header .store-main-header {
            padding: 8px 0 !important;
          }
          .store-header .store-main-header-inner {
            padding: 0 12px !important;
          }
          .store-header .store-logo-name {
            font-size: 16px !important;
          }
          .store-header .store-logo-tagline {
            font-size: 9px !important;
          }
          .store-header .store-icons {
            gap: 12px !important;
          }
          .store-mobile-categories {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
