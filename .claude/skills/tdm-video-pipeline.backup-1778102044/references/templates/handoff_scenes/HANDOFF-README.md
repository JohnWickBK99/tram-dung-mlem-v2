# Bún Chả Hà Nội — Apply Universal Theme v1.0

## 📁 File structure (copy vào repo `JohnWickBK99/tram-dung-mlem`)

```
src/
├── scenes/
│   └── bun-cha/                      ← NEW folder, mỗi scene 1 file
│       ├── _theme.ts                 ← Pillar A tokens (yellow dominant)
│       ├── _chrome.tsx               ← Shared: PhotoBackdrop, SubtitleKaraoke,
│       │                               StickerCard, PillarBadge, ChannelMark,
│       │                               ZoomPunch, OutlineText, useEntry
│       ├── index.ts                  ← Barrel export + SHOT_MAP
│       ├── Scene01HookGrill.tsx
│       ├── Scene02Sidewalk.tsx
│       ├── Scene03StatOverlay.tsx
│       ├── Scene04OldHanoi.tsx
│       ├── Scene06_800Years.tsx
│       ├── Scene07MeatMarinade.tsx
│       ├── Scene08GrillFlame.tsx
│       ├── Scene09SauceRatio.tsx
│       ├── Scene10NoodlesHerbs.tsx
│       ├── SceneShopCards.tsx        ← S11/S12/S13 (cùng template)
│       └── Scene14CTA.tsx
└── compositions/
    └── BunChaHaNoi.tsx               ← REPLACE (rút từ 32KB → 4KB)
```

## ✅ Đã apply

- **Pillar A** (vàng `#F8B147` dominant) — match màu cũ `#F5B041` nhất
- **Font**: Playfair → **Baloo 2** + Be Vietnam Pro
- **Shadow**: soft blur → **sticker chunky** offset solid (4/8/14/20px)
- **Text**: outline đen 4-6px (`-webkit-text-stroke`) cho mọi text trên ảnh
- **Subtitle**: karaoke style với highlight vàng (token `motion.captionKaraoke`)
- **Bỏ**: Smoke, EmberBackground, Ken Burns, Playfair italic
- **Giữ**: `staticFile()` paths assets gốc, audio lanes, scene timing
- **Mỗi scene 1 file riêng** trong `src/scenes/bun-cha/` (option B đã chọn)

## 🚀 Cách install

```bash
# 1. Copy folder
cp -r handoff/src/scenes/bun-cha /path/to/repo/src/scenes/

# 2. Replace BunChaHaNoi.tsx
cp handoff/src/compositions/BunChaHaNoi.tsx /path/to/repo/src/compositions/

# 3. Install Google Font (nếu chưa có) — thêm vào Root.tsx:
import { loadFont as loadBaloo2 } from '@remotion/google-fonts/Baloo2';
import { loadFont as loadBeVietnam } from '@remotion/google-fonts/BeVietnamPro';
loadBaloo2();
loadBeVietnam();

# 4. npm install (nếu cần thêm package)
npx remotion preview
```

## 🎨 Preview

Mở `bun-cha-preview.html` → 14 frame TikTok 9:16, mỗi cái là 1 scene độc lập với theme đã apply.

## 🔧 Tweak nhanh sau này

- Đổi pillar: sửa `_theme.ts` → `PILLAR_A` thành `PILLAR_B/C/D` 
- Thêm scene mới: tạo `Scene15XX.tsx` + thêm vào `SHOT_MAP` trong `index.ts`
- Đổi shadow style: sửa `SHADOW.stickerMd` trong `_theme.ts` → đồng bộ tất cả

## ⚠️ Note

- File `Scene05` không tồn tại (theo timeline gốc bỏ S05)
- Karaoke timing default = chia đều theo số từ; có thể truyền `perWord={[0, 0.1, 0.3, ...]}` để tinh chỉnh
- `ZoomPunch` wrapper export sẵn — wrap quanh scene root nếu muốn dùng zoom-punch transition (hiện tại không enable mặc định để tránh giật khi preview)
