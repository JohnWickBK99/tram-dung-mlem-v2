import './shared/RootShared';
import React from 'react';
import { Composition } from 'remotion';
import { Chuotdong } from './compositions/Chuotdong';
import metaChuotdong from '../assets/chuotdong/clip-meta.json';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={metaChuotdong.slug}
        component={Chuotdong}
        durationInFrames={metaChuotdong.totalFrames}
        fps={metaChuotdong.fps}
        width={metaChuotdong.width}
        height={metaChuotdong.height}
      />
    </>
  );
};
