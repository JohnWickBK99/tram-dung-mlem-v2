/**
 * useSceneWords — read perWord timestamps from scenes-with-perword.json for a given shot.
 *
 * Uses Remotion's delayRender/continueRender to ensure JSON loads before render.
 * Returns absolute seconds; consumer (SubtitleKaraoke) handles offset against scene start.
 *
 * Alternative pattern (simpler, statically imported in composition):
 *   import scenesData from '../../public/scenes-with-perword.json';
 *   ...
 *   <SceneComp perWord={sc.perWord} />   ← pass via prop
 *
 * Use this hook when scene component lives far from composition and prop drilling is awkward.
 */
import { useEffect, useState } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';

export interface PerWord {
  word: string;
  start: number;            // seconds (absolute in voiceover)
  end: number;
}

export const useSceneWords = (shot: string): PerWord[] => {
  const [words, setWords] = useState<PerWord[]>([]);
  const [handle] = useState(() => delayRender(`load-scenes-${shot}`));

  useEffect(() => {
    fetch(staticFile('scenes-with-perword.json'))
      .then((r) => r.json())
      .then((data) => {
        const sc = (data.scenes || []).find((s: { shot: string }) => s.shot === shot);
        if (sc && sc.perWord) setWords(sc.perWord);
      })
      .catch((e) => {
        console.error(`useSceneWords(${shot}) fetch fail:`, e);
      })
      .finally(() => continueRender(handle));
  }, [shot, handle]);

  return words;
};
