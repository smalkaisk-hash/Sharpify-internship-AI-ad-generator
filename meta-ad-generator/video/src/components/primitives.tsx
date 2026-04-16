import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Video,
  Img,
  staticFile,
  Sequence,
} from 'remotion';
import React from 'react';
import { loadFont as loadInstrument } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

loadInstrument();
loadGrotesk();

export const BRAND = {
  black: '#0a0a0a',
  white: '#FAFAFA',
  accent: '#FF3B1C',
  yellow: '#E8D500',
  green: '#22C55E',
};

// Display for headlines (editorial serif), Grotesk for UI/body.
export const FONT_DISPLAY =
  '"Instrument Serif", "Playfair Display", Georgia, serif';
export const FONT_UI =
  '"Space Grotesk", "Helvetica Neue", system-ui, sans-serif';
// Backwards-compat alias used by older components.
export const FONT_STACK = FONT_UI;

// Background video clip that auto-plays + covers.
export const ClipBg: React.FC<{ src: string; startFrom?: number; playbackRate?: number }> = ({
  src,
  startFrom = 0,
  playbackRate = 1,
}) => (
  <AbsoluteFill style={{ background: BRAND.black }}>
    <Video
      src={staticFile(src)}
      startFrom={startFrom}
      playbackRate={playbackRate}
      muted
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </AbsoluteFill>
);

// Dark gradient overlay for text legibility.
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(0,0,0,${strength * 0.9}) 0%, rgba(0,0,0,${
        strength * 0.2
      }) 35%, rgba(0,0,0,${strength * 0.2}) 65%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

// Inky-black cut (replaces cheap white flash). Quick dark-to-clear fade.
export const FlashCut: React.FC<{ at?: number; duration?: number; color?: string }> = ({
  at = 0,
  duration = 6,
  color = BRAND.black,
}) => {
  const frame = useCurrentFrame();
  const delta = frame - at;
  if (delta < 0 || delta > duration) return null;
  const opacity = 1 - delta / duration;
  return <AbsoluteFill style={{ background: color, opacity }} />;
};

// Glitch: quick RGB-shift + displacement flicker.
export const GlitchFlash: React.FC<{ at: number; duration?: number }> = ({
  at,
  duration = 6,
}) => {
  const frame = useCurrentFrame();
  const delta = frame - at;
  if (delta < 0 || delta > duration) return null;
  const opacity = interpolate(delta, [0, duration * 0.5, duration], [0.8, 0.6, 0]);
  const shift = Math.sin(delta * 6) * 30;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'screen' }}>
      <AbsoluteFill
        style={{
          background: 'rgba(255,0,80,0.5)',
          transform: `translateX(${shift}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: 'rgba(0,220,255,0.5)',
          transform: `translateX(${-shift}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Kinetic typography — each word pops in with spring.
export const KineticText: React.FC<{
  words: string[];
  start?: number;
  perWord?: number;
  style?: React.CSSProperties;
  highlightIdx?: number[];
  highlightColor?: string;
}> = ({
  words,
  start = 0,
  perWord = 6,
  style,
  highlightIdx = [],
  highlightColor = BRAND.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 400,
        fontStyle: 'italic',
        color: BRAND.white,
        textAlign: 'center',
        lineHeight: 1.0,
        letterSpacing: '-0.02em',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.25em',
        ...style,
      }}
    >
      {words.map((w, i) => {
        const wordStart = start + i * perWord;
        const s = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 12, stiffness: 180, mass: 0.6 },
        });
        const scale = 0.6 + s * 0.4;
        const op = Math.min(1, s * 1.4);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `scale(${scale})`,
              opacity: op,
              color: highlightIdx.includes(i) ? highlightColor : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Slide-up subtitle / caption pill.
export const CaptionPill: React.FC<{
  text: string;
  start?: number;
  duration?: number;
  bg?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, start = 0, duration = 60, bg = BRAND.yellow, color = BRAND.black, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({
    frame: frame - start,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const exit = Math.min(1, Math.max(0, (start + duration - frame) / 6));
  const vis = Math.min(appear, exit);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '18px 40px',
        background: bg,
        color,
        fontFamily: FONT_STACK,
        fontWeight: 800,
        fontSize: 54,
        borderRadius: 18,
        letterSpacing: '-0.01em',
        transform: `translateY(${(1 - vis) * 60}px) scale(${0.9 + vis * 0.1})`,
        opacity: vis,
        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Number counter with spring.
export const NumberCounter: React.FC<{
  from: number;
  to: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from, to, start = 0, duration = 40, prefix = '', suffix = '', style }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - start, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - progress, 3);
  const value = Math.round(from + (to - from) * eased);
  return (
    <span style={style}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
};

// Full-screen color swipe transition.
export const ColorSwipe: React.FC<{ at: number; duration?: number; color?: string; direction?: 'left' | 'right' | 'up' | 'down' }> = ({
  at,
  duration = 8,
  color = BRAND.accent,
  direction = 'right',
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, duration / 2, duration], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'up' ? -1 : 1;
  const pos = (1 - p) * 100 * sign;
  return (
    <AbsoluteFill
      style={{
        background: color,
        transform: `translate${axis}(${pos}%)`,
      }}
    />
  );
};

// Whip-pan: shake + blur motion between scenes.
export const WhipPanMask: React.FC<{ at: number; duration?: number }> = ({ at, duration = 5 }) => {
  const frame = useCurrentFrame();
  const delta = frame - at;
  if (delta < 0 || delta > duration) return null;
  const blur = interpolate(delta, [0, duration / 2, duration], [0, 40, 0]);
  const rot = interpolate(delta, [0, duration / 2, duration], [0, 6, 0]);
  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${blur}px)`,
        transform: `rotate(${rot}deg) scale(1.1)`,
        background: 'rgba(0,0,0,0.3)',
      }}
    />
  );
};

// Progress bar wiping horizontally.
export const ProgressBar: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  height?: number;
  y?: string;
}> = ({ start = 0, duration = 60, color = BRAND.accent, height = 10, y = '6%' }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        width: `${p * 100}%`,
        height,
        background: color,
        boxShadow: `0 0 24px ${color}`,
      }}
    />
  );
};

// Shake container — used on impact.
export const Shake: React.FC<{ at: number; duration?: number; amp?: number; children: React.ReactNode }> = ({
  at,
  duration = 6,
  amp = 10,
  children,
}) => {
  const frame = useCurrentFrame();
  const delta = frame - at;
  let x = 0;
  let y = 0;
  if (delta >= 0 && delta <= duration) {
    const decay = 1 - delta / duration;
    x = Math.sin(delta * 4) * amp * decay;
    y = Math.cos(delta * 3) * amp * decay;
  }
  return <div style={{ transform: `translate(${x}px, ${y}px)` }}>{children}</div>;
};
