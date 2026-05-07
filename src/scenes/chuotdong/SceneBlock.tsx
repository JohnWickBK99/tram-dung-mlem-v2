/**
 * SceneBlock — pixel-faithful clone của handoff/chuot-dong-preview.html.
 * Mỗi scene custom JSX inline (không dùng templates), match exact CSS:
 * font sizes, colors, padding, shadows, letter-spacings.
 */
import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import scenesData from '../../../public/chuotdong/scenes-with-perword.json';
import shotMap from '../../../assets/chuotdong/shot_map.json';
import { SceneFrame, SubtitleKaraoke } from '../../shared';
import { FONT_FAMILY } from '../../shared/fonts';

/* ─── Tokens (match handoff CSS variables) ─── */
const C = {
  yellow: '#F8B147', orange: '#F39820', coral: '#E85D2F', red: '#C8302D',
  teal: '#4FC3D1', cream: '#FFF4E0', white: '#FFF', off: '#FFFAF0',
  ink: '#1A1A1A', body: '#5C5443',
  pillarBLight: '#F4B0AE', pillarBBase: '#C8302D', pillarBDark: '#7A1614',
  yellowGold: '#FFD23F',
};
// Font family resolved by @remotion/google-fonts (Baloo2 register có thể là 'Baloo 2' hoặc 'Baloo Two')
const FONT = FONT_FAMILY;
const outlineH = (stroke = 6, sh = 8): React.CSSProperties => ({
  fontFamily: FONT.display, fontWeight: 800,
  WebkitTextStroke: `${stroke}px ${C.ink}`,
  paintOrder: 'stroke fill' as const,
  textShadow: `0 ${sh}px 0 ${C.ink}`,
  lineHeight: 0.95, whiteSpace: 'nowrap',
});

/* ─── Types ─── */
type Scene = {
  id: string; shot: string; start: number; end: number;
  text: string; perWord?: { word: string; start: number; end: number }[];
  emphasis?: string[];
  sfx?: { name: string; frame: number; volume?: number }[];
};
const getScene = (shot: string): Scene | undefined =>
  (scenesData.scenes as Scene[]).find((s) => s.shot === shot);
const sec = (frames: number, fps: number) => frames / fps;

/* ─── Utilities ─── */
const ShotImageRaw: React.FC<{ shot: string; opacity?: number; tint?: string }> = ({ shot, opacity = 0.6, tint }) => {
  const info = (shotMap as unknown as Record<string, { out?: string | null }>)[shot];
  if (!info?.out) return <AbsoluteFill style={{ background: C.pillarBDark }} />;
  return (
    <AbsoluteFill style={{ background: C.pillarBDark, overflow: 'hidden' }}>
      <Img src={staticFile(`chuotdong/${info.out}`)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity,
                 filter: 'saturate(1.25) contrast(1.18) brightness(1.05)' }} />
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};

const ShotVideo: React.FC<{ shot: string }> = ({ shot }) => {
  const info = (shotMap as unknown as Record<string, { out?: string | null }>)[shot];
  if (!info?.out) return null;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <OffthreadVideo src={staticFile(`chuotdong/${info.out}`)} muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
      <AbsoluteFill style={{ background: 'rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};

const SfxLayer: React.FC<{ sfx?: Scene['sfx']; sceneStart: number }> = ({ sfx, sceneStart }) => {
  if (!sfx?.length) return null;
  return (
    <>{sfx.map((s, i) => (
      <Sequence key={i} from={Math.max(0, s.frame - sceneStart)} durationInFrames={45} layout="none">
        <Audio src={staticFile(`audio/${s.name}`)} volume={s.volume ?? 0.5} />
      </Sequence>
    ))}</>
  );
};

const useEntry = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 }, durationInFrames: 24 });
};

