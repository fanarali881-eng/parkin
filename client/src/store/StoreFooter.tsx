import { useLang } from './LanguageContext';

export default function StoreFooter() {
  const { dir, isRTL } = useLang();

  return (
    <footer dir={dir} style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}>
      {/* Main Footer */}
      <div style={{
        background: '#dfe6ed',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1400\' height=\'300\' viewBox=\'0 0 1400 300\'%3E%3Cg fill=\'%23c8d4df\' opacity=\'0.4\'%3E%3Cpath d=\'M50 280c5-20 15-40 25-45s20 5 25 0 10-15 20-20 25-5 30 0 10 15 15 15 15-5 25-10 20 0 25 10 10 20 20 25 25-10 30-15 15 5 20 15 10 20 15 20 15-10 25-15 20 0 25 10 10 15 15 15 15-10 25-15 20 0 25 10 10 15 15 15 15-10 25-15 20 0 25 10\'/%3E%3Ccircle cx=\'200\' cy=\'250\' r=\'3\'/%3E%3Ccircle cx=\'400\' cy=\'260\' r=\'2\'/%3E%3Ccircle cx=\'600\' cy=\'255\' r=\'3\'/%3E%3Ccircle cx=\'800\' cy=\'258\' r=\'2\'/%3E%3Ccircle cx=\'1000\' cy=\'252\' r=\'3\'/%3E%3Ccircle cx=\'1200\' cy=\'260\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        padding: '50px 0 30px',
        position: 'relative' as const,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>
          <div className="footer-main-grid" style={{
            display: 'grid',
            gridTemplateColumns: isRTL ? '1.8fr 1fr 1.5fr 1.5fr' : '1.5fr 1.5fr 1fr 1.8fr',
            gap: '30px',
            direction: isRTL ? 'rtl' : 'ltr',
          }}>

            {/* Column 1 (Right in RTL): Brand - Logo + Slogan */}
            <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <img
                src="/product-images/logo.svg"
                alt="Al Ain Farms"
                style={{ width: '120px', marginBottom: '15px' }}
              />
              <img
                src="/product-images/footer-title.png"
                alt={isRTL ? 'بكل حب صنع محلياً' : 'Made with love locally'}
                style={{ width: '200px', display: 'block' }}
              />
            </div>

            {/* Column 2: معلومات عنا / About Us */}
            <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <h6 style={{ color: '#1a2744', fontSize: '16px', fontWeight: 700, marginBottom: '15px' }}>
                {isRTL ? 'معلومات عنا' : 'About Us'}
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(isRTL
                  ? ['تاريخنا', 'قصتنا', 'فريقنا', 'سياسة الجودة']
                  : ['Our History', 'Our Story', 'Our Team', 'Quality Policy']
                ).map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a style={{ color: '#4a5568', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1a2744')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: مزرعتنا / Our Farm */}
            <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <h6 style={{ color: '#1a2744', fontSize: '16px', fontWeight: 700, marginBottom: '15px' }}>
                {isRTL ? 'مزرعتنا' : 'Our Farm'}
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(isRTL
                  ? ['الألبان', 'العصائر', 'الدواجن', 'حليب النوق']
                  : ['Dairy', 'Juices', 'Poultry', 'Camel Milk']
                ).map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a style={{ color: '#4a5568', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1a2744')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: منتجاتنا / Products + جهات الاتصال / Contact */}
            <div style={{ display: 'flex', gap: '40px' }}>
              {/* منتجاتنا */}
              <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <h6 style={{ color: '#1a2744', fontSize: '16px', fontWeight: 700, marginBottom: '15px' }}>
                  {isRTL ? 'منتجاتنا' : 'Products'}
                </h6>
                <div style={{ display: 'flex', gap: '25px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {(isRTL
                      ? ['حليب', 'زبادي', 'لبن', 'الحلويات', 'الدواجن']
                      : ['Milk', 'Yoghurt', 'Laban', 'Desserts', 'Poultry']
                    ).map((item, i) => (
                      <li key={i} style={{ marginBottom: '8px' }}>
                        <a style={{ color: '#4a5568', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#1a2744')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}>
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {(isRTL
                      ? ['الأجبان', 'العصائر', 'حليب نوق']
                      : ['Cheese', 'Juices', 'Camelait']
                    ).map((item, i) => (
                      <li key={i} style={{ marginBottom: '8px' }}>
                        <a style={{ color: '#4a5568', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#1a2744')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}>
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* جهات الاتصال */}
              <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <h6 style={{ color: '#1a2744', fontSize: '16px', fontWeight: 700, marginBottom: '15px' }}>
                  {isRTL ? 'جهات الاتصال' : 'Contact'}
                </h6>
                <div style={{ color: '#4a5568', fontSize: '13px', lineHeight: 1.8 }}>
                  <p style={{ margin: '0 0 5px' }}>{isRTL ? 'صندوق بريد رقم : 15571' : 'P.O. Box: 15571'}</p>
                  <p style={{ margin: '0 0 5px' }}>{isRTL ? 'العين، أبوظبي، الإمارات العربية المتحدة' : 'Al Ain, Abu Dhabi, UAE'}</p>
                  <p style={{ margin: '0 0 5px', direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
                    <a href="tel:+97137114600" style={{ color: '#4a5568', textDecoration: 'none' }}>+ 971 3 711 4600</a>
                  </p>
                  <p style={{ margin: '0 0 5px' }}>
                    {isRTL ? 'الرقم المجاني: ' : 'Toll Free: '}
                    <a href="tel:8005344" style={{ color: '#4a5568', textDecoration: 'none' }}>8005344</a>
                  </p>
                  <p style={{ margin: 0 }}>
                    <a href="mailto:customercare@alainfarms.com" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '12px' }}>
                      customercare@alainfarms.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar - Social + Copyright */}
      <div style={{
        background: '#1a2744',
        padding: '15px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', direction: 'ltr' }}>
          {/* Social Icons - LEFT side */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            {/* YouTube */}
            <a href="https://www.youtube.com/alainfarms" target="_blank" rel="noopener" style={{ color: '#a0aec0', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#a0aec0')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/alainfarms" target="_blank" rel="noopener" style={{ color: '#a0aec0', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#a0aec0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/alainfarms" target="_blank" rel="noopener" style={{ color: '#a0aec0', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#a0aec0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/alainfarms" target="_blank" rel="noopener" style={{ color: '#a0aec0', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#a0aec0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>

          {/* Copyright - RIGHT side */}
          <p style={{ margin: 0, fontSize: '13px', color: '#a0aec0' }}>
            Copyright Al Ain Farms. All Rights Reserved
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 25px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </footer>
  );
}
