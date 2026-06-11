/* global React */

function VideoPlaceholder() {
  return (
    <section className="cc-reveal" style={{ background: '#000', padding: '32px max(24px, 4vw) 96px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A' }}>
            Inside the room · 2026 reel
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: 'rgba(244,239,230,0.55)' }}>
            01:42 — Dubai · Monaco · Istanbul
          </div>
        </div>

        <div
          className="cc-video-frame"
          style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(201,162,74,0.10) 0%, rgba(201,162,74,0) 55%), linear-gradient(180deg, #0e0905 0%, #050302 100%)',
            border: '1px solid rgba(201,162,74,0.35)',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* corner ticks */}
          {[
            { top: 16, left: 16, b: ['top', 'left'] },
            { top: 16, right: 16, b: ['top', 'right'] },
            { bottom: 16, left: 16, b: ['bottom', 'left'] },
            { bottom: 16, right: 16, b: ['bottom', 'right'] },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom,
              width: 22, height: 22,
              borderTop: c.b.includes('top') ? '1px solid #C9A24A' : 'none',
              borderBottom: c.b.includes('bottom') ? '1px solid #C9A24A' : 'none',
              borderLeft: c.b.includes('left') ? '1px solid #C9A24A' : 'none',
              borderRight: c.b.includes('right') ? '1px solid #C9A24A' : 'none',
              opacity: 0.85,
            }} />
          ))}

          {/* center play */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 28, textAlign: 'center', padding: '0 24px',
          }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              border: '1px solid rgba(201,162,74,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(201,162,74,0.06)',
              transition: 'transform 320ms ease, background 320ms ease',
            }} className="cc-play-btn">
              <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true">
                <path d="M1 1 L21 13 L1 25 Z" fill="#C9A24A" />
              </svg>
            </div>
            <div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 500,
                fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, color: '#F4EFE6',
                letterSpacing: '-0.01em', maxWidth: 720, margin: '0 auto', textWrap: 'balance',
              }}>
                The room our members refuse to describe in public.
              </div>
              <div style={{
                marginTop: 14,
                fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500,
                letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.55)',
              }}>
                Film · Coming soon
              </div>
            </div>
          </div>

          {/* timecode */}
          <div style={{
            position: 'absolute', left: 24, bottom: 24,
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.18em',
            color: 'rgba(244,239,230,0.55)',
          }}>
            REC · 00:00:00:00
          </div>
          <div style={{
            position: 'absolute', right: 24, bottom: 24,
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.18em',
            color: 'rgba(244,239,230,0.55)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#C9A24A',
              animation: 'cc-rec-pulse 1.6s ease-in-out infinite',
            }} />
            CHANGER · 4K
          </div>
        </div>
      </div>
    </section>
  );
}

window.VideoPlaceholder = VideoPlaceholder;
