import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import meta from '../../assets/chacalavong/clip-meta.json';
import scenesData from '../../public/chacalavong/scenes-with-perword.json';
import { Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07 } from '../scenes/chacalavong/SceneBlock';

const SCENE_MAP: Record<string, React.FC> = {
  S01_HOOK: Scene01,
  S02_FUNFACT_1_AGE: Scene02,
  S03_FUNFACT_2_NAME: Scene03,
  S04_FUNFACT_3_REVOLUTION: Scene04,
  S05_FUNFACT_4_STREET: Scene05,
  S06_FUNFACT_5_INGREDIENTS: Scene06,
  S07_CTA: Scene07,
};

/** Chả Cá Lã Vọng — 5 funfact mind-blow — pillar D — 75s — pixel-faithful handoff v1.4 */
export const Chacalavong: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Audio src={staticFile(meta.voiceoverFile)} />
      <Audio src={staticFile('audio/bgm-pillarD.mp3')} volume={0.18} />
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
