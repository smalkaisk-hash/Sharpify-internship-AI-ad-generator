/* global React */

function ProgrammeSteps() {
  const steps = [
    {
      n: 'First',
      h: 'You sit with the people who built what you are building.',
      b: 'Last year we hosted Marc Randolph, co-founder of Netflix. Nobel laureates. First-generation billionaires. New York Times best-selling authors — people who will re-wire your mindset.',
    },
    {
      n: 'Second',
      h: 'Your children enter the same room.',
      b: 'Not a junior programme. The same room. They learn valuations. They learn to hold their own conversations with billionaires. They begin to understand what turning ten million into a billion actually requires.',
    },
    {
      n: 'Third',
      h: 'We invest together.',
      b: 'The club selects and evaluates technology companies as a group. You and your heir make the decisions jointly. Your child learns investments by deploying capital, with you, in real transactions.',
    },
  ];
  return (
    <section id="programme" style={{ background: '#000', padding: '128px max(24px, 4vw)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="cc-programme-intro" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 64, alignItems: 'center', marginBottom: 96 }}>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A', marginBottom: 24 }}>
              The programme
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(34px, 3.6vw, 50px)', lineHeight: 1.1, color: '#F4EFE6', letterSpacing: '-0.015em', textWrap: 'balance' }}>
              Changer is not networking, not mingling.
            </h2>
            <p style={{ margin: '28px 0 0', fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.5, color: 'rgba(244,239,230,0.78)', maxWidth: 540 }}>
              It is an intellectually challenging environment where the wealth creator, the spouse and the children are exposed to the same level of thinking.
            </p>
          </div>
          <div className="cc-reveal" style={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', background: '#1a0f0c' }}>
            <img
              src="assets/programme-couple.jpg"
              alt="A Changer Club member couple at a chapter gathering"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: 24, bottom: 22, fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F4EFE6', opacity: 0.85 }}>
              Chapter gathering · Dubai
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          {steps.map((s, i) => (
            <div key={s.n} className="cc-reveal" style={{ borderTop: '1px solid rgba(201,162,74,0.55)', paddingTop: 28, transitionDelay: `${i * 140}ms` }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 20, color: '#C9A24A', marginBottom: 16 }}>
                {String(i + 1).padStart(2, '0')} · {s.n}
              </div>
              <h3 style={{ margin: '0 0 16px', fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 26, lineHeight: 1.2, color: '#F4EFE6' }}>
                {s.h}
              </h3>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 17, lineHeight: 1.55, color: 'rgba(244,239,230,0.7)' }}>
                {s.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.ProgrammeSteps = ProgrammeSteps;
