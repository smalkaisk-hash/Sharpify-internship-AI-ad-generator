/* global React */

function PhotoGallery() {
  // Editorial 3-up: tall portrait + two stacked landscapes. Real Changer events.
  return (
    <section className="cc-reveal" style={{ background: '#000', padding: '128px max(24px, 4vw)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A', marginBottom: 18 }}>
              The room
            </div>
            <h2 style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(40px, 5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: '#F4EFE6',
              maxWidth: 720,
              textWrap: 'balance',
            }}>
              Three nights a year. The same fifty families.
            </h2>
          </div>
        </div>

        <div className="cc-tumble-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, height: 720 }}>
          <div className="cc-photo cc-tumble cc-tumble-1" style={{ height: '100%' }}>
            <img src="../../assets/photo-step-and-repeat.webp" alt="Members at the Changer Club step-and-repeat" />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
            <div className="cc-photo cc-tumble cc-tumble-2">
              <img src="../../assets/photo-dinner-laughter.webp" alt="Members in conversation at a Changer Club dinner" />
            </div>
            <div className="cc-photo cc-tumble cc-tumble-3">
              <img src="../../assets/photo-reception-laughter.webp" alt="Members at a Changer Club reception" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.PhotoGallery = PhotoGallery;
