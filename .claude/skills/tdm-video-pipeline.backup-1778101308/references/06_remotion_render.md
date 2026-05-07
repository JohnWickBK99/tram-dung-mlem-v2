# 06 — REMOTION RENDER

> Output: `out/<slug>.mp4` (1080×1920, 30fps, H.264).

## Architecture

```
src/
├── shared/                          ← COMMON (build 1 lần, dùng cho mọi clip)
│   ├── theme/{theme,tokens,globals,index}.ts
│   ├── components/{*.tsx,index.ts}  ← PhotoBackdrop, SubtitleKaraoke, ...
│   ├── hooks/{useEntry,useSceneWords}.ts
│   └── RootShared.tsx               ← font loader (side-effect import)
├── scenes/<slug>/                   ← PER-CLIP
│   ├── _theme.ts                    ← per-clip overrides extends shared
│   ├── _chrome.tsx                  ← (optional) custom chrome nếu cần
│   ├── index.ts                     ← SHOT_MAP {shotKey: SceneComponent}
│   ├── Scene01....tsx
│   └── ...
├── compositions/<PascalSlug>.tsx    ← <Composition> entry, totalFrames + Series
└── Root.tsx                         ← register all <Composition>
```

## Per-clip Scene*.tsx pattern

```tsx
// src/scenes/cha-ca/Scene01HookFlame.tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PhotoBackdrop, OutlineText, SubtitleKaraoke, SceneFrame, useSceneWords } from '../../shared';
import { PILLAR_KEY } from './_theme';

export const Scene01HookFlame: React.FC<{ text: string; sceneStart: number }> = ({ text, sceneStart }) => {
  const frame = useCurrentFrame();
  const words = useSceneWords('S01_HOOK_FLAME');
  return (
    <SceneFrame pillar={PILLAR_KEY} bg="#1A1A1A" withMark={false}>
      <PhotoBackdrop src="chaca/01_hook_chaca.jpg" vignette={0.55} />
      <div style={{ position: 'absolute', top: 600, left: 0, right: 0, textAlign: 'center' }}>
        <OutlineText size={140}>CHẢ CÁ?!</OutlineText>
      </div>
      <SubtitleKaraoke
        text={text}
        perWord={words.map((w) => w.start)}
        sceneStartSec={sceneStart}
      />
    </SceneFrame>
  );
};
```

## Composition pattern

```tsx
// src/compositions/ChaCa.tsx
import React from 'react';
import { Audio, Series, staticFile, useVideoConfig } from 'remotion';
import meta from '../../assets/chaca/clip-meta.json';
import scenesData from '../../public/chaca/scenes.json';
import { SHOT_MAP } from '../scenes/cha-ca';

export const ChaCa: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio src={staticFile(meta.voiceoverFile)} />
      <Audio src={staticFile('audio/bgm-pillarA.mp3')} volume={0.18} />
      <Series>
        {scenesData.scenes.map((sc) => {
          const SceneComp = (SHOT_MAP as any)[sc.shot];
          if (!SceneComp) return null;
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
```

## Root.tsx

```tsx
import React from 'react';
import { Composition } from 'remotion';
import './shared/RootShared'; // side-effect: load fonts
import { CaPheTrung } from './compositions/CaPheTrung';
import { ChaCa } from './compositions/ChaCa';
import { ChuotDongAnGiang } from './compositions/ChuotDongAnGiang';
import metaCaphetrung from '../assets/caphetrung/clip-meta.json';
import metaChaCa from '../assets/chaca/clip-meta.json';
import metaChuotdong from '../assets/chuotdong/clip-meta.json';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id={metaCaphetrung.slug} component={CaPheTrung}
        durationInFrames={metaCaphetrung.totalFrames}
        fps={metaCaphetrung.fps} width={metaCaphetrung.width} height={metaCaphetrung.height} />
      <Composition id={metaChaCa.slug} component={ChaCa}
        durationInFrames={metaChaCa.totalFrames}
        fps={metaChaCa.fps} width={metaChaCa.width} height={metaChaCa.height} />
      <Composition id={metaChuotdong.slug} component={ChuotDongAnGiang}
        durationInFrames={metaChuotdong.totalFrames}
        fps={metaChuotdong.fps} width={metaChuotdong.width} height={metaChuotdong.height} />
    </>
  );
};
```

## Render command

```bash
# Studio preview
npx remotion studio

# Render single clip
npx remotion render src/index.tsx <slug> out/<slug>.mp4 \
  --concurrency=4 \
  --pixel-format=yuv420p \
  --codec=h264 \
  --crf=20

# Apple Silicon: concurrency=4 (sweet spot @ 32GB RAM); CPU yếu → concurrency=2.
# 90s @ concurrency=4 ~ 12-15 phút.
```

## SFX layer (option A — Remotion Audio per scene)

