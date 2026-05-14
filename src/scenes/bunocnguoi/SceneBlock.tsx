/**
 * Bún Ốc Nguội · 10 scenes · Pillar B
 * Pixel-faithful theo handoff/bun-oc-nguoi-preview.html
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
  yellow: '#F8B147', yellowHi: '#FFD24A', orange: '#F39820',
  coral: '#E85D2F', red: '#C8302D',
  teal: '#4FC3D1',
  cream: '#FFF4E0', white: '#FFF', off: '#FFFAF0',
  ink: '#1A1A1A', body: '#5C5443',
  pillarBLight: '#F4B0AE', pillarBBase: '#C8302D', pillarBDark: '#7A1614',
  green: '#1f8a3d',
};

type ManifestEntry = { kind: 'image' | 'video'; file: string };
const M = manifest as Record<string, ManifestEntry>;

type Scene = {
  id: string; start: number; end: number; durFrames?: number;
  bg?: string; bgKind?: string; karaokeActive?: string;
  subtitle?: string; emphasis?: string[];
  perWord?: { word: string; start: number; end: number }[];
};
const getScene = (id: string): Scene | undefined =>
  (scenesData.scenes as unknown as Scene[]).find((s) => s.id === id);

const useEntry = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 }, durationInFrames: 24 });
};

const STROKE = (px: number, c: string) => ({
  WebkitTextStroke: `${px}px ${c}`,
  paintOrder: 'stroke fill' as const,
});

/* ─── Photo backdrop (placeholder + tint + radial vignette) ─── */
const Photo: React.FC<{
  shot?: string; placeholder?: string; tint?: string; opacity?: number;
}> = ({ shot, placeholder, tint = 'transparent', opacity = 0.65 }) => {
  const m = shot ? M[shot] : null;
  const ph = placeholder || C.pillarBDark;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: ph }} />
      {m && m.kind === 'image' && (
        <Img src={staticFile(`bunocnguoi/${m.file}`)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, filter: 'saturate(1.10) contrast(1.05)' }}
        />
      )}
      {m && m.kind === 'video' && (
        <OffthreadVideo src={staticFile(`bunocnguoi/${m.file}`)} muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity }}
        />
      )}
      <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};

const ImageSequence: React.FC<{ shots: string[]; placeholder?: string; tint?: string; opacity?: number }> = ({ shots, placeholder, tint, opacity }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = shots.length;
  const seg = Math.max(1, Math.floor(durationInFrames / n));
  const idx = Math.min(n - 1, Math.floor(frame / seg));
  return <Photo shot={shots[idx]} placeholder={placeholder} tint={tint} opacity={opacity} />;
};

const Center: React.FC<{ children: React.ReactNode; gap?: number; padTop?: number; padBottom?: number; align?: string }> = ({ children, gap = 18, padTop = 200, padBottom = 480, align = 'center' }) => (
  <AbsoluteFill style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: align === 'top' ? 'flex-start' : 'center',
    gap, padding: `${padTop}px 60px ${padBottom}px`,
  }}>
    {children}
  </AbsoluteFill>
);

/* ═══════════════ SCENES (pixel-faithful) ═══════════════ */

