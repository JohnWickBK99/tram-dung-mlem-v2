/**
 * SceneBlock — generic declarative renderer cho schema scenes-with-perword.json v1.4.
 * Consume mọi scene có shape: { bgKind, bg, asset, overlays[], subtitle, perWord, karaokeActive }.
 */
import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';

type ManifestEntry = { kind: 'image' | 'video'; file: string };
type Manifest = Record<string, ManifestEntry>;
import { SceneFrame } from './components/SceneFrame';
import { SubtitleKaraoke } from './components/SubtitleKaraoke';
import { OutlineText } from './components/OutlineText';
import { StickerCard } from './components/StickerCard';
import { PhotoBackdrop } from './components/PhotoBackdrop';
import { FONT_FAMILY } from './fonts';

const FONT = FONT_FAMILY;
const C = {
  ink: '#1A1A1A', white: '#FFF', cream: '#FFFAF0',
  yellow: '#FFD24A', yellowSoft: '#FFF4E0',
  coral: '#E85D2F', teal: '#4FC3D1', tealDark: '#1F6E79',
};

type Overlay = {
  t: number; kind: string;
  text?: string; sub?: string;
  variant?: 'hook' | 'body' | 'thin';
  color?: string; stroke?: string; strokeW?: number; bg?: string;
  rotate?: number; y?: number;
  fontSize?: number; pulse?: boolean;
  to?: string; from?: string;
  shot?: string; spotlight?: string;
  value?: string; unit?: string;
  items?: Array<{ label?: string; color?: string; icon?: string; bg?: string }>;
  left?: { shot: string; label?: string };
  right?: { shot: string; label?: string };
  arrow?: string;
  icons?: string[]; duration?: number;
  popInterval?: number;
};

type Asset =
  | { kind: 'photo'; shot: string; src?: string }
  | { kind: 'image-sequence'; shots: string[] }
  | { kind: 'carousel-9'; shots: string[] }
  | null;

type Scene = {
  id: string; start: number; end: number; durFrames: number;
  bgKind: 'flat' | 'flat-striped' | 'photo';
  bg: string; fallbackBg?: string; tint?: string; vignette?: number;
  karaokeActive?: 'yellow' | 'coral' | 'ink';
  withBadge?: boolean;
  asset: Asset;
  overlays?: Overlay[];
  subtitle?: string;
  emphasis?: string[];
  sfx?: { t: number; file: string; dur?: number; volume?: number }[];
  perWord?: { word: string; start: number; end: number }[];
};

const ManifestCtx = React.createContext<{ slug: string; manifest: Manifest }>({ slug: '', manifest: {} });
const useShot = (shot: string) => {
  const { slug, manifest } = React.useContext(ManifestCtx);
  const m = manifest[shot];
  if (!m) return null;
  return { url: staticFile(`${slug}/${m.file}`), kind: m.kind };
};
const shotImg = (slug: string, shot: string) => staticFile(`${slug}/${shot}.jpg`); // legacy
void shotImg;

