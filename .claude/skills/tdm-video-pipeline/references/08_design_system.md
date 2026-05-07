# 08 — DESIGN SYSTEM (Universal Theme v1.0)

> Source of truth: `remotion-shared/theme/{theme.ts,tokens.json,globals.css}`.
> Direction A — **Playful Foodtoon**.

## Color hierarchy

```
brand:      yellow #F8B147 · orange #F39820 · coral #E85D2F · red #C8302D · teal #4FC3D1 · cream #FFF4E0
pillar.a:   light #FFE0A8 / base #F8B147 / dark #B87808
pillar.b:   light #F4B0AE / base #C8302D / dark #7A1614
pillar.c:   light #F9C5AE / base #E85D2F / dark #8E2F0F
pillar.d:   light #BEE7ED / base #4FC3D1 / dark #1F6E79
neutral:    0 #FFFFFF / 50 #FFFAF0 / 200 #EFE6D2 / 400 #A89C84 / 600 #5C5443 / 800 #2B2620 / 900 #1A1A1A
outline:    {neutral.900} #1A1A1A
```

## Font stack

```
display:  'Baloo 2', system-ui, sans-serif    ExtraBold 800
heading:  'Be Vietnam Pro', system-ui, sans-serif    Bold 700
body:     'Be Vietnam Pro', system-ui, sans-serif    Medium 500
mono:     'JetBrains Mono', ui-monospace, monospace  SemiBold 600
```

⚠️ Production gotcha: `@remotion/google-fonts/Baloo2` đăng ký vào browser dưới tên `"Baloo Two"`. Khi viết CSS-in-JS, có thể cần `'Baloo 2'` HOẶC `"Baloo Two"` — phụ thuộc Remotion version. **Cách an toàn**:
1. Dùng exact string từ `theme.font.family.display` (`'Baloo 2', system-ui, sans-serif`)
2. Kiểm bằng test render: nếu thấy fallback Helvetica → đổi sang `"Baloo Two"`.

## Type scale (Remotion 1080×1920)

| Token | Size px | Weight | Family | Use |
|-------|---------|--------|--------|-----|
| `font.video.hookXL` | 200 (max 240) | 800 | display | Hook 1-3 từ |
| `font.video.hookL` | 140 | 800 | display | Hook 4-7 từ |
| `font.video.title` | 96 | 800 | display | Cover, lower-third |
| `font.video.subtitle` | 56 | 700 | heading | Lower-third sub |
| `font.video.body` | 44 | 500 | body | Karaoke caption |
| `font.video.monoStat` | 280 | 700 | mono | **MAX 240 in production** — số lớn |
| `font.video.tag` | 32 | 700 | heading | Chip, badge |
| `font.video.caption` | 48 | 600 | body | SubtitleKaraoke |

## Karaoke caption — 5 RULES CỨNG (v1.1 layout-stable)

```tsx
// LAYOUT cố định — KHÔNG đổi theo active/inactive (rule 1)
const baseWordStyle = {
  padding: '4px 12px',                                // LUÔN — không jump
  fontSize: 48,
  fontWeight: weight.bold,
  lineHeight: 1.3,
  WebkitTextStroke: `4px ${color.outline}`,           // LUÔN — outline đen
  paintOrder: 'stroke fill',
  display: 'inline-block',
  transition: 'background-color 100ms, color 100ms',
};

// Chỉ swap color + bg khi active (rule 3 + 4)
const activeStyle  = { color: '#1A1A1A', background: '#F8B147' };  // đen + vàng
const inactiveStyle = { color: '#FFFFFF', background: 'transparent' }; // trắng + trong suốt

// Rule 5: active = t >= start && t < end + 0.04 (no overshoot)
// implemented in SubtitleKaraoke component

// Override cho scene nền vàng — dùng coral
// <SubtitleKaraoke ... highlightColor="#E85D2F" />
```

**v1.0 → v1.1 BUG FIX:** Trước đây padding inactive = `4px 0` vs active = `4px 12px` → gây nhảy ngang chữ khi karaoke chạy. Giờ padding luôn `4px 12px`, outline luôn 4px → ZERO layout jump.

## Shadow tokens (chunky offset solid)

```
stickerSm:  4px 4px 0 0 #1A1A1A
stickerMd:  8px 8px 0 0 #1A1A1A
stickerLg:  14px 14px 0 0 #1A1A1A
stickerXL:  20px 20px 0 0 #1A1A1A
```

KHÔNG dùng soft blur (`box-shadow: 0 4px 16px rgba(...)`) cho video. Web modal/dropdown OK.

## Border tokens

```
thin:    3px
base:    4px      ← chip, badge
thick:   6px      ← card outline
xthick:  8px      ← hero card
```

## Spacing (4-base grid)

```
1 → 4px / 2 → 8px / 3 → 12px / 4 → 16px / 5 → 20px /
6 → 24px / 8 → 32px / 10 → 40px / 12 → 48px /
16 → 64px / 20 → 80px / 24 → 96px / 32 → 128px
```

## Outline text helper

```tsx
import { outlineText } from '../shared';

<h1 style={{
  fontSize: 140,
  color: '#FFFFFF',
  ...outlineText('hook'),  // 6px stroke
  textShadow: '0 8px 0 #1A1A1A',
}}>
  HÓT NHẤT!
</h1>
```

`variant`:
- `'hook'` → 6px stroke
- `'body'` → 4px stroke
- `'thin'` → 2px stroke

## Photo treatment ("Vibrant Foodtoon")

