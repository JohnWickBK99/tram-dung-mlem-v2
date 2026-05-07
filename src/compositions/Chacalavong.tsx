import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import meta from '../../assets/chacalavong/clip-meta.json';
import scenesData from '../../public/chacalavong/scenes-with-perword.json';
import manifest from '../../public/chacalavong/_manifest.json';
import { SceneBlock, type DeclarativeScene } from '../shared/SceneBlock';

const SFX_AVAILABLE = ['pop-sticker.mp3', 'whoosh-transition.mp3', 'impact-hook.mp3', 'chime-fact.mp3', 'mlem-sting.mp3'];

export const Chacalavong: React.FC = () => {
  const scenes = scenesData.scenes as unknown as DeclarativeScene[];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Audio src={staticFile(meta.voiceoverFile)} />
      <Audio src={staticFile('audio/bgm-pillarD.mp3')} volume={0.18} />
      {scenes.map((sc) => {
        const dur = sc.end - sc.start;
        if (dur <= 0) return null;
        const sceneWithDur = { ...sc, durFrames: dur };
        return (
          <Sequence key={sc.id} from={sc.start} durationInFrames={dur} layout="none">
            <SceneBlock scene={sceneWithDur} slug="chacalavong" pillar="d" manifest={manifest as never} sfxAvailable={SFX_AVAILABLE} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
