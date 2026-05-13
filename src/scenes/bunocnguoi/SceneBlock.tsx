/**
 * Bún Ốc Nguội · 10 scenes · Pillar B (red/yellow/coral)
 * S01 hook → S02 reveal → S03-S05 3 funfacts → S06 sepia HN xưa →
 * S07/S08/S09 3 quán recommend → S10 CTA (Comment OPEN → FOLLOW CLOSE).
 */
import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import scenesData from '../../../public/bunocnguoi/scenes-with-perword.json';
import manifest from '../../../public/bunocnguoi/_manifest.json';
import { SceneFrame, SubtitleKaraoke } from '../../shared';
import { FONT_FAMILY } from '../../shared/fonts';

const FONT = FONT_FAMILY;
const C = {
  red: '#C8302D', redDark: '#8B1F1D',
  yellow: '#F8B147', yellowHi: '#FFD24A',
  coral: '#E85D2F', orange: '#F39820',
  teal: '#4FC3D1',
  cream: '#FFF4E0', off: '#FFFAF0', white: '#FFF',
  ink: '#1A1A1A', body: '#5C5443',
};

type ManifestEntry = { kind: 'image' | 'video'; file: string };
const M = manifest as Record<string, ManifestEntry>;

type Scene = {
  id: string; start: number; end: number; durFrames?: number;
  bg?: string; bgKind?: string; karaokeActive?: string;
  subtitle?: string; emphasis?: string[];
  perWord?: { word: string; start: number; end: number }[];
  asset?: { kind: string; shot?: string; shots?: string[] } | null;
};
const getScene = (id: string): Scene | undefined =>
  (scenesData.scenes as unknown as Scene[]).find((s) => s.id === id);

const useEntry = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 }, durationInFrames: 24 });
};

/* ─── Photo / video backdrop ─── */
const Backdrop: React.FC<{
  shot?: string; tint?: string; placeholder?: string; opacity?: number; sepia?: boolean;
}> = ({ shot, tint = 'rgba(200,48,45,0.18)', placeholder, opacity = 0.7, sepia = false }) => {
  const m = shot ? M[shot] : null;
  const ph = placeholder || `linear-gradient(135deg,${C.cream} 0%, #f3e2bf 100%)`;
  return (
    <AbsoluteFill style={{ background: ph, overflow: 'hidden' }}>
      {m && m.kind === 'image' && (
        <Img src={staticFile(`bunocnguoi/${m.file}`)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, filter: sepia ? 'sepia(0.7) contrast(1.05) brightness(0.95)' : 'saturate(1.15) contrast(1.10)' }}
        />
      )}
      {m && m.kind === 'video' && (
        <OffthreadVideo src={staticFile(`bunocnguoi/${m.file}`)} muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity }}
        />
      )}
      <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

/* ─── Image sequence — splits scene duration across N shots, no loop ─── */
const ImageSequence: React.FC<{ shots: string[]; sepia?: boolean; tint?: string; opacity?: number }> = ({ shots, sepia, tint, opacity }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = shots.length;
  const seg = Math.max(1, Math.floor(durationInFrames / n));
  const idx = Math.min(n - 1, Math.floor(frame / seg));
  return <Backdrop shot={shots[idx]} sepia={sepia} tint={tint} opacity={opacity} />;
};

const Center: React.FC<{ children: React.ReactNode; gap?: number; padTop?: number; padBottom?: number }> = ({ children, gap = 18, padTop = 200, padBottom = 480 }) => (
  <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap, padding: `${padTop}px 60px ${padBottom}px` }}>
    {children}
  </AbsoluteFill>
);

