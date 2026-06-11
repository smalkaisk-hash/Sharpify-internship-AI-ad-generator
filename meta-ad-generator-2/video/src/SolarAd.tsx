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

// 420 frames total. 30fps.
// Scene 1 HOOK 0-90 (3s)
// Scene 2 PROBLEM 90-240 (5s)
// Scene 3 PROOF 240-330 (3s)
// Scene 4 CTA 330-420 (3s)

const SolarHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Zoom + slow shake for tension
  const zoom = interpolate(frame, [0, 90], [1.0, 1.12]);
  const shake = Math.sin(frame * 0.8) * 2;
  return (
    <AbsoluteFill>
      <div style={{ transform: `scale(${zoom}) translate(${shake}px, 0)`, width: '100%', height: '100%' }}>
        <ClipBg src="video/solar-5.mp4" startFrom={0} playbackRate={0.9} />
      </div>
      <Vignette strength={0.7} />
      <FlashCut at={0} duration={6} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
        <Shake at={2} duration={10} amp={4}>
          <KineticText
            words={['Vai', 'Tavs', 'telefons', 'klusē?']}
            start={4}
            perWord={7}
            highlightIdx={[2, 3]}
            highlightColor={BRAND.yellow}
            style={{ fontSize: 130, maxWidth: 900 }}
          />
        </Shake>
      </AbsoluteFill>
      {/* Pulse red tick counter in corner */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          right: 80,
          padding: '14px 28px',
          background: BRAND.accent,
          color: BRAND.white,
          fontFamily: FONT_STACK,
          fontWeight: 800,
          fontSize: 36,
          borderRadius: 8,
          opacity: Math.floor(frame / 8) % 2,
        }}
      >
        ● 0 zvani šodien
      </div>
      <ProgressBar start={0} duration={90} color={BRAND.accent} />
    </AbsoluteFill>
  );
};

const SolarProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame; // this sequence is already offset by parent
  // Split screen: left = solar installer, right = money burning
  const splitAppear = spring({ frame: local, fps: 30, config: { damping: 14, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ background: BRAND.black }}>
      {/* Left half */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(0 0, ${50 * splitAppear}% 0, ${50 * splitAppear - 4}% 100%, 0 100%)`,
        }}
      >
        <ClipBg src="video/solar-1.mp4" startFrom={10} playbackRate={1} />
        <AbsoluteFill style={{ background: 'rgba(0,0,0,0.35)' }} />
      </AbsoluteFill>
      {/* Right half */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(${100 - 50 * splitAppear}% 0, 100% 0, 100% 100%, ${
            100 - 50 * splitAppear + 4
          }% 100%)`,
        }}
      >
        <ClipBg src="video/solar-4.mp4" startFrom={20} playbackRate={1.1} />
        <AbsoluteFill style={{ background: 'rgba(255,0,40,0.25)' }} />
      </AbsoluteFill>

      {/* Dividing line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 6,
          background: BRAND.yellow,
          transform: `translateX(-50%) scaleY(${splitAppear})`,
          boxShadow: `0 0 40px ${BRAND.yellow}`,
        }}
      />

      {/* Labels */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <CaptionPill
          text="Google Ads"
          start={6}
          duration={140}
          bg={BRAND.white}
          color={BRAND.black}
          style={{
            position: 'absolute',
            left: '5%',
            top: '10%',
            fontSize: 42,
          }}
        />
        <CaptionPill
          text="€8 par kliku"
          start={14}
          duration={130}
          bg={BRAND.accent}
          color={BRAND.white}
          style={{
            position: 'absolute',
            left: '5%',
            top: '22%',
            fontSize: 42,
          }}
        />
        <CaptionPill
          text="Sharpify"
          start={10}
          duration={140}
          bg={BRAND.yellow}
          color={BRAND.black}
          style={{
            position: 'absolute',
            right: '5%',
            top: '10%',
            fontSize: 42,
          }}
        />
        <CaptionPill
          text="Karsti līdi"
          start={18}
          duration={130}
          bg={BRAND.green}
          color={BRAND.white}
          style={{
            position: 'absolute',
            right: '5%',
            top: '22%',
            fontSize: 42,
          }}
        />
      </AbsoluteFill>

      {/* Bottom big headline */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 140,
        }}
      >
        <KineticText
          words={['Beidz', 'maksāt', 'par', 'klikiem.']}
          start={30}
          perWord={5}
          highlightIdx={[0, 1]}
          highlightColor={BRAND.yellow}
          style={{ fontSize: 96, maxWidth: 900 }}
        />
      </AbsoluteFill>

      <WhipPanMask at={140} duration={8} />
    </AbsoluteFill>
  );
};

const SolarProof: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BRAND.black }}>
      <ClipBg src="video/solar-3.mp4" startFrom={5} playbackRate={1} />
      <Vignette strength={0.75} />
      <GlitchFlash at={0} duration={5} />

      {/* Stat card */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            background: BRAND.white,
            padding: '48px 64px',
            borderRadius: 28,
            fontFamily: FONT_STACK,
            textAlign: 'center',
            transform: `scale(${spring({ frame: frame - 4, fps: 30, config: { damping: 12, stiffness: 200 } })})`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ color: '#666', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            Vidēji par līdi
          </div>
          <div
            style={{
              color: BRAND.accent,
              fontSize: 180,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            €<NumberCounter from={40} to={7} start={10} duration={30} />
          </div>
          <div style={{ color: BRAND.black, fontSize: 40, fontWeight: 800, marginTop: 8 }}>
            ar AI mērķēšanu
          </div>
        </div>
      </AbsoluteFill>

      {/* Bottom ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: BRAND.yellow,
          fontFamily: FONT_STACK,
          fontWeight: 800,
          fontSize: 44,
          opacity: interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        ● Dienā vidēji 3-5 jauni klienti
      </div>
    </AbsoluteFill>
  );
};

export const SolarAd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BRAND.black }}>
      <Sequence from={0} durationInFrames={90}>
        <SolarHook />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <SolarProblem />
      </Sequence>
      <Sequence from={240} durationInFrames={90}>
        <SolarProof />
      </Sequence>
      <Sequence from={330} durationInFrames={90}>
        <Endframe start={0} />
      </Sequence>

      {/* Global transitions between sequences */}
      <ColorSwipe at={86} duration={8} color={BRAND.accent} direction="right" />
      <ColorSwipe at={236} duration={8} color={BRAND.yellow} direction="left" />
      <ColorSwipe at={326} duration={8} color={BRAND.black} direction="up" />

      {/* Subtle film grain */}
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
