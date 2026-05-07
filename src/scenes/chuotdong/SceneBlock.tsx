import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import scenesData from '../../../public/chuotdong/scenes-with-perword.json';
import shotMap from '../../../assets/chuotdong/shot_map.json';
import {
  PhotoBackdrop,
  SceneFrame,
  SubtitleKaraoke,
  OutlineText,
  StickerCard,
  Carousel3Panel,
  type CarouselPanel,
  PlaceNamePill,
  GiantNumberYellow,
  StatOverlayInk,
  TagChipsStat,
  RatioCells,
  CTAStriped,
} from '../../shared';
import theme from '../../shared/theme';

const { color } = theme;
const PILLAR_RED = color.brand.red;

type Scene = {
  id: string;
  shot: string;
  start: number;
  end: number;
  text: string;
  visual?: string;
  highlightColor?: string | null;
  perWord?: { word: string; start: number; end: number }[];
  emphasis?: string[];
  sfx?: { name: string; frame: number; volume?: number }[];
};

const getScene = (shot: string): Scene | undefined =>
  (scenesData.scenes as Scene[]).find((s) => s.shot === shot);

const sec = (frames: number, fps: number) => frames / fps;

const ShotImage: React.FC<{ shot: string }> = ({ shot }) => {
  const info = (shotMap as unknown as Record<string, { out?: string | null; kind?: string }>)[shot];
  if (!info?.out) return null;
  return <PhotoBackdrop src={`chuotdong/${info.out}`} pillar="b" />;
};

const ShotVideo: React.FC<{ shot: string; muted?: boolean }> = ({ shot, muted = true }) => {
  const info = (shotMap as unknown as Record<string, { out?: string | null; kind?: string }>)[shot];
  if (!info?.out) return null;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <OffthreadVideo
        src={staticFile(`chuotdong/${info.out}`)}
        muted={muted}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};

const SfxLayer: React.FC<{ sfx?: Scene['sfx']; sceneStart: number }> = ({ sfx, sceneStart }) => {
  if (!sfx?.length) return null;
  return (
    <>
      {sfx.map((s, i) => {
        const rel = s.frame - sceneStart;
        return (
          <Sequence key={i} from={Math.max(0, rel)} durationInFrames={45} layout="none">
            <Audio src={staticFile(`audio/${s.name}`)} volume={s.volume ?? 0.5} />
          </Sequence>
        );
      })}
    </>
  );
};

const TopTitle: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 84, color: c }) => (
  <div style={{ position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center', padding: '0 60px' }}>
    <OutlineText size={size} color={c ?? '#FFFFFF'} variant="hook">
      {children}
    </OutlineText>
  </div>
);

/* ─────────────── Visual variants ─────────────── */

const BiteCallouts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Beats khớp với word time (scene-relative): "da giòn tan" f31, "thịt ngọt mềm" f63, "quên trời quên đất" f195
  const callouts = [
    { text: 'DA GIÒN TAN',         f: 31,  rotate: -4, color: '#F8B147', life: 100 },
    { text: 'THỊT NGỌT · MỀM',     f: 63,  rotate:  3, color: '#FFFFFF', life: 110 },
    { text: 'QUÊN TRỜI · QUÊN ĐẤT', f: 195, rotate: -2, color: '#F8B147', life: 90  },
  ];
  return (
    <>
      {callouts.map((c, i) => {
        const enter = spring({ frame: frame - c.f, fps, config: { damping: 11, mass: 0.7 }, durationInFrames: 18 });
        const exit = interpolate(frame, [c.f + c.life, c.f + c.life + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const alive = frame >= c.f && frame <= c.f + c.life + 12;
        if (!alive) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 600 + i * 220,
              left: 0,
              right: 0,
              textAlign: 'center',
              transform: `scale(${enter}) rotate(${c.rotate}deg)`,
              opacity: exit,
            }}
          >
            <span style={{
              display: 'inline-block',
              background: c.color === '#F8B147' ? '#F8B147' : '#FFFFFF',
              color: '#1A1A1A',
              border: '8px solid #1A1A1A',
              borderRadius: 16,
              padding: '20px 40px',
              fontFamily: theme.font.family.display,
              fontWeight: 800,
              fontSize: 110,
              letterSpacing: -2,
              boxShadow: '14px 14px 0 0 #1A1A1A',
              whiteSpace: 'nowrap',
            }}>
              {c.text}
            </span>
          </div>
        );
      })}
    </>
  );
};