/** Background layer: flat / striped / photo */
const Background: React.FC<{ scene: Scene; pillarKey: 'a' | 'b' | 'c' | 'd' }> = ({ scene, pillarKey }) => {
  const { slug, manifest } = React.useContext(ManifestCtx);
  if (scene.bgKind === 'flat') {
    return <AbsoluteFill style={{ background: scene.bg }} />;
  }
  if (scene.bgKind === 'flat-striped') {
    return (
      <AbsoluteFill style={{ background: scene.bg }}>
        <AbsoluteFill style={{ background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 60px, rgba(0,0,0,0.06) 60px 120px)' }} />
      </AbsoluteFill>
    );
  }
  const a = scene.asset;
  const candidate = a && a.kind === 'photo' ? a.shot : (a && (a.kind === 'image-sequence' || a.kind === 'carousel-9') ? a.shots.find((s) => manifest[s]) : null);
  const m = candidate ? manifest[candidate] : null;
  if (!m) return <AbsoluteFill style={{ background: scene.fallbackBg || scene.bg }} />;
  if (m.kind === 'video') {
    return (
      <AbsoluteFill style={{ background: scene.fallbackBg || C.ink }}>
        <OffthreadVideo src={staticFile(`${slug}/${m.file}`)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
        {scene.tint && <AbsoluteFill style={{ background: scene.tint, mixBlendMode: 'multiply' }} />}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${scene.vignette ?? 0.45}) 100%)`, pointerEvents: 'none' }} />
      </AbsoluteFill>
    );
  }
  return (
    <PhotoBackdrop
      src={`${slug}/${m.file}`}
      tint={scene.tint}
      vignette={scene.vignette ?? 0.45}
      fallbackBg={scene.fallbackBg}
      pillar={pillarKey}
    />
  );
};

/** Image sequence — split scene duration across shots, skipping missing */
const ImageSequenceLayer: React.FC<{ shots: string[]; durationFrames: number }> = ({ shots, durationFrames }) => {
  const frame = useCurrentFrame();
  const { slug, manifest } = React.useContext(ManifestCtx);
  const available = shots.filter((s) => manifest[s] && manifest[s].kind === 'image');
  if (available.length === 0) return null;
  const seg = Math.max(1, Math.floor(durationFrames / available.length));
  const i = Math.min(available.length - 1, Math.floor(frame / seg));
  const shot = available[i];
  const m = manifest[shot];
  const enter = interpolate(frame % seg, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: 0.55 }}>
      <Img
        key={shot}
        src={staticFile(`${slug}/${m.file}`)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: enter, filter: 'saturate(1.15) contrast(1.1)' }}
      />
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.30)' }} />
    </AbsoluteFill>
  );
};

const SafeShotImg: React.FC<{ shot: string; style?: React.CSSProperties; fallbackBg?: string }> = ({ shot, style, fallbackBg = C.ink }) => {
  const info = useShot(shot);
  if (!info || info.kind !== 'image') return <div style={{ background: fallbackBg, ...style, width: '100%', height: '100%' }} />;
  return <Img src={info.url} style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }} />;
};

const Carousel9Layer: React.FC<{ items: NonNullable<Overlay['items']>; from: number; popInterval?: number }> = ({ items, from, popInterval = 15 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 360 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        width: 920, padding: 40,
      }}>
        {items.slice(0, 9).map((it, idx) => {
          const f = from + idx * popInterval;
          const e = spring({ frame: frame - f, fps, durationInFrames: 18, config: { damping: 11, mass: 0.7 } });
          return (
            <div key={idx} style={{
              transform: `scale(${e}) rotate(${(idx % 2 === 0 ? -2 : 2)}deg)`,
              background: it.bg || C.cream, color: C.ink,
              border: `6px solid ${C.ink}`, borderRadius: 18,
              boxShadow: `12px 12px 0 0 ${C.ink}`,
              padding: '18px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 64, lineHeight: 1 }}>{it.icon}</div>
              <div style={{ fontFamily: FONT.heading, fontWeight: 800, fontSize: 24, marginTop: 8, lineHeight: 1.1 }}>{it.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TimelineLayer: React.FC<{ items: NonNullable<Overlay['items']>; arrow?: string }> = ({ items, arrow }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30, paddingBottom: 480 }}>
    {items.map((it, i) => (
      <div key={i} style={{
        background: C.cream, color: C.ink,
        border: `6px solid ${C.ink}`, borderRadius: 16, padding: '18px 36px',
        boxShadow: `10px 10px 0 0 ${C.ink}`,
        fontFamily: FONT.heading, fontWeight: 800, fontSize: 44, letterSpacing: 1,
      }}>
        <span style={{ color: it.color || C.ink, marginRight: 12 }}>●</span>{it.label}
      </div>
    ))}
    {arrow && (
      <div style={{ background: C.coral, color: C.white, border: `4px solid ${C.ink}`, borderRadius: 999, padding: '8px 24px', fontFamily: FONT.heading, fontWeight: 800, fontSize: 32 }}>{arrow}</div>
    )}
  </AbsoluteFill>
);

const SplitLayer: React.FC<{ left: NonNullable<Overlay['left']>; right: NonNullable<Overlay['right']>; arrow?: string }> = ({ left, right, arrow }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: 60, paddingBottom: 360 }}>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {[left, right].map((p, i) => (
        <div key={i} style={{ width: 420, height: 560, border: `8px solid ${C.ink}`, borderRadius: 20, overflow: 'hidden', background: C.ink, boxShadow: `14px 14px 0 0 ${C.ink}`, position: 'relative' }}>
          <SafeShotImg shot={p.shot} />
          {p.label && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: C.ink, color: C.yellow, fontFamily: FONT.heading, fontWeight: 800, fontSize: 22, padding: '14px 12px', textAlign: 'center', letterSpacing: 1 }}>{p.label}</div>
          )}
        </div>
      ))}
    </div>
    {arrow && (
      <div style={{ marginTop: 30, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '12px 32px', fontFamily: FONT.heading, fontWeight: 800, fontSize: 36, boxShadow: `8px 8px 0 0 ${C.ink}` }}>{arrow}</div>
    )}
  </AbsoluteFill>
);

const StreetSignMorphLayer: React.FC<{ from: string; to: string }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 30, 60], [0, 0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, paddingBottom: 360 }}>
      <div style={{ opacity: 1 - t, background: C.white, color: C.ink, border: `8px solid ${C.ink}`, borderRadius: 12, padding: '26px 40px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 56, letterSpacing: 2, transform: `rotate(${-2 * (1 - t)}deg)` }}>{from}</div>
      <div style={{ fontSize: 60, color: C.ink, transform: `rotate(${t * 90}deg)` }}>↓</div>
      <div style={{ opacity: t, background: C.coral, color: C.white, border: `8px solid ${C.ink}`, borderRadius: 12, padding: '26px 40px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 64, letterSpacing: 2, transform: `scale(${t})` }}>{to}</div>
    </AbsoluteFill>
  );
};

const FoodIconCloudLayer: React.FC<{ icons: string[] }> = ({ icons }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {icons.map((ic, i) => {
        const angle = (i / icons.length) * Math.PI * 2 + frame / 60;
        const r = 280;
        const x = 540 + Math.cos(angle) * r;
        const y = 960 + Math.sin(angle) * r;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 40, top: y - 40, fontSize: 70, transform: `rotate(${frame * 2}deg)` }}>{ic}</div>
        );
      })}
    </AbsoluteFill>
  );
};

const StickerLike: React.FC<{ o: Overlay; defaultBg?: string }> = ({ o, defaultBg }) => {
  return (
    <StickerCard
      bg={o.bg || defaultBg || C.yellow}
      rotate={o.rotate || 0}
      style={{
        color: o.color || C.ink,
        fontFamily: FONT.display, fontWeight: 800,
        fontSize: o.fontSize || 56, letterSpacing: 1,
        textAlign: 'center',
        padding: '22px 38px',
      }}
    >
      <div>{o.text}</div>
      {o.sub && <div style={{ fontFamily: FONT.heading, fontWeight: 700, fontSize: 28, marginTop: 8, opacity: 0.9 }}>{o.sub}</div>}
    </StickerCard>
  );
};

const PositionedOverlay: React.FC<{ children: React.ReactNode; y?: number; centerX?: boolean }> = ({ children, y, centerX = true }) => (
  <div style={{
    position: 'absolute', top: y ?? 720, left: 0, right: 0,
    display: 'flex', justifyContent: centerX ? 'center' : 'flex-start',
  }}>{children}</div>
);

const PulseWrap: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on, children }) => {
  const frame = useCurrentFrame();
  const s = on ? 1 + Math.sin(frame / 6) * 0.04 : 1;
  return <div style={{ transform: `scale(${s})` }}>{children}</div>;
};

const RenderOverlay: React.FC<{ o: Overlay; sceneDur: number }> = ({ o, sceneDur }) => {
  const frame = useCurrentFrame();
  const enter = spring({ frame, fps: 30, durationInFrames: 18, config: { damping: 11, mass: 0.7 } });
  const exit = interpolate(frame, [Math.max(0, sceneDur - 12), sceneDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const baseStyle: React.CSSProperties = { transform: `scale(${enter}) rotate(${o.rotate || 0}deg)`, opacity: exit };
  switch (o.kind) {
    case 'OutlineText':
    case 'BrandMark':
      return (
        <PositionedOverlay y={o.y ?? 720}>
          <PulseWrap on={o.pulse}>
            <div style={baseStyle}>
              <OutlineText
                size={o.fontSize ?? (o.variant === 'hook' ? 160 : o.variant === 'thin' ? 48 : 80)}
                variant={o.variant ?? 'hook'}
                color={o.color || C.white}
                stroke={o.strokeW}
                family={FONT.display}
              >
                {o.text}
              </OutlineText>
            </div>
          </PulseWrap>
        </PositionedOverlay>
      );
    case 'Caption':
      return (
        <PositionedOverlay y={o.y ?? 1500}>
          <div style={baseStyle}>
            <OutlineText size={48} variant="body" color={C.white}>{o.text}</OutlineText>
          </div>
        </PositionedOverlay>
      );
    case 'StickerPop':
    case 'Sticker':
    case 'StickerCard':
    case 'Chip':
    case 'FactPop':
    case 'CTAPill': {
      return (
        <PositionedOverlay y={o.y ?? 980}>
          <PulseWrap on={o.pulse}>
            <div style={baseStyle}>
              <StickerLike o={o} />
            </div>
          </PulseWrap>
        </PositionedOverlay>
      );
    }
    case 'StatOverlay':
      return (
        <PositionedOverlay y={o.y ?? 600}>
          <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <OutlineText size={240} variant="hook" color={o.color || C.white} stroke={6}>{o.value}</OutlineText>
            {o.unit && (
              <StickerCard bg={C.coral} style={{ color: C.white, fontFamily: FONT.heading, fontWeight: 800, fontSize: 40, letterSpacing: 4, padding: '10px 28px' }}>
                {o.unit}
              </StickerCard>
            )}
          </div>
        </PositionedOverlay>
      );
    case 'Timeline':
      return o.items ? <TimelineLayer items={o.items} arrow={o.arrow} /> : null;
    case 'Carousel9Chip':
      return o.items ? <Carousel9Layer items={o.items} from={0} popInterval={o.popInterval} /> : null;
    case 'SplitScreen':
      return o.left && o.right ? <SplitLayer left={o.left} right={o.right} arrow={o.arrow} /> : null;
    case 'MapCutout':
      if (!o.shot) return null;
      return (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 360 }}>
          <div style={{ width: 760, height: 760, border: `8px solid ${C.ink}`, borderRadius: 24, overflow: 'hidden', boxShadow: `16px 16px 0 0 ${C.ink}`, background: C.ink }}>
            <SafeShotImg shot={o.shot} />
          </div>
          {o.spotlight && (
            <div style={{ marginTop: 24, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '12px 30px', fontFamily: FONT.heading, fontWeight: 800, fontSize: 36, boxShadow: `8px 8px 0 0 ${C.ink}` }}>📍 {o.spotlight}</div>
          )}
        </AbsoluteFill>
      );
    case 'Spotlight':
    case 'ZoomPunch': {
      // visual emphasis — spotlight: vignette ring; zoompunch: scale up
      return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <AbsoluteFill style={{
            background: o.kind === 'Spotlight'
              ? 'radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.7) 80%)'
              : 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.55) 90%)',
          }} />
        </AbsoluteFill>
      );
    }
    case 'StreetSignMorph':
      return o.from && o.to ? <StreetSignMorphLayer from={o.from} to={o.to} /> : null;
    case 'FoodIconCloud':
      return o.icons ? <FoodIconCloudLayer icons={o.icons} /> : null;
    default:
      return null;
  }
};

const SfxLayer: React.FC<{ sfx?: Scene['sfx']; sceneStart: number; available: Set<string> }> = ({ sfx, sceneStart, available }) => {
  if (!sfx?.length) return null;
  return (
    <>{sfx.filter((s) => available.has(s.file)).map((s, i) => (
      <Sequence key={i} from={Math.max(0, s.t - sceneStart)} durationInFrames={Math.max(8, Math.round((s.dur || 0.3) * 30))} layout="none">
        <Audio src={staticFile(`audio/${s.file}`)} volume={s.volume ?? 0.5} />
      </Sequence>
    ))}</>
  );
};

const karaokeStyleFor = (mode?: Scene['karaokeActive']) => {
  switch (mode) {
    case 'coral':
      return { highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink, emphasisColor: C.coral };
    case 'ink':
      return { highlightBg: C.ink, highlightTextColor: C.yellow, highlightShadowColor: C.coral, emphasisColor: C.coral };
    case 'yellow':
    default:
      return { highlightBg: C.yellow, highlightTextColor: C.ink, highlightShadowColor: C.ink, emphasisColor: C.coral };
  }
};

export const SceneBlock: React.FC<{
  scene: Scene;
  slug: string;
  pillar: 'a' | 'b' | 'c' | 'd';
  manifest: Manifest;
  sfxAvailable?: string[];
}> = ({ scene, slug, pillar, manifest, sfxAvailable = [] }) => {
  const ko = karaokeStyleFor(scene.karaokeActive);
  const sceneStartSec = scene.start / 30;
  const perWordSec = scene.perWord?.map((w) => w.start);
  const sfxSet = React.useMemo(() => new Set(sfxAvailable), [sfxAvailable]);

  return (
    <ManifestCtx.Provider value={{ slug, manifest }}>
      <SceneFrame pillar={pillar} bg={scene.bg} withBadge={scene.withBadge !== false} withMark>
        <Background scene={scene} pillarKey={pillar} />
        {scene.asset?.kind === 'image-sequence' && (
          <ImageSequenceLayer shots={scene.asset.shots} durationFrames={scene.durFrames} />
        )}
        {(scene.overlays || []).map((o, i, arr) => {
          // Lifetime: replace at next overlay sharing same slot to avoid stacking.
          // Y-band collision tracking — replace overlay when a later overlay's band overlaps mine ≥30%.
          const yBandOf = (ov: Overlay): [number, number] | null => {
            const k = ov.kind;
            if (k === 'Spotlight' || k === 'ZoomPunch') return null; // vignette only
            if (k === 'Timeline' || k === 'Carousel9Chip' || k === 'SplitScreen' ||
                k === 'MapCutout' || k === 'StreetSignMorph' || k === 'FoodIconCloud') {
              return [200, 1500]; // full-stage layouts
            }
            const sizeByKind: Record<string, number> = {
              OutlineText: ov.variant === 'hook' ? 220 : ov.variant === 'thin' ? 80 : 130,
              BrandMark: 200, Caption: 90,
              StickerPop: 160, Sticker: 160, StickerCard: 160, Chip: 110, FactPop: 120, CTAPill: 130,
              StatOverlay: 340,
            };
            const h = sizeByKind[k] ?? 140;
            const y = ov.y ?? (k === 'StatOverlay' ? 600 : (k === 'Caption' ? 1500 : (k === 'OutlineText' ? 720 : 980)));
            return [y, y + h];
          };
          const overlap = (a: [number, number] | null, b: [number, number] | null) => {
            if (!a || !b) return false;
            const lo = Math.max(a[0], b[0]); const hi = Math.min(a[1], b[1]);
            const inter = Math.max(0, hi - lo);
            const minH = Math.min(a[1] - a[0], b[1] - b[0]);
            return minH > 0 && inter / minH >= 0.3;
          };
          const isVignette = o.kind === 'Spotlight' || o.kind === 'ZoomPunch';
          const myBand = yBandOf(o);
          const slotOf = (k: string) => isVignette ? 'vignette' : 'overlay';
          const mySlot = slotOf(o.kind);
          let nextT = scene.durFrames;
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[j].t <= o.t) continue;
            const otherSlot = arr[j].kind === 'Spotlight' || arr[j].kind === 'ZoomPunch' ? 'vignette' : 'overlay';
            if (mySlot === 'vignette' && otherSlot === 'vignette') { nextT = arr[j].t; break; }
            if (mySlot === 'overlay' && otherSlot === 'overlay' && overlap(myBand, yBandOf(arr[j]))) { nextT = arr[j].t; break; }
          }
          const cap = mySlot === 'vignette' ? 36 : 9999;
          const dur = Math.min(nextT - o.t, cap, scene.durFrames - o.t);
          if (dur <= 0) return null;
          return (
            <Sequence key={i} from={o.t} durationInFrames={dur} layout="none">
              <RenderOverlay o={o} sceneDur={dur} />
            </Sequence>
          );
        })}
        {scene.subtitle && (
          <SubtitleKaraoke
            text={scene.subtitle}
            perWord={perWordSec}
            sceneStartSec={sceneStartSec}
            emphasis={scene.emphasis}
            bottom={180}
            fontSize={46}
            highlightBg={ko.highlightBg}
            highlightTextColor={ko.highlightTextColor}
            highlightShadowColor={ko.highlightShadowColor}
            emphasisColor={ko.emphasisColor}
          />
        )}
        <SfxLayer sfx={scene.sfx} sceneStart={scene.start} available={sfxSet} />
      </SceneFrame>
    </ManifestCtx.Provider>
  );
};

export type { Scene as DeclarativeScene };
