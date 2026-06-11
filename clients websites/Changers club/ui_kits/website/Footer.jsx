/* global React */

function Footer() {
  return (
    <footer style={{ background: '#000', padding: '96px max(24px, 4vw) 64px', borderTop: '1px solid rgba(201,162,74,0.55)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <img src="../../assets/logo-changer-white.webp" alt="Changer — Be wealthy, not just rich" style={{ width: 240, height: 'auto', display: 'block', marginBottom: 32 }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'rgba(244,239,230,0.55)', lineHeight: 1.7 }}>
            Changer Global Inc.<br />
            Pl. de la Gare 12, 1003 Lausanne, Switzerland
          </div>
          <div style={{ marginTop: 8, fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: 'rgba(244,239,230,0.38)', lineHeight: 1.6 }}>
            Changer Global Arabia Ltd — Subsidiary in UAE
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.5)', marginBottom: 16 }}>Contact</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#F4EFE6', lineHeight: 1.9 }}>
            <a href="tel:+41783031059" style={{ color: 'inherit', textDecoration: 'none' }}>+41 783 031 059</a><br />
            <a href="mailto:idea@clubchanger.com" style={{ color: '#C9A24A', textDecoration: 'none' }}>idea@clubchanger.com</a>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.5)', marginBottom: 16 }}>Follow</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Facebook', href: 'https://www.facebook.com/changerclub/' },
              { label: 'Instagram', href: 'https://www.instagram.com/clubchanger' },
              { label: 'YouTube',  href: 'https://www.youtube.com/channel/UCeC-QZoSC95l5q5iSAZfwKA' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                color: '#F4EFE6',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'color 300ms',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A24A'}
              onMouseLeave={e => e.currentTarget.style.color = '#F4EFE6'}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1240, margin: '64px auto 0', borderTop: '1px solid rgba(244,239,230,0.12)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.4)' }}>
        <span>© Changer Club {new Date().getFullYear()}</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}

window.Footer = Footer;
