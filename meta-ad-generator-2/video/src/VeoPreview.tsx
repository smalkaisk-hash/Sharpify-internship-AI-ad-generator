import { AbsoluteFill, Video, staticFile } from 'remotion';
import React from 'react';

export const VeoPreview: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Video
      src={staticFile('video/solar-fall-hook.mp4')}
      muted
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </AbsoluteFill>
);
