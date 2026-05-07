# 09 — SCENE PATTERNS COOKBOOK (v1.5)

> Source: handoff `bun-cha-preview.html` + 11 `Scene*.tsx` files trong `handoff/src/scenes/bun-cha/`.
>
> Dùng file này như cookbook — KHI build Scene*.tsx mới, CHỌN pattern phù hợp + ADAPT, KHÔNG gen scene từ scratch.
>
> Reference templates: `references/templates/handoff_scenes/Scene*.tsx`

## Tại sao cần file này

Trước v1.5, Claude Code gen Scene*.tsx ra style đơn giản (chỉ `<PhotoBackdrop>` + `<OutlineText>` + `<SubtitleKaraoke>`). Handoff có visual language **giàu hơn** với chips, sticker cards, big stat boxes, ribbon eyebrows, tag rows... Để match handoff, phải copy + adapt patterns thay vì gen vanilla.

## 11 patterns trong handoff bun-cha (Pillar A)

### Pattern 1 — HOOK with ribbon eyebrow + huge title + sticker tagline
**File:** `Scene01HookGrill.tsx`

Visual:
- BG: pillar.dark + photo + tint orange + vignette 0.55
- Top: yellow chip "⚡ Hà Nội · 800 năm" (ribbon, scale entry)
- Center: HUGE outline text "BÚN CHẢ" 260px yellow letterSpacing -6
- Below: ink sticker box "KHÓI THAN" yellow text rotated -2deg

Khi dùng: Scene 0-3s opening hook clip — món + địa danh + tagline.

```tsx
const titlePop = useEntry(0, 11);
const ribbonPop = useEntry(28, 12);

<AbsoluteFill style={{ background: PILLAR.dark }}>
  <PhotoBackdrop src="..." pillar="a" tint="rgba(184,120,8,0.35)" vignette={0.55} />
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
    {/* Ribbon eyebrow */}
    <Chip variant="yellow" size="lg" style={{transform: `scale(${ribbonPop})`}}>
      ⚡ Hà Nội · 800 năm
    </Chip>
    {/* Huge title */}
    <div style={{ transform: `scale(${titlePop})` }}>
      <OutlineText size={260} color={color.brand.yellow} variant="hook" letterSpacing={-6} lineHeight={0.95}>
        BÚN CHẢ
      </OutlineText>
    </div>
    {/* Sticker tagline */}
    <div style={{ transform: 'rotate(-2deg)', background: color.outline, color: color.brand.yellow,
                  border: `8px solid ${color.outline}`, borderRadius: 16,
                  padding: '18px 40px', boxShadow: '14px 14px 0 0 #1A1A1A',
                  fontFamily: font.family.display, fontWeight: 800, fontSize: 84, letterSpacing: 8 }}>
      KHÓI THAN
    </div>
  </AbsoluteFill>
</AbsoluteFill>
```

---

### Pattern 2 — TAG CHIPS ROW + HUGE STAT BOX + subtitle outline
**File:** `Scene02Sidewalk.tsx`

Visual:
- BG: pillar.light + photo + tint cream
- Top: 3 cream chips rotated `(i-1)*3deg` — vd "ghế nhựa · vỉa hè · khói than"
- Center: HUGE yellow box "60K" với border 8px, shadow XL, mono 280px
- Below: outline text "MỘT SUẤT BÚN CHẢ" 56px white
- Subtitle dim: "≈ 2.5 USD" cream với outline thin

Khi dùng: Scene 5-10s giới thiệu giá + 3 đặc điểm món.

```tsx
const tagOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
const priceScale = useEntry(10, 12);
const subOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

<AbsoluteFill style={{ background: PILLAR.light }}>
  <PhotoBackdrop src="..." pillar="a" tint="rgba(255,224,168,0.45)" vignette={0.4} />
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
    {/* Chip row rotated */}
    <div style={{ display: 'flex', gap: 16, opacity: tagOp }}>
      {['ghế nhựa', 'vỉa hè', 'khói than'].map((t, i) => (
        <Chip key={t} variant="cream" size="md" rotate={(i - 1) * 3}>{t}</Chip>
      ))}
    </div>
    {/* HUGE stat box */}
    <div style={{
      transform: `scale(${priceScale})`,
      background: color.brand.yellow, border: `8px solid ${color.outline}`, borderRadius: 32,
      padding: '40px 80px', boxShadow: '20px 20px 0 0 #1A1A1A',
      fontFamily: font.family.mono, fontWeight: 700, fontSize: 280, color: color.outline, lineHeight: 0.9,
    }}>60 nghìn</div>
    {/* Outline subtitle */}
    <OutlineText size={56} color={color.neutral[0]} weight={700} family={font.family.heading} variant="body">
      MỘT SUẤT BÚN CHẢ
    </OutlineText>
    {/* Dim subtitle */}
    <div style={{ opacity: subOp, fontFamily: font.family.body, fontWeight: 500,
                  fontSize: 36, color: color.brand.cream, letterSpacing: 4,
                  WebkitTextStroke: `2px ${color.outline}`, paintOrder: 'stroke fill' }}>
      ≈ 2.5 đô la Mỹ
    </div>
  </AbsoluteFill>
</AbsoluteFill>
```

