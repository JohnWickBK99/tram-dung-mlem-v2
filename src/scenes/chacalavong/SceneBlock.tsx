/**
 * Chacalavong SceneBlock — pixel-faithful clone của handoff/cha-ca-la-vong-preview.html.
 * 7 scenes (S01 hook / S02-S06 5 funfact / S07 CTA) — Pillar D teal.
 */
import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import scenesData from '../../../public/chacalavong/scenes-with-perword.json';
import manifest from '../../../public/chacalavong/_manifest.json';
import { SceneFrame, SubtitleKaraoke } from '../../shared';
import { FONT_FAMILY } from '../../shared/fonts';

const FONT = FONT_FAMILY;
const C = {
  yellow: '#F8B147', yellowHi: '#FFD24A', orange: '#F39820', coral: '#E85D2F', red: '#C8302D',
  teal: '#4FC3D1', cream: '#FFF4E0', white: '#FFF', off: '#FFFAF0',
  ink: '#1A1A1A', body: '#5C5443',
  pillarDLight: '#BEE7ED', pillarDBase: '#4FC3D1', pillarDDark: '#1F6E79',
};

type ManifestEntry = { kind: 'image' | 'video'; file: string };
const M = manifest as Record<string, ManifestEntry>;

type Scene = {
  id: string; start: number; end: number; durFrames: number;
  bgKind?: string; bg?: string; karaokeActive?: 'yellow' | 'coral' | 'ink';
  subtitle?: string; emphasis?: string[];
  perWord?: { word: string; start: number; end: number }[];
  withBadge?: boolean;
  asset?: { kind: string; shot?: string; shots?: string[] } | null;
};
const getScene = (id: string): Scene | undefined =>
  (scenesData.scenes as unknown as Scene[]).find((s) => s.id === id);

const useEntry = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 }, durationInFrames: 24 });
};

