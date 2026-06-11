/* global React */

function StatRow() {
  const stats = [
    { n: '270+', l: 'Power families' },
    { n: '$25B+', l: 'In joint capital' },
    { n: '10', l: 'New members / month' },
  ];
  return (
    <section className="cc-reveal" style={{ background: '#000', padding: '96px max(24px, 4vw)', borderTop: '1px solid rgba(244,239,230,0.12)', borderBottom: '1px solid rgba(244,239,230,0.12)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 64 }}>
        {stats.map((s, i) => (
          <div key={s.l} className="cc-reveal" style={{ transitionDelay: `${i * 160}ms`, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(72px, 8vw, 120px)', lineHeight: 1, color: '#C9A24A', letterSpacing: '-0.02em' }}>
              {s.n}
            </div>
            <div style={{ marginTop: 16, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.65)' }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

window.StatRow = StatRow;