const Sticker: React.FC<{
  children: React.ReactNode; bg: string; color: string; size?: number;
  rotate?: number; scale?: number; pad?: string; radius?: number;
  shadow?: number; borderW?: number; letterSpacing?: number;
}> = ({ children, bg, color, size = 56, rotate = 0, scale = 1, pad = '14px 36px', radius = 16, shadow = 12, borderW = 6, letterSpacing = 2 }) => (
  <div style={{
    transform: `scale(${scale}) rotate(${rotate}deg)`,
    background: bg, color, border: `${borderW}px solid ${C.ink}`, borderRadius: radius,
    padding: pad, boxShadow: `${shadow}px ${shadow}px 0 0 ${C.ink}`,
    fontFamily: FONT.display, fontWeight: 800, fontSize: size, letterSpacing,
    textAlign: 'center', lineHeight: 1.05,
  }}>{children}</div>
);

/* ════════════════ SCENES ════════════════ */

/* S01 — HOOK: video bún ốc + "MÓN BÚN ĐỘC NHẤT VIỆT NAM" + yellow sticker */
const S01: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(10); const e3 = useEntry(28);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Backdrop shot="S01A_HOOK_BOWL" tint="rgba(200,48,45,0.30)" placeholder={`linear-gradient(135deg,${C.redDark} 0%, ${C.ink} 100%)`} opacity={0.62} />
      <Center gap={20} padTop={210} padBottom={520}>
        <div style={{ transform: `scale(${e1})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 116, color: C.white, lineHeight: 0.95, letterSpacing: -2, WebkitTextStroke: `7px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}`, textAlign: 'center' }}>
            MÓN BÚN<br />ĐỘC NHẤT<br />VIỆT NAM
        </div>
        <div style={{ marginTop: 36, transform: `scale(${e2}) rotate(-3deg)` }}>
          <Sticker bg={C.yellow} color={C.ink} size={66} pad="18px 42px">BÚN ỐC NGUỘI</Sticker>
        </div>
        <div style={{ opacity: e3, marginTop: 12, fontFamily: FONT.heading, fontWeight: 800, fontSize: 38, color: C.white, WebkitTextStroke: `3px ${C.ink}`, paintOrder: 'stroke fill' as const, letterSpacing: 2 }}>
          PHẢI ĂN LẠNH NHÉ ❄️
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* S02 — REVEAL: chopstick/bowl photo + "3 ĐIỀU + 3 QUÁN" teaser */
const S02: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14); const e3 = useEntry(28); const e4 = useEntry(46);
  return (
    <AbsoluteFill style={{ background: C.off }}>
      <ImageSequence shots={['S02A_CHOPSTICKS','S02B_BOWL_COOL']} tint="rgba(255,212,74,0.22)" opacity={0.78} />
      <Center gap={16} padTop={170} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.ink} color={C.yellowHi} size={34} pad="10px 26px" radius={999} letterSpacing={4} shadow={10}>BẢN GỐC HÀ NỘI XƯA</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 132, color: C.red, lineHeight: 0.9, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}`, marginTop: 8 }}>
          BÚN ỐC<br/>NGUỘI
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
          <div style={{ transform: `scale(${e3}) rotate(-2deg)` }}>
            <Sticker bg={C.yellow} color={C.ink} size={36} pad="10px 22px" shadow={10}>3 ĐIỀU</Sticker>
          </div>
          <div style={{ transform: `scale(${e3}) rotate(2deg)`, fontFamily: FONT.display, fontWeight: 800, fontSize: 46, color: C.ink }}>+</div>
          <div style={{ transform: `scale(${e4}) rotate(2deg)` }}>
            <Sticker bg={C.coral} color={C.white} size={36} pad="10px 22px" shadow={10}>3 QUÁN NGON</Sticker>
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* S03 — DẤM BỖNG (funfact ①): photo dấm bỗng pour + số ① */
const S03: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14); const e3 = useEntry(30);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <ImageSequence shots={['S03A_DAM_BONG_POUR','S03B_RICE_FERMENT','S03C_BOWL_GOLDEN']} tint="rgba(200,48,45,0.40)" opacity={0.55} />
      <Center gap={16} padTop={170} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.red} color={C.white} size={42} pad="10px 26px" radius={999} letterSpacing={4} shadow={10}>① LINH HỒN BÁT BÚN</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 168, color: C.yellow, lineHeight: 0.9, letterSpacing: -4, WebkitTextStroke: `7px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}`, marginTop: 14 }}>
          DẤM BỖNG
        </div>
        <div style={{ transform: `scale(${e3}) rotate(-2deg)`, marginTop: 16 }}>
          <Sticker bg={C.yellowHi} color={C.ink} size={32} pad="10px 24px" shadow={10}>men gạo nếp lên men · chua thanh · vàng óng</Sticker>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* S04 — ỐC NHỒI (funfact ②): yellow BG + photo ốc nhồi */
