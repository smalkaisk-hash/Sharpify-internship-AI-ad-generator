import {
  AbsoluteFill,
  Sequence,
  Video,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import React from 'react';
import {
  BRAND,
  FONT_DISPLAY,
  FONT_UI,
  KineticText,
  GlitchFlash,
  ColorSwipe,
  ProgressBar,
  Shake,
  NumberCounter,
} from './components/primitives';
import { Endframe } from './components/Endframe';

// 420 frames @ 30fps = 14s
// 0-90     (3s)  HOOK — Veo fall clip, ends freeze-frame mid-fall
// 90-150   (2s)  PIVOT — hard cut to black, empathy line
// 150-330  (6s)  PRODUCT — laptop mockup of sharpify.io/lv, cursor click
// 330-420  (3s)  CTA endframe

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  // Subtle zoom + shake near the end as fall intensifies
  const zoom = interpolate(frame, [0, 90], [1.02, 1.12]);
  const shake = frame > 60 ? Math.sin(frame * 2) * ((frame - 60) / 30) * 12 : 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <div style={{ transform: `scale(${zoom}) translate(${shake}px, ${shake * 0.6}px)`, width: '100%', height: '100%' }}>
        <Video
          src={staticFile('video/solar-fall-hook.mp4')}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Freeze-frame grain intensifies near end */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          opacity: interpolate(frame, [0, 90], [0.4, 0.8]),
        }}
      />

      {/* Recording timecode HUD — UGC phone-feed realism */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: FONT_UI,
          fontWeight: 700,
          fontSize: 32,
          color: '#fff',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: '#ff2020',
            opacity: Math.floor(frame / 10) % 2,
            boxShadow: '0 0 12px #ff2020',
          }}
        />
        REC 00:0{Math.min(2, Math.floor(frame / 30))}
      </div>
    </AbsoluteFill>
  );
};

