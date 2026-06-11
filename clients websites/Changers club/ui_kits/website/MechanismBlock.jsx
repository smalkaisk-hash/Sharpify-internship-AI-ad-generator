/* global React */

function MechanismBlock() {
  return (
    <section className="cc-reveal" style={{
      position: 'relative',
      background: '#000',
      padding: '128px max(24px, 4vw)',
      backgroundImage: "url('../../assets/photo-dubai-gala.webp')",
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.5) 100%)' }} />
      <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A', marginBottom: 28 }}>
          Why families lose 70%
        </div>
        <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.1, color: '#F4EFE6', letterSpacing: '-0.015em' }}>
          Other clubs offer networking and nice champagne to the parents.<br/>
          <em style={{ color: '#C9A24A' }}>The children are not addressed.</em>
        </h2>
        <p style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.55, color: 'rgba(244,239,230,0.78)', maxWidth: 720 }}>
          Children do not take intellectual instruction from their own parents. They never have. Changer is the only place where a full family is taught in the same room, at the same time, by the same legends. That is what alters the seventy-percent number.
        </p>
      </div>
    </section>
  );
}

window.MechanismBlock = MechanismBlock;
