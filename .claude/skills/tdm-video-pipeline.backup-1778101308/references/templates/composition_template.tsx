/**
 * {{TITLE}} — Pillar {{PILLAR}} — {{DURATION_SEC}}s composition.
 */
import React from 'react';
import { Audio, Series, staticFile, useVideoConfig } from 'remotion';
import meta from '../../assets/{{SLUG}}/clip-meta.json';
import scenesData from '../../public/{{SLUG}}/scenes.json';
import { SHOT_MAP } from '../scenes/{{SLUG_DASH}}';

export const {{PASCAL_SLUG}}: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio src={staticFile(meta.voiceoverFile)} />
      <Audio src={staticFile('audio/bgm-pillar{{PILLAR}}.mp3')} volume={0.18} />
      <Series>
        {scenesData.scenes.map((sc: any) => {
          const SceneComp = (SHOT_MAP as any)[sc.shot];
          if (!SceneComp) {
            console.warn(`No scene component for shot: ${sc.shot}`);
            return null;
          }
          return (
            <Series.Sequence key={sc.id} durationInFrames={sc.end - sc.start}>
              <SceneComp text={sc.text} sceneStart={sc.start / fps} />
            </Series.Sequence>
          );
        })}
      </Series>
    </>
  );
};
