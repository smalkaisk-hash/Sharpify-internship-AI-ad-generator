/* global React */
/* Pinned horizontal-scroll programme: 4 panels slide horizontally as user scrolls vertically. */

function ProgrammePinned() {
  const steps = [
    {
      h: 'New Goals Activation.',
      b: 'Most wealthy families plateau — not from money, but from a lack of new goals. In the same room as Marc Randolph, Mo Gawdat and Chris Voss, your next mission becomes clear.',
      big: '01',
    },
    {
      h: 'Deep Relationships.',
      b: 'You crave allies, not admirers. A partner who doesn\'t just support you, but stands beside you in a new mission. Changer is the only place where genuine peers at the highest level challenge and support each other.',
      big: '02',
    },
    {
      h: 'Purpose Aligned Capital.',
      b: '20+ vetted off-market investment deals per year. Co-invest alongside top U.S. VCs in late-stage pre-IPO tech from just $10,000. Our $24M portfolio grew 110% last year, with zero losses in three years.',
      big: '03',
    },
    {
      h: 'Legacy Architecture.',
      b: 'Membership includes main member, spouse and children 16+. Not a junior programme — the same room. Your children learn valuations, hold their own conversations with billionaires, and begin to understand what building a legacy truly requires.',
      big: '04',
    },
  ];

  return (
    <section id="programme" className="cc-pin-track" data-fx="pin">
      <div className="cc-pin-stage">
        {/* Subtle photo backgrounds */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
        }}>
          <div style={{
            backgroundImage: "url('../../assets/526461982_1310197114444475_1125121615960481743_n.jpg')",
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.35, filter: 'grayscale(20%)',
          }} />
          <div style={{
            backgroundImage: "url('../../assets/603782708_1438506418280210_471081820925706945_n.jpg')",
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.35, filter: 'grayscale(20%)',
          }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.60) 100%)', pointerEvents: 'none' }} />

        <div className="cc-pin-rail" style={{ position: 'relative', zIndex: 2 }}>
          {steps.map((s, i) => (
            <div key={i} className="cc-pin-panel">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'center', width: '100%', maxWidth: 1240, margin: '0 auto' }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 'clamp(180px, 28vw, 420px)',
                  lineHeight: 0.85,
                  letterSpacing: '-0.04em',
                  color: 'transparent',
                  WebkitTextStroke: '1px #C9A24A',
                  textShadow: '0 0 80px rgba(201,162,74,0.18)',
                  userSelect: 'none',
                }}>
                  {s.big}
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 'clamp(40px, 4.4vw, 68px)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.015em',
                    color: '#F4EFE6',
                    textWrap: 'balance',
                    marginBottom: 28,
                    textShadow: '0 2px 24px rgba(0,0,0,0.8)',
                  }}>
                    {s.h}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    lineHeight: 1.5,
                    color: 'rgba(244,239,230,0.78)',
                    maxWidth: 560,
                    textWrap: 'pretty',
                    textShadow: '0 1px 16px rgba(0,0,0,0.9)',
                  }}>
                    {s.b}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div style={{
          position: 'absolute',
          zIndex: 4,
          left: '50%',
          bottom: 40,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(244,239,230,0.55)',
        }}>
          <span>The programme</span>
          <span style={{ width: 80, height: 1, background: 'rgba(244,239,230,0.25)', position: 'relative', overflow: 'hidden' }}>
            <span className="cc-pin-progress" style={{
              position: 'absolute',
              left: 0, top: 0, bottom: 0,
              width: '100%',
              background: '#C9A24A',
              transformOrigin: '0 0',
            }} />
          </span>
          <span style={{ color: '#C9A24A' }}>scroll →</span>
        </div>
      </div>
    </section>
  );
}

window.ProgrammePinned = ProgrammePinned;
