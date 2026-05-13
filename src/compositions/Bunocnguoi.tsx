import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import meta from '../../assets/bunocnguoi/clip-meta.json';
import scenesData from '../../public/bunocnguoi/scenes-with-perword.json';
import {
  Scene01, Scene02, Scene03, Scene04, Scene05,
  Scene06, Scene07, Scene08, Scene09, Scene10,
} from '../scenes/bunocnguoi/SceneBlock';

const SCENE_MAP: Record<string, React.FC> = {
  S01_HOOK: Scene01,
  S02_REVEAL: Scene02,
  S03_DAM_BONG: Scene03,
  S04_OC_NHOI: Scene04,
  S05_HERBS: Scene05,
  S06_WHY_NGUOI: Scene06,
  S07_QUAN_BA_LUONG: Scene07,
  S08_QUAN_CO_HUE: Scene08,
  S09_QUAN_O_QUAN_CHUONG: Scene09,
  S10_CTA_BOOKMARK: Scene10,
};

/** Bún Ốc Nguội Hà Nội — 10 scenes long-form 90s · pillar B */
export const Bunocnguoi: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Audio src={staticFile(meta.voiceoverFile)} />
      <Audio src={staticFile('audio/bgm-pillarB.mp3')} volume={0.18} />
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