```css
filter: saturate(1.25) contrast(1.18) brightness(1.05);
/* + outline overlay đen 3-4px quanh chủ thể (Find Edges → multiply blend) */
```

KHÔNG dùng grain. KHÔNG warm cinematic (sepia).

## Motion signature

```
Zoom Punch + Whip Transition (last 13 frames @ 30fps ~ 430ms)
- zoom-in     (frames 0..4)   scale 1.15 → 1.0
- hold        (frames 4..6)   scale 1.0
- whip blur   (frames 6..10)  blur 0 → 30px, scale 1.0 → 1.15
- zoom-out    (frames 10..13) scale 1.15 → 1.0 (next scene entry)
```

Implement: wrap scene root với `<ZoomPunch>...</ZoomPunch>`. Disabled by default trong preview để tránh giật.

## Mascot Mèo Mlem

6 expressions (PNG isolated, transparent BG):
- `mlem-happy.png` — vui vẻ (food khoe ngon)
- `mlem-shocked.png` — sốc (fact shock 0-3s)
- `mlem-drooling.png` — chảy nước miếng (close-up)
- `mlem-thinking.png` — suy tư (câu hỏi mở)
- `mlem-mindblown.png` — đầu nổ (kỷ lục)
- `mlem-sideeye.png` — liếc xéo (món ghê)

Đặt: `public/mascot/mlem-{expression}.png`.

Dùng:
- Hook bottom-right (200-240px) — entry với spring
- Reaction sticker khi voice nhấn shock
- Intro/outro

## SubtitleKaraoke variants

### Default (BG photo / dark)
```tsx
<SubtitleKaraoke text={text} perWord={words} sceneStartSec={start/30} />
// active bg yellow + text black
```

### Scene nền vàng (Pillar A scenes nhiều)
```tsx
<SubtitleKaraoke ... highlightColor="#E85D2F" />
// active bg coral + text black (yellow on yellow vô hình)
```

### Scene nền đỏ (Pillar B price scene)
```tsx
<SubtitleKaraoke ... highlightColor="#F8B147" />
// active bg yellow (override default behavior — vì BG đã đỏ pillar)
```

### Scene cream BG (Pillar B FAO)
```tsx
<SubtitleKaraoke ... highlightColor="#C8302D" />
// active bg đỏ pillar + text white
```

## PhotoBackdrop production rules

```tsx
<PhotoBackdrop
  src="<slug>/01_hook.jpg"
  vignette={0.45}                     // default
  fallbackBg="#1A1A1A"                // KHÔNG pillar.dark vàng nâu
  opacity={1.0}                       // 1.0 default; 0.5 cho dark text overlay
/>
```

## Components inventory

Xem `remotion-shared/components/index.ts`:

| Component | Purpose |
|-----------|---------|
| `PhotoBackdrop` | static photo + vignette + tint |
| `PillarBadge` | top-left pillar tag |
| `ChannelMark` | top-right "Trạm Dừng Mlem" watermark |
| `SubtitleKaraoke` | word-level highlight |
| `StickerCard` | chunky outline + offset shadow card |
| `SceneFrame` | root container + optional badge/mark |
| `OutlineText` | big text với outline + shadow |
| `ZoomPunch` | 13-frame transition wrapper |
| `KenBurns` | optional zoom slow (legacy clip 02-04) |
| `Carousel3Panel` | 3-panel comparison (clip 04 S06b) |
| `StatOverlay` | mono number MAX 240px |
| `FactPop` | small fact card với chime |
| `HookFrame` | 0-3s hook frame |

## Token usage examples

```tsx
import theme, { color, font, motion, getPillar, outlineText } from '../shared/theme';

// Get pillar
const p = getPillar('b');                       // {light, base, dark, name}

// Use color
const hookBg = color.brand.yellow;             // '#F8B147'
const pillarColor = p.base;                     // '#C8302D' for B

// Use font (Remotion video px)
const titleStyle = {
  fontFamily: font.family.display,
  fontSize: font.video.hookL.size,              // 96 (or use 140 for ExtraBold)
  fontWeight: font.video.hookL.weight,          // 800
  ...outlineText('hook'),
};

// Sticker chip preset
<button style={stickerChip(color.brand.yellow, color.outline)}>Follow</button>

// Motion
const transitionMs = motion.duration.slow;      // 430 (ms = 13 frames @ 30fps)
```

## Component examples (production-tested)

### Hook frame Pillar B (scene 0-3s clip 04)

```tsx
<HookFrame
  text="150K ĂN NO NÊ"
  pillar="b"
  bg="#C8302D"
  textColor="#F8B147"
  textSize={140}
  mascotSrc={staticFile('mascot/mlem-shocked.png')}
  mascotSize={240}
/>
```

### Stat overlay (clip 04 S06_PRICE_KFC)

```tsx
<StatOverlay
  value="150K"
  size={240}
  color={getPillar('b').base}
  delay={45}
/>
```

### Carousel 3 panel (clip 04 S06b)

```tsx
<Carousel3Panel
  panels={[
    { src: staticFile('chuotdong/11_paris_siege_1870.jpg'), label: 'PHÁP 1870', color: getPillar('b').base, activeFrame: [0, 120] },
    { src: staticFile('chuotdong/12_grasscutter_ghana.jpg'), label: 'GHANA',     color: '#3FB28E', activeFrame: [120, 240] },
    { src: staticFile('chuotdong/01_hook_chuotdong.jpg'),     label: 'AN GIANG', color: '#F8B147', activeFrame: [240, 420] },
  ]}
/>
```
