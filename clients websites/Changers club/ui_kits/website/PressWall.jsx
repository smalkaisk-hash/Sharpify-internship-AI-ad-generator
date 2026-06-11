/* global React */

function PressWall() {
  const logos = [
    { name: 'Fortune', style: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, fontSize: 44 } },
    { name: 'BUSINESS INSIDER', style: { fontFamily: "'Anton', sans-serif", letterSpacing: '0.04em', fontSize: 36 } },
    { name: 'NEBELSPALTER', style: { fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em', fontSize: 36 } },
    { name: 'Khaleej Times', style: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 44 } },
  ];
  return (
    <section style={{ background: '#000', padding: '64px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto 28px', padding: '0 max(24px, 4vw)' }}>
        <div style={{ height: 1, background: '#C9A24A', opacity: 0.85 }} />
      </div>
      <div className="cc-marquee-track" style={{ alignItems: 'center' }}>
        {[...logos, ...logos, ...logos].map((l, i) => (
          <div key={i} style={{ color: '#F4EFE6', opacity: 0.8, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', height: 60, lineHeight: 1, ...l.style }}>{l.name}</div>
        ))}
      </div>
    </section>
  );
}

window.PressWall = PressWall;
