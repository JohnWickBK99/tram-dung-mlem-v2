# 01 — VBEE SCRIPT

> Output: `<slug>_script.md` chứa raw text + Vbee-ready text + metadata.

## 3 modes

### MODE 1 — Research-driven (bot tự research + viết)

User chỉ cung tên món + pillar. Bot:
1. **WebSearch** chủ đề (vd: "{món} lịch sử nguồn gốc", "{món} cách chế biến", "{món} so sánh quốc tế")
2. Fact-check 3 nguồn độc lập (Wikipedia, FAO/WHO, food blog uy tín)
3. Áp template Pillar (xem MODE 2)
4. Hỏi user verify trước khi commit

⚠️ Risk: fact sai. Mỗi claim phải có source URL log lại trong cuối file `_script.md`.

### MODE 2 — Template-driven (user cung facts, bot ráp)

User cung 5-7 facts. Bot ráp theo 6-beat template tùy pillar + duration.

#### Template 35s (105 từ ~ Vbee tốc độ 1.0x)

```
[0-3s | Hook]      Câu shock 1-3 từ + setup tương phản
[3-8s | Setup]     Giới thiệu ngắn món + pillar context
[8-15s | Process]  Cách làm / nguyên liệu chính (3 chip)
[15-22s | Reaction] Khoảnh khắc bite + miêu tả vị
[22-28s | Stat]    1 con số shock (giá / lịch sử / kỷ lục)
[28-35s | CTA]     Câu hỏi mở + Follow chip
```

#### Template 60s (~190 từ)

Như 35s + thêm 1 beat:
```
[15-25s | Tutorial]   Tutorial 4 sub-step (10s)
[35-45s | Compare]    So sánh quốc tế / VN khác
```

#### Template 90s (~290 từ — production tested clip 04)

```
[0-3s   | Hook]            Tương phản quốc tế (vd: Mỹ DIỆT vs VN ĂN)
[3-8s   | Setup]           Bối cảnh địa lý + thời điểm
[8-16s  | History]         30 năm lịch sử / mùa nước nổi / nguồn gốc văn hóa
[16-23s | Process]         Nguyên liệu vs nguyên liệu mainstream khác
[23-35s | Tutorial]        4 sub-step + 3 chip ingredient + stat thời gian
[35-42s | Reaction]        Money shot bite Zoom Punch
[42-46s | Flavor]          Chip "khác X / không Y" so sánh hương vị
[46-56s | Market/Origin]   B-roll chợ + map + chip #1 + stat sản lượng
[56-62s | Price]           Stat giá + so sánh fastfood (KFC/Mc/Lotteria)
[62-76s | Global]          Carousel 3 panel quốc tế (lịch sử + tương đương)
[76-85s | Credibility]     FAO/WHO/uy tín + stamp ✅ AN TOÀN
[85-90s | CTA]             Logo + Follow + comment hint
```

### MODE 3 — Format-only (user tự viết, bot format)

User paste raw text. Bot:
1. Số → đọc thành chữ (vd: "150K" → "một trăm năm mươi nghìn")
2. Viết tắt → mở rộng (vd: "VN" → "Việt Nam", "TP HCM" → "Thành phố Hồ Chí Minh")
3. Punctuation cho Vbee TTS (`.` ngắt đầy đủ, `,` ngắt nhẹ, `…` để pause dài)
4. Loại bỏ ký tự đặc biệt Vbee không đọc được (emoji, `&`, `*`)
5. Estimate duration (~3 từ/s với tốc độ 1.0x; 3.3 từ/s với 1.1x)

## Vbee TTS guideline

- **Tốc độ:** 1.0x mặc định cho hook/CTA, 1.1x cho tutorial dày
- **Giọng:** "Linh - giọng nữ Hà Nội" hoặc "Hữu - giọng nam miền Nam" (test mỗi clip)
- **Breath marks:** thêm `<break time="300ms"/>` SSML giữa beat để phát âm tự nhiên
- **Số:** ghi chữ ("một trăm", "ba mươi", "tám tỷ") — không tin Vbee tự convert
- **Tên riêng nước ngoài:** phiên âm Việt + ghi rõ trong ngoặc lần đầu (vd: "Casu Marzu — phô mai con sâu — đọc là Ca-su Mat-zu")
- **Tránh:** câu quá dài (> 25 từ) → cắt 2 câu

## Output `<slug>_script.md` structure

