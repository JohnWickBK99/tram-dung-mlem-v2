/**
 * Canhcathaibinh SceneBlock — 90s LONG-FORM documentary, Pillar B amber.
 * 7 scenes · gradient fallbacks (assets pending) + karaoke subtitle driver.
 */
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import scenesData from '../../../public/canhcathaibinh/scenes-with-perword.json';
import manifest from '../../../public/canhcathaibinh/_manifest.json';
import { SceneFrame, SubtitleKaraoke } from '../../shared';
import { FONT_FAMILY } from '../../shared/fonts';

const FONT = FONT_FAMILY;
const C = {
  amber: '#D97742', amberDark: '#A85529', amberLight: '#EBA67A', amberSoft: '#F5C9A6',
  cream: '#FFF4E0', creamDeep: '#F5E3C4', ink: '#1A1A1A', body: '#5C5443',
  yellow: '#FFD23F', yellowHi: '#FFEAA0', coral: '#E85D2F', teal: '#4FC3D1', white: '#FFF',
};

type ManifestEntry = { kind: 'image' | 'video'; file: string };
const M = manifest as Record<string, ManifestEntry>;

type Scene = {
  id: string; start: number; end: number; durFrames: number;
  voiceText?: string; emphasis?: string[];
  perWord?: { word: string; start: number; end: number }[];
};

const getScene = (id: string): Scene | undefined =>
  (scenesData.scenes as unknown as Scene[]).find((s) => s.id === id);

const useEntry = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 }, durationInFrames: 24 });
};