const SplitScreenHook: React.FC<{ leftShot: string; rightShot: string; leftLabel: string; rightLabel: string }> = ({ leftShot, rightShot, leftLabel, rightLabel }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const slide = interpolate(frame, [0, 14], [60, 0], { extrapolateRight: 'clamp' });
  // Exit whip last 14 frames — split panels slide ra ngoài + fade
  const exitStart = durationInFrames - 14;
  const exitProg = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exitOffset = exitProg * 200;
  const exitOpacity = 1 - exitProg;
  return (
    <AbsoluteFill style={{ flexDirection: 'column', opacity: exitOpacity, background: '#000' }}>
      <div style={{ flex: 1, position: 'relative', transform: `translateY(${-slide - exitOffset}px)` }}>
        <AbsoluteFill style={{ opacity: 0.6 }}><ShotImage shot={leftShot} /></AbsoluteFill>
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <OutlineText size={130} color="#FFD23F" variant="hook">{leftLabel}</OutlineText>
        </div>
      </div>
      <div style={{ height: 8, background: PILLAR_RED }} />
      <div style={{ flex: 1, position: 'relative', transform: `translateY(${slide + exitOffset}px)` }}>
        <AbsoluteFill style={{ opacity: 0.6 }}><ShotImage shot={rightShot} /></AbsoluteFill>
        <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center' }}>
          <OutlineText size={130} color="#FFD23F" variant="hook">{rightLabel}</OutlineText>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FourPanelTutorial: React.FC<{ shot: string; sceneStartFrame: number }> = ({ shot, sceneStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Entry fade-in toàn cảnh + slight zoom — không cut hard
  const sceneEnter = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const enterScale = interpolate(frame, [0, 14], [1.06, 1.0], { extrapolateRight: 'clamp' });
  // Panel beats sync với word "1/2/3/4" Vbee đọc (whisper anchors 726/793/856/917f → scene-relative)
  const panels = [
    { label: '1. Ướp sả ớt', f: 726 - sceneStartFrame },
    { label: '2. Treo lu đất', f: 793 - sceneStartFrame },
    { label: '3. Nướng than 30-40p', f: 856 - sceneStartFrame },
    { label: '4. Da vàng giòn', f: 917 - sceneStartFrame },
  ];
  // Poster crossfade: show poster image first 14 frames để mask video first-frame stutter
  const posterFade = interpolate(frame, [10, 18], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const videoFade = interpolate(frame, [10, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ transform: `scale(${enterScale})` }}>
      {/* Poster image — full opacity ngay frame 0 → mask video startup stutter */}
      <AbsoluteFill style={{ opacity: 0.35 * sceneEnter * posterFade }}>
        <Img src={staticFile('chuotdong/videos/04_lu_dat_poster.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <AbsoluteFill style={{ background: 'rgba(0,0,0,0.35)' }} />
      </AbsoluteFill>
      {/* Video fades in sau 10 frames — đã loaded buffer */}
      <AbsoluteFill style={{ opacity: 0.35 * sceneEnter * videoFade }}>
        <ShotVideo shot={shot} />
      </AbsoluteFill>
      {/* Panels FULL opacity, KHÔNG dim, centered */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: sceneEnter }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 28,
          padding: 40,
          maxWidth: 980,
        }}>
          {panels.map((p, i) => {
            // Spring entry — bounce mượt, scale 0 → 1 với overshoot nhẹ
            const entry = spring({
              frame: frame - p.f,
              fps,
              config: { damping: 12, mass: 0.7, stiffness: 140 },
              durationInFrames: 24,
            });
            const fade = interpolate(frame, [p.f, p.f + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div
                key={i}
                style={{
                  opacity: fade,
                  transform: `scale(${entry}) rotate(${i % 2 === 0 ? -2 : 2}deg)`,
                  transformOrigin: 'center',
                }}
              >
                <StickerCard bg={i === 0 ? '#F8B147' : '#FFFFFF'} rotate={0}>
                  <div style={{
                    padding: '24px 28px',
                    fontFamily: theme.font.family.display,
                    fontWeight: 800,
                    fontSize: 50,
                    color: theme.color.outline,
                    textAlign: 'center',
                    lineHeight: 1.1,
                    minHeight: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {p.label}
                  </div>
                </StickerCard>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Carousel3: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const seg = Math.floor(durationFrames / 3);
  const panels: CarouselPanel[] = [
    { label: 'PHÁP 1870', src: staticFile('chuotdong/11_paris_siege_1870.jpg'), color: color.brand.coral, activeFrame: [0, seg] },
    { label: 'GHANA', src: staticFile('chuotdong/12_grasscutter_ghana.jpg'), color: color.brand.yellow, activeFrame: [seg, seg * 2] },
    { label: 'MIỀN TÂY', src: staticFile('chuotdong/01_hook_chuotdong.jpg'), color: PILLAR_RED, activeFrame: [seg * 2, durationFrames] },
  ];
  // S10 ảnh là nội dung chính — KHÔNG dim
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Carousel3Panel panels={panels} />
    </AbsoluteFill>
  );
};

/* ─────────────── Main SceneBlock ─────────────── */

export const SceneBlock: React.FC<{ shot: string }> = ({ shot }) => {
  const sc = getScene(shot);
  const { fps } = useVideoConfig();
  if (!sc) return <SceneFrame pillar="b"><div /></SceneFrame>;

  const sceneStartSec = sec(sc.start, fps);
  const perWordSec = sc.perWord?.map((w) => w.start) ?? [];
  const highlight = sc.highlightColor || undefined;
  const durationFrames = sc.end - sc.start;

  // Bottom y for caption — special tweaks per scene
  // S05 karaoke đẩy thấp + font nhỏ hơn vì panels chiếm vùng trung tâm
  // S06 BITE: lấp khoảng trống bằng caption to + đẩy lên giữa
  const captionBottom = shot === 'S12_CTA' ? 180
    : shot === 'S09_PRICE_KFC' ? 180
    : shot === 'S05_TUTORIAL_LU_DEEP' ? 80
    : shot === 'S06_BITE_REACTION' ? 480
    : 220;
  const captionFontSize = shot === 'S05_TUTORIAL_LU_DEEP' ? 38
    : shot === 'S06_BITE_REACTION' ? 64
    : 48;

  let body: React.ReactNode;

  switch (shot) {
    case 'S01_HOOK_USA_VN':
      body = <SplitScreenHook leftShot="S01_USA" rightShot="S01_VN" leftLabel="$50 DIỆT" rightLabel="80K ĂN" />;
      break;
    case 'S02_SETUP_PHUDAT':
      body = (
        <PlaceNamePill
          pillar="b"
          placeName="PHÙ DẬT"
          subtitle="AN GIANG · CHỢ CHUỘT"
          photoSrc="chuotdong/03_phu_dat_market.jpg"
        />
      );
      break;
    case 'S03_HISTORY_NUOCNOI':
      body = (
        <GiantNumberYellow
          pillar="b"
          number="30"
          unit="NĂM ĐẶC SẢN"
          attribution="Mùa nước nổi · tháng 8 âm lịch"
          shadowColor={color.outline}
        />
      );
      break;
    case 'S04_PROCESS_NGUYENLIEU':
      body = <SplitScreenHook leftShot="S04_PROCESS_NGUYENLIEU" rightShot="S04_CONG" leftLabel="ĐỒNG ✓" rightLabel="CỐNG ✗" />;
      break;
    case 'S05_TUTORIAL_LU_DEEP':
      body = <FourPanelTutorial shot={shot} sceneStartFrame={sc.start} />;
      break;
    case 'S06_BITE_REACTION':
      body = (
        <AbsoluteFill style={{ background: '#000' }}>
          <AbsoluteFill style={{ opacity: 0.6 }}><ShotVideo shot={shot} /></AbsoluteFill>
          <TopTitle size={96} color="#FFD23F">CẮN!</TopTitle>
          <BiteCallouts />
        </AbsoluteFill>
      );
      break;
    case 'S07_FLAVOR_GATATHO':
      body = (
        <RatioCells
          pillar="b"
          cells={[
            { num: '🐔', label: 'GÀ TA', variant: 'yellow' },
            { num: '🐰', label: 'THỊT THỎ', variant: 'cream' },
            { num: '🐭', label: 'CHUỘT ĐỒNG', variant: 'coral' },
          ]}
          extras="vị béo · mềm · đậm đà"
          extrasHighlight={['vị béo', 'mềm', 'đậm đà']}
        />
      );
      break;
    case 'S08_PHUDAT_MARKET':
      body = (
        <StatOverlayInk
          pillar="b"
          stat="5000"
          unit="KG/NGÀY"
          tailText="Chợ Phù Dật · số 1 Việt Nam"
          tailHighlight="Phù Dật"
        />
      );
      break;
    case 'S09_PRICE_KFC':
      body = (
        <TagChipsStat
          pillar="b"
          chips={['1 dĩa', 'no nê']}
          stat="150K"
          subtitle="ĐẮT HƠN KFC"
          dimText="≈ 6 đô la Mỹ"
        />
      );
      break;
    case 'S10_GLOBAL_RAT_DISHES':
      body = <Carousel3 durationFrames={durationFrames} />;
      break;
    case 'S11_FAO_HEALTH':
      body = (
        <PlaceNamePill
          pillar="b"
          placeName="FAO"
          subtitle="✓ AN TOÀN · GIÀU ĐẠM"
          placeNameSize={300}
        />
      );
      break;
    case 'S12_CTA':
      body = (
        <CTAStriped
          pillar="b"
          eyebrow="DÁM THỬ?"
          mainText="FOLLOW"
          ctaText="Trạm Dừng Mlem"
          subtitle="món lạ Việt Nam mỗi tuần"
          subtitleHighlight="món lạ"
        />
      );
      break;
    default:
      body = <ShotImage shot={shot} />;
  }

  // Karaoke override per scene (v1.4 full sticker style + v1.5 template BG mapping)
  let karaokeOverride: {
    highlightBg?: string;
    highlightTextColor?: string;
    highlightShadowColor?: string;
    emphasisColor?: string;
  } = {};
  if (shot === 'S03_HISTORY_NUOCNOI' || shot === 'S12_CTA') {
    // BG yellow (GiantNumberYellow / CTAStriped) → coral chip + text trắng
    karaokeOverride = {
      highlightBg: color.brand.coral,
      highlightTextColor: '#FFFFFF',
      highlightShadowColor: color.outline,
      emphasisColor: PILLAR_RED,
    };
  } else if (shot === 'S07_FLAVOR_GATATHO' || shot === 'S09_PRICE_KFC') {
    // BG cream/light pink (RatioCells / TagChipsStat) → red chip + text trắng
    karaokeOverride = {
      highlightBg: PILLAR_RED,
      highlightTextColor: '#FFFFFF',
      highlightShadowColor: color.outline,
      emphasisColor: PILLAR_RED,
    };
  } else if (shot === 'S11_FAO_HEALTH') {
    // BG đỏ đậm (PlaceNamePill pillar.dark) → yellow chip + text đen cho contrast
    karaokeOverride = {
      highlightBg: color.brand.yellow,
      highlightTextColor: color.outline,
      highlightShadowColor: color.outline,
      emphasisColor: color.brand.yellow,
    };
  } else if (highlight) {
    karaokeOverride = { highlightBg: highlight };
  }
  // S02 PlaceNamePill + S08 StatOverlayInk (dark) → default yellow chip OK

  const showBadge = !['S01_HOOK_USA_VN', 'S12_CTA'].includes(shot);

  return (
    <SceneFrame pillar="b" bg="#000" withBadge={showBadge} withMark={shot !== 'S01_HOOK_USA_VN'}>
      {/* v1.10+ templates tự dim BG nội bộ → KHÔNG wrap thêm. Custom scenes (Split/Bite/Carousel) tự handle dim BG bên trong. */}
      {body}
      <SubtitleKaraoke
        text={sc.text}
        perWord={perWordSec.length ? perWordSec : undefined}
        sceneStartSec={sceneStartSec}
        emphasis={sc.emphasis}
        bottom={captionBottom}
        fontSize={captionFontSize}
        {...karaokeOverride}
      />
      <SfxLayer sfx={sc.sfx} sceneStart={sc.start} />
    </SceneFrame>
  );
};
