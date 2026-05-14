import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import meta from '../../assets/canhcathaibinh/clip-meta.json';
import scenesData from '../../public/canhcathaibinh/scenes-with-perword.json';
import {
  Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07,
} from '../scenes/canhcathaibinh/SceneBlock';

const SCENE_MAP: Record<string, React.FC> = {
  S01_HOOK: Scene01,
  S02_LICH_SU: Scene02,
  S03_DAC_SAC_BANH_DA: Scene03,
  S04_DAC_SAC_CA_RO_DONG: Scene04,
  S05_CHE_BIEN: Scene05,
  S06_DIA_CHI: Scene06,
  S07_KET_BAI: Scene07,
};

/** Canh Cá Quỳnh Côi — 7 scenes long-form 90s · pillar B amber documentary */
export const Canhcathaibinh: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Audio src={staticFile(meta.voiceoverFile)} />
      <Audio src={staticFile('audio/bgm-pillarB.mp3')} volume={0.16} />
      {(scenesData.scenes as Array<{ id: string; start: number; end: number }>).map((sc) => {
        const Comp = SCENE_MAP[sc.id];
        if (!Comp) return null;
        const dur = sc.end - sc.start;
        if (dur <= 0) return null;
        return (
          <Sequence key={sc.id} from={sc.start} durationInFrames={dur} layout="none">
            <Comp />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