/* ─── Photo backdrop (chỉ S01, S03, S04) ─── */
const Photo: React.FC<{ shot?: string; tint?: string; placeholder?: string; opacity?: number }> = ({
  shot, tint = 'rgba(31,110,121,0.40)', placeholder = `linear-gradient(135deg,#1F6E79 0%,#0d3a40 100%)`, opacity = 0.55,
}) => {
  const m = shot ? M[shot] : null;
  return (
    <AbsoluteFill style={{ background: placeholder, overflow: 'hidden' }}>
      {m && m.kind === 'image' && (
        <Img src={staticFile(`chacalavong/${m.file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, filter: 'saturate(1.20) contrast(1.15)' }} />
      )}
      {m && m.kind === 'video' && (
        <OffthreadVideo src={staticFile(`chacalavong/${m.file}`)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity }} />
      )}
      <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

const Center: React.FC<{ children: React.ReactNode; gap?: number; padTop?: number; padBottom?: number }> = ({ children, gap = 18, padTop = 200, padBottom = 480 }) => (
  <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap, padding: `${padTop}px 60px ${padBottom}px` }}>
    {children}
  </AbsoluteFill>
);

/* ─── S01: HOOK · "5 FUNFACT · Chả Cá Lã Vọng" + sticker SỐ 3 ─── */
const S01: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(8); const e3 = useEntry(16); const e4 = useEntry(28);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo shot="S01A_HOOK_BG" tint="rgba(31,110,121,0.40)" placeholder="linear-gradient(135deg,#1F6E79 0%,#0d3a40 100%)" opacity={0.55} />
      <Center gap={18}>
        <div style={{ transform: `scale(${e1})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 340, color: C.white, lineHeight: 0.9, letterSpacing: -10, WebkitTextStroke: `8px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 12px 0 ${C.ink}` }}>5</div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 140, color: C.white, letterSpacing: 6, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 8px 0 ${C.ink}`, marginTop: -20 }}>FUNFACT</div>
        <div style={{ transform: `scale(${e3}) rotate(-2deg)`, background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '18px 50px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 64, letterSpacing: -1, marginTop: 24 }}>Chả Cá Lã Vọng</div>
      </Center>
      <div style={{ position: 'absolute', top: 340, right: 60, zIndex: 8, transform: `scale(${e4}) rotate(-3deg)`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '14px 26px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 36, textAlign: 'center', lineHeight: 1.05 }}>
        SỐ 3 —<br />BẠN KHÔNG<br />BIẾT ĐÂU
      </div>
    </AbsoluteFill>
  );
};

/* ─── S02: FUNFACT 1 · 1871 + 155 năm + Timeline + 5 đời họ Đoàn (cream BG) ─── */
const S02: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(10); const e3 = useEntry(20); const e4 = useEntry(36); const e5 = useEntry(52);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Center gap={14}>
        <div style={{ transform: `scale(${e1})`, background: C.ink, color: C.teal, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '14px 38px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 38, letterSpacing: 4 }}>FUNFACT ① · NIÊN ĐẠI</div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 380, color: C.pillarDDark, lineHeight: 0.9, letterSpacing: -12, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}`, marginTop: 18 }}>1871</div>
        <div style={{ transform: `scale(${e3}) rotate(-2deg)`, background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '14px 40px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 54, letterSpacing: 4, marginTop: 18 }}>155 NĂM TUỔI</div>
        <div style={{ transform: `scale(${e4})`, marginTop: 30, display: 'flex', alignItems: 'center', gap: 14, background: C.white, border: `6px solid ${C.ink}`, borderRadius: 16, boxShadow: `12px 12px 0 0 ${C.ink}`, padding: '18px 26px' }}>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 36, color: C.ink, background: C.pillarDLight, padding: '8px 14px', border: `3px solid ${C.ink}`, borderRadius: 8 }}>1871</span>
          <span style={{ fontFamily: FONT.heading, fontWeight: 800, fontSize: 28 }}>— 11 năm —</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 36, color: C.white, background: C.coral, padding: '8px 14px', border: `3px solid ${C.ink}`, borderRadius: 8 }}>1882</span>
          <span style={{ fontFamily: FONT.heading, fontWeight: 800, fontSize: 28 }}>Pháp chiếm HN</span>
        </div>
        <div style={{ opacity: e5, marginTop: 24, fontFamily: FONT.heading, fontWeight: 700, fontSize: 38, color: C.ink }}>
          → <b style={{ background: C.coral, color: C.white, border: `3px solid ${C.ink}`, padding: '2px 12px', borderRadius: 8, boxShadow: `4px 4px 0 0 ${C.ink}`, margin: '0 4px' }}>5 đời</b> nhà họ <b style={{ background: C.coral, color: C.white, border: `3px solid ${C.ink}`, padding: '2px 12px', borderRadius: 8, boxShadow: `4px 4px 0 0 ${C.ink}`, margin: '0 4px' }}>Đoàn</b>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S03: FUNFACT 2 · LÃ VỌNG = ÔNG TIÊN CÂU CÁ + 3000 NĂM TRƯỚC + KHÔNG lưỡi KHÔNG mồi (photo + ink BG) ─── */
