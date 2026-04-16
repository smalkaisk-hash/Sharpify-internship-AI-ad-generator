import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import React from 'react';
import { BRAND, FONT_STACK, NumberCounter, Shake } from './primitives';

// Endframe: Sharpify MP Risinājums brand card, price reveal, CTA pulse.
export const Endframe: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgReveal = spring({
    frame: frame - start,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const logoSpring = spring({
    frame: frame - start - 4,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  const priceSpring = spring({
    frame: frame - start - 18,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const ctaPulse = 1 + Math.sin((frame - start - 40) * 0.25) * 0.03;
  const ctaAppear = spring({
    frame: frame - start - 36,
    fps,
    config: { damping: 15, stiffness: 180 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${BRAND.black} 0%, #1a1a1a 100%)`,
        opacity: bgReveal,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        fontFamily: FONT_STACK,
      }}
    >
      {/* Accent diagonal bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.yellow})`,
          transform: `scaleX(${bgReveal})`,
          transformOrigin: 'left',
        }}
      />

      <div
        style={{
          transform: `scale(${logoSpring}) translateY(${(1 - logoSpring) * 30}px)`,
          opacity: logoSpring,
          textAlign: 'center',
          marginBottom: 60,
        }}
      >
        <div
          style={{
            color: BRAND.white,
            fontWeight: 900,
            fontSize: 88,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
          }}
        >
          Sharpify
        </div>
        <div
          style={{
            color: BRAND.accent,
            fontWeight: 700,
            fontSize: 44,
            marginTop: 12,
            letterSpacing: '-0.01em',
          }}
        >
          MP Risinājums
        </div>
      </div>

      {/* Price reveal */}
      <Shake at={18 + start - start} duration={8} amp={6}>
        <div
          style={{
            transform: `scale(${priceSpring})`,
            opacity: priceSpring,
            textAlign: 'center',
            marginBottom: 80,
          }}
        >
          <div
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
              fontSize: 40,
              textDecoration: 'line-through',
              marginBottom: 8,
            }}
          >
            €299
          </div>
          <div
            style={{
              color: BRAND.yellow,
              fontWeight: 900,
              fontSize: 160,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            €<NumberCounter from={299} to={59} start={start + 18} duration={18} />
          </div>
          <div
            style={{
              color: BRAND.white,
              fontWeight: 600,
              fontSize: 36,
              marginTop: 12,
              opacity: interpolate(frame - start, [36, 44], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            + 🎁 Bezmaksas mājaslapa
          </div>
        </div>
      </Shake>

      {/* CTA button */}
      <div
        style={{
          transform: `scale(${ctaAppear * ctaPulse})`,
          opacity: ctaAppear,
          padding: '36px 80px',
          background: BRAND.accent,
          color: BRAND.white,
          fontWeight: 900,
          fontSize: 54,
          borderRadius: 999,
          boxShadow: `0 0 60px ${BRAND.accent}`,
          letterSpacing: '-0.01em',
        }}
      >
        Pieteikties →
      </div>

      <div
        style={{
          marginTop: 40,
          color: BRAND.white,
          fontWeight: 600,
          fontSize: 36,
          opacity: ctaAppear * 0.85,
        }}
      >
        sharpify.io/lv
      </div>
    </AbsoluteFill>
  );
};
