/**
 * Scene{{NN}}{{NAME}} — {{description}}
 *
 * Frame range: {{START}}f → {{END}}f ({{DURATION}}s)
 * Shot: {{SHOT_KEY}}
 */
import React from 'react';
import { staticFile, useCurrentFrame, interpolate } from 'remotion';
import {
  PhotoBackdrop,
  SubtitleKaraoke,
  SceneFrame,
  OutlineText,
  useSceneWords,
} from '../../shared';
import { PILLAR_KEY } from './_theme';

export const Scene{{NN}}{{NAME}}: React.FC<{
  text: string;
  sceneStart: number;
}> = ({ text, sceneStart }) => {
  const frame = useCurrentFrame();
  const words = useSceneWords('{{SHOT_KEY}}');
  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <SceneFrame pillar={PILLAR_KEY} bg="#1A1A1A">
      <PhotoBackdrop src="{{SLUG}}/{{IMAGE_FILE}}" vignette={0.45} />
      <div style={{
        position: 'absolute',
        top: 600,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: fade,
      }}>
        <OutlineText size={120}>{{HEADLINE}}</OutlineText>
      </div>
      <SubtitleKaraoke
        text={text}
        perWord={words.map((w) => w.start)}
        sceneStartSec={sceneStart}
      />
    </SceneFrame>
  );
};
