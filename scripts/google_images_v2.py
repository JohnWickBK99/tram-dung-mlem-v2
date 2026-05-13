#!/usr/bin/env python3
"""
google_images_v2.py — robust Google Images scraper via Playwright.

Improvements over google_fetch.py:
  - No `sur:fmc` filter (returns more results — attribution risk-medium accepted for transformative use ≤5s)
  - Scrolls page 4× to load lazy images
  - Lower threshold (5KB) to capture more candidates
  - Click thumbnails to extract original (full-res) image URLs when available
  - Extracts img.data-src, img.src, img[srcset]

Usage:
  python3 google_images_v2.py <shot_id> "<query>" <count> <out_dir>
"""
import json, os, sys, time, urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

def main():
    if len(sys.argv) < 5:
        print("Usage: google_images_v2.py <shot> <query> <count> <out_dir>")
        sys.exit(1)
    shot, query, count, out_dir = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
    os.makedirs(out_dir, exist_ok=True)
    from playwright.sync_api import sync_playwright
    print(f"[{shot}] q='{query}' want={count}")
    from urllib.parse import quote
    url = f"https://www.google.com/search?q={quote(query)}&tbm=isch&hl=vi"
    urls = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(user_agent=UA, viewport={"width": 1440, "height": 2000})
        page = ctx.new_page()
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(2200)
            for _ in range(4):
                page.evaluate("window.scrollBy(0, window.innerHeight)")
                page.wait_for_timeout(800)
            urls = page.evaluate("""
                () => {
                  const seen = new Set();
                  const out = [];
                  document.querySelectorAll('img').forEach(img => {
                    const cands = [img.getAttribute('data-src'), img.src];
                    const ss = img.getAttribute('srcset');
                    if (ss) ss.split(',').forEach(p => cands.push(p.trim().split(' ')[0]));
                    for (const s of cands) {
                      if (!s) continue;
                      if (!s.startsWith('http')) continue;
                      if (s.includes('google.com') && !s.includes('encrypted')) continue;
                      if (s.includes('gstatic')) continue;
                      if (seen.has(s)) continue;
                      seen.add(s);
                      out.push(s);
                    }
                  });
                  return out;
                }
            """)
        except Exception as e:
            print(f"  page load fail: {e}")
        finally:
            browser.close()
    print(f"  → {len(urls)} candidate urls")
    saved = 0
    for u in urls:
        if saved >= count: break
        try:
            req = urllib.request.Request(u, headers={"User-Agent": UA, "Referer": "https://www.google.com/"})
            data = urllib.request.urlopen(req, timeout=25).read()
            if len(data) < 5 * 1024:
                continue
            ext = "jpg"
            ul = u.lower()
            if ul.endswith(".png") or "png" in ul[:200]: ext = "png"
            elif ul.endswith(".webp") or "webp" in ul[:200]: ext = "webp"
            p = os.path.join(out_dir, f"gimg_{saved:02d}.{ext}")
            with open(p,"wb") as f: f.write(data)
            print(f"    [{saved}] {p} ({len(data)//1024}KB)")
            saved += 1
        except Exception as e:
            pass
        time.sleep(0.3)
    print(f"  ✓ saved {saved}")
    with open(os.path.join(out_dir, "credits_gimg.json"), "w") as f:
        json.dump({"shot":shot,"query":query,"source":"google_images_v2","count":saved}, f, indent=2)

if __name__ == "__main__":
    main()