---

### Pattern 3 — STAT OVERLAY (BG ink + glow + huge mono number)
**File:** `Scene03StatOverlay.tsx`

Visual:
- BG: ink (#1A1A1A) + radial glow pillar.dark
- Center: stat 300px mono yellow + outline ink 8px + shadow ink 12px
- Adjacent pill "KM" coral
- Tail text "tỷ giá Hà Nội" cream

Khi dùng: scene shock fact với 1 số HUGE (record, distance, weight).

---

### Pattern 4 — OLD HA NOI photo + place name pill
**File:** `Scene04OldHanoi.tsx`

Visual:
- BG photo vintage warm + tint
- Center: HUGE outline place name yellow
- Below: ink pill "BÚN CHẢ HÀ NỘI" or địa danh

---

### Pattern 5 — 800 YEARS (BG yellow + radial glow + giant number)
**File:** `Scene06_800Years.tsx`

Visual:
- **BG yellow flat** (override SceneFrame default)
- Radial glow pillar.light
- Giant "800" 480px display + shadow coral 12px offset
- Below: coral pill "NĂM TUỔI" white text
- Quote attribution
- **Karaoke override:** active = ink box + yellow text + shadow coral

```tsx
<SceneFrame pillar="a" bg="#F8B147">
  <div style={{ background: 'radial-gradient(circle at 50% 50%, #FFE0A8 0%, #F8B147 70%)' }}>
    {/* huge number */}
    <div style={{ fontFamily: font.family.display, fontWeight: 800, fontSize: 480,
                  color: color.outline, letterSpacing: -16, textShadow: '12px 12px 0 #E85D2F' }}>
      800
    </div>
    {/* coral pill */}
    <div style={{ background: color.brand.coral, color: color.neutral[0], border: '6px solid #1A1A1A',
                  borderRadius: 16, padding: '20px 50px', boxShadow: '14px 14px 0 0 #1A1A1A',
                  fontFamily: font.family.display, fontWeight: 800, fontSize: 96, letterSpacing: 12 }}>
      NĂM TUỔI
    </div>
  </div>
  <SubtitleKaraoke text="..." emphasis={[...]}
    highlightBg="#1A1A1A" highlightTextColor="#F8B147" highlightShadowColor="#E85D2F" />
</SceneFrame>
```

---

### Pattern 6 — INGREDIENT LIST (column of cream pills + 1 emphasized yellow lg)
**File:** `Scene07MeatMarinade.tsx`

Visual:
- BG photo dim red
- Column gap 22px center
- Multiple cream pills "ba chỉ", "tỏi", "đường", "nước mắm"
- 1 emphasized yellow LG pill "MẮM NÊM" (84px font)
- Optional small pills

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
  <Chip variant="cream" size="md">Ba chỉ</Chip>
  <Chip variant="yellow" size="lg">MẮM NÊM</Chip>
  <Chip variant="cream" size="md">Tỏi</Chip>
  <Chip variant="cream" size="md">Đường</Chip>
  <Chip variant="cream" size="sm">Nước mắm</Chip>
</div>
```

---

### Pattern 7 — GRILL FLAME (BG coral + photo overlay + huge text yellow + hot fact pill)
**File:** `Scene08GrillFlame.tsx`

Visual:
- **BG coral flat** + photo overlay 0.5 coral tint
- Center: HUGE outline text yellow 220px "CHÁY CẠNH"
- Yellow sticker "VÀNG RỘM" 84px
- Floating pill rotated -6deg "🔥 CỬA NHIỆT 200°C"

```tsx
<SceneFrame pillar="a" bg="#E85D2F">
  <PhotoBackdrop src="..." pillar="a" tint="rgba(232,93,47,0.5)" vignette={0} />
  <OutlineText size={220} color={color.brand.yellow} letterSpacing={-4}>CHÁY CẠNH</OutlineText>
  <div style={{
    background: color.brand.yellow, color: color.outline, border: '6px solid #1A1A1A',
    borderRadius: 16, padding: '18px 46px', boxShadow: '14px 14px 0 0 #1A1A1A',
    fontFamily: font.family.display, fontWeight: 800, fontSize: 84, letterSpacing: 6
  }}>VÀNG RỘM</div>
  {/* Floating hot fact pill */}
  <Chip variant="cream" size="sm" rotate={-6}
    style={{ position: 'absolute', top: 600, right: 80, color: color.brand.coral }}>
    🔥 200°C lửa than hoa
  </Chip>
</SceneFrame>
```

---

### Pattern 8 — SAUCE RATIO (BG cream + 3 column cells + extras)
**File:** `Scene09SauceRatio.tsx`

Visual:
- **BG cream flat** + photo overlay 0.55 cream tint
- 3 column cells (200px wide, padding 32px, border 8px ink, shadow 20px 20px)
  - Cell 1 yellow "1 nước mắm"
  - Cell 2 cream "1 đường"
  - Cell 3 coral "3 nước"
- Below: heading "+ giấm + tỏi + ớt" với inline yellow highlight

```tsx
<SceneFrame pillar="a" bg="#FFF4E0">
  <PhotoBackdrop src="..." pillar="a" tint="rgba(255,244,224,0.55)" vignette={0} />
  <div style={{ display: 'flex', gap: 24 }}>
    {[
      { num: '1', label: 'NƯỚC MẮM', bg: color.brand.yellow, fg: color.outline },
      { num: '1', label: 'ĐƯỜNG',    bg: color.brand.cream,  fg: color.outline },
      { num: '3', label: 'NƯỚC',     bg: color.brand.coral,  fg: color.neutral[0] },
    ].map(c => (
      <div key={c.label} style={{
        width: 200, padding: '32px 0', background: c.bg, color: c.fg,
        border: '8px solid #1A1A1A', borderRadius: 24, boxShadow: '20px 20px 0 0 #1A1A1A',
        textAlign: 'center'
      }}>
        <div style={{ fontFamily: font.family.mono, fontWeight: 700, fontSize: 180, lineHeight: 0.9 }}>
          {c.num}
        </div>
        <div style={{ fontFamily: font.family.heading, fontWeight: 800, fontSize: 36,
                      letterSpacing: 4, marginTop: 14 }}>
          {c.label}
        </div>
      </div>
    ))}
  </div>
</SceneFrame>
```

---

### Pattern 9 — NOODLES + HERB CHIPS (BG light + chip cluster)
**File:** `Scene10NoodlesHerbs.tsx`

Visual:
- BG pillar.light (vàng nhạt) + photo overlay teal tint
- Top: huge text "BÚN RỐI" 200px white
- Below: heading "+ rau sống"
- Cluster: 8-10 cream chips "kinh giới · tía tô · xà lách · húng quế · giá · ngò..."

```tsx
<SceneFrame pillar="a" bg="#FFE0A8">
  <OutlineText size={200} color={color.neutral[0]} letterSpacing={-2}>BÚN RỐI</OutlineText>
  <div style={{ fontFamily: font.family.heading, fontWeight: 700, fontSize: 48 }}>+ rau sống</div>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 920 }}>
    {['kinh giới', 'tía tô', 'xà lách', 'húng quế', 'giá', 'ngò'].map(h => (
      <Chip key={h} variant="cream" size="md">{h}</Chip>
    ))}
  </div>
