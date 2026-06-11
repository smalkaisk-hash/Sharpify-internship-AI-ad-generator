/* global React, Button */
const { useState: useState_AF, useEffect: useEffect_AF } = React;

function ApplicationForm({ isOpen, onClose, onApply }) {
  const [step, setStep] = useState_AF(0);
  const isModal = isOpen !== undefined;

  useEffect_AF(() => {
    if (!isModal || !isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, isModal, onClose]);

  if (isModal && !isOpen) return null;

  const inner = (
    <div
      onClick={isModal ? (e) => e.stopPropagation() : undefined}
      style={{
        position: 'relative',
        width: '100%', maxWidth: 720,
        ...(isModal ? {
          background: '#0a0805',
          border: '1px solid rgba(201,162,74,0.45)',
          padding: '64px 56px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,162,74,0.12)',
        } : {
          margin: '0 auto',
        }),
      }}
    >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 24, right: 28,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", fontSize: 22,
            color: 'rgba(244,239,230,0.45)', lineHeight: 1,
            transition: 'color 240ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C9A24A'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,239,230,0.45)'}
          aria-label="Close"
        >×</button>

        {step === 1 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ height: 1, background: '#C9A24A', width: 60, margin: '0 auto 40px' }} />
            <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15, color: '#F4EFE6' }}>
              Application received.<br />We will be in touch.
            </h2>
            <div style={{ marginTop: 40 }}>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A24A', marginBottom: 20 }}>
              Qualification
            </div>
            <h2 style={{ margin: '0 0 12px', fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.1, color: '#F4EFE6', letterSpacing: '-0.015em' }}>
              Five million liquid minimum and a clear reputation.<br />
              <em style={{ color: '#C9A24A' }}>We will tell you honestly on the call.</em>
            </h2>
            <p style={{ margin: '16px 0 40px', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, lineHeight: 1.6, color: 'rgba(244,239,230,0.65)' }}>
              We admit just fifty families a year across Monaco and Dubai. We have said no to applicants with considerably more, when the fit was wrong.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setStep(1); }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px 28px' }}
            >
              {[
                { id: 'name',  label: 'Full name',     type: 'text',  placeholder: 'Jonas Rolo' },
                { id: 'email', label: 'Private email', type: 'email', placeholder: 'jonas@…' },
              ].map(f => (
                <label key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.55)' }}>{f.label}</span>
                  <input
                    required type={f.type} placeholder={f.placeholder}
                    onFocus={e => e.target.style.borderBottomColor = '#C9A24A'}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(244,239,230,0.25)'}
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#F4EFE6', background: 'transparent', border: 0, borderBottom: '1px solid rgba(244,239,230,0.25)', padding: '10px 0', outline: 'none', transition: 'border-color 320ms' }}
                  />
                </label>
              ))}
              {[
                { label: 'Liquid assets',     opts: ['$5 – $10M', '$10 – $20M', '$20M+'] },
                { label: 'Preferred chapter', opts: ['Monaco', 'Dubai'] },
              ].map(f => (
                <label key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.55)' }}>{f.label}</span>
                  <select required defaultValue="" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#F4EFE6', background: 'transparent', border: 0, borderBottom: '1px solid rgba(244,239,230,0.25)', padding: '10px 0', outline: 'none' }}>
                    <option value="" disabled style={{ background: '#0a0a0a' }}>—</option>
                    {f.opts.map(o => <option key={o} style={{ background: '#0a0a0a' }}>{o}</option>)}
                  </select>
                </label>
              ))}
              <div style={{ gridColumn: '1 / -1', marginTop: 16 }}>
                <Button type="submit" size="lg">Send application</Button>
              </div>
            </form>
          </>
        )}
      </div>
  );

  if (isModal) {
    return (
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', overflowY: 'auto',
      }}>
        {inner}
      </div>
    );
  }

  return (
    <section id="apply" className="cc-reveal" style={{ background: '#000', padding: '72px max(24px, 4vw) 120px', textAlign: 'center' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 1.05, color: '#F4EFE6', letterSpacing: '-0.02em' }}>
          Request Your Invitation<br />Only 10 Families per Region
        </h2>
        <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(22px, 2.4vw, 32px)', lineHeight: 1.4, color: '#F4EFE6' }}>
          We don't accept everyone –{' '}
          <em style={{ color: '#C9A24A' }}>and that's precisely the point.</em>
        </p>
        <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.65, color: 'rgba(244,239,230,0.72)', maxWidth: 740 }}>
          Changer is intentionally kept intimate, welcoming only 10 new families per region each month.
        </p>
        <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.65, color: 'rgba(244,239,230,0.72)', maxWidth: 800 }}>
          Membership is reserved for those with a minimum of 5M$ (20M AED) in liquid assets, and access is granted through reputation check and interview.
        </p>
        <p style={{ margin: '4px 0 8px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 17, lineHeight: 1.5, color: '#F4EFE6' }}>
          Apply now to step into your next chapter — where wealth finally feels alive.
        </p>
        <Button size="lg" onClick={onApply}>See If You Qualify</Button>
        <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: '0.06em', color: 'rgba(244,239,230,0.45)' }}>
          Only 10 members per month
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{ color: '#C9A24A', fontSize: 22, letterSpacing: 3 }}>★★★★★</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,239,230,0.45)' }}>
            270+ High-Net Members
          </div>
        </div>
      </div>
    </section>
  );
}

window.ApplicationForm = ApplicationForm;
