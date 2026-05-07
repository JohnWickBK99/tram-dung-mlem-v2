#!/usr/bin/env python3
"""
google_fetch.py — Google Images via Playwright headless (FALLBACK).

Use ONLY when CC sources (asset_fetch.py) miss. Risk-medium attribution.
Auto-add `&tbs=isz:l,sur:fmc` filter (large size, free-modify-commerce-use)
to bias toward licensed images, but cannot guarantee CC.

Install:
  pip3 install playwright --break-system-packages
  python3 -m playwright install chromium

Usage:
  python3 google_fetch.py <shot_id> "<query>" <count> <out_dir>
"""
import json
import os
import sys
import time
import urllib.request
from urllib.parse import quote

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) TramDungMlem/1.0"

def main():
    if len(sys.argv) < 5:
        print("Usage: google_fetch.py <shot_id> <query> <count> <out_dir>")
        sys.exit(1)
    shot, query, count, out_dir = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
    os.makedirs(out_dir, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("❌ playwright not installed. Run: pip3 install playwright --break-system-packages && python3 -m playwright install chromium")
        sys.exit(1)

    print(f"[{shot}] google query='{query}' count={count}")

    # tbs=isz:l (large), sur:fmc (free-modify-commerce-use filter)
    url = f"https://www.google.com/search?q={quote(query)}&tbm=isch&tbs=isz:l,sur:fmc"

    saved = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent=UA, viewport={"width": 1280, "height": 1600})
        page = context.new_page()
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(1500)
            # Click thumbnails to reveal full URL — but easier: extract from img src + data-src
            urls = page.evaluate("""
                () => {
                  const seen = new Set();
                  const out = [];
                  document.querySelectorAll('img').forEach(img => {
                    const s = img.getAttribute('data-src') || img.src || '';
                    if (s.startsWith('http') && !s.includes('google') && !seen.has(s)) {
                      seen.add(s);
                      out.push(s);
                    }
                  });
                  return out;
                }
            """)
        except Exception as e:
            print(f"  ! page load fail: {e}")
            urls = []
        finally:
            browser.close()

    # download top N
    for u in urls:
        if saved >= count:
            break
        try:
            req = urllib.request.Request(u, headers={"User-Agent": UA})
            data = urllib.request.urlopen(req, timeout=30).read()
            if len(data) < 30 * 1024:  # skip tiny thumbs
                continue
            ext = "jpg"
            if u.lower().endswith(".png"):
                ext = "png"
            elif u.lower().endswith(".webp"):
                ext = "webp"
            path_out = os.path.join(out_dir, f"google_{saved:02d}.{ext}")
            with open(path_out, "wb") as f:
                f.write(data)
            print(f"    google[{saved}] → {path_out} ({len(data)//1024} KB)")
            saved += 1
        except Exception as e:
            print(f"    google download fail: {e}")
        time.sleep(0.5)

    print(f"  ✓ google total: {saved}")
    with open(os.path.join(out_dir, "credits_google.json"), "w") as f:
        json.dump({"shot": shot, "query": query, "source": "google_images", "filter": "fmc-large", "count": saved}, f, indent=2)


if __name__ == "__main__":
    main()