const S04: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14); const e3 = useEntry(30); const e4 = useEntry(46);
  return (
    <AbsoluteFill style={{ background: C.yellow }}>
      <ImageSequence shots={['S04A_SNAILS_PLATE','S04B_SNAIL_DIPPING']} tint="rgba(248,177,71,0.40)" opacity={0.55} />
      <Center gap={12} padTop={170} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.ink} color={C.yellowHi} size={42} pad="10px 26px" radius={999} letterSpacing={4} shadow={10}>② NGUYÊN LIỆU</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 156, color: C.red, lineHeight: 0.9, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}`, marginTop: 12 }}>
          ỐC NHỒI
        </div>
        <div style={{ transform: `scale(${e3}) rotate(-2deg)`, marginTop: 8 }}>
          <Sticker bg={C.coral} color={C.white} size={30} pad="10px 22px" shadow={10}>TO BẰNG ĐẦU NGÓN TAY</Sticker>
        </div>
        <div style={{ transform: `scale(${e4})`, marginTop: 10 }}>
          <Sticker bg={C.white} color={C.ink} size={28} pad="8px 22px" shadow={8}>luộc lá chanh · khêu sẵn · giòn dai</Sticker>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* S05 — HERBS (funfact ③): cream BG + herbs photo */
const S05: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14); const e3 = useEntry(30); const e4 = useEntry(46);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Backdrop shot="S05A_HERBS_CHOPPED" tint="rgba(248,177,71,0.18)" opacity={0.65} />
      <Center gap={14} padTop={170} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.red} color={C.white} size={42} pad="10px 26px" radius={999} letterSpacing={4} shadow={10}>③ RAU THƠM</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 150, color: C.ink, lineHeight: 0.9, WebkitTextStroke: `6px ${C.cream}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.red}`, marginTop: 12, textAlign: 'center' }}>
          TÍA TÔ<br/>KINH GIỚI
        </div>
        <div style={{ transform: `scale(${e3}) rotate(-2deg)`, marginTop: 16 }}>
          <Sticker bg={C.yellow} color={C.ink} size={32} pad="10px 24px" shadow={10}>THÁI NHỎ · TRỘN VÀO BÁT</Sticker>
        </div>
        <div style={{ opacity: e4, marginTop: 10, fontFamily: FONT.heading, fontWeight: 700, fontSize: 30, color: C.ink, letterSpacing: 1 }}>
          ⓧ KHÔNG rau sống nguyên cây
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* S06 — WHY NGUỘI: sepia HN xưa */
const S06: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14); const e3 = useEntry(30);
  return (
    <AbsoluteFill style={{ background: '#3a2a1c' }}>
      <ImageSequence shots={['S06A_HANOI_VENDOR','S06B_OLD_STREET']} tint="rgba(70,40,15,0.45)" opacity={0.68} sepia />
      <Center gap={16} padTop={210} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.coral} color={C.white} size={36} pad="10px 26px" radius={999} letterSpacing={3} shadow={10}>VÌ SAO “NGUỘI”?</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 200, color: C.yellowHi, lineHeight: 0.9, WebkitTextStroke: `7px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}`, marginTop: 6 }}>
          70 NĂM
        </div>
        <div style={{ transform: `scale(${e3}) rotate(-1deg)`, marginTop: 12 }}>
          <Sticker bg={C.cream} color={C.ink} size={30} pad="10px 24px" shadow={10}>gánh hàng rong xế chiều · không bếp · làm sẵn để nguội</Sticker>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── Shared 3-chip row for shop scenes ─── */
const ShopChip: React.FC<{ color: string; text: string; textColor?: string; delay: number; dir: number }> = ({ color, text, textColor, delay, dir }) => {
  const e = useEntry(delay);
  return (
    <div style={{ transform: `scale(${e}) translateX(${(1 - e) * dir * 40}px)` }}>
      <Sticker bg={color} color={textColor || C.white} size={28} pad="10px 26px" radius={999} shadow={8} borderW={5}>{text}</Sticker>
    </div>
  );
};
const ShopChips: React.FC<{ chips: { color: string; text: string; textColor?: string }[]; delay?: number }> = ({ chips, delay = 0 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, alignItems: 'center' }}>
    {chips.map((c, i) => (
      <ShopChip key={i} color={c.color} text={c.text} textColor={c.textColor} delay={delay + i * 10} dir={i % 2 === 0 ? -1 : 1} />
    ))}
  </div>
);

/* S07 — QUÁN BÀ LƯƠNG */
const S07: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Backdrop shot="S07A_BA_LUONG" tint="rgba(200,48,45,0.35)" placeholder={`linear-gradient(160deg, ${C.red} 0%, ${C.redDark} 100%)`} opacity={0.55} />
      <Center gap={10} padTop={170} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.ink} color={C.yellowHi} size={34} pad="10px 24px" radius={999} letterSpacing={4} shadow={10}>📍 QUÁN ①</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 132, color: C.red, lineHeight: 0.92, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}` }}>
          BÀ LƯƠNG
        </div>
        <ShopChips delay={28} chips={[
          { color: C.yellow, textColor: C.ink, text: 'Khương Thượng · Đống Đa' },
          { color: C.coral, text: 'Gia truyền 40 năm' },
          { color: C.teal, textColor: C.ink, text: 'Nước dùng vàng óng · chua thanh đậm đà' },
        ]} />
      </Center>
    </AbsoluteFill>
  );
};