```markdown
# {Title} — Vbee script + storyboard

## Metadata
- Pillar: B
- Duration: 90s
- Words: ~291
- Vbee voice: Linh 1.0x

## Vbee text (paste vào app.vbee.vn)

[hook - 0-3s]
Một trăm năm mươi nghìn đồng. <break time="200ms"/> Ăn no nê tại An Giang.

[setup - 3-8s]
...

## Storyboard (12 scenes, 2700f @ 30fps)

| # | Time | Shot | Text | Visual | SFX |
|---|------|------|------|--------|-----|
| S01 | 0-3s | HOOK_USA_VN | "Một trăm năm mươi nghìn đồng..." | Split-screen Mỹ exterminator vs VN nướng lu | impact-hook.mp3 @ f0 |

## Audio mapping
- BGM: bgm-pillarB.mp3 @ 0.18
- SFX events: 33 triggers (xem scenes.json)

## Source / fact-check
- ...
```

## Khi user nói "Viết Vbee cho {món}"

1. Đọc memory `project_clip0X_status.md` để tham khảo style các clip cũ.
2. Hỏi 4 ABCD + Recommended:
   - **Pillar?**
   - **Duration?** (35s / 60s / 90s / khác — Recommended dựa vào depth của chủ đề)
   - **Vbee mode?** (Research / Template / Format / Hybrid — Recommended Template nếu user cung được 5-7 facts; Research nếu chỉ tên món)
   - **Voice + tốc độ?** (Linh 1.0x / Linh 1.1x / Hữu 1.0x / khác)
3. Generate `<slug>_script.md` ở `/Users/duyphan/Documents/Claude/Projects/Trạm Dừng Mlem/`.
4. CP1: user verify text → tinh chỉnh → thu Vbee → save vào `public/<slug>/<slug-dash>-voiceover.mp3`.

## ⚠️ QUY TẮC v1.2 — KHÔNG VIẾT TẮT (mọi text user-facing)

### Phải viết đầy đủ chữ

| ❌ Viết tắt | ✅ Đầy đủ trong Vbee | ✅ Đầy đủ trong caption |
|------------|---------------------|----------------------|
| VN | Việt Nam | Việt Nam |
| TP HCM | Thành phố Hồ Chí Minh | Thành phố Hồ Chí Minh |
| HN | Hà Nội | Hà Nội |
| 150K | một trăm năm mươi nghìn | 150 nghìn |
| 1M | một triệu | 1 triệu |
| $50 | năm mươi đô la | 50 đô la |
| AI | trí tuệ nhân tạo | AI (cho phép vì TikTok user hiểu) |
| 30p | ba mươi phút | 30 phút |
| 5kg | năm ki-lô-gam | 5 ki-lô-gam |

### Vẫn được giữ acronym

- Tổ chức quốc tế: FAO, WHO, UNESCO, UN, NASA → giữ nguyên (Vbee đọc spelling-out)
- Tên thương hiệu: TikTok, Vbee, KFC, McDonald's, Lotteria, Coca-Cola → giữ nguyên
- Tên đài/báo: BBC, CNN, VTV, Tuổi Trẻ → giữ nguyên
- Đơn vị viết tắt trong CHIP overlay (vd: "150K") OK vì tiết kiệm space, nhưng Vbee text PHẢI đọc đầy đủ "một trăm năm mươi nghìn"

### Lý do
1. Vbee TTS đọc viết tắt sai (vd: "VN" → "vi-en")
2. Whisper transcribe không match nếu Vbee đọc tắt
3. Caption đầy đủ tăng SEO + người mới xem đọc được
4. Brand consistency

## ⚠️ QUY TẮC v1.2 — HIGHLIGHT ĐỊA DANH + TỪ KHÓA

Mỗi scene trong scenes.json có thêm field `emphasis` (string array) chứa địa danh + từ khóa cần nổi bật.

```json
{
  "id": "S02_SETUP",
  "shot": "S02_SETUP",
  "start": 90,
  "end": 240,
  "text": "Tại An Giang miền Tây, chuột đồng nướng lu là đặc sản 30 năm",
  "emphasis": ["An Giang", "chuột đồng", "30 năm"],
  ...
}
```

`SubtitleKaraoke` v1.2 đọc `emphasis` → render keyword màu vàng (default) hoặc coral (scene vàng) khi inactive. Active vẫn đen-trên-vàng như word thường (không distract khi đọc).

### Khi sinh scenes.json — auto-detect emphasis

- **Địa danh:** An Giang, Bến Tre, Hà Nội, Mekong, ... + tên quốc gia (Pháp, Ghana, Iceland, ...)
- **Số liệu shock:** "150 nghìn", "30 phút", "5,000 ki-lô-gam"
- **Tên món chính:** "chuột đồng nướng lu", "casu marzu", "balut"
- **Fact đặc biệt:** "RẺ HƠN KFC", "FAO khuyến cáo", "kỷ lục thế giới"

Limit: ≤ 30% words/scene là emphasized.