const Pivot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #1a1a1a 0%, ${BRAND.black} 70%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Subtle mesh overlay */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 15% 15%, rgba(232,213,0,0.08) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(232,213,0,0.05) 0%, transparent 40%)',
        }}
      />

      <Shake at={0} duration={8} amp={6}>
        <KineticText
          words={['Kritiens', 'biznesā', 'izskatās', 'savādāk.']}
          start={0}
          perWord={5}
          highlightIdx={[0]}
          highlightColor={BRAND.yellow}
          style={{ fontSize: 120, maxWidth: 960 }}
        />
      </Shake>

      <div
        style={{
          marginTop: 48,
          fontFamily: FONT_UI,
          fontWeight: 500,
          fontSize: 48,
          color: 'rgba(255,255,255,0.75)',
          textAlign: 'center',
          letterSpacing: '-0.01em',
          opacity: interpolate(frame, [28, 44], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Tukšs kalendārs. Zvani, kas nepienāk.
      </div>
    </AbsoluteFill>
  );
};

// Laptop mockup with sharpify.io/lv screenshot + realistic cursor click.
const LaptopProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing inside this scene (frame 0 = scene start, total 180 frames @ 30fps = 6s)
  const LAPTOP_APPEAR = 0;
  const CURSOR_START = 25;
  const CURSOR_END = 95; // ~2.3s of cursor travel
  const HOVER_START = 95;
  const CLICK_FRAME = 112; // brief dwell before click
  const MODAL_START = 122; // page reacts to click

  const appear = spring({
    frame: frame - LAPTOP_APPEAR,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.9 },
  });

  // Cursor path: curved bezier from lower-center → top-right "Pieslēgties".
  // Use three control points so motion feels human: accel → overshoot → settle.
  const t = interpolate(frame - CURSOR_START, [0, CURSOR_END - CURSOR_START], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Ease-out cubic for decelerating approach.
  const eased = 1 - Math.pow(1 - t, 3);
  // Quadratic bezier: P0=start, P1=control (curves up and right), P2=target.
  const P0 = { x: 48, y: 82 };
  const P1 = { x: 72, y: 48 };
  const P2 = { x: 88.5, y: 11.5 };
  const u = eased;
  const bx =
    (1 - u) * (1 - u) * P0.x + 2 * (1 - u) * u * P1.x + u * u * P2.x;
  const by =
    (1 - u) * (1 - u) * P0.y + 2 * (1 - u) * u * P1.y + u * u * P2.y;

  // Tiny overshoot-settle at the end for realism.
  const settle = spring({
    frame: frame - CURSOR_END,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  const overshoot = interpolate(settle, [0, 1], [-1.2, 0]);
  const cursorX = bx + overshoot;
  const cursorY = by + overshoot * 0.2;

  // Hover state: button brightens once cursor arrives.
  const hoverEnergy = interpolate(frame, [HOVER_START, HOVER_START + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Click: button presses down briefly, ripple expands.
  const clickPress = interpolate(
    frame,
    [CLICK_FRAME - 2, CLICK_FRAME, CLICK_FRAME + 6, CLICK_FRAME + 12],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const ripple = spring({
    frame: frame - CLICK_FRAME,
    fps,
    config: { damping: 11, stiffness: 200 },
  });
  const rippleOpacity = interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 30], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Login modal: dims the page + shows a mini login card sliding in.
  const modal = spring({
    frame: frame - MODAL_START,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #0f0f0f 0%, ${BRAND.black} 100%)`,
      }}
    >
      {/* Gradient mesh highlight */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(232,213,0,0.18) 0%, transparent 45%), radial-gradient(ellipse at 80% 90%, rgba(255,70,40,0.1) 0%, transparent 40%)',
        }}
      />

      {/* Headline above laptop */}
      <div
        style={{
          position: 'absolute',
          top: '6%',
          left: 0,
          right: 0,
          padding: '0 60px',
          textAlign: 'center',
          opacity: interpolate(frame, [10, 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [10, 30], [24, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontStyle: 'italic',
            fontSize: 90,
            color: '#fff',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          Tā vietā —
        </div>
        <div
          style={{
            fontFamily: FONT_UI,
            fontWeight: 800,
            fontSize: 58,
            color: BRAND.yellow,
            marginTop: 16,
            letterSpacing: '-0.01em',
          }}
        >
          viens klikšķis.
        </div>
      </div>

      {/* Laptop — CSS-only */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 900,
          transform: `translate(-50%, 0) translateY(${(1 - appear) * 120}px) scale(${0.92 + appear * 0.08}) perspective(1200px) rotateX(4deg)`,
          opacity: appear,
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 10',
            background: '#000',
            borderRadius: 18,
            padding: 16,
            border: '3px solid #333',
            boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.05)',
          }}
        >
          {/* Inner viewport (holds screenshot + cursor + interaction layers) */}
          <div
            style={{
              position: 'absolute',
              inset: 16,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <Img
              src={staticFile('images/sharpify-site-hero.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Hover highlight — subtle glow that arrives with the cursor */}
            <div
              style={{
                position: 'absolute',
                top: `${7.5}%`,
                left: `${80.5}%`,
                width: `${16.5}%`,
                height: `${8}%`,
                borderRadius: 10,
                background: `rgba(232,213,0,${0.2 * hoverEnergy - 0.1 * clickPress})`,
                outline: `${2 + hoverEnergy * 2}px solid rgba(232,213,0,${
                  hoverEnergy * 0.9
                })`,
                outlineOffset: 2,
                transform: `scale(${1 - clickPress * 0.05})`,
                boxShadow: `0 0 ${20 + hoverEnergy * 30}px rgba(232,213,0,${
                  hoverEnergy * 0.7
                })`,
                transition: 'none',
                pointerEvents: 'none',
                opacity: 1 - modal * 0.9,
              }}
            />

            {/* Click ripple */}
            <div
              style={{
                position: 'absolute',
                top: `${11.5}%`,
                left: `${88.5}%`,
                width: 140,
                height: 140,
                marginLeft: -70,
                marginTop: -70,
                border: `4px solid ${BRAND.yellow}`,
                borderRadius: '50%',
                opacity: rippleOpacity * ripple * 0.9,
                transform: `scale(${0.1 + ripple * 1.6})`,
                pointerEvents: 'none',
              }}
            />

            {/* Cursor arrow */}
            <div
              style={{
                position: 'absolute',
                top: `${cursorY}%`,
                left: `${cursorX}%`,
                transform: `translate(-18%, -8%) scale(${1 - clickPress * 0.18})`,
                width: 50,
                height: 50,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.7))',
                pointerEvents: 'none',
                zIndex: 4,
                opacity: 1 - modal * 0.6,
              }}
            >
              <svg viewBox="0 0 32 32" width="50" height="50">
                <path
                  d="M5 3 L5 25 L11 19 L16 29 L20 27 L15 17 L23 17 Z"
                  fill="#ffffff"
                  stroke="#000"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Login modal overlay — page reaction to the click */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0,0,0,${modal * 0.65})`,
                opacity: modal,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '65%',
                transform: `translate(-50%, -50%) translateY(${(1 - modal) * 30}px) scale(${0.92 + modal * 0.08})`,
                opacity: modal,
                background: '#111',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: '28px 32px',
                fontFamily: FONT_UI,
                color: '#fff',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                Pieslēgties
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.55)',
                  marginBottom: 18,
                }}
              >
                Ienāc savā Sharpify kontā
              </div>
              <div
                style={{
                  height: 32,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  marginBottom: 10,
                  fontSize: 12,
                  padding: '8px 10px',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                e-pasts@sharpify.io
              </div>
              <div
                style={{
                  height: 32,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  marginBottom: 14,
                  fontSize: 12,
                  padding: '8px 10px',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                ••••••••
              </div>
              <div
                style={{
                  height: 36,
                  background: BRAND.yellow,
                  color: '#000',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Ienākt
              </div>
            </div>
          </div>
        </div>

        {/* Laptop bottom base */}
        <div
          style={{
            width: '112%',
            height: 28,
            marginLeft: '-6%',
            background: 'linear-gradient(180deg, #2a2a2a 0%, #141414 100%)',
            borderRadius: '0 0 40px 40px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 8,
              background: '#0a0a0a',
              borderRadius: '0 0 10px 10px',
            }}
          />
        </div>
      </div>

      {/* Stat ticker below laptop */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT_UI,
          fontWeight: 700,
          fontSize: 48,
          color: BRAND.white,
          opacity: interpolate(frame, [120, 140], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          letterSpacing: '-0.01em',
        }}
      >
        Jau <span style={{ color: BRAND.yellow }}>
          <NumberCounter from={0} to={320} start={120} duration={40} />+
        </span>{' '}
        uzņēmumi
      </div>
    </AbsoluteFill>
  );
};

export const FallHookAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND.black }}>
      <Sequence from={0} durationInFrames={90}>
        <Hook />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <Pivot />
      </Sequence>
      <Sequence from={150} durationInFrames={180}>
        <LaptopProduct />
      </Sequence>
      <Sequence from={330} durationInFrames={90}>
        <Endframe start={0} />
      </Sequence>

      {/* Hard cut transitions — no white flashes */}
      <ColorSwipe at={86} duration={8} color={BRAND.black} direction="up" />
      <ColorSwipe at={146} duration={8} color={BRAND.yellow} direction="right" />
      <ColorSwipe at={326} duration={8} color={BRAND.accent} direction="down" />

      {/* Global film grain */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"200\\" height=\\"200\\"><filter id=\\"n\\"><feTurbulence baseFrequency=\\"0.9\\" /></filter><rect width=\\"200\\" height=\\"200\\" filter=\\"url(%23n)\\" opacity=\\"0.35\\"/></svg>")',
          opacity: 0.09,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Progress bar across whole video */}
      <ProgressBar start={0} duration={420} color={BRAND.yellow} height={6} y="1.5%" />
    </AbsoluteFill>
  );
};