```tsx
// Trong Scene*.tsx
import { Audio, staticFile, useCurrentFrame } from 'remotion';
import { useEffect } from 'react';

const Scene04Bite: React.FC = () => {
  return (
    <>
      <Audio src={staticFile('audio/whoosh-transition.mp3')} volume={0.55} />
      {/* visual */}
    </>
  );
};
```

## SFX layer (option B — Pre-mix với audio_mix.py)

Chạy trước render:
```bash
python3 scripts/audio_mix.py <slug>
# Output: out/<slug>_audiomix.mp3
```

Trong composition:
```tsx
<Audio src={staticFile(`../out/${meta.slug}_audiomix.mp3`)} />
```

Bỏ qua VO + BGM individual <Audio>. Cách này tốt hơn cho long-form (33+ SFX events) tránh React reconcile chậm.

## Performance tips (production-tested clip 04)

1. **Sequence grouping:** scene cùng `shot` → gộp thành 1 `<Series.Sequence>` thay vì 2 (subtitle layer per-scene OK).
2. **PhotoBackdrop opacity 0.5:** dark theme scenes phải opacity 0.5 + fallbackBg `#1A1A1A`, KHÔNG pillar.dark.
3. **Stat overlay MAX 240px:** không vượt trừ design system update.
4. **Karaoke padding 4px 12px cố định:** dynamic gây jitter.
5. **Outline text:** chỉ dùng `WebkitTextStroke` + `paintOrder: 'stroke fill'`, không SVG (gây flicker).
6. **Concurrency=4** trên M2 Pro 32GB; nếu OOM → concurrency=2.
7. **Audio cache:** Remotion render cache `~/.remotion/` — nếu fix audio không update → `rm -rf ~/.remotion`.

## CHECKPOINT 2

User xem `out/<slug>.mp4` → check:
- Hook 0-3s đọc rõ
- Karaoke đồng bộ từng từ (delay max 100ms)
- BGM volume không lấn voice
- Transitions không giật
- Mascot xuất hiện đúng beat shock/reaction

OK → upload TikTok. Fail → quay lại scene cụ thể fix.

## Khi user yêu cầu "render clip <slug>"

1. Verify prerequisites:
   - `public/<slug>/<slug-dash>-voiceover.mp3` exists
   - `public/scenes-with-perword.json` exists (phase 5 done)
   - `public/<slug>/01_*.jpg`, `videos/04_*.mp4`, ... đầy đủ theo shot_map.json
   - `assets/<slug>/clip-meta.json` exists
   - `src/scenes/<slug-dash>/index.ts` SHOT_MAP có scene cho mọi shot trong scenes.json
   - `src/compositions/<PascalSlug>.tsx` exists + registered in Root.tsx
2. Run render command.
3. Verify out/<slug>.mp4 size 15-50MB, duration ≈ totalFrames/fps.
4. Trigger CP2.

## ⚠️ QUY TẮC v1.2 — VIDEO + ẢNH CHỈ CHIẾU 1 LẦN

### `<OffthreadVideo>` — NEVER use `loop`

```tsx
import { OffthreadVideo, staticFile } from 'remotion';

// ✅ ĐÚNG — play 1 lần, không loop, không replay
<OffthreadVideo src={staticFile('chuotdong/videos/04_lu_dat.mp4')} />
```

Default `loop = false` ở Remotion v4. KHÔNG override.

### Edge case — video ngắn hơn scene

Nếu `scene.end - scene.start > video duration × fps`:

```tsx
// Phương án A — cắt scene ngắn lại để khớp video
{/* scenes.json: scene.end = scene.start + (videoDur * fps) */}

// Phương án B — sau khi video hết, hiển thị frame cuối tĩnh (không replay)
const frame = useCurrentFrame();
const VIDEO_FRAMES = 90;  // 3s @ 30fps
return frame < VIDEO_FRAMES ? (
  <OffthreadVideo src={staticFile('...')} />
) : (
  <Img src={staticFile('frame_last.jpg')} />
);

// Phương án C — slow video xuống cho khớp scene
const SCENE_FRAMES = 120;
<OffthreadVideo
  src={staticFile('...')}
  playbackRate={VIDEO_FRAMES / SCENE_FRAMES}
/>
```

### `<Audio>` SFX — cũng KHÔNG loop

```tsx
<Audio src={staticFile('audio/whoosh-transition.mp3')} />
{/* Không có loop = play once */}
```

BGM master (composition) có thể loop vì BGM dài hơn clip. Nhưng SFX events trong scene PHẢI no loop.

### Animation — không restart trong scene

```tsx
// ✅ KenBurns linear — zoom 1 chiều từ đầu đến cuối scene
<KenBurns src="..." from={1.0} to={1.06} durationFrames={SCENE_FRAMES} />

// ❌ KHÔNG sin/loop animation
const scale = 1 + 0.06 * Math.sin(frame / 30);  // SAI — restart cycle
```