/* ─── Photo backdrop ─── */
const Photo: React.FC<{ shot?: string; tint?: string; placeholder: string; opacity?: number; kenBurns?: boolean }> = ({
  shot, tint = 'rgba(217,119,66,0.18)', placeholder, opacity = 0.6, kenBurns = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = kenBurns ? 1.0 + 0.05 * (frame / Math.max(durationInFrames - 1, 1)) : 1.0;
  const m = shot ? M[shot] : null;
  return (
    <AbsoluteFill style={{ background: placeholder, overflow: 'hidden' }}>
      {m && m.kind === 'image' && (
        <Img src={staticFile(`canhcathaibinh/${m.file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, transform: `scale(${scale})`, filter: 'saturate(1.15) contrast(1.10)' }} />
      )}
      {m && m.kind === 'video' && (
        <OffthreadVideo src={staticFile(`canhcathaibinh/${m.file}`)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, transform: `scale(${scale})` }} />
      )}
      <AbsoluteFill style={{ background: tint, mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.40) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

const Center: React.FC<{ children: React.ReactNode; gap?: number; padTop?: number; padBottom?: number }> = ({
  children, gap = 18, padTop = 220, padBottom = 460,
}) => (
  <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap, padding: `${padTop}px 70px ${padBottom}px` }}>
    {children}
  </AbsoluteFill>
);

const Sticker: React.FC<{
  bg: string; color: string; border?: string; size?: number; weight?: number;
  rotate?: number; pad?: string; radius?: number; letterSpacing?: number;
  children: React.ReactNode; style?: React.CSSProperties;
}> = ({ bg, color, border = C.ink, size = 56, weight = 800, rotate = 0, pad = '14px 32px', radius = 14, letterSpacing = 0, children, style }) => (
  <div style={{
    background: bg, color, border: `5px solid ${border}`, borderRadius: radius, padding: pad,
    boxShadow: `10px 10px 0 0 ${border}`, fontFamily: FONT.display, fontWeight: weight,
    fontSize: size, letterSpacing, transform: `rotate(${rotate}deg)`, textAlign: 'center', lineHeight: 1.1,
    ...style,
  }}>{children}</div>
);

const BigOutlineText: React.FC<{ children: React.ReactNode; size?: number; color?: string; stroke?: number; shadow?: number; style?: React.CSSProperties }> = ({
  children, size = 100, color = C.white, stroke = 6, shadow = 8, style,
}) => (
  <div style={{
    fontFamily: FONT.display, fontWeight: 800, fontSize: size, color, lineHeight: 1.0,
    WebkitTextStroke: `${stroke}px ${C.ink}`, paintOrder: 'stroke fill' as const,
    textShadow: `0 ${shadow}px 0 ${C.ink}`, textAlign: 'center', ...style,
  }}>{children}</div>
);

/* ─── S01: HOOK — "Một món ăn 400 năm tuổi…" 4s ─── */
const S01: React.FC = () => {
  const e1 = useEntry(0);
  const e2 = useEntry(10);
  const e3 = useEntry(22);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo shot="S01_HOOK" placeholder={`linear-gradient(135deg,${C.amberDark} 0%,#3a1a0d 100%)`} tint="rgba(168,85,41,0.40)" opacity={0.55} kenBurns />
      <Center gap={24} padTop={260} padBottom={520}>
        <BigOutlineText size={220} style={{ transform: `scale(${e1})`, color: C.yellowHi }}>400</BigOutlineText>
        <BigOutlineText size={88} style={{ transform: `scale(${e2})`, marginTop: -16, color: C.white, letterSpacing: 4 }}>NĂM TUỔI</BigOutlineText>
        <div style={{ transform: `scale(${e3}) rotate(-2deg)` }}>
          <Sticker bg={C.amber} color={C.white} size={42} weight={800} pad="14px 34px" letterSpacing={1}>
            Bạn đoán là món gì?
          </Sticker>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S02: LỊCH SỬ — Phố Dâu Gia, thế kỷ 17 — 11s ─── */
const S02: React.FC = () => {
  const e1 = useEntry(0);
  const e2 = useEntry(20);
  const e3 = useEntry(180);
  return (
    <AbsoluteFill style={{ background: C.creamDeep }}>
      <Photo shot="S02_LICH_SU" placeholder={`linear-gradient(160deg,${C.amberLight} 0%,${C.creamDeep} 60%,${C.cream} 100%)`} tint="rgba(255,244,224,0.28)" opacity={0.5} kenBurns />
      <Center gap={22} padTop={210} padBottom={520}>
        <Sticker bg={C.ink} color={C.yellowHi} size={56} pad="16px 40px" letterSpacing={1} style={{ transform: `scale(${e1})` }}>
          Canh Cá Quỳnh Côi
        </Sticker>
        <Sticker bg={C.cream} color={C.amberDark} size={48} pad="12px 32px" rotate={-1.5} style={{ transform: `scale(${e2}) rotate(-1.5deg)` }}>
          Thế kỷ 17 · Thái Bình
        </Sticker>
        <div style={{ opacity: e3, marginTop: 16 }}>
          <Sticker bg={C.amber} color={C.white} size={42} pad="14px 38px" letterSpacing={2}>
            🌳 PHỐ DÂU GIA
          </Sticker>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S03: SỢI BÁNH ĐA LÀNG ĐỢI — 12s ─── */
const S03: React.FC = () => {
  const e1 = useEntry(0);
  const e2 = useEntry(20);
  const e3 = useEntry(140);
  const e4 = useEntry(260);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Photo shot="S03_BANHDA" placeholder={`linear-gradient(140deg,${C.cream} 0%,${C.amberSoft} 70%,${C.amberLight} 100%)`} tint="rgba(255,244,224,0.32)" opacity={0.5} kenBurns />
      <Center gap={24} padTop={200} padBottom={520}>
        <Sticker bg={C.amberDark} color={C.yellowHi} size={48} pad="14px 32px" style={{ transform: `scale(${e1})` }}>
          🍜 LÀNG ĐỢI
        </Sticker>
        <BigOutlineText size={86} style={{ transform: `scale(${e2})`, color: C.white, marginTop: 4 }}>
          Sợi bánh đa<br/>3 li trắng trong
        </BigOutlineText>
        <Sticker bg={C.amber} color={C.white} size={36} pad="10px 26px" rotate={-2} style={{ transform: `scale(${e3}) rotate(-2deg)`, marginTop: 14 }}>
          Xã Đông Hải · Huyện Quỳnh Phụ
        </Sticker>
        <Sticker bg={C.yellowHi} color={C.ink} size={34} pad="8px 24px" rotate={2} style={{ transform: `scale(${e4}) rotate(2deg)`, marginTop: 8 }}>
          Dai mềm · thơm gạo
        </Sticker>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S04: CÁ RÔ ĐỒNG TỰ NHIÊN + XƯƠNG NINH 16H — 12s ─── */
const S04: React.FC = () => {
  const e1 = useEntry(0);
  const e2 = useEntry(20);
  const e3 = useEntry(140);
  const e4 = useEntry(260);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo shot="S04_CARODONG" placeholder={`linear-gradient(135deg,${C.amberDark} 0%,#2a1a10 100%)`} tint="rgba(217,119,66,0.22)" opacity={0.55} kenBurns />
      <Center gap={20} padTop={210} padBottom={520}>
        <Sticker bg={C.amber} color={C.white} size={44} pad="12px 30px" letterSpacing={2} style={{ transform: `scale(${e1})` }}>
          🐟 CÁ RÔ ĐỒNG TỰ NHIÊN
        </Sticker>
        <BigOutlineText size={70} style={{ transform: `scale(${e2})`, color: C.yellowHi, marginTop: 8 }}>
          Bằng 2 ngón tay<br/>· Ruộng nước Thái Bình ·
        </BigOutlineText>
        <Sticker bg={C.amberDark} color={C.yellowHi} size={38} pad="10px 28px" rotate={-1.5} style={{ transform: `scale(${e3}) rotate(-1.5deg)`, marginTop: 16 }}>
          Tháng 10 âm — mùa cá béo nhất
        </Sticker>
        <Sticker bg={C.coral} color={C.white} size={36} pad="10px 26px" rotate={1.5} style={{ transform: `scale(${e4}) rotate(1.5deg)`, marginTop: 6 }}>
          Thơm · ngọt · không tanh
        </Sticker>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S05: CHẾ BIẾN 3 BƯỚC — 24s LONG  ─── */
const S05: React.FC = () => {
  const e0 = useEntry(0);
  const step1 = useEntry(20);
  const step2 = useEntry(280);
  const step3 = useEntry(520);
  const finale = useEntry(670);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo shot="S05_CHEBIEN" placeholder={`linear-gradient(150deg,${C.amber} 0%,${C.amberDark} 60%,#2a1408 100%)`} tint="rgba(217,119,66,0.18)" opacity={0.5} />
      <Center gap={14} padTop={160} padBottom={480}>
        <Sticker bg={C.yellowHi} color={C.ink} size={44} pad="12px 32px" letterSpacing={1} style={{ transform: `scale(${e0})` }}>
          ⏱️ CHẾ BIẾN — 3 BƯỚC
        </Sticker>

        <div style={{ transform: `scale(${step1})`, opacity: step1 }}>
          <Sticker bg={C.cream} color={C.amberDark} size={36} pad="12px 30px" rotate={-1.5} radius={18}>
            <div style={{ fontSize: 24, color: C.amber, letterSpacing: 3, marginBottom: 4 }}>BƯỚC 1 — HẤP 7 PHÚT</div>
            Gỡ thịt · ướp 30p · nướng 5p
          </Sticker>
        </div>

        <div style={{ transform: `scale(${step2})`, opacity: step2 }}>
          <Sticker bg={C.amber} color={C.white} size={36} pad="12px 30px" rotate={1.5} radius={18}>
            <div style={{ fontSize: 24, color: C.yellowHi, letterSpacing: 3, marginBottom: 4 }}>BƯỚC 2 — HẦM XƯƠNG 16H</div>
            Xương cá rô + xương heo
          </Sticker>
        </div>

        <div style={{ transform: `scale(${step3})`, opacity: step3 }}>
          <Sticker bg={C.amberDark} color={C.yellowHi} size={36} pad="12px 30px" rotate={-1.5} radius={18}>
            <div style={{ fontSize: 24, color: C.yellow, letterSpacing: 3, marginBottom: 4 }}>BƯỚC 3 — XÀO 3 PHÚT</div>
            Thịt cá + hành phi · chan bánh đa
          </Sticker>
        </div>

        <div style={{ opacity: finale }}>
          <Sticker bg={C.coral} color={C.white} size={32} pad="10px 26px" rotate={2}>
            ✓ Truyền thống 4 đời
          </Sticker>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S06: ĐỊA CHỈ — Quán Thái Bình — 14s ─── */
const S06: React.FC = () => {
  const e0 = useEntry(0);
  const c1 = useEntry(40);
  const c2 = useEntry(150);
  const c3 = useEntry(240);
  const c4 = useEntry(330);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <AbsoluteFill style={{ background: `linear-gradient(160deg,${C.cream} 0%,${C.amberSoft} 100%)` }} />
      <Center gap={14} padTop={170} padBottom={500}>
        <Sticker bg={C.amberDark} color={C.yellowHi} size={48} pad="14px 36px" letterSpacing={2} style={{ transform: `scale(${e0})` }}>
          📍 QUÁN UY TÍN
        </Sticker>
        <BigOutlineText size={56} style={{ color: C.amberDark, marginTop: 4, transform: `scale(${e0})` }}>
          Thị trấn Quỳnh Côi
        </BigOutlineText>

        <div style={{ transform: `translateY(${(1 - c1) * 60}px)`, opacity: c1 }}>
          <Sticker bg={C.amber} color={C.white} size={36} pad="12px 28px" radius={16}>
            ⭐ Quán Bẩy — 63 Đào Đình Luyện
          </Sticker>
        </div>
        <div style={{ transform: `translateY(${(1 - c2) * 60}px)`, opacity: c2 }}>
          <Sticker bg={C.amberDark} color={C.yellowHi} size={32} pad="10px 26px" rotate={-1.5} radius={16}>
            Vũ Gia — phố Trần Hưng Đạo
          </Sticker>
        </div>
        <div style={{ transform: `translateY(${(1 - c3) * 60}px)`, opacity: c3 }}>
          <Sticker bg={C.coral} color={C.white} size={32} pad="10px 26px" rotate={1.5} radius={16}>
            Bốn Mùa — xã Quỳnh Hải
          </Sticker>
        </div>
        <div style={{ transform: `translateY(${(1 - c4) * 60}px)`, opacity: c4 }}>
          <Sticker bg={C.teal} color={C.ink} size={28} pad="10px 24px" radius={14}>
            San sát Trần Hưng Đạo: Quang · Ba Huê · Miêu
          </Sticker>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── S07: KẾT BÀI — 13s ─── */
const S07: React.FC = () => {
  const e1 = useEntry(0);
  const e2 = useEntry(80);
  const e3 = useEntry(200);
  const e4 = useEntry(280);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo shot="S07_KETBAI" placeholder={`linear-gradient(180deg,${C.amberDark} 0%,${C.amber} 50%,#2a1408 100%)`} tint="rgba(255,244,224,0.18)" opacity={0.5} kenBurns />
      <Center gap={22} padTop={230} padBottom={500}>
        <BigOutlineText size={72} style={{ transform: `scale(${e1})`, color: C.yellowHi }}>
          400 năm<br/>văn hoá đồng quê
        </BigOutlineText>
        <Sticker bg={C.amber} color={C.white} size={38} pad="12px 30px" rotate={-1.5} style={{ transform: `scale(${e2}) rotate(-1.5deg)`, marginTop: 14 }}>
          Thái Bình — Quỳnh Côi
        </Sticker>
        <div style={{ opacity: e3, marginTop: 24 }}>
          <Sticker bg={C.cream} color={C.amberDark} size={32} pad="10px 26px">
            Có dịp về Thái Bình — đừng quên ghé
          </Sticker>
        </div>
        <div style={{ transform: `scale(${e4}) rotate(-1.5deg)`, marginTop: 22 }}>
          <Sticker bg={C.coral} color={C.white} size={42} pad="14px 40px" letterSpacing={3} radius={999} weight={800}>
            ↑ FOLLOW NGAY
          </Sticker>
        </div>
        <div style={{ opacity: e4, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.yellowHi, marginTop: 6, WebkitTextStroke: `2px ${C.ink}`, paintOrder: 'stroke fill' as const }}>
          Trạm Dừng Mlem
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ─── Karaoke styling per scene BG ─── */
const karaokeStyleFor = (id: string) => {
  switch (id) {
    case 'S06_DIA_CHI':
      // Cream BG → ink fill, no white stroke
      return {
        highlightBg: C.amber, highlightTextColor: C.white, highlightShadowColor: C.ink,
        textColor: C.ink, textStrokeColor: C.cream, strokeWidth: 0, emphasisColor: C.amberDark,
      };
    case 'S05_CHE_BIEN':
      // Amber/ink BG → karaoke amber bg
      return {
        highlightBg: C.amber, highlightTextColor: C.white, highlightShadowColor: C.ink,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 4, emphasisColor: C.yellowHi,
      };
    case 'S01_HOOK':
    case 'S03_DAC_SAC_BANH_DA':
    case 'S04_DAC_SAC_CA_RO_DONG':
    case 'S07_KET_BAI':
      // Photo/ink BG → ink-bg pop + yellow text + amber shadow
      return {
        highlightBg: C.ink, highlightTextColor: C.yellowHi, highlightShadowColor: C.amber,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.yellowHi,
      };
    case 'S02_LICH_SU':
    default:
      return {
        highlightBg: C.yellow, highlightTextColor: C.ink, highlightShadowColor: C.ink,
        textColor: C.white, textStrokeColor: C.ink, strokeWidth: 5, emphasisColor: C.amberDark,
      };
  }
};

/* ─── Dispatcher ─── */
export const SceneBlock: React.FC<{ id: string }> = ({ id }) => {
  const sc = getScene(id);
  if (!sc) return <SceneFrame pillar="b" bg={C.ink}><div /></SceneFrame>;
  const sceneStartSec = sc.start / 30;
  const perWordSec = sc.perWord?.map((w) => w.start);
  const ko = karaokeStyleFor(id);

  let body: React.ReactNode = null;
  switch (id) {
    case 'S01_HOOK': body = <S01 />; break;
    case 'S02_LICH_SU': body = <S02 />; break;
    case 'S03_DAC_SAC_BANH_DA': body = <S03 />; break;
    case 'S04_DAC_SAC_CA_RO_DONG': body = <S04 />; break;
    case 'S05_CHE_BIEN': body = <S05 />; break;
    case 'S06_DIA_CHI': body = <S06 />; break;
    case 'S07_KET_BAI': body = <S07 />; break;
  }

  const showBadge = !['S01_HOOK', 'S07_KET_BAI'].includes(id);
  const showMark = id !== 'S01_HOOK';

  return (
    <SceneFrame pillar="b" bg={C.ink} withBadge={showBadge} withMark={showMark}>
      {body}
      {sc.voiceText && (
        <SubtitleKaraoke
          text={sc.voiceText}
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
export const Scene02: React.FC = () => <SceneBlock id="S02_LICH_SU" />;
export const Scene03: React.FC = () => <SceneBlock id="S03_DAC_SAC_BANH_DA" />;
export const Scene04: React.FC = () => <SceneBlock id="S04_DAC_SAC_CA_RO_DONG" />;
export const Scene05: React.FC = () => <SceneBlock id="S05_CHE_BIEN" />;
export const Scene06: React.FC = () => <SceneBlock id="S06_DIA_CHI" />;
export const Scene07: React.FC = () => <SceneBlock id="S07_KET_BAI" />;
