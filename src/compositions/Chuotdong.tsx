import React from 'react';
import { AbsoluteFill, Audio, Series, staticFile } from 'remotion';
import meta from '../../assets/chuotdong/clip-meta.json';
import scenesData from '../../public/chuotdong/scenes-with-perword.json';
import { SHOT_MAP, type ShotKey } from '../scenes/chuotdong';

/** Chuột đồng nướng lu An Giang — pillar B — 90s */
export const Chuotdong: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Audio src={staticFile(meta.voiceoverFile)} />
      <Audio src={staticFile('audio/bgm-pillarB.mp3')} volume={0.1} />
      <Series>
        {(scenesData.scenes as Array<{ id: string; shot: string; start: number; end: number }>).map((sc) => {
          const Scene = SHOT_MAP[sc.shot as ShotKey];
          if (!Scene) return null;
          return (
            <Series.Sequence key={sc.id} durationInFrames={sc.end - sc.start}>
              <Scene />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
