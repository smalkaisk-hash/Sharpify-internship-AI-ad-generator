/* global React */

function MemberQuote() {
  return (
    <section className="cc-reveal" style={{ background: '#000', padding: '128px max(24px, 4vw)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A', marginBottom: 32 }}>
          Member · joined at 63
        </div>
        <div style={{ height: 1, background: '#C9A24A', opacity: 0.85, marginBottom: 40 }} />
        <p style={{
          margin: 0,
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(28px, 3vw, 42px)',
          lineHeight: 1.25,
          color: '#F4EFE6',
          textWrap: 'balance',
        }}>
          "I was a partner at Apollo Management in the UK. Became a minister. I had money, yet I felt deeply alone. Since joining Changer, I have listed a $2B AI firm, built Ukraine's biggest charity, and found a true friend. Life changed for me."
        </p>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(244,239,230,0.12)', paddingTop: 20 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 20, color: '#F4EFE6' }}>Brooks Newmark</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.55)' }}>Apollo Management · Former UK Minister · Rezolve NASDAQ $2B</span>
        </div>
      </div>
    </section>
  );
}

window.MemberQuote = MemberQuote;