const S03: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12); const e3 = useEntry(24); const e4 = useEntry(40); const e5 = useEntry(60);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo shot="S03A_KHUONG_TU_NHA_STATUE" tint="rgba(31,110,121,0.40)" placeholder="linear-gradient(135deg,#3a3a4a 0%,#1F6E79 100%)" opacity={0.55} />
      <Center gap={38} padTop={160}>
        <div style={{ transform: `scale(${e1})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 160, color: C.yellowHi, lineHeight: 0.95, letterSpacing: -2, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 8px 0 ${C.ink}` }}>LÃ VỌNG = ?</div>
        <div style={{ transform: `scale(${e2}) rotate(1deg)`, background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '16px 40px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 44, letterSpacing: 2 }}>ÔNG TIÊN CÂU CÁ</div>
        <div style={{ transform: `scale(${e3})`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 280, color: C.white, lineHeight: 0.9, letterSpacing: -10, WebkitTextStroke: `6px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}`, marginTop: 18 }}>3000</div>
        <div style={{ opacity: e4, fontFamily: FONT.heading, fontWeight: 800, fontSize: 44, color: C.white, WebkitTextStroke: `3px ${C.ink}`, paintOrder: 'stroke fill' as const, letterSpacing: 6, marginTop: 6 }}>NĂM TRƯỚC</div>
        <div style={{ transform: `scale(${e5}) rotate(-2deg)`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '14px 32px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 42, letterSpacing: -1, marginTop: 24, textAlign: 'center' }}>câu cá KHÔNG lưỡi · KHÔNG mồi</div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S04: FUNFACT 3 · ÍT NGƯỜI BIẾT + CƠ SỞ BÍ MẬT + ĐOÀN ↔ ĐỀ THÁM cards (ink BG) ─── */
const S04: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(10); const e3 = useEntry(28); const e4 = useEntry(40); const e5 = useEntry(56);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo tint="rgba(0,0,0,0.50)" placeholder="linear-gradient(135deg,#2b2620 0%,#1F6E79 100%)" opacity={0.55} />
      <Center gap={10} padTop={200}>
        <div style={{ transform: `scale(${e1}) rotate(-2deg)`, background: C.coral, color: C.white, border: `6px solid ${C.white}`, borderRadius: 16, padding: '14px 38px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 54, letterSpacing: 2 }}>ÍT NGƯỜI BIẾT</div>
        <div style={{ transform: `scale(${e2})`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '14px 36px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 44, letterSpacing: 4, marginTop: 30 }}>CƠ SỞ BÍ MẬT · CHỐNG PHÁP</div>
        <div style={{ transform: `scale(${e3})`, display: 'flex', gap: 20, marginTop: 30 }}>
          <div style={{ width: 280, padding: '24px 12px', background: C.white, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 20, boxShadow: `14px 14px 0 0 ${C.coral}`, textAlign: 'center', transform: 'rotate(-2deg)' }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 36, lineHeight: 1, letterSpacing: -1 }}>ĐOÀN<br />XUÂN PHÚC</div>
            <div style={{ fontFamily: FONT.heading, fontWeight: 700, fontSize: 22, color: C.body, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' }}>họa sĩ · chủ quán</div>
          </div>
          <div style={{ width: 280, padding: '24px 12px', background: C.white, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 20, boxShadow: `14px 14px 0 0 ${C.yellowHi}`, textAlign: 'center', transform: 'rotate(2deg)' }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 36, lineHeight: 1, letterSpacing: -1 }}>ĐỀ<br />THÁM</div>
            <div style={{ fontFamily: FONT.heading, fontWeight: 700, fontSize: 22, color: C.body, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' }}>nghĩa quân</div>
          </div>
        </div>
        <div style={{ opacity: e4, fontFamily: FONT.display, fontWeight: 800, fontSize: 48, color: C.yellowHi, WebkitTextStroke: `3px ${C.ink}`, paintOrder: 'stroke fill' as const, marginTop: 18 }}>↔ LIÊN LẠC</div>
        <div style={{ transform: `scale(${e5}) rotate(1deg)`, background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '14px 36px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 44, letterSpacing: 2, marginTop: 24 }}>1 THẾ KỶ CÁCH MẠNG</div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S05: FUNFACT 4 · Phố Hàng Sơn → Phố Chả Cá · 1945 · DUY NHẤT VN (cream BG) ─── */
const S05: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12); const e3 = useEntry(28); const e4 = useEntry(40); const e5 = useEntry(56); const e6 = useEntry(72);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Center gap={10}>
        <div style={{ transform: `scale(${e1})`, background: C.ink, color: C.teal, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '14px 36px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 38, letterSpacing: 4 }}>FUNFACT ④ · TÊN PHỐ</div>
        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ transform: `scale(${e2})`, background: C.white, color: C.body, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '18px 44px', boxShadow: `14px 14px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 60, letterSpacing: 2, textDecoration: 'line-through', textDecorationThickness: 6, textDecorationColor: C.coral }}>PHỐ HÀNG SƠN</div>
          <div style={{ opacity: e3, fontFamily: FONT.display, fontWeight: 800, fontSize: 80, color: C.coral, lineHeight: 0.7, WebkitTextStroke: `4px ${C.ink}`, paintOrder: 'stroke fill' as const }}>↓</div>
          <div style={{ transform: `scale(${e4})`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 60, color: C.pillarDDark, background: C.pillarDLight, border: `4px solid ${C.ink}`, borderRadius: 10, padding: '6px 22px', letterSpacing: -2, marginTop: 8 }}>1945</div>
          <div style={{ transform: `scale(${e5}) rotate(-2deg)`, background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '18px 44px', boxShadow: `14px 14px 0 0 ${C.coral}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 60, letterSpacing: 2 }}>PHỐ CHẢ CÁ</div>
        </div>
        <div style={{ transform: `scale(${e6}) rotate(-1deg)`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '14px 36px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 44, letterSpacing: 2, marginTop: 30 }}>DUY NHẤT VIỆT NAM</div>
        <div style={{ opacity: e6, fontFamily: FONT.heading, fontWeight: 700, fontSize: 30, color: C.ink, marginTop: 14 }}>đặt theo tên 1 món ăn</div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S06: FUNFACT 5 · 9 THỨ THIẾU 1 LÀ SAI + cluster + tự đảo cá tại bàn (yellow BG) ─── */
const S06: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e1 = useEntry(0); const e2 = useEntry(10); const eDao = useEntry(110);
  const ingredients: { ic: string; label: string; cls: 'w' | 't' | 'c'; r: number }[] = [
    { ic: '🐟', label: 'Cá lăng sông Đà', cls: 'w', r: -2 },
    { ic: '🍜', label: 'Bún rối', cls: 't', r: 2 },
    { ic: '🌿', label: 'Thì là', cls: 'w', r: -1 },
    { ic: '🌱', label: 'Hành lá', cls: 't', r: 1 },
    { ic: '🥜', label: 'Lạc rang', cls: 'w', r: -2 },
    { ic: '🦐', label: 'Mắm tôm', cls: 'c', r: 2 },
    { ic: '🌶️', label: 'Ớt', cls: 'c', r: -1 },
    { ic: '🍋', label: 'Chanh', cls: 't', r: 1 },
    { ic: '🍃', label: 'Rau mùi', cls: 'w', r: -2 },
  ];
  return (
    <AbsoluteFill style={{ background: C.yellow }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 35%, #FFE0A8 0%, #F8B147 70%)', opacity: 0.6 }} />
      <Center gap={10} padTop={160}>
        <div style={{ transform: `scale(${e1})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 240, color: C.white, lineHeight: 0.9, letterSpacing: -6, WebkitTextStroke: `8px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 10px 0 ${C.ink}` }}>9 THỨ</div>
        <div style={{ transform: `scale(${e2}) rotate(-2deg)`, background: C.ink, color: C.yellowHi, border: `5px solid ${C.ink}`, borderRadius: 12, padding: '10px 26px', fontFamily: FONT.heading, fontWeight: 800, fontSize: 36, letterSpacing: 2, marginTop: 60, boxShadow: `8px 8px 0 0 ${C.ink}` }}>THIẾU 1 LÀ SAI</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', maxWidth: 920, marginTop: 24 }}>
          {ingredients.map((ing, i) => {
            const f = 24 + i * 8;
            const e = spring({ frame: frame - f, fps, durationInFrames: 18, config: { damping: 11, mass: 0.7 } });
            const bg = ing.cls === 't' ? C.teal : ing.cls === 'c' ? C.coral : C.white;
            const fg = ing.cls === 'c' ? C.white : C.ink;
            return (
              <div key={i} style={{
                transform: `scale(${e}) rotate(${ing.r}deg)`,
                background: bg, color: fg,
                border: `5px solid ${C.ink}`, borderRadius: 999,
                padding: '10px 22px', boxShadow: `6px 6px 0 0 ${C.ink}`,
                fontFamily: FONT.heading, fontWeight: 800, fontSize: 32,
                whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 34 }}>{ing.ic}</span>{ing.label}
              </div>
            );
          })}
        </div>
        <div style={{ transform: `scale(${eDao}) rotate(-1deg)`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 16, padding: '14px 36px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 44, letterSpacing: 2, marginTop: 24 }}>→ TỰ ĐẢO CÁ TẠI BÀN</div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S07: CTA · Số 14 phố Chả Cá + Follow (teal-dark + stripes) ─── */
const S07: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(8); const e3 = useEntry(20); const e4 = useEntry(34); const e5 = useEntry(48); const e6 = useEntry(64); const e7 = useEntry(80); const e8 = useEntry(96);
  return (
    <AbsoluteFill style={{ background: C.pillarDDark }}>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(45deg, ${C.pillarDDark} 0 60px, rgba(255,210,74,0.12) 60px 120px)` }} />
      <Center gap={18} padTop={140} padBottom={380}>
        <div style={{ transform: `scale(${e1})`, background: C.ink, color: C.yellowHi, border: `4px solid ${C.ink}`, borderRadius: 999, padding: '10px 26px', fontFamily: FONT.heading, fontWeight: 800, fontSize: 32, letterSpacing: 4, textTransform: 'uppercase' }}>📍 ĐỊA CHỈ GỐC</div>
        <div style={{ transform: `scale(${e2})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 88, color: C.yellowHi, WebkitTextStroke: `4px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 6px 0 ${C.ink}`, lineHeight: 1.0, marginTop: 6, textAlign: 'center' }}>Số 14<br />phố Chả Cá</div>
        <div style={{ transform: `scale(${e3})`, background: C.coral, color: C.white, border: `5px solid ${C.ink}`, borderRadius: 999, padding: '12px 30px', boxShadow: `10px 10px 0 0 ${C.ink}`, fontFamily: FONT.heading, fontWeight: 800, fontSize: 34, letterSpacing: 3, marginTop: 18 }}>QUÁN GỐC HÀ NỘI</div>
        <div style={{ transform: `scale(${e4}) rotate(-2deg)`, background: C.yellowHi, color: C.ink, border: `5px solid ${C.ink}`, borderRadius: 14, padding: '10px 28px', boxShadow: `10px 10px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, letterSpacing: 2, marginTop: 14 }}>MÓN TIẾP THEO?</div>
        <div style={{ opacity: e5, display: 'flex', gap: 10, marginTop: 14, fontSize: 48 }}>🍜 🥢 🍱 🌶️ 🦀</div>
        <div style={{ transform: `scale(${e6})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 64, color: C.white, WebkitTextStroke: `5px ${C.ink}`, paintOrder: 'stroke fill' as const, textShadow: `0 6px 0 ${C.ink}`, marginTop: 8, textAlign: 'center' }}>Trạm Dừng Mlem</div>
        <div style={{ opacity: e7, fontFamily: FONT.heading, fontWeight: 700, fontSize: 30, color: C.yellowHi, WebkitTextStroke: `2px ${C.ink}`, paintOrder: 'stroke fill' as const, letterSpacing: 2, marginTop: 6 }}>🍜 mỗi ngày 2 món lạ thế giới</div>
        <div style={{ transform: `scale(${e8}) rotate(-1deg)`, background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '14px 42px', boxShadow: `12px 12px 0 0 ${C.ink}`, fontFamily: FONT.display, fontWeight: 800, fontSize: 40, letterSpacing: 3, textTransform: 'uppercase', marginTop: 8 }}>↑ FOLLOW NGAY</div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── Karaoke + text styling per scene BG (high-contrast subtitle) ─── */
const karaokeStyleFor = (id: string) => {
  switch (id) {
    case 'S02_FUNFACT_1_AGE':
    case 'S05_FUNFACT_4_STREET':
      // Cream BG — ink fill, no stroke (white stroke vanishes on cream)
      return {
        highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink,
        textColor: C.ink, textStrokeColor: C.cream, strokeWidth: 0, emphasisColor: C.coral,
      };
    case 'S06_FUNFACT_5_INGREDIENTS':
      // Yellow BG — ink fill, no stroke
      return {
        highlightBg: C.ink, highlightTextColor: C.yellowHi, highlightShadowColor: C.ink,
        textColor: C.ink, textStrokeColor: C.yellow, strokeWidth: 0, emphasisColor: C.coral,
      };
    case 'S04_FUNFACT_3_REVOLUTION':
      // Ink/photo BG, kara=coral — white fill + ink stroke
      return {
        highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi,
      };
    case 'S07_CTA':
      // Teal-dark BG — white fill + ink stroke
      return {
        highlightBg: C.coral, highlightTextColor: C.white, highlightShadowColor: C.ink,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi,
      };
    case 'S01_HOOK':
    case 'S03_FUNFACT_2_NAME':
    default:
      // Ink BG — white fill + ink stroke + yellow hl
      return {
        highlightBg: C.yellow, highlightTextColor: C.ink, highlightShadowColor: C.ink,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi,
      };
  }
};

/* ─── Dispatcher ─── */
export const SceneBlock: React.FC<{ id: string }> = ({ id }) => {
  const sc = getScene(id);
  if (!sc) return <SceneFrame pillar="d" bg={C.ink}><div /></SceneFrame>;
  const sceneStartSec = sc.start / 30;
  const perWordSec = sc.perWord?.map((w) => w.start);
  const ko = karaokeStyleFor(id);

  let body: React.ReactNode = null;
  switch (id) {
    case 'S01_HOOK': body = <S01 />; break;
    case 'S02_FUNFACT_1_AGE': body = <S02 />; break;
    case 'S03_FUNFACT_2_NAME': body = <S03 />; break;
    case 'S04_FUNFACT_3_REVOLUTION': body = <S04 />; break;
    case 'S05_FUNFACT_4_STREET': body = <S05 />; break;
    case 'S06_FUNFACT_5_INGREDIENTS': body = <S06 />; break;
    case 'S07_CTA': body = <S07 />; break;
  }

  // Theo handoff: S01 / S04 / S07 không show pillar badge; S01 không show channel mark.
  const showBadge = !['S01_HOOK', 'S04_FUNFACT_3_REVOLUTION', 'S07_CTA'].includes(id);
  const showMark = id !== 'S01_HOOK';
  const bg = sc.bg || C.ink;

  return (
    <SceneFrame pillar="d" bg={bg} withBadge={showBadge} withMark={showMark}>
      {body}
      {sc.subtitle && (
        <SubtitleKaraoke
          text={sc.subtitle}
          perWord={perWordSec}
          sceneStartSec={sceneStartSec}
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
export const Scene02: React.FC = () => <SceneBlock id="S02_FUNFACT_1_AGE" />;
export const Scene03: React.FC = () => <SceneBlock id="S03_FUNFACT_2_NAME" />;
export const Scene04: React.FC = () => <SceneBlock id="S04_FUNFACT_3_REVOLUTION" />;
export const Scene05: React.FC = () => <SceneBlock id="S05_FUNFACT_4_STREET" />;
export const Scene06: React.FC = () => <SceneBlock id="S06_FUNFACT_5_INGREDIENTS" />;
export const Scene07: React.FC = () => <SceneBlock id="S07_CTA" />;
