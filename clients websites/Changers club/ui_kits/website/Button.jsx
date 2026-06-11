/* global React */
const { useState } = React;

function Button({ children, variant = 'primary', onClick, type = 'button', size = 'md' }) {
  const styles = {
    primary: {
      background: '#C9A24A',
      color: '#1A1208',
      border: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), inset 0 -2px 0 #8E6F2C, 0 8px 24px rgba(201,162,74,.18)',
    },
    ghost: {
      background: 'transparent',
      color: '#F4EFE6',
      border: '1px solid rgba(244,239,230,.45)',
    },
    quiet: {
      background: 'transparent',
      color: '#C9A24A',
      border: 'none',
      padding: 0,
      boxShadow: 'none',
    },
  };
  const sizes = {
    sm: { padding: '10px 18px', fontSize: 13 },
    md: { padding: '15px 28px', fontSize: 15 },
    lg: { padding: '18px 36px', fontSize: 16 },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={(e) => { if (variant==='primary') e.currentTarget.style.background = '#D9B860'; }}
      onMouseLeave={(e) => { if (variant==='primary') e.currentTarget.style.background = '#C9A24A'; }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        letterSpacing: '0.02em',
        borderRadius: 999,
        cursor: 'pointer',
        transition: 'background 320ms cubic-bezier(0.22,0.61,0.36,1), color 320ms',
        ...styles[variant],
        ...sizes[size],
        ...(variant==='quiet' ? { borderRadius: 0 } : {}),
      }}
    >
      {children}
      {variant !== 'quiet' && <span aria-hidden style={{ fontSize: '1.05em', lineHeight: 1, transform: 'translateY(-1px)' }}>→</span>}
    </button>
  );
}

window.Button = Button;