/* S08 — QUÁN CÔ HUỆ */
const S08: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14);
  return (
    <AbsoluteFill style={{ background: C.off }}>
      <Backdrop shot="S08A_CO_HUE" tint="rgba(232,93,47,0.35)" placeholder={`linear-gradient(160deg, ${C.coral} 0%, #802b14 100%)`} opacity={0.55} />
      <Center gap={10} padTop={170} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.ink} color={C.coral} size={34} pad="10px 24px" radius={999} letterSpacing={4} shadow={10}>📍 QUÁN ②</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 132, color: C.coral, lineHeight: 0.92, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}` }}>
          CÔ HUỆ
        </div>
        <ShopChips delay={28} chips={[
          { color: C.yellow, textColor: C.ink, text: '43 Nguyễn Siêu · phố cổ' },
          { color: C.teal, textColor: C.ink, text: '6:00 — 14:00' },
          { color: C.red, text: '35.000 — 45.000 đ / bát' },
        ]} />
      </Center>
    </AbsoluteFill>
  );
};

/* S09 — QUÁN CÔ XUÂN */
const S09: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14);
  return (
    <AbsoluteFill style={{ background: '#1F4A50' }}>
      <ImageSequence shots={['S09_O_QUAN_CHUONG_LANDMARK','S09A_CO_XUAN']} tint="rgba(31,74,80,0.40)" opacity={0.55} />
      <Center gap={10} padTop={170} padBottom={520}>
        <div style={{ transform: `scale(${e1})` }}>
          <Sticker bg={C.ink} color={C.teal} size={34} pad="10px 24px" radius={999} letterSpacing={4} shadow={10}>📍 QUÁN ③</Sticker>
        </div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 132, color: C.teal, lineHeight: 0.92, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}` }}>
          CÔ XUÂN
        </div>
        <ShopChips delay={28} chips={[
          { color: C.yellow, textColor: C.ink, text: 'Vỉa hè 1 Hàng Chiếu' },
          { color: C.coral, text: 'Ngay cổng Ô Quan Chưởng' },
          { color: C.cream, textColor: C.ink, text: '8:00 — 13:00 · vị truyền thống' },
        ]} />
      </Center>
    </AbsoluteFill>
  );
};