/* S01 — HOOK */
const S01: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12); const e3 = useEntry(28);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo shot="S01A_HOOK_BOWL"
        placeholder={`linear-gradient(135deg, ${C.pillarBDark} 0%, #1A0a0a 100%)`}
        tint="rgba(122,22,20,0.40)" opacity={0.55} />
      <Center gap={6} padTop={300}>
        <div style={{
          transform: `scale(${e1})`,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 96, lineHeight: 0.95,
          color: C.white, ...STROKE(6, C.ink), textShadow: `0 10px 0 ${C.ink}`,
          textAlign: 'center', letterSpacing: -2,
        }}>
          MÓN BÚN<br/><b style={{ color: C.yellowHi }}>ĐỘC NHẤT</b><br/>VIỆT NAM
        </div>
        <div style={{
          transform: `scale(${e2}) rotate(-2deg)`,
          background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 16,
          padding: '24px 64px', boxShadow: `14px 14px 0 0 ${C.ink}`,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 120, letterSpacing: -2,
          marginTop: 36, textAlign: 'center', lineHeight: 1,
        }}>
          BÚN ỐC<br/>NGUỘI
        </div>
        <div style={{
          opacity: e3, marginTop: 30,
          fontFamily: FONT.heading, fontStyle: 'italic', fontWeight: 700, fontSize: 48,
          color: C.yellowHi, ...STROKE(3, C.ink),
        }}>
          Phải ăn lạnh nhé 🍜
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* S02 — REVEAL */
const S02: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12); const e3 = useEntry(30); const e4 = useEntry(46);
  return (
    <AbsoluteFill style={{ background: C.off }}>
      <Center gap={10} padTop={300}>
        <div style={{
          transform: `scale(${e1})`,
          background: C.ink, color: C.pillarBLight, border: `6px solid ${C.ink}`,
          borderRadius: 999, padding: '14px 38px', boxShadow: `12px 12px 0 0 ${C.ink}`,
          fontFamily: FONT.heading, fontWeight: 800, fontSize: 34, letterSpacing: 4,
        }}>
          REVEAL · BẢN GỐC HÀ NỘI
        </div>
        <div style={{
          transform: `scale(${e2})`,
          marginTop: 24, background: C.white, border: `8px solid ${C.red}`, borderRadius: 32,
          boxShadow: `20px 20px 0 0 ${C.ink}`, padding: '30px 70px', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: FONT.display, fontWeight: 800, fontSize: 200, color: C.red,
            ...STROKE(6, C.ink), textShadow: `0 10px 0 ${C.ink}`, lineHeight: 0.9, letterSpacing: -6,
          }}>NGUỘI</div>
          <div style={{
            marginTop: 14, fontFamily: FONT.heading, fontWeight: 800, fontSize: 30,
            color: C.ink, letterSpacing: 3,
          }}>BẢN GỐC · HÀ NỘI XƯA</div>
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 22, alignItems: 'center' }}>
          <div style={{
            transform: `scale(${e3}) rotate(-2deg)`,
            background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 20,
            padding: '18px 32px', boxShadow: `12px 12px 0 0 ${C.ink}`,
            fontFamily: FONT.display, fontWeight: 800, textAlign: 'center', lineHeight: 1,
          }}>
            <span style={{ fontSize: 96, letterSpacing: -2, display: 'block' }}>3</span>
            <span style={{ fontSize: 30, letterSpacing: 3, marginTop: 4 }}>ĐIỀU</span>
          </div>
          <div style={{
            transform: `scale(${e3})`, fontFamily: FONT.display, fontWeight: 800, fontSize: 80,
            color: C.red, ...STROKE(4, C.ink), textShadow: `0 6px 0 ${C.ink}`,
          }}>+</div>
          <div style={{
            transform: `scale(${e4}) rotate(2deg)`,
            background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 20,
            padding: '18px 32px', boxShadow: `12px 12px 0 0 ${C.ink}`,
            fontFamily: FONT.display, fontWeight: 800, textAlign: 'center', lineHeight: 1,
          }}>
            <span style={{ fontSize: 96, letterSpacing: -2, display: 'block' }}>3</span>
            <span style={{ fontSize: 30, letterSpacing: 3, marginTop: 4 }}>QUÁN</span>
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── Number circle helper for S03/S04/S05 ─── */
const NumCircle: React.FC<{ n: number; bg?: string; color?: string; scale?: number }> = ({ n, bg = C.red, color = C.yellowHi, scale = 1 }) => (
  <div style={{
    transform: `scale(${scale})`,
    width: 160, height: 160, borderRadius: '50%',
    background: bg, color, border: `8px solid ${C.ink}`,
    boxShadow: `12px 12px 0 0 ${C.ink}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: FONT.display, fontWeight: 800, fontSize: 140, lineHeight: 1,
  }}>{n}</div>
);

/* S03 — DẤM BỖNG ① */
const S03: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(10); const e3 = useEntry(22); const e4 = useEntry(36); const e5 = useEntry(52);
  return (
    <AbsoluteFill style={{ background: C.pillarBDark }}>
      <Photo shot="S03B_RICE_FERMENT"
        placeholder={`linear-gradient(135deg, ${C.pillarBDark} 0%, ${C.orange} 100%)`}
        tint="rgba(243,152,32,0.25)" opacity={0.5} />
      <Center gap={6} padTop={280}>
        <NumCircle n={1} scale={e1} />
        <div style={{
          transform: `scale(${e2})`,
          marginTop: 24, fontFamily: FONT.display, fontWeight: 800, fontSize: 170,
          color: C.yellowHi, ...STROKE(6, C.ink), textShadow: `0 10px 0 ${C.ink}`,
          lineHeight: 0.9, letterSpacing: -4, textAlign: 'center',
        }}>DẤM BỖNG</div>
        <div style={{
          transform: `scale(${e3}) rotate(-1deg)`, marginTop: 18,
          background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 14,
          padding: '14px 36px', boxShadow: `12px 12px 0 0 ${C.ink}`,
          fontFamily: FONT.heading, fontWeight: 800, fontSize: 34, letterSpacing: 3,
        }}>LINH HỒN · KHÔNG PHẢI MẮM TÔM</div>
        <div style={{
          opacity: e4, marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { txt: 'men gạo nếp', coral: false },
            { txt: 'lên men tự nhiên', coral: true },
            { txt: 'chua thanh', coral: false },
          ].map((c, i) => (
            <div key={i} style={{
              background: c.coral ? C.coral : C.white, color: c.coral ? C.white : C.ink,
              border: `5px solid ${C.ink}`, borderRadius: 999, padding: '12px 26px',
              boxShadow: `8px 8px 0 0 ${C.coral}`,
              fontFamily: FONT.heading, fontWeight: 800, fontSize: 32,
            }}>{c.txt}</div>
          ))}
        </div>
        <div style={{
          transform: `scale(${e5}) rotate(1deg)`, marginTop: 24,
          background: C.orange, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 16,
          padding: '14px 40px', boxShadow: `12px 12px 0 0 ${C.ink}`,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 50, letterSpacing: 4,
        }}>★ VÀNG ÓNG ★</div>
      </Center>
    </AbsoluteFill>
  );
};

/* S04 — ỐC NHỒI ② */
const S04: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(10); const e3 = useEntry(22); const e4 = useEntry(38);
  return (
    <AbsoluteFill style={{ background: C.yellow }}>
      <Center gap={6} padTop={280}>
        <NumCircle n={2} bg={C.red} color={C.white} scale={e1} />
        <div style={{
          transform: `scale(${e2})`, marginTop: 24,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 200, color: C.red,
          ...STROKE(6, C.ink), textShadow: `0 10px 0 ${C.ink}`,
          lineHeight: 0.9, letterSpacing: -6, textAlign: 'center',
        }}>ỐC NHỒI</div>
        <div style={{
          transform: `scale(${e3}) rotate(-2deg)`, marginTop: 18,
          background: C.ink, color: C.yellowHi, border: `6px solid ${C.ink}`, borderRadius: 14,
          padding: '12px 30px', boxShadow: `12px 12px 0 0 ${C.red}`,
          fontFamily: FONT.heading, fontWeight: 800, fontSize: 32, letterSpacing: 3,
        }}>TO BẰNG ĐẦU NGÓN TAY CÁI</div>
        <div style={{ opacity: e4, marginTop: 30, display: 'flex', gap: 22, alignItems: 'center' }}>
          {/* good */}
          <div style={{
            width: 300, padding: '24px 18px', background: C.white, border: `6px solid ${C.ink}`,
            borderRadius: 20, boxShadow: `12px 12px 0 0 ${C.red}`, transform: 'rotate(-2deg)', textAlign: 'center',
          }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 50, lineHeight: 1, letterSpacing: -1 }}>Ốc nhồi</div>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 80, lineHeight: 1, marginTop: 8, color: C.green }}>✓</div>
          </div>
          <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 60, color: C.ink, letterSpacing: 2 }}>≠</div>
          {/* bad */}
          <div style={{
            width: 300, padding: '24px 18px', background: C.cream, border: `6px solid ${C.ink}`,
            borderRadius: 20, boxShadow: `12px 12px 0 0 ${C.ink}`, transform: 'rotate(2deg)', opacity: 0.95, textAlign: 'center',
          }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 50, lineHeight: 1, letterSpacing: -1 }}>Ốc đá</div>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 80, lineHeight: 1, marginTop: 8, color: C.red }}>✗</div>
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* S05 — RAU ③ */
const S05: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(12); const e3 = useEntry(28); const e4 = useEntry(46);
  return (
    <AbsoluteFill style={{ background: C.off }}>
      <Center gap={4} padTop={270}>
        <NumCircle n={3} bg={C.red} color={C.white} scale={e1} />
        <div style={{
          transform: `scale(${e2})`, marginTop: 24,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 120, color: C.ink,
          lineHeight: 0.95, letterSpacing: -3, textAlign: 'center',
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <span style={{
            background: C.red, color: C.white, padding: '4px 24px',
            border: `6px solid ${C.ink}`, borderRadius: 14, display: 'inline-block',
            boxShadow: `8px 8px 0 0 ${C.ink}`,
          }}>KHÔNG</span>
          <span>RAU NGUYÊN CÂY</span>
        </div>
        <div style={{
          opacity: e3, marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: 900,
        }}>
          <div style={{
            background: C.cream, border: `6px solid ${C.ink}`, borderRadius: 20,
            boxShadow: `14px 14px 0 0 ${C.ink}`, padding: '22px 18px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', minHeight: 200,
            opacity: 0.85, transform: 'rotate(-2deg)',
          }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 64, lineHeight: 1, color: C.red }}>✗</div>
            <div style={{ fontFamily: FONT.heading, fontWeight: 800, fontSize: 32, lineHeight: 1.1, letterSpacing: 1 }}>RAU SỐNG NGUYÊN CÂY</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, color: C.body, letterSpacing: 2, marginTop: 4 }}>như bún khác</div>
          </div>
          <div style={{
            background: C.yellowHi, border: `6px solid ${C.ink}`, borderRadius: 20,
            boxShadow: `14px 14px 0 0 ${C.red}`, padding: '22px 18px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', minHeight: 200,
            transform: 'rotate(2deg)',
          }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 64, lineHeight: 1, color: C.green }}>✓</div>
            <div style={{ fontFamily: FONT.heading, fontWeight: 800, fontSize: 32, lineHeight: 1.1, letterSpacing: 1 }}>TÍA TÔ + KINH GIỚI</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, color: C.body, letterSpacing: 2, marginTop: 4 }}>THÁI NHỎ</div>
          </div>
        </div>
        <div style={{
          opacity: e4, marginTop: 26,
          fontFamily: FONT.heading, fontStyle: 'italic', fontWeight: 700, fontSize: 32,
          color: C.ink, letterSpacing: 1,
          background: C.white, border: `4px dashed ${C.ink}`, borderRadius: 14, padding: '10px 30px',
        }}>— giữ vị tinh tế của nước canh —</div>
      </Center>
    </AbsoluteFill>
  );
};

/* S06 — WHY NGUỘI */
const S06: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14); const e3 = useEntry(30);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <ImageSequence shots={['S06A_HANOI_VENDOR', 'S06B_OLD_STREET']}
        placeholder={`linear-gradient(135deg, #3a2e1f 0%, ${C.pillarBDark} 100%)`}
        tint="rgba(90,58,31,0.50)" opacity={0.55} />
      <Center gap={6} padTop={280}>
        <div style={{
          transform: `scale(${e1})`,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 170, color: C.yellowHi,
          lineHeight: 0.95, letterSpacing: -2, ...STROKE(6, C.ink),
          textShadow: `0 10px 0 ${C.ink}`, textAlign: 'center',
        }}>VÌ SAO<br/>NGUỘI?</div>
        <div style={{
          transform: `scale(${e2}) rotate(-3deg)`, marginTop: 22,
          background: C.yellowHi, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 14,
          padding: '14px 38px', boxShadow: `12px 12px 0 0 ${C.ink}`,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 54, letterSpacing: 4,
        }}>★ 70 NĂM TRƯỚC ★</div>
        <div style={{ opacity: e3, marginTop: 36, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { ic: '🚫', lb: 'KHÔNG BẾP', shadow: C.coral, rot: -2 },
            { ic: '❄', lb: 'ĐỂ NGUỘI', shadow: C.yellowHi, rot: 2 },
            { ic: '🚶', lb: 'MANG ĐI', shadow: C.coral, rot: -1 },
          ].map((b, i) => (
            <div key={i} style={{
              width: 280, padding: '24px 16px',
              background: C.white, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 20,
              boxShadow: `14px 14px 0 0 ${b.shadow}`,
              textAlign: 'center', transform: `rotate(${b.rot}deg)`,
            }}>
              <div style={{ fontSize: 80, lineHeight: 1 }}>{b.ic}</div>
              <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 36, letterSpacing: 1, marginTop: 6, lineHeight: 1.05 }}>{b.lb}</div>
            </div>
          ))}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── Shop card template (used by S07/S08/S09) ─── */
type Pill = { txt: string; variant?: 'default' | 'teal' | 'coral' | 'ink' };
const ShopCard: React.FC<{
  tag: string; name: React.ReactNode; nameColor: string; nameStrokeColor?: string;
  rows: Pill[][]; bottomTag: string; bottomTagStyle?: React.CSSProperties;
  cardBg?: string; stamp?: string;
  delayBase?: number;
}> = ({ tag, name, nameColor, nameStrokeColor = C.ink, rows, bottomTag, bottomTagStyle, cardBg = C.cream, stamp = 'MLEM!', delayBase = 0 }) => {
  const e1 = useEntry(delayBase);
  const e2 = useEntry(delayBase + 8);
  const eRows = rows.map((_, i) => useEntry(delayBase + 18 + i * 8));
  const eTag = useEntry(delayBase + 18 + rows.length * 8 + 6);
  const eStamp = useEntry(delayBase + 18 + rows.length * 8 + 14);
  const pillStyle = (v?: string) => {
    const base = { background: C.yellowHi, color: C.ink };
    if (v === 'teal') return { background: C.teal, color: C.ink };
    if (v === 'coral') return { background: C.coral, color: C.white };
    if (v === 'ink') return { background: C.ink, color: C.yellowHi };
    return base;
  };
  return (
    <div style={{
      transform: `scale(${e1})`,
      width: 880, padding: '60px 50px 50px',
      background: cardBg, color: C.ink,
      border: `8px solid ${C.ink}`, borderRadius: 32, boxShadow: `20px 20px 0 0 ${C.ink}`,
      textAlign: 'center', position: 'relative',
    }}>
      {/* QUÁN tag (top) */}
      <div style={{
        position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)',
        background: C.ink, color: C.yellowHi, border: `5px solid ${C.ink}`, borderRadius: 999,
        padding: '8px 28px',
        fontFamily: FONT.display, fontWeight: 800, fontSize: 24, letterSpacing: 3, whiteSpace: 'nowrap',
      }}>{tag}</div>
      {/* name */}
      <div style={{
        transform: `scale(${e2})`,
        fontFamily: FONT.display, fontWeight: 800, fontSize: 170, lineHeight: 0.95, letterSpacing: -3,
        color: nameColor, WebkitTextStroke: `5px ${nameStrokeColor}`, paintOrder: 'stroke fill' as const,
        textShadow: `0 8px 0 ${C.ink}`,
      }}>{name}</div>
      {/* rows */}
      {rows.map((row, ri) => (
        <div key={ri} style={{
          marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center',
          opacity: eRows[ri],
        }}>
          {row.map((p, pi) => (
            <div key={pi} style={{
              ...pillStyle(p.variant),
              border: `4px solid ${C.ink}`, borderRadius: 999,
              padding: '12px 26px', boxShadow: `6px 6px 0 0 ${C.ink}`,
              fontFamily: FONT.heading, fontWeight: 800, fontSize: 30,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              whiteSpace: 'nowrap',
            }}>{p.txt}</div>
          ))}
        </div>
      ))}
      {/* bottom tag */}
      <div style={{
        transform: `scale(${eTag}) rotate(-1deg)`,
        marginTop: 18, display: 'inline-block',
        background: C.red, color: C.white, border: `5px solid ${C.ink}`, borderRadius: 14,
        padding: '10px 28px', boxShadow: `8px 8px 0 0 ${C.ink}`,
        fontFamily: FONT.display, fontWeight: 800, fontSize: 34, letterSpacing: 2,
        ...bottomTagStyle,
      }}>{bottomTag}</div>
      {/* MLEM stamp */}
      <div style={{
        position: 'absolute', top: -26, right: -30, transform: `scale(${eStamp}) rotate(12deg)`,
        background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 999,
        padding: '10px 22px', boxShadow: `8px 8px 0 0 ${C.ink}`,
        fontFamily: FONT.display, fontWeight: 800, fontSize: 32, letterSpacing: 2,
      }}>{stamp}</div>
    </div>
  );
};

/* S07 — Quán #1 Bà Lương */
const S07: React.FC = () => (
  <AbsoluteFill style={{ background: C.off }}>
    <Center gap={0} padTop={500} align="top">
      <ShopCard
        tag="QUÁN #1"
        name={<>BÀ<br/>LƯƠNG</>}
        nameColor={C.red}
        rows={[
          [{ txt: '📍 Ngõ 191 Khương Thượng' }],
          [{ txt: '⏰ 8h30 — 22h30', variant: 'teal' }],
        ]}
        bottomTag="🏛 GIA TRUYỀN 40 NĂM"
      />
    </Center>
  </AbsoluteFill>
);

/* S08 — Quán #2 Cô Huệ */
const S08: React.FC = () => (
  <AbsoluteFill style={{ background: C.off }}>
    <Center gap={0} padTop={500} align="top">
      <ShopCard
        tag="QUÁN #2"
        name={<>CÔ<br/>HUỆ</>}
        nameColor={C.coral}
        cardBg={C.white}
        rows={[
          [{ txt: '📍 43 Nguyễn Siêu (phố cổ)' }],
          [{ txt: '⏰ 6h — 14h', variant: 'teal' }, { txt: '💵 35–45K / bát', variant: 'ink' }],
        ]}
        bottomTag="★ SÁNG SỚM PHỐ CỔ"
        bottomTagStyle={{ background: C.coral }}
      />
    </Center>
  </AbsoluteFill>
);

/* S09 — Quán #3 Cô Xuân */
const S09: React.FC = () => (
  <AbsoluteFill style={{ background: C.pillarBDark }}>
    <Photo shot="S09_O_QUAN_CHUONG_LANDMARK"
      placeholder={`linear-gradient(135deg, #5A3A1F 0%, ${C.pillarBDark} 100%)`}
      tint="rgba(248,177,71,0.15)" opacity={0.55} />
    <Center gap={0} padTop={500} align="top">
      <ShopCard
        tag="QUÁN #3"
        name={<>CÔ<br/>XUÂN</>}
        nameColor={C.teal}
        nameStrokeColor={C.ink}
        rows={[
          [{ txt: '📍 Vỉa hè 1 Hàng Chiếu' }],
          [{ txt: 'đối diện Ô Quan Chưởng', variant: 'coral' }],
          [{ txt: '⏰ 8h — 13h', variant: 'teal' }],
        ]}
        bottomTag="🏛 VỊ TRUYỀN THỐNG PHỐ CỔ"
        bottomTagStyle={{ background: C.ink, color: C.yellowHi }}
      />
    </Center>
  </AbsoluteFill>
);

/* S10 — CTA bookmark + follow */
const S10: React.FC = () => {
  const e1 = useEntry(0); const e2 = useEntry(14); const e3 = useEntry(30); const e4 = useEntry(46); const e5 = useEntry(62);
  return (
    <AbsoluteFill style={{ background: C.pillarBDark }}>
      <Photo shot="S07_HERO_BOWL"
        placeholder={`linear-gradient(135deg, ${C.pillarBDark} 0%, #2a0a0a 100%)`}
        tint="rgba(200,48,45,0.20)" opacity={0.55} />
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(45deg, transparent 0 60px, rgba(255,210,74,0.10) 60px 120px)' }} />
      <Center gap={8} padTop={260} padBottom={340}>
        <div style={{
          transform: `scale(${e1}) rotate(-3deg)`,
          background: C.red, color: C.white, border: `8px solid ${C.ink}`, borderRadius: 24,
          padding: '24px 56px', boxShadow: `18px 18px 0 0 ${C.ink}`,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 80, letterSpacing: 1,
          textAlign: 'center', lineHeight: 1,
        }}>LƯU LẠI<br/>BOOKMARK 🔖</div>
        <div style={{
          transform: `scale(${e2})`, marginTop: 36,
          background: C.white, color: C.ink, border: `6px solid ${C.ink}`, borderRadius: 20,
          boxShadow: `14px 14px 0 0 ${C.yellowHi}`, padding: '22px 36px',
          fontFamily: FONT.display, fontWeight: 800, fontSize: 40, letterSpacing: 1, lineHeight: 1.4,
          textAlign: 'center',
        }}>
          <b style={{ color: C.red }}>1.BÀ LƯƠNG</b>
          <span style={{ margin: '0 14px', color: C.coral }}>·</span>
          <b style={{ color: C.red }}>2.CÔ HUỆ</b>
          <span style={{ margin: '0 14px', color: C.coral }}>·</span>
          <b style={{ color: C.red }}>3.CÔ XUÂN</b>
        </div>
        <div style={{
          transform: `scale(${e3})`, marginTop: 30,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 64, color: C.yellowHi,
          ...STROKE(4, C.ink), textShadow: `0 6px 0 ${C.ink}`, textAlign: 'center',
        }}>@tramdungmlem</div>
        <div style={{
          opacity: e4, marginTop: 6,
          fontFamily: FONT.heading, fontWeight: 700, fontSize: 30, color: C.cream, letterSpacing: 2,
        }}>🍜 mỗi ngày 1 món lạ thế giới</div>
        <div style={{
          transform: `scale(${e5}) rotate(-1deg)`, marginTop: 14,
          background: C.coral, color: C.white, border: `6px solid ${C.ink}`, borderRadius: 999,
          padding: '14px 42px', boxShadow: `12px 12px 0 0 ${C.ink}`,
          fontFamily: FONT.display, fontWeight: 800, fontSize: 40, letterSpacing: 3, textTransform: 'uppercase',
        }}>↑ FOLLOW NGAY</div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── Karaoke style — unified white+ink-stroke for max contrast across all BGs;
   highlight bg varies per scene per design (yellow/coral/red/ink). ─── */
const karaokeStyleFor = (id: string) => {
  const base = {
    textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5,
    emphasisColor: C.yellowHi,
  };
  const yellow = { ...base, highlightBg: C.yellowHi, highlightTextColor: C.ink, highlightShadowColor: C.ink };
  const coral  = { ...base, highlightBg: C.coral,    highlightTextColor: C.white, highlightShadowColor: C.ink };
  const red    = { ...base, highlightBg: C.red,      highlightTextColor: C.white, highlightShadowColor: C.ink };
  const ink    = { ...base, highlightBg: C.ink,      highlightTextColor: C.yellowHi, highlightShadowColor: C.red };
  switch (id) {
    case 'S02_REVEAL':            return coral;
    case 'S04_OC_NHOI':           return ink;
    case 'S05_HERBS':             return coral;
    case 'S07_QUAN_BA_LUONG':     return red;
    case 'S08_QUAN_CO_HUE':       return red;
    case 'S09_QUAN_O_QUAN_CHUONG':return ink;
    case 'S10_CTA_BOOKMARK':      return coral;
    case 'S01_HOOK':
    case 'S03_DAM_BONG':
    case 'S06_WHY_NGUOI':
    default:                      return yellow;
  }
};

/* ─── Fix common Whisper transcription errors so subtitle reads cleanly ─── */
const FIX_MAP: Record<string, string> = {
  'ngụi': 'nguội', 'ngụi.': 'nguội.', 'ngụi,': 'nguội,',
  'Ngụi': 'Nguội', 'Ngụi.': 'Nguội.',
  '1': 'một', '2': 'hai', '3': 'ba',
  'Vạn': 'Bạn',
  'bầy': 'bày', 'bầy.': 'bày.',
  'Mlèm': 'Mlem', 'lèm': 'lem', 'Lèm': 'Lem',
  'Mở': 'Dừng', 'mở': 'dừng',  // Whisper: "Trạm Dừng" → "Trạm Mở"
  'kích,': 'cái,', 'kích.': 'cái.', 'kích': 'cái',
};
const cleanWord = (w: string): string => FIX_MAP[w] ?? w;

/* ─── Subtitle backdrop — dark fade band at bottom so karaoke always readable on any BG ─── */
const SubtitleBackdrop: React.FC = () => (
  <AbsoluteFill style={{
    background: 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.50) 22%, rgba(0,0,0,0.35) 32%, transparent 42%)',
    pointerEvents: 'none',
    zIndex: 5,
  }} />
);

/* ─── Header overrides — pillar badge + channel mark at top:92 (32px lower than shared default) ─── */
const HEADER_TOP = 120;
const PillarBadgeB: React.FC = () => (
  <div style={{
    position: 'absolute', top: HEADER_TOP, left: 60, zIndex: 10,
    display: 'flex', alignItems: 'center', gap: 14,
    background: C.red, color: C.white,
    border: `3px solid ${C.ink}`, borderRadius: 999,
    padding: '12px 22px 12px 14px', boxShadow: `6px 6px 0 0 ${C.ink}`,
    fontFamily: FONT.heading, fontWeight: 800, fontSize: 26, letterSpacing: 1.5,
  }}>
    <span style={{
      width: 44, height: 44, borderRadius: '50%',
      background: C.ink, color: C.yellowHi,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT.display, fontWeight: 800, fontSize: 30,
    }}>B</span>
    <span>MÓN LẠ QUỐC GIA</span>
  </div>
);
const ChannelMarkLow: React.FC = () => (
  <div style={{
    position: 'absolute', top: HEADER_TOP, right: 60, zIndex: 10,
    background: C.ink, color: C.yellowHi,
    border: `3px solid ${C.ink}`, borderRadius: 999,
    padding: '10px 22px', boxShadow: `4px 4px 0 0 ${C.ink}`,
    fontFamily: FONT.display, fontWeight: 800, fontSize: 24,
    letterSpacing: 2, textTransform: 'uppercase',
  }}>Trạm Dừng Mlem</div>
);

/* ─── Dispatcher ─── */
const SceneBlock: React.FC<{ id: string }> = ({ id }) => {
  const sc = getScene(id);
  if (!sc) return <SceneFrame pillar="b" bg={C.ink} withBadge={false} withMark={false}><div /></SceneFrame>;
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

  // S01 + S10 no pillar badge; S01 no channel mark (per design HTML)
  const showBadge = !['S01_HOOK', 'S10_CTA_BOOKMARK'].includes(id);
  const showMark = id !== 'S01_HOOK';
  const bg = sc.bg || C.off;

  return (
    <SceneFrame pillar="b" bg={bg} withBadge={false} withMark={false}>
      {body}
      <SubtitleBackdrop />
      {showBadge && <PillarBadgeB />}
      {showMark && <ChannelMarkLow />}
      {sc.perWord && sc.perWord.length > 0 && (
        <SubtitleKaraoke
          text={sc.perWord.map((w) => cleanWord(w.word)).join(' ')}
          perWord={perWordSec}
          sceneStartSec={sc.start / 30}
          emphasis={sc.emphasis}
          bottom={200}
          fontSize={42}
          strokeWidth={ko.strokeWidth}
          minWordsPerPage={6}
          maxWordsPerPage={14}
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
