/* global React, Button */
const { useEffect, useState: useState_Nav } = React;

function Nav({ onApply }) {
  const [scrolled, setScrolled] = useState_Nav(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px max(24px, 4vw)',
        background: '#000',
        borderBottom: scrolled ? '1px solid rgba(201,162,74,0.55)' : '1px solid transparent',
        transition: 'border-color 320ms',
      }}
    >
      <a href="./index.html" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="../../assets/logo-changer-white.webp" alt="Changer — Be wealthy, not just rich" style={{ height: 52, width: 'auto', display: 'block' }} />
      </a>
      <Button size="sm" onClick={onApply}>Apply</Button>
    </nav>
  );
}

window.Nav = Nav;
