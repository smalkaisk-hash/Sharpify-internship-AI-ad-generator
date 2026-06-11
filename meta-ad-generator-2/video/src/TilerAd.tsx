import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import React from 'react';
import {
  BRAND,
  FONT_STACK,
  ClipBg,
  Vignette,
  FlashCut,
  GlitchFlash,
  KineticText,
  CaptionPill,
  NumberCounter,
  ColorSwipe,
  WhipPanMask,
  ProgressBar,
  Shake,
} from './components/primitives';
import { Endframe } from './components/Endframe';

const TilerHook: React.FC = () => {
  const frame = useCurrentFrame();
  // Close-up on grout/tile wipe, zoom-in
  const zoom = interpolate(frame, [0, 90], [1.05, 1.18]);
  return (
    <AbsoluteFill>
      <div style={{ transform: `scale(${zoom})`, width: '100%', height: '100%' }}>
        <ClipBg src="video/tiler-4.mp4" startFrom={20} playbackRate={0.85} />
      </div>
      <Vignette strength={0.9} />
      <FlashCut at={0} duration={5} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
        <Shake at={2} duration={8} amp={3}>
          <KineticText
            words={['Pēdējais', 'objekts', 'beidzas.']}
            start={4}
            perWord={7}
            highlightIdx={[2]}
            highlightColor={BRAND.yellow}
            style={{ fontSize: 150, maxWidth: 980 }}
          />
        </Shake>
        <div
          style={{
            marginTop: 50,
            color: BRAND.white,
            fontFamily: FONT_STACK,
            fontWeight: 700,
            fontSize: 64,
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            textAlign: 'center',
          }}
        >
          Kas nāk pēc tā?
        </div>
      </AbsoluteFill>
      <ProgressBar start={0} duration={90} color={BRAND.accent} />
    </AbsoluteFill>
  );
};

const TilerProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Empty calendar" visual with slots crossing out
  const slots = ['Pirmdiena', 'Otrdiena', 'Trešdiena', 'Ceturtdiena', 'Piektdiena'];

  return (
    <AbsoluteFill style={{ background: '#141414' }}>
      <ClipBg src="video/tiler-5.mp4" startFrom={10} playbackRate={1} />
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.72)' }} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            color: BRAND.white,
            fontFamily: FONT_STACK,
            fontWeight: 900,
            fontSize: 80,
            textAlign: 'center',
            marginBottom: 40,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Nākamā nedēļa:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '80%' }}>
          {slots.map((s, i) => {
            const appear = spring({
              frame: frame - (10 + i * 6),
              fps,
              config: { damping: 14, stiffness: 180 },
            });
            const crossAt = 10 + i * 6 + 14;
            const crossP = interpolate(frame - crossAt, [0, 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={s}
                style={{
                  transform: `translateX(${(1 - appear) * 100}px)`,
                  opacity: appear,
                  padding: '20px 32px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: FONT_STACK,
                  color: BRAND.white,
                  fontSize: 44,
                  fontWeight: 700,
                  position: 'relative',
                }}
              >
                <span>{s}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 36 }}>—</span>
                {/* Strike-through line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    top: '50%',
                    height: 4,
                    background: BRAND.accent,
                    transform: `scaleX(${crossP})`,
                    transformOrigin: 'left',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 50,
            color: BRAND.accent,
            fontFamily: FONT_STACK,
            fontWeight: 900,
            fontSize: 72,
            opacity: interpolate(frame, [75, 90], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            letterSpacing: '-0.02em',
          }}
        >
          TUKŠA.
        </div>
      </AbsoluteFill>
      <WhipPanMask at={140} duration={8} />
    </AbsoluteFill>
  );
};

const TilerProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // iMessage-style message bubbles popping in
  const bubbles = [
    { who: 'Anna K.', text: 'Labdien, vai varat flīzēt vannas istabu?', delay: 0 },
    { who: 'Jānis B.', text: 'Cik maksā 12m² virtuve?', delay: 12 },
    { who: 'Ilze R.', text: 'Varu piezvanīt tūlīt?', delay: 24 },
  ];

  return (
    <AbsoluteFill style={{ background: '#0a0a0a' }}>
      <ClipBg src="video/tiler-1.mp4" startFrom={10} playbackRate={1} />
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.75)' }} />
      <GlitchFlash at={0} duration={5} />

      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: BRAND.yellow,
          fontFamily: FONT_STACK,
          fontWeight: 800,
          fontSize: 48,
          opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Pēc 3 dienām:
      </div>

      <AbsoluteFill
        style={{
          flexDirection: 'column',
          gap: 20,
          padding: '280px 60px 260px',
          justifyContent: 'center',
        }}
      >
        {bubbles.map((b, i) => {
          const s = spring({
            frame: frame - b.delay,
            fps,
            config: { damping: 14, stiffness: 180 },
          });
          return (
            <div
              key={i}
              style={{
                alignSelf: 'flex-start',
                maxWidth: '85%',
                transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,
                opacity: s,
                background: BRAND.white,
                color: BRAND.black,
                padding: '24px 32px',
                borderRadius: 28,
                borderBottomLeftRadius: 8,
                fontFamily: FONT_STACK,
                fontSize: 38,
                fontWeight: 600,
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                lineHeight: 1.25,
              }}
            >
              <div style={{ color: '#888', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
                {b.who}
              </div>
              {b.text}
            </div>
          );
        })}
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: BRAND.white,
          fontFamily: FONT_STACK,
          fontWeight: 900,
          fontSize: 64,
          opacity: interpolate(frame, [50, 65], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          letterSpacing: '-0.02em',
        }}
      >
        Nākamais klients<br />
        <span style={{ color: BRAND.green }}>jau rindā.</span>
      </div>
    </AbsoluteFill>
  );
};

export const TilerAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND.black }}>
      <Sequence from={0} durationInFrames={90}>
        <TilerHook />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <TilerProblem />
      </Sequence>
      <Sequence from={240} durationInFrames={90}>
        <TilerProof />
      </Sequence>
      <Sequence from={330} durationInFrames={90}>
        <Endframe start={0} />
      </Sequence>

      <ColorSwipe at={86} duration={8} color={BRAND.accent} direction="left" />
      <ColorSwipe at={236} duration={8} color={BRAND.yellow} direction="right" />
      <ColorSwipe at={326} duration={8} color={BRAND.black} direction="down" />

      <AbsoluteFill
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"200\\" height=\\"200\\"><filter id=\\"n\\"><feTurbulence baseFrequency=\\"0.9\\" /></filter><rect width=\\"200\\" height=\\"200\\" filter=\\"url(%23n)\\" opacity=\\"0.35\\"/></svg>")',
          opacity: 0.08,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
