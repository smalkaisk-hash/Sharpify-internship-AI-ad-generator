/* global React */

function PressFeature() {
  return (
    <section className="cc-reveal" style={{ background: '#000', padding: '128px max(24px, 4vw)', borderTop: '1px solid rgba(244,239,230,0.12)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="cc-reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A', marginBottom: 24 }}>
            Press
          </div>
          <h2 style={{
            margin: '0 auto',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(40px, 5vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: '#F4EFE6',
            maxWidth: 1000,
            textWrap: 'balance',
          }}>
            Global media awareness from Europe to the&nbsp;<span style={{ color: '#C9A24A' }}>Middle East</span>.
          </h2>
          <p style={{
            margin: '28px auto 0',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 22,
            lineHeight: 1.5,
            color: 'rgba(244,239,230,0.7)',
            maxWidth: 760,
            textWrap: 'pretty',
          }}>
            Global media is recognising the success of a new era in private members' clubs for UHNWI &amp; angel investors. Changer is at the forefront of embracing innovation, transforming thinking and nurturing exponential growth.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <article className="cc-reveal cc-clipping" style={{ '--tilt': '-1.2deg' }}>
            <img src="../../assets/press-fortune.png" alt="Fortune — European angel investors have bussed more than 7,500 Ukrainians to safety" style={{ display: 'block', width: '100%', height: 'auto' }} />
          </article>
          <article className="cc-reveal cc-clipping" style={{ '--tilt': '1.5deg', transitionDelay: '160ms' }}>
            <img src="../../assets/press-arabian-business.png" alt="Arabian Business — Revealed: Exclusive European and Swiss clubs for the ultra rich flocking to Dubai" style={{ display: 'block', width: '100%', height: 'auto' }} />
          </article>
        </div>
      </div>
    </section>
  );
}

window.PressFeature = PressFeature;
