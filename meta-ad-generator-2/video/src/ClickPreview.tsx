import { AbsoluteFill, Video, staticFile } from 'remotion';
import React from 'react';

export const ClickPreview: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Video
      src={staticFile('video/click-recording.webm')}
      muted
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </AbsoluteFill>
);
