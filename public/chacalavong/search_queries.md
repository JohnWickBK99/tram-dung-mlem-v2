# Search Queries — Clip 06 Chả Cá Lã Vọng

> Mỗi shot ưu tiên CC source (Pexels / Pixabay / Mixkit / Wikimedia). Fallback Google CC + YT-CC ≤ 5s.

## Pexels / Pixabay (CC ưu tiên — video & ảnh chung)

```
cha ca la vong sizzle close up
vietnamese fish hot pot bubbling pan
turmeric fish hanoi tableside
fresh dill herb close up
green onion scallion fresh
roasted peanuts bowl
fresh red chili
lime sliced quarters
fresh cilantro coriander
vietnamese rice noodles cold loose
hanoi old quarter street vendor
old vietnamese family portrait sepia
```

## Wikimedia Commons (lịch sử + chân dung — bắt buộc cho S04C)

```
Đề Thám Hoàng Hoa Thám portrait
Hoang Hoa Tham yen the leader
old hanoi map french colonial 1900
rue de la laque hanoi
Jiang Ziya Khương Tử Nha statue
Phong Thần Diễn Nghĩa illustration
hanoi cha ca street vintage photography
```

## Gallica (Bibliothèque nationale de France — bản đồ phố cổ HN thời Pháp)

```
plan hanoi vieux quartier 1900
carte vieille ville hanoi colonial
```

URL search: https://gallica.bnf.fr/services/Search?query=hanoi+plan+1900

## Google Images (CC license filter)

```
chả cá lã vọng số 14 phố chả cá
ngôi nhà nhà họ Đoàn 14 hàng sơn
tượng Lã Vọng quán chả cá hà nội
Đoàn Xuân Phúc họa sĩ chân dung
phố chả cá biển hiệu phố cổ hà nội
chả cá lã vọng đảo cá tại bàn chảo gang
mắm tôm bát chấm hà nội
```

## YouTube CC (yt-dlp `--match-filter "license=creativecommons"`)

```
chả cá lã vọng tableside cooking 5s
hanoi cha ca street food tour
old hanoi 1900 french colonial footage
```

Limit `--max-duration 8` cho mỗi clip, sau đó cut ≤ 5s.

## Freepik fallback (Mystic 2.5 / Flux — synth nếu CC miss)

### Prompt synth cho S04B nếu Wikimedia không có ảnh Đoàn Xuân Phúc:

```
Sepia-toned vintage portrait painting of Vietnamese painter from early 20th century, traditional ao dai outfit, holding a paintbrush, soft window light, Pierre Bonnard style, hanoi 1900 background blurred, painterly oil texture, museum quality, 1024x1280
```

### Prompt synth cho S03A nếu thiếu tượng Lã Vọng:

```
Traditional chinese terracotta statue of Jiang Ziya (Khương Tử Nha) sitting and fishing with bare hook, long white beard, scholar robe, weathered patina, museum showcase backdrop deep teal, soft rim light, ultra detailed, 1024x1280
```

### Prompt synth cho S05A nếu thiếu bản đồ phố cổ HN:

```
Vintage french colonial map of hanoi old quarter circa 1900, sepia parchment texture, hand-drawn streets including rue de la laque, watercolor accent on cha ca street area, art nouveau border, 1024x1280
```

## Strategy

1. Phase 4a (CC ưu tiên) chạy `asset_fetch.py` Pexels + Pixabay + Mixkit
2. Phase 4b (Google fetch Playwright) cho shots: S02A, S02C, S03C, S04A, S04B, S05C
3. Phase 4c (YouTube CC yt-dlp) cho shot video: S01A, S06_10
4. Phase 4d (Freepik synth fallback) cho shots S04B (Đoàn Xuân Phúc) + S03A (tượng Lã Vọng) nếu CC miss
5. CHECKPOINT 1 — User duyệt `_pick_proposed/`