</SceneFrame>
```

---

### Pattern 10 — SHOP CARD (BG photo dark + huge sticker card with stamp)
**File:** `SceneShopCards.tsx` (S11/S12/S13 cùng template)

Visual:
- BG photo + tint dark
- Center: 880px wide cream card với border 8px, shadow XL, padding 60/50
  - Top: number circle (color cycling pillar) "1"
  - Title: "BÚN CHẢ HƯƠNG LIÊN" 130px display
  - Address pill yellow
  - Tag line "ai cũng biết"
  - Stamp top-right (coral, rotate 12deg) "TOP 1"

---

### Pattern 11 — CTA (BG yellow striped + big follow text + cta pill)
**File:** `Scene14CTA.tsx`

Visual:
- BG yellow + striped pattern overlay (45deg, yellow + pillar.light)
- Top: ink pill "ĐĂNG KÝ KÊNH" small
- Center: HUGE outline text "FOLLOW" coral 240px letterSpacing -6
- Bottom: coral CTA pill "Trạm Dừng Mlem" 72px white
- Heading "+ món hot mỗi tuần"
- **Karaoke override:** coral box + white + stroke 2px ink + rotate -1deg

```tsx
<SceneFrame pillar="a" bg="#F8B147">
  {/* striped overlay */}
  <AbsoluteFill style={{
    background: 'repeating-linear-gradient(45deg, #F8B147 0 60px, #FFE0A8 60px 120px)',
    opacity: 0.5
  }} />
  <Chip variant="ink" size="sm" style={{textTransform: 'uppercase', letterSpacing: 6}}>
    ĐĂNG KÝ KÊNH
  </Chip>
  <OutlineText size={240} color={color.brand.coral} letterSpacing={-6}>FOLLOW</OutlineText>
  <Chip variant="coral" size="lg">Trạm Dừng Mlem</Chip>
  <SubtitleKaraoke text="..." emphasis={[...]}
    highlightBg="#E85D2F" highlightTextColor="#FFFFFF" highlightStroke={2}
    bottom={220} />
