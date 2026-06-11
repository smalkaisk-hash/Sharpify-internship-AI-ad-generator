/* global React, Button */

function Hero({ onApply }) {
  const W = ({ children, gold }) => (
    <span style={{ color: gold ? '#C9A24A' : 'inherit' }}>{children}</span>
  );

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      alignItems: 'stretch',
      background: '#000',
      paddingTop: 78,
    }}>
      {/* Video placeholder replacing the photo */}
      <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '40px max(24px, 3vw)' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          background: 'radial-gradient(ellipse at 30% 30%, rgba(201,162,74,0.10) 0%, rgba(201,162,74,0) 55%), linear-gradient(180deg, #0e0905 0%, #050302 100%)',
          border: '1px solid rgba(201,162,74,0.35)',
          overflow: 'hidden',
          cursor: 'pointer',
        }}>
          {/* Corner ticks */}
          {[
            { top: 14, left: 14, b: ['top', 'left'] },
            { top: 14, right: 14, b: ['top', 'right'] },
            { bottom: 14, left: 14, b: ['bottom', 'left'] },
            { bottom: 14, right: 14, b: ['bottom', 'right'] },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom,
              width: 20, height: 20,
              borderTop:    c.b.includes('top')    ? '1px solid #C9A24A' : 'none',
              borderBottom: c.b.includes('bottom') ? '1px solid #C9A24A' : 'none',
              borderLeft:   c.b.includes('left')   ? '1px solid #C9A24A' : 'none',
              borderRight:  c.b.includes('right')  ? '1px solid #C9A24A' : 'none',
              opacity: 0.85,
            }} />
          ))}
          {/* Play button */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 20, textAlign: 'center', padding: '0 24px',
          }}>
            <div className="cc-play-btn" style={{
              width: 80, height: 80, borderRadius: '50%',
              border: '1px solid rgba(201,162,74,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(201,162,74,0.06)',
              transition: 'transform 320ms ease, background 320ms ease',
            }}>
              <svg width="18" height="22" viewBox="0 0 22 26" fill="none" aria-hidden="true">
                <path d="M1 1 L21 13 L1 25 Z" fill="#C9A24A" />
              </svg>
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 500,
              fontSize: 'clamp(18px, 2vw, 28px)', lineHeight: 1.15, color: '#F4EFE6',
              letterSpacing: '-0.01em', maxWidth: 480, textWrap: 'balance',
            }}>
              The room our members refuse to describe in public.
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500,
              letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.55)',
            }}>
              Film · Coming soon
            </div>
          </div>
          {/* Timecode */}
          <div style={{ position: 'absolute', left: 20, bottom: 16, fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.18em', color: 'rgba(244,239,230,0.45)' }}>
            REC · 00:00:00:00
          </div>
          <div style={{ position: 'absolute', right: 20, bottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.18em', color: 'rgba(244,239,230,0.45)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A24A', animation: 'cc-rec-pulse 1.6s ease-in-out infinite' }} />
            CHANGER · 4K
          </div>
        </div>
      </div>

      {/* Text column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '64px max(24px, 3vw)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A' }}>
            Monaco · Dubai
          </span>
          <h1 style={{
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(48px, 5.2vw, 84px)',
            lineHeight: 1.08,
            letterSpacing: '-0.015em',
            color: '#F4EFE6',
          }}>
            The First <W gold>Life Extension</W> Club for Wealth Families in Europe and Dubai
          </h1>
          <p style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            lineHeight: 1.5,
            color: 'rgba(244,239,230,0.78)',
            textWrap: 'pretty',
          }}>
            Every year inside Changer adds +7 years of fulfilled, emotionally alive, purpose-driven life. Backed by science.
          </p>
          <p style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            lineHeight: 1.5,
            color: 'rgba(244,239,230,0.58)',
            textWrap: 'pretty',
          }}>
            Most wealthy families plateau — not from money, but from a lack of new goals. Changer solves it.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Button onClick={onApply}>See if you qualify</Button>
            <Button variant="ghost" onClick={() => document.getElementById('programme')?.scrollIntoView({ behavior: 'smooth' })}>How the room works</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