/* ─── S01: Split USA $50 vs VN 80K ─── */
const S01: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(8);
  return (
    <AbsoluteFill style={{ background: C.ink, flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '80px 0 200px' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg,#3a3a3a 0%,#7A1614 100%)', opacity: 0.6 }} />
        <ShotImageRaw shot="S01_USA" opacity={0.45} />
        <div style={{ position: 'relative', transform: `scale(${e1})`, ...outlineH(6, 8), color: C.yellowGold, fontSize: 200, letterSpacing: -4 }}>$50 DIỆT</div>
      </div>
      <div style={{ height: 8, background: C.red }} />
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '200px 0 600px' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg,#B87808 0%,#7A1614 100%)', opacity: 0.6 }} />
        <ShotImageRaw shot="S01_VN" opacity={0.45} />
        <div style={{ position: 'relative', transform: `scale(${e2})`, ...outlineH(6, 8), color: C.yellowGold, fontSize: 200, letterSpacing: -4 }}>80K ĂN</div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── S02: PHÙ DẬT pill ─── */
const S02: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(10);
  return (
    <AbsoluteFill>
      <ShotImageRaw shot="S02_SETUP_PHUDAT" tint="rgba(122,22,20,0.40)" />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30, padding: '200px 60px 480px' }}>
        <div style={{ transform: `scale(${e1})`, ...outlineH(6, 8), color: C.yellow, fontSize: 240, letterSpacing: -6 }}>PHÙ DẬT</div>
        <div style={{ transform: `scale(${e2})`, background: C.ink, color: C.yellow, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '20px 44px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 42, letterSpacing: 4, textAlign: 'center' }}>AN GIANG · CHỢ CHUỘT</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── S03: Giant 30 năm — yellow BG ─── */
const S03: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12); const e3 = useEntry(28);
  return (
    <AbsoluteFill style={{ background: C.yellow }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, #FFE0A8 0%, #F8B147 70%)', opacity: 0.6 }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30, padding: '200px 60px 480px' }}>
        <div style={{ transform: `scale(${e1})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 480, color: C.white, lineHeight: 0.9, letterSpacing: -16, textShadow: `12px 12px 0 ${C.ink}`, whiteSpace: 'nowrap' }}>30</div>
        <div style={{ transform: `scale(${e2})`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '20px 50px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 96, letterSpacing: 8 }}>NĂM ĐẶC SẢN</div>
        <div style={{ opacity: e3, fontFamily: FONT.heading, fontWeight: 700, fontSize: 42, color: C.white, WebkitTextStroke: `2px ${C.ink}`, paintOrder: 'stroke fill' as const, letterSpacing: 2, marginTop: 30 }}>Mùa nước nổi · tháng 8 âm lịch</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── S04: Split ĐỒNG vs CỐNG ─── */
const S04: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(8);
  return (
    <AbsoluteFill style={{ background: C.ink, flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '80px 0 200px' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg,#B87808 0%,#3a8e3f 100%)', opacity: 0.6 }} />
        <ShotImageRaw shot="S04_PROCESS_NGUYENLIEU" opacity={0.45} />
        <div style={{ position: 'relative', transform: `scale(${e1})`, ...outlineH(6, 8), color: '#9bf08a', fontSize: 180, letterSpacing: -4 }}>ĐỒNG ✓</div>
      </div>
      <div style={{ height: 8, background: C.red }} />
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '200px 0 600px' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg,#2b1a0a 0%,#5C5443 100%)', opacity: 0.6 }} />
        <ShotImageRaw shot="S04_CONG" opacity={0.45} />
        <div style={{ position: 'relative', transform: `scale(${e2})`, ...outlineH(6, 8), color: C.pillarBLight, fontSize: 180, letterSpacing: -4 }}>CỐNG ✗</div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── S05: 4-panel tutorial ─── */
const S05: React.FC<{ sceneStartFrame: number }> = ({ sceneStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Beats sync với word "1/2/3/4" Vbee đọc (whisper anchors 726/793/856/917f)
  const panels = [
    { label: '1. Ướp sả ớt',         f: 726 - sceneStartFrame, yellow: true,  rotate: -2 },
    { label: '2. Treo lu đất',        f: 793 - sceneStartFrame, yellow: false, rotate:  2 },
    { label: '3. Nướng than 30-40p',  f: 856 - sceneStartFrame, yellow: false, rotate: -2 },
    { label: '4. Da vàng giòn',       f: 917 - sceneStartFrame, yellow: false, rotate:  2 },
  ];
  // Poster crossfade để mask video startup
  const posterFade = interpolate(frame, [10, 18], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const videoFade = interpolate(frame, [10, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ opacity: posterFade }}>
        <Img src={staticFile('chuotdong/videos/04_lu_dat_poster.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
        <AbsoluteFill style={{ background: 'rgba(0,0,0,0.30)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: videoFade }}>
        <ShotVideo shot="S05_TUTORIAL_LU_DEEP" />
      </AbsoluteFill>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 280 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, width: 980, padding: 40 }}>
          {panels.map((p, i) => {
            const entry = spring({ frame: frame - p.f, fps, config: { damping: 12, mass: 0.7, stiffness: 140 }, durationInFrames: 24 });
            const fade = interpolate(frame, [p.f, p.f + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                opacity: fade,
                transform: `scale(${entry}) rotate(${p.rotate}deg)`,
                background: p.yellow ? C.yellow : C.white,
                border: `8px solid ${C.ink}`, borderRadius: 24,
                boxShadow: `20px 20px 0 0 ${C.ink}`,
                padding: '24px 28px', minHeight: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT.display, fontWeight: 800, fontSize: 50,
                color: C.ink, textAlign: 'center', lineHeight: 1.1,
              }}>{p.label}</div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── S06: BITE reaction ─── */
const S06: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEntry = useEntry(0);
  const callouts = [
    { text: 'DA GIÒN TAN',           f: 31,  yellow: true,  rotate: -4 },
    { text: 'THỊT NGỌT · MỀM',       f: 63,  yellow: false, rotate:  3 },
    { text: 'QUÊN TRỜI · QUÊN ĐẤT',  f: 195, yellow: true,  rotate: -2 },
  ];
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill>
        <ShotVideo shot="S06_BITE_REACTION" />
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center', transform: `scale(${titleEntry})`, ...outlineH(6, 8), color: C.yellowGold, fontSize: 200, letterSpacing: -4 }}>CẮN!</div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, paddingTop: 600 }}>
        {callouts.map((c, i) => {
          const entry = spring({ frame: frame - c.f, fps, config: { damping: 11, mass: 0.7 }, durationInFrames: 18 });
          const alive = frame >= c.f;
          if (!alive) return <div key={i} style={{ visibility: 'hidden', height: 130 }} />;
          return (
            <div key={i} style={{
              transform: `scale(${entry}) rotate(${c.rotate}deg)`,
              background: c.yellow ? C.yellow : C.white,
              color: C.ink,
              border: `8px solid ${C.ink}`, borderRadius: 16,
              padding: '20px 40px', boxShadow: `14px 14px 0 0 ${C.ink}`,
              fontFamily: FONT.display, fontWeight: 800, fontSize: 90,
              letterSpacing: -2, whiteSpace: 'nowrap',
            }}>{c.text}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── S07: Ratio cells gà/thỏ/chuột — cream BG ─── */
const S07: React.FC = () => {
  const cells = [
    { num: '🐔', lab: 'GÀ TA',       bg: C.yellow, fg: C.ink },
    { num: '🐰', lab: 'THỊT THỎ',    bg: C.cream,  fg: C.ink },
    { num: '🐭', lab: 'CHUỘT ĐỒNG',  bg: C.coral,  fg: C.white },
  ];
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <ShotImageRaw shot="S07_FLAVOR_GATATHO" opacity={0.35} tint="rgba(255,244,224,0.55)" />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36, padding: '200px 60px 480px' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {cells.map((c, i) => {
            const e = useEntry(i * 6);
            return (
              <div key={i} style={{
                transform: `scale(${e})`,
                width: 200, padding: '32px 0',
                background: c.bg, color: c.fg,
                border: `8px solid ${C.ink}`, borderRadius: 24,
                boxShadow: `20px 20px 0 0 ${C.ink}`, textAlign: 'center',
              }}>
                <div style={{ fontSize: 130, lineHeight: 0.9 }}>{c.num}</div>
                <div style={{ fontFamily: FONT.heading, fontWeight: 800, fontSize: 36, letterSpacing: 4, marginTop: 14 }}>{c.lab}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: FONT.heading, fontWeight: 700, fontSize: 48, color: C.ink, marginTop: 20, letterSpacing: 2 }}>
          {['vị béo', 'mềm', 'đậm đà'].map((w, i) => (
            <React.Fragment key={i}>
              {i > 0 && ' · '}
              <span style={{ background: C.yellow, padding: '4px 14px', borderRadius: 6, border: `3px solid ${C.ink}`, margin: '0 4px' }}>{w}</span>
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── S08: Big stat 5000 KG — ink BG ─── */
const S08: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12); const e3 = useEntry(24);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${C.pillarBDark} 0%, ${C.ink} 70%)`, opacity: 0.6 }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 28, padding: '200px 60px 480px' }}>
        <div style={{ transform: `scale(${e1})`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 300, color: C.yellow, lineHeight: 0.9, letterSpacing: -10, textShadow: `0 12px 0 ${C.ink}`, WebkitTextStroke: `8px ${C.ink}`, paintOrder: 'stroke fill' as const, whiteSpace: 'nowrap' }}>5000</div>
        <div style={{ transform: `scale(${e2})`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '14px 42px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 88, letterSpacing: 6 }}>KG/NGÀY</div>
        <div style={{ width: 600, height: 8, background: C.yellow, transform: `scaleX(${e2})`, transformOrigin: 'left' }} />
        <div style={{ opacity: e3, fontFamily: FONT.heading, fontWeight: 700, fontSize: 56, color: C.cream, letterSpacing: 2, textAlign: 'center' }}>
          Chợ <span style={{ background: C.yellow, color: C.ink, padding: '4px 12px', borderRadius: 6 }}>Phù Dật</span> · số 1 Việt Nam
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── S09: TagChipsStat 150K — light pink BG ─── */
const S09: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(8); const e3 = useEntry(16); const e4 = useEntry(28);
  return (
    <AbsoluteFill style={{ background: C.pillarBLight }}>
      <ShotImageRaw shot="S09_PRICE_KFC" opacity={0.3} tint="rgba(244,176,174,0.45)" />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: '200px 60px 480px' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ transform: `scale(${e1}) rotate(-3deg)`, background: C.cream, color: C.ink, border: `4px solid ${C.ink}`, borderRadius: 999, padding: '14px 32px', boxShadow: `8px 8px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 36, whiteSpace: 'nowrap' }}>1 dĩa</div>
          <div style={{ transform: `scale(${e1}) rotate(3deg)`, background: C.cream, color: C.ink, border: `4px solid ${C.ink}`, borderRadius: 999, padding: '14px 32px', boxShadow: `8px 8px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 36, whiteSpace: 'nowrap' }}>no nê</div>
        </div>
        <div style={{ transform: `scale(${e2})`, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 32, padding: '40px 80px', boxShadow: `20px 20px 0 0 ${C.ink}`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 240, color: C.ink, lineHeight: 0.9 }}>150K</div>
        <div style={{ transform: `scale(${e3})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 56, color: C.white, WebkitTextStroke: `4px ${C.ink}`, paintOrder: 'stroke fill' as const, whiteSpace: 'nowrap' }}>ĐẮT HƠN KFC</div>
        <div style={{ opacity: e4, fontFamily: FONT.body, fontWeight: 500, fontSize: 36, color: C.cream, letterSpacing: 4, WebkitTextStroke: `2px ${C.ink}`, paintOrder: 'stroke fill' as const }}>≈ 6 đô la Mỹ</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── S10: Carousel 3-row Pháp/Ghana/MT — ink BG ─── */
const S10: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const seg = Math.floor(durationFrames / 3);
  const rows = [
    { shot: 'S10_GLOBAL_RAT_DISHES_PARIS', label: 'PHÁP 1870', color: C.coral, range: [0, seg] },
    { shot: 'S10_GLOBAL_RAT_DISHES_GHANA', label: 'GHANA',     color: C.yellow, range: [seg, seg * 2] },
    { shot: 'S10_GLOBAL_RAT_DISHES_VN',    label: 'MIỀN TÂY',  color: C.yellowGold, range: [seg * 2, durationFrames] },
  ];
  return (
    <AbsoluteFill style={{ background: C.ink, flexDirection: 'column' }}>
      {rows.map((r, i) => {
        const active = frame >= r.range[0] && frame < r.range[1];
        return (
          <div key={i} style={{
            flex: 1, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            borderTop: i > 0 ? `8px solid ${C.ink}` : undefined,
            opacity: active ? 1 : 0.55,
            transform: active ? 'scale(1.0)' : 'scale(0.97)',
            transition: 'all 0.25s ease',
          }}>
            <ShotImageRaw shot={r.shot} opacity={0.55} />
            <div style={{ position: 'relative', zIndex: 2, ...outlineH(6, 8), fontSize: 140, color: r.color, letterSpacing: -4, padding: '20px 40px' }}>{r.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ─── S11: FAO place pill — dark red BG ─── */
const S11: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12);
  return (
    <AbsoluteFill style={{ background: C.pillarBDark }}>
      <AbsoluteFill style={{ background: 'linear-gradient(135deg,#5a0e10 0%,#7A1614 100%)', opacity: 0.6 }} />
      <AbsoluteFill style={{ background: 'rgba(122,22,20,0.50)', mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30, padding: '200px 60px 480px' }}>
        <div style={{ transform: `scale(${e1})`, ...outlineH(6, 8), color: C.yellow, fontSize: 300, letterSpacing: -8 }}>FAO</div>
        <div style={{ transform: `scale(${e2})`, background: C.ink, color: C.yellow, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '20px 44px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 42, letterSpacing: 4, textAlign: 'center' }}>✓ AN TOÀN · GIÀU ĐẠM</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── S12: CTA striped — yellow BG ─── */
const S12: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(8); const e3 = useEntry(16); const e4 = useEntry(24);
  return (
    <AbsoluteFill style={{ background: C.yellow }}>
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(45deg, #F8B147 0 60px, #FFE0A8 60px 120px)', opacity: 0.6 }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26, padding: '200px 60px 480px' }}>
        <div style={{ transform: `scale(${e1})`, background: C.ink, color: C.yellow, border: `4px solid ${C.ink}`, borderRadius: 999, padding: '14px 40px', boxShadow: `8px 8px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 44, letterSpacing: 6, textTransform: 'uppercase' }}>DÁM THỬ?</div>
        <div style={{ transform: `scale(${e2})`, ...outlineH(6, 8), color: C.coral, fontSize: 240, letterSpacing: -6 }}>FOLLOW</div>
        <div style={{ transform: `scale(${e3})`, background: C.coral, color: C.white, border: `8px solid ${C.ink}`, borderRadius: 999, padding: '28px 64px', boxShadow: `20px 20px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 64, letterSpacing: 4, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Trạm Dừng Mlem</div>
        <div style={{ opacity: e4, fontFamily: FONT.heading, fontWeight: 700, fontSize: 46, color: C.ink, letterSpacing: 2, textAlign: 'center' }}>
          <span style={{ background: C.ink, color: C.yellow, padding: '4px 14px', borderRadius: 6 }}>món lạ</span> Việt Nam mỗi tuần
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── Main SceneBlock dispatcher ─── */
export const SceneBlock: React.FC<{ shot: string }> = ({ shot }) => {
  const sc = getScene(shot);
  const { fps } = useVideoConfig();
  if (!sc) return <SceneFrame pillar="b"><div /></SceneFrame>;
  const sceneStartSec = sec(sc.start, fps);
  const perWordSec = sc.perWord?.map((w) => w.start) ?? [];
  const durationFrames = sc.end - sc.start;

  // Karaoke per-scene styles theo handoff
  const k: Record<string, {
    bottom: number; fontSize?: number;
    highlightBg?: string; highlightTextColor?: string;
    highlightShadowColor?: string; emphasisColor?: string;
  }> = {
    S01_HOOK_USA_VN:        { bottom: 220 },
    S02_SETUP_PHUDAT:       { bottom: 220 },
    S03_HISTORY_NUOCNOI:    { bottom: 220, highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink, emphasisColor: C.red },
    S04_PROCESS_NGUYENLIEU: { bottom: 220 },
    S05_TUTORIAL_LU_DEEP:   { bottom: 80, fontSize: 38 },
    S06_BITE_REACTION:      { bottom: 80, fontSize: 38 },
    S07_FLAVOR_GATATHO:     { bottom: 220, highlightBg: C.red, highlightTextColor: C.white, highlightShadowColor: C.ink, emphasisColor: C.red },
    S08_PHUDAT_MARKET:      { bottom: 220 },
    S09_PRICE_KFC:          { bottom: 180, highlightBg: C.red, highlightTextColor: C.white, highlightShadowColor: C.ink, emphasisColor: C.red },
    S10_GLOBAL_RAT_DISHES:  { bottom: 220 },
    S11_FAO_HEALTH:         { bottom: 220, highlightBg: C.yellow, highlightTextColor: C.ink, highlightShadowColor: C.ink, emphasisColor: C.yellow },
    S12_CTA:                { bottom: 180, highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink, emphasisColor: C.red },
  };
  const ko = k[shot] ?? { bottom: 220 };

  let body: React.ReactNode;
  switch (shot) {
    case 'S01_HOOK_USA_VN':         body = <S01 />; break;
    case 'S02_SETUP_PHUDAT':        body = <S02 />; break;
    case 'S03_HISTORY_NUOCNOI':     body = <S03 />; break;
    case 'S04_PROCESS_NGUYENLIEU':  body = <S04 />; break;
    case 'S05_TUTORIAL_LU_DEEP':    body = <S05 sceneStartFrame={sc.start} />; break;
    case 'S06_BITE_REACTION':       body = <S06 />; break;
    case 'S07_FLAVOR_GATATHO':      body = <S07 />; break;
    case 'S08_PHUDAT_MARKET':       body = <S08 />; break;
    case 'S09_PRICE_KFC':           body = <S09 />; break;
    case 'S10_GLOBAL_RAT_DISHES':   body = <S10 durationFrames={durationFrames} />; break;
    case 'S11_FAO_HEALTH':          body = <S11 />; break;
    case 'S12_CTA':                 body = <S12 />; break;
    default:                        body = null;
  }

  const showBadge = !['S01_HOOK_USA_VN', 'S12_CTA'].includes(shot);
  const showMark = shot !== 'S01_HOOK_USA_VN';

  return (
    <SceneFrame pillar="b" bg={C.ink} withBadge={showBadge} withMark={showMark}>
      {body}
      <SubtitleKaraoke
        text={sc.text}
        perWord={perWordSec.length ? perWordSec : undefined}
        sceneStartSec={sceneStartSec}
        emphasis={sc.emphasis}
        bottom={ko.bottom}
        fontSize={ko.fontSize ?? 48}
        highlightBg={ko.highlightBg}
        highlightTextColor={ko.highlightTextColor}
        highlightShadowColor={ko.highlightShadowColor}
        emphasisColor={ko.emphasisColor}
      />
      <SfxLayer sfx={sc.sfx} sceneStart={sc.start} />
    </SceneFrame>
  );
};