</SceneFrame>
```

---

## CHỌN PATTERN PER SCENE TYPE

| Scene type | Pattern phù hợp | Lý do |
|------------|----------------|-------|
| Hook 0-3s với địa danh + tagline | Pattern 1 (Hook + ribbon + sticker) | Visual đậm, nhấn brand |
| Setup 3-8s giới thiệu món + giá | Pattern 2 (Tag chips + stat box) | Dồn dập info đầu |
| Stat shock số huge | Pattern 3 (Stat overlay BG ink) | BG đen làm số nổi bật |
| Bối cảnh địa lý/lịch sử cũ | Pattern 4 (Place name pill) | Vintage tone |
| Fact lịch sử (năm tuổi, kỷ lục) | Pattern 5 (BG yellow giant number) | Stand out |
| Liệt kê nguyên liệu | Pattern 6 (Ingredient column) | Compact list |
| Tutorial process / nướng | Pattern 7 (BG coral + huge text + hot pill) | Hot energy |
| Tỉ lệ / công thức | Pattern 8 (BG cream + 3 column cells) | Clean structure |
| Liệt kê herbs/sides | Pattern 9 (Chip cluster) | Visual rich |
| Shop card / restaurant feature | Pattern 10 (Photo + sticker card + stamp) | Trust signal |
| CTA cuối | Pattern 11 (BG yellow striped + FOLLOW) | Call to action mạnh |

## NGUYÊN TẮC ADAPT PATTERN

1. **GIỮ structure** (positioning, sizing, animation timing) — đó là design intent
2. **THAY content** — text, color (pillar B/C/D thay vì A), món name, stat number
3. **GIỮ animation** — `useEntry`, `interpolate(frame, [0, X], [0, 1])` — timing đã calibrate
4. **CHANGE pillar color** — Pillar B đỏ thay yellow ở places. Pillar C coral. Pillar D teal
5. **NEVER simplify** — đừng bỏ chip/sticker/animation cho "minimal" — handoff intent là rich

## CHO PILLAR B/C/D — CONVERSION TABLE

Khi adapt patterns từ Pillar A (handoff bun-cha) sang pillar khác:

| Pillar A token | Pillar B (Đỏ) | Pillar C (Coral) | Pillar D (Teal) |
|---------------|---------------|------------------|-----------------|
| `pillar.dark` `#B87808` | `#7A1614` | `#8E2F0F` | `#1F6E79` |
| `pillar.light` `#FFE0A8` | `#F4B0AE` | `#F9C5AE` | `#BEE7ED` |
| `pillar.base` `#F8B147` | `#C8302D` | `#E85D2F` | `#4FC3D1` |
| Yellow accents | Red accents | Coral accents | Teal accents |
| Cream BG scenes | Cream OK (giữ) | Cream OK (giữ) | Cream OK (giữ) |

Karaoke override khi BG đổi:
- Pillar B BG đỏ → highlight yellow box + ink text
- Pillar C BG coral → highlight yellow box + ink text
- Pillar D BG teal → highlight yellow box + ink text