/* S10 — CTA: Comment OPEN → FOLLOW MAIN CLOSE (sticker pulse) */
const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eComment = useEntry(0);
  const eRecap = useEntry(60);
  const eFollow = useEntry(135); // ~4.5s = ~45f * 3 — but we have ~340 frames total, so spread out
  const eTagline = useEntry(220);
  const eArrow = useEntry(260);
  // FOLLOW pulse: scale 1 → 1.12 → 1, repeated 3x starting eFollow visible
  const pulseFrame = Math.max(0, frame - 135);
  const pulse = 1 + 0.12 * Math.sin((pulseFrame / fps) * Math.PI * 3); // 3 cycles total ~1.5s
  return (
    <AbsoluteFill style={{ background: C.redDark }}>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(45deg, ${C.redDark} 0 60px, rgba(248,177,71,0.10) 60px 120px)` }} />
      <Center gap={12} padTop={130} padBottom={300}>
        {/* Comment OPEN sticker */}
        <div style={{ transform: `scale(${eComment}) rotate(-2deg)` }}>
          <Sticker bg={C.coral} color={C.white} size={42} pad="14px 30px" shadow={12}>
            💬 BẠN BIẾT QUÁN<br/>NÀO NGON NỮA?
          </Sticker>
        </div>

        {/* Recap 3 quán mini chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, opacity: eRecap, flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Sticker bg={C.yellow} color={C.ink} size={22} pad="6px 16px" radius={999} shadow={6} borderW={4}>BÀ LƯƠNG</Sticker>
            <Sticker bg={C.coral} color={C.white} size={22} pad="6px 16px" radius={999} shadow={6} borderW={4}>CÔ HUỆ</Sticker>
            <Sticker bg={C.teal} color={C.ink} size={22} pad="6px 16px" radius={999} shadow={6} borderW={4}>CÔ XUÂN</Sticker>
          </div>
        </div>

        {/* FOLLOW MAIN sticker (pulse 3x) */}
        <div style={{ marginTop: 30, transform: `scale(${eFollow * pulse})` }}>
          <div style={{
            background: C.yellow, color: C.ink, border: `8px solid ${C.ink}`, borderRadius: 24,
            padding: '22px 48px', boxShadow: `16px 16px 0 0 ${C.ink}`,
            fontFamily: FONT.display, fontWeight: 800, fontSize: 64, letterSpacing: 3,
            textAlign: 'center', lineHeight: 1.0,
          }}>
            🔔 FOLLOW<br/>@TRẠM DỪNG MLEM
          </div>
        </div>

        {/* Tagline */}
        <div style={{ opacity: eTagline, marginTop: 14, fontFamily: FONT.heading, fontStyle: 'italic', fontWeight: 700, fontSize: 28, color: C.yellowHi, WebkitTextStroke: `2px ${C.ink}`, paintOrder: 'stroke fill' as const, letterSpacing: 1 }}>
          🍜 Mỗi ngày một món lạ thế giới
        </div>

        {/* Arrow */}
        <div style={{ opacity: eArrow, marginTop: 6, fontFamily: FONT.display, fontWeight: 800, fontSize: 50, color: C.coral, WebkitTextStroke: `3px ${C.ink}`, paintOrder: 'stroke fill' as const }}>
          ↗ Follow
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── Karaoke style per scene BG ─── */
const karaokeStyleFor = (id: string) => {
  switch (id) {
    case 'S03_DAM_BONG':
      // photo + red dark → ink BG / yellow text / coral shadow
      return { highlightBg: C.ink, highlightTextColor: C.yellow, highlightShadowColor: C.coral,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi };
    case 'S04_OC_NHOI':
      // yellow flat → ink BG / yellow text / coral shadow
      return { highlightBg: C.ink, highlightTextColor: C.yellowHi, highlightShadowColor: C.coral,
        textColor: C.ink, textStrokeColor: C.yellow, strokeWidth: 0, emphasisColor: C.red };
    case 'S06_WHY_NGUOI':
      // sepia → coral BG / white text / stroke 2
      return { highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 4, emphasisColor: C.yellowHi };
    case 'S05_HERBS':
      // cream → ink text / coral hi
      return { highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink,
        textColor: C.ink, textStrokeColor: C.cream, strokeWidth: 0, emphasisColor: C.red };
    case 'S07_QUAN_BA_LUONG':
    case 'S08_QUAN_CO_HUE':
    case 'S09_QUAN_O_QUAN_CHUONG':
      return { highlightBg: C.ink, highlightTextColor: C.yellow, highlightShadowColor: C.coral,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi };
    case 'S10_CTA_BOOKMARK':
      return { highlightBg: C.yellow, highlightTextColor: C.ink, highlightShadowColor: C.coral,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi };
    case 'S01_HOOK':
    case 'S02_REVEAL':
    default:
      return { highlightBg: C.yellow, highlightTextColor: C.ink, highlightShadowColor: C.ink,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi };
  }
};

/* ─── Dispatcher ─── */
const SceneBlock: React.FC<{ id: string }> = ({ id }) => {
  const sc = getScene(id);
  if (!sc) return <SceneFrame pillar="b" bg={C.ink}><div /></SceneFrame>;
  const perWordSec = sc.perWord?.map((w) => w.start);
  const ko = karaokeStyleFor(id);

  let body: React.ReactNode = null;
  switch (id) {
    case 'S01_HOOK': body = <S01 />; break;
    case 'S02_REVEAL': body = <S02 />; break;
    case 'S03_DAM_BONG': body = <S03 />; break;
    case 'S04_OC_NHOI': body = <S04 />; break;
    case 'S05_HERBS': body = <S05 />; break;
    case 'S06_WHY_NGUOI': body = <S06 />; break;
    case 'S07_QUAN_BA_LUONG': body = <S07 />; break;
    case 'S08_QUAN_CO_HUE': body = <S08 />; break;
    case 'S09_QUAN_O_QUAN_CHUONG': body = <S09 />; break;
    case 'S10_CTA_BOOKMARK': body = <S10 />; break;
  }

  const showBadge = id !== 'S01_HOOK' && id !== 'S10_CTA_BOOKMARK';
  const showMark = id !== 'S01_HOOK';
  const bg = sc.bg || C.off;

  return (
    <SceneFrame pillar="b" bg={bg} withBadge={showBadge} withMark={showMark}>
      {body}
      {sc.subtitle && (
        <SubtitleKaraoke
          text={sc.subtitle}
          perWord={perWordSec}
          sceneStartSec={0}
          emphasis={sc.emphasis}
          bottom={120}
          fontSize={42}
          strokeWidth={ko.strokeWidth}
          minWordsPerPage={4}
          maxWordsPerPage={9}
          highlightBg={ko.highlightBg}
          highlightTextColor={ko.highlightTextColor}
          highlightShadowColor={ko.highlightShadowColor}
          textColor={ko.textColor}
          textStrokeColor={ko.textStrokeColor}
          emphasisColor={ko.emphasisColor}
        />
      )}
    </SceneFrame>
  );
};

export const Scene01: React.FC = () => <SceneBlock id="S01_HOOK" />;
export const Scene02: React.FC = () => <SceneBlock id="S02_REVEAL" />;
export const Scene03: React.FC = () => <SceneBlock id="S03_DAM_BONG" />;
export const Scene04: React.FC = () => <SceneBlock id="S04_OC_NHOI" />;
export const Scene05: React.FC = () => <SceneBlock id="S05_HERBS" />;
export const Scene06: React.FC = () => <SceneBlock id="S06_WHY_NGUOI" />;
export const Scene07: React.FC = () => <SceneBlock id="S07_QUAN_BA_LUONG" />;
export const Scene08: React.FC = () => <SceneBlock id="S08_QUAN_CO_HUE" />;
export const Scene09: React.FC = () => <SceneBlock id="S09_QUAN_O_QUAN_CHUONG" />;
export const Scene10: React.FC = () => <SceneBlock id="S10_CTA_BOOKMARK" />;
