# 07 — AUDIO MIX & POLISH

> Output: BGM + SFX integrated. Caption + hashtag + cover.png.

## BGM SHARED library

Chỉ build 1 lần ở `public/audio/` — KHÔNG fetch lại mỗi clip.

```bash
# Bootstrap once
bash scripts/fetch_audio_library.sh
```

Output:
```
public/audio/
├── bgm-pillarA.mp3        ← lofi vietnamese instrumental (90-300s)
├── bgm-pillarB.mp3        ← asian travel discovery instrumental
├── bgm-pillarC.mp3        ← epic culinary record instrumental
├── bgm-pillarD.mp3        ← traditional vietnamese culture instrumental
├── whoosh-transition.mp3  ← Mixkit CC0
├── impact-hook.mp3        ← Mixkit CC0
├── chime-fact.mp3         ← Mixkit CC0
├── mlem-sting.mp3         ← Mixkit CC0
└── pop-sticker.mp3        ← Mixkit CC0
```

**Volume defaults** (production tested):
- Voiceover: 1.0
- BGM: 0.18 (đủ rõ instrumental, không lấn voice)
- SFX whoosh/impact: 0.55-0.6
- SFX chime/pop: 0.5
- Mlem sting: 0.7

## Tại sao BGM shared per pillar?

Pillar có mood riêng:
- **A Khẩu phần** → cheerful lofi (vd: "Mekong morning")
- **B Món lạ** → adventurous travel (vd: "Asian discovery")
- **C Kỷ lục** → epic build-up (vd: "Champion's table")
- **D Văn hóa** → mellow traditional (vd: "Highland tea")

User có thể swap BGM mỗi clip nếu cảm thấy không hợp:
```bash
# Override per clip
yt-dlp \
  "ytsearch3:vietnamese street food cheerful instrumental no vocal" \
  --match-filter "license = 'Creative Commons Attribution license (reuse allowed)' & duration >= 90" \
  --max-downloads 1 \
  -x --audio-format mp3 \
  -o "public/<slug>/bgm-override.mp3"
```

Trong composition:
```tsx
<Audio src={staticFile(`<slug>/bgm-override.mp3`)} volume={0.18} />
```

## Mix workflow

### Option A — Remotion <Audio> per scene (mặc định)
Mỗi scene tự render <Audio> SFX theo cần. Render 1 lần duy nhất.

### Option B — Pre-mix với audio_mix.py
Chạy trước Remotion render:

```bash
python3 scripts/audio_mix.py <slug>
# Output: out/<slug>_audiomix.mp3 (VO + BGM + SFX layered)
```

Sau đó composition chỉ cần 1 `<Audio>` master — Remotion render nhanh hơn long-form.

## Caption + Hashtag

Generate `out/<slug>_caption.txt`:

```
HỎI: 1 món NGAY An Giang ai cũng SỢ tới khi… 👀

Chuột đồng nướng lu — đặc sản 30 năm mùa nước nổi 🔥
Mỹ chi $50 DIỆT, An Giang trả 80K ĂN!

⏰ 30 phút lu nung → da vàng giòn rụm
💰 Chỉ 150K/dĩa — RẺ HƠN KFC
✅ FAO khuyến cáo an toàn

Bạn có dám thử?

#TramDungMlem #monlathegioi #chuotdongnuonglu #angiang
#chophudat #miencay #monlamientay #amthucvietnam #monla
#foodvietnam #foodadventure #xuhuong
```

**Hashtag formula** (9-12 tags):
- 2 brand: `#TramDungMlem` + `#monlathegioi`
- 3-4 broad: `#amthucvietnam` `#foodvietnam` `#foodadventure`
- 3-4 niche pillar:
  - A: `#khauphan` `#mre` `#ration`
  - B: `#monla` `#weirdfood` `#exoticfood`
  - C: `#kyluc` `#worldrecord` `#extremefood`
  - D: `#vanhoa` `#taboo` `#culture`
- 1-2 trending tuần: research TikTok creator center

## Cover.png

Generate via Python PIL (scripts/cover_gen.py — TODO) hoặc CapCut.

Cấu trúc cover 1080×1920:
```
┌────────────────────────────┐
│ [TIME] 90s DEEP-DIVE chip  │  top-right badge
│                            │
│   [HERO IMAGE]             │  full-bleed photo
│   (subject 60% width)      │
│                            │
│ ┌────────────────────────┐ │
│ │ MAIN TITLE (Baloo 800) │ │  bottom-left card
│ │ Subtitle (BeVN 700)    │ │
│ └────────────────────────┘ │
│                            │
│  [Pillar Badge]   [Logo]   │  bottom corners
└────────────────────────────┘
```

## Output deliverables (`out/<slug>/`)

```
out/<slug>/
├── <slug>.mp4               ← final video upload-ready
├── caption.txt              ← TikTok caption + hashtag
├── credits.txt              ← attribution all sources
├── cover.png                ← thumbnail (cho TikTok cover frame)
└── <slug>_audiomix.mp3      ← (optional) standalone audio mix
```

## Khi user yêu cầu "polish + caption clip <slug>"

1. Đọc `assets/<slug>/clip-meta.json` (title, pillar, duration).
2. Đọc `<slug>_script.md` (script + storyboard) ở workspace.
3. Generate:
   - `out/<slug>/caption.txt` — 3-5 lines viral-style + 9-12 hashtags
   - `out/<slug>/credits.txt` — tổng hợp credits từ raw_pool/credits_*.json
   - (Optional) `out/<slug>/cover.png` — thumbnail
4. Tóm tắt 3 strategies caption (A/B/C) → user chọn.

## Upload TikTok manual

User upload qua TikTok app, paste caption + hashtag, set:
- Cover frame: chọn frame có hook text rõ nhất
- Schedule: 12:00 hoặc 20:00 (tùy slot đã chốt)
- Allow: comment + duet + stitch (tăng retention)
- Disable: not commercial (TikTok auto-flag nếu bật)

## ⚠️ QUY TẮC v1.2 — CAPTION KHÔNG VIẾT TẮT

Caption TikTok phải viết ĐẦY ĐỦ chữ — không "VN", "TP HCM", "150K", "30p".

### Đúng

```
Tại An Giang miền Tây, chuột đồng nướng lu là đặc sản 30 năm.
Chỉ 150 nghìn đồng cho một dĩa — rẻ hơn KFC.
FAO khuyến cáo món an toàn.
```

### Sai

```
Tại An Giang m.Tây, chuột đồng nướng lu là đặc sản 30 năm.   ← "m.Tây" tắt
Chỉ 150K cho 1 dĩa — rẻ hơn KFC.                              ← "150K" + "1" tắt
FAO khuyến cáo món an toàn.
```

### Vẫn cho phép giữ

- Acronym tổ chức: FAO, WHO, UNESCO, UN
- Brand: TikTok, KFC, McDonald's, Lotteria
- Đài/báo: BBC, CNN, VTV
- Đơn vị thông dụng trong context food: 1 dĩa, 1 phần (số 1 OK)

### Lý do

1. SEO TikTok index full text → từ khóa đầy đủ search được
2. Người mới xem không biết viết tắt vẫn đọc được
3. Brand professional, không "cẩu thả mạng"