## VISUAL PREVIEW

Mở `references/templates/handoff_scenes/visual-preview.html` trong browser để xem rendered preview của 11 scenes.

## REFERENCE TEMPLATES

11 file Scene*.tsx + composition reference + theme reference + chrome reference đầy đủ tại:
```
references/templates/handoff_scenes/
├── Scene01HookGrill.tsx          (Pattern 1)
├── Scene02Sidewalk.tsx           (Pattern 2)
├── Scene03StatOverlay.tsx        (Pattern 3)
├── Scene04OldHanoi.tsx           (Pattern 4)
├── Scene06_800Years.tsx          (Pattern 5)
├── Scene07MeatMarinade.tsx       (Pattern 6)
├── Scene08GrillFlame.tsx         (Pattern 7)
├── Scene09SauceRatio.tsx         (Pattern 8)
├── Scene10NoodlesHerbs.tsx       (Pattern 9)
├── SceneShopCards.tsx            (Pattern 10)
├── Scene14CTA.tsx                (Pattern 11)
├── _chrome.tsx.reference         (handoff chrome — DO NOT replace shared/)
├── _theme.ts.reference           (handoff per-clip theme adapter)
├── Composition.tsx.reference     (handoff composition)
├── visual-preview.html           (HTML mockup 14 scenes)
└── HANDOFF-README.md             (handoff usage guide)
```

Khi build clip mới: `cp` Scene template → rename → adapt content per scene needs.

## ⭐ v1.5 — COMPONENT TEMPLATES (RECOMMENDED USAGE)

Thay vì copy-adapt từ handoff Scene*.tsx, **dùng component templates** trong `src/shared/scene-templates/`.

### Mapping Pattern → Component

| Pattern | Component |
|---------|-----------|
| 1 — Hook + ribbon + sticker | `<HookRibbon>` |
| 2 — Tag chips + stat box | `<TagChipsStat>` |
| 3 — Stat overlay BG ink | `<StatOverlayInk>` |
| 4 — Old place name pill | `<PlaceNamePill>` |
| 5 — Giant number yellow | `<GiantNumberYellow>` |
| 6 — Ingredient list | `<IngredientList>` |
| 7 — Grill flame coral | `<GrillFlameCoral>` |
| 8 — Ratio cells | `<RatioCells>` |
| 9 — Chip cluster | `<ChipCluster>` |
| 10 — Shop card | `<ShopCard>` |
| 11 — CTA striped | `<CTAStriped>` |

### Per-clip Scene*.tsx siêu thin (4-15 line)

```tsx
// src/scenes/cha-ca/Scene01HookFlame.tsx
import React from 'react';
import { staticFile } from 'remotion';
import { HookRibbon, SubtitleKaraoke, useSceneWords } from '../../shared';
import { PILLAR_KEY } from './_theme';

export const Scene01HookFlame: React.FC<{ text: string; sceneStart: number; emphasis?: string[] }> = ({ text, sceneStart, emphasis }) => {
  const words = useSceneWords('S01_HOOK_FLAME');
  return (
    <>
      <HookRibbon
        pillar={PILLAR_KEY}
        eyebrow="⚡ Hà Nội · 30 năm"
        title="CHẢ CÁ"
        tagline="LÃ VỌNG"
        photoSrc="chaca/01_hook.jpg"
        photoTint="rgba(184,120,8,0.35)"
      />
      <SubtitleKaraoke
        text={text}
        perWord={words.map(w => w.start)}
        sceneStartSec={sceneStart}
        emphasis={emphasis}
      />
    </>
  );
};
```

### Template props nhanh

