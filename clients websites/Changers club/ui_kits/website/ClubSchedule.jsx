/* global React */

function ClubSchedule() {
  const middleEast = [
    { date: 'January 15–16, 2026',   place: 'Dubai',    note: 'Mishal Kanoo' },
    { date: 'February 12–13, 2026',  place: 'Dubai',    note: 'John Sanei' },
    { date: 'March 12–13, 2026',     place: 'Dubai' },
    { date: 'April 9–10, 2026',      place: 'Dubai' },
    { date: 'May 7–8, 2026',         place: 'Dubai' },
    { date: 'June 18–19, 2026',      place: 'Istanbul' },
    { date: 'July 16–17, 2026',      place: 'Cyprus' },
    { date: 'September 24–25, 2026', place: 'Dubai' },
    { date: 'October 22–23, 2026',   place: 'Dubai' },
    { date: 'November 19–20, 2026',  place: 'Dubai' },
    { date: 'December 10–11, 2026',  place: 'Dubai' },
  ];

  const europe = [
    { date: 'February 26–27, 2026',  place: 'Monaco' },
    { date: 'March 26–27, 2026',     place: 'Monaco' },
    { date: 'April 23–24, 2026',     place: 'Monaco' },
    { date: 'May 21–22, 2026',       place: 'Monaco' },
    { date: 'September 10–11, 2026', place: 'Monaco' },
    { date: 'October 8–9, 2026',     place: 'Monaco' },
    { date: 'November 5–6, 2026',    place: 'Monaco' },
  ];

  return (
    <section className="cc-reveal" style={{ background: '#000', padding: '128px max(24px, 4vw)', borderTop: '1px solid rgba(244,239,230,0.12)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="cc-reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A', marginBottom: 24 }}>
            20 private gatherings · 2026
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
            Club Schedule&nbsp;<span style={{ color: '#C9A24A' }}>2026</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <ScheduleColumn title="Middle East Chapter" items={middleEast} delay={0} />
          <ScheduleColumn title="European Chapter" items={europe} delay={140} />
        </div>
      </div>
    </section>
  );
}

function ScheduleColumn({ title, items, delay }) {
  return (
    <div className="cc-reveal" style={{ transitionDelay: `${delay || 0}ms` }}>
      <h3 style={{
        margin: 0,
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: 'clamp(26px, 2.6vw, 34px)',
        lineHeight: 1.1,
        color: '#F4EFE6',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>
      <div style={{ borderTop: '1px solid rgba(201,162,74,0.55)' }}>
        {items.map((it, i) => (
          <div key={i} className="cc-schedule-row">
            <span style={{ color: '#C9A24A', fontFamily: "'Inter', sans-serif", fontSize: 18, transition: 'transform 320ms' }} className="cc-arrow">→</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#F4EFE6', lineHeight: 1.35 }}>
              {it.date} — <span style={{ color: 'rgba(244,239,230,0.78)' }}>{it.place}</span>
              {it.note && <span style={{ color: 'rgba(244,239,230,0.55)' }}>, {it.note}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ClubSchedule = ClubSchedule;