```tsx
// Pattern 1 — Hook
<HookRibbon
  pillar="a|b|c|d"
  eyebrow="⚡ {địa danh} · {số}"
  title="TÊN MÓN HUGE"
  tagline="TÊN PHỤ" {/* optional */}
  photoSrc="<slug>/01_hook.jpg"
  photoTint="rgba(R,G,B,0.35)"
  titleSize={260}            // optional, tăng/giảm theo độ dài
/>

// Pattern 2 — Setup pricing
<TagChipsStat
  pillar="a"
  chips={['ghế nhựa', 'vỉa hè', 'khói than']}
  stat="60K"
  subtitle="MỘT SUẤT BÚN CHẢ"
  dimText="≈ 2.5 đô la Mỹ"   // optional
  photoSrc="..."
/>

// Pattern 3 — Stat shock
<StatOverlayInk
  pillar="b"
  stat="5000"
  unit="KG/NGÀY"
  tailText="bán tại chợ Phù Dật"
  tailHighlight="Phù Dật"
/>

// Pattern 4 — Place name
<PlaceNamePill
  pillar="b"
  placeName="HÀ NỘI"
  subtitle="BÚN CHẢ HÀ NỘI"
  photoSrc="..."
/>

// Pattern 5 — Giant number history
<GiantNumberYellow
  pillar="a"
  number="800"
  unit="NĂM TUỔI"
  attribution='— Vũ Bằng, "Miếng ngon Hà Nội" 1957'
/>

// Pattern 6 — Ingredient list
<IngredientList
  pillar="a"
  items={[
    { text: 'Ba chỉ', size: 'md' },
    { text: 'MẮM NÊM', emphasized: true },  // shorthand: yellow lg
    { text: 'Tỏi', size: 'md' },
    { text: 'Đường', size: 'md' },
    { text: 'Nước mắm', size: 'sm' },
  ]}
  photoSrc="..."
/>

// Pattern 7 — Grill flame
<GrillFlameCoral
  pillar="a"
  mainText="CHÁY CẠNH"
  stickerText="VÀNG RỘM"
  hotFact="🔥 200°C lửa than hoa"
  photoSrc="..."
/>

// Pattern 8 — Ratio sauce
<RatioCells
  pillar="a"
  cells={[
    { num: '1', label: 'NƯỚC MẮM', variant: 'yellow' },
    { num: '1', label: 'ĐƯỜNG',    variant: 'cream' },
    { num: '3', label: 'NƯỚC',     variant: 'coral' },
  ]}
  extras="+ giấm + tỏi + ớt"
  extrasHighlight="ớt"
/>

// Pattern 9 — Chip cluster (rau, herbs, options)
<ChipCluster
  pillar="a"
  mainText="BÚN RỐI"
  heading="+ rau sống"
  items={['kinh giới', 'tía tô', 'xà lách', 'húng quế', 'giá', 'ngò']}
/>

// Pattern 10 — Shop card
<ShopCard
  pillar="a"
  number="1"
  name="BÚN CHẢ HƯƠNG LIÊN"
  address="24 Lê Văn Hưu"
  tagText="ai cũng biết"
  stamp="TOP 1"
  photoSrc="..."
/>

// Pattern 11 — CTA
<CTAStriped
  pillar="a"
  eyebrow="ĐĂNG KÝ KÊNH"
  mainText="FOLLOW"
  ctaText="Trạm Dừng Mlem"
  subtitle="+ món hot mỗi tuần"
  subtitleHighlight="món hot"
/>
```

### Pillar overrides

Mỗi component nhận `pillar="a"|"b"|"c"|"d"` → tự dùng `pillar.dark`/`light`/`base` đúng. Photo tint tự áp dụng theo pillar khi không pass `photoTint`.

Per-scene karaoke override khi BG khác cream/photo:
```tsx
{/* Sau template, thêm SubtitleKaraoke với override */}
<SubtitleKaraoke
  text={text}
  perWord={words.map(w => w.start)}
  emphasis={emphasis}
  highlightBg="#1A1A1A"     // override khi scene BG yellow flat
  highlightTextColor="#F8B147"
  highlightShadowColor="#E85D2F"
/>
```

### Auto-scaffold via new_clip.sh + scenes.json (tương lai)

scenes.json declare pattern, generator script đọc → scaffold:

```json
{
  "scenes": [
    {
      "id": "S01_HOOK",
      "pattern": "HookRibbon",
      "props": {
        "eyebrow": "⚡ An Giang · 30 năm",
        "title": "CHUỘT ĐỒNG",
        "tagline": "NƯỚNG LU"
      },
      "start": 0, "end": 90,
      "text": "...", "emphasis": [...]
    }
  ]
}
```

Future script `scaffold_scenes.py <slug>` đọc scenes.json → gen Scene*.tsx import + render template.

## TÓM TẮT

- **11 pattern components** sẵn ở `src/shared/scene-templates/`
- Per-clip Scene*.tsx **chỉ 4-15 line** (import template + pass props)
- Match handoff visual **chính xác**
- Pillar A/B/C/D auto-applied
- Karaoke + emphasis hoạt động normal đè lên template
