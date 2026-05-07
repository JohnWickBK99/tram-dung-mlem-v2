#!/usr/bin/env python3
"""
asset_fetch.py — fetch CC-licensed assets cho 1 shot.

Sources (no API key required, public endpoints):
  - Pexels Videos / Photos  (search via embedded HTML scraping)
  - Pixabay Photos / Videos (search HTML scraping)
  - Mixkit (videos)
  - Wikimedia Commons (images, public domain)

Usage:
  python3 asset_fetch.py <shot_id> <kind:image|video> "<query>" <count> <out_dir>

Example:
  python3 asset_fetch.py S01 image "vietnamese pho beef bowl" 4 public/pho/raw_pool/S01

The script writes credits.json to out_dir with source attribution.
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from html.parser import HTMLParser

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 TramDungMlem/1.0"

def http_get(url, timeout=30, accept="text/html"):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
    return urllib.request.urlopen(req, timeout=timeout).read()

def safe_save(url, out_path):
    try:
        with open(out_path, "wb") as f:
            f.write(http_get(url, timeout=60, accept="*/*"))
        return os.path.getsize(out_path)
    except Exception as e:
        print(f"    ↓ fail {url[:60]}: {e}")
        if os.path.exists(out_path):
            os.unlink(out_path)
        return 0


# ─────────────── Pexels ───────────────
def fetch_pexels(query, kind, count, out_dir):
    """Scrape Pexels search page (no key)."""
    base = "https://www.pexels.com"
    path = "/videos/" if kind == "video" else "/search/"
    url = f"{base}{path}?search={urllib.parse.quote(query)}" if kind == "video" \
          else f"{base}/search/{urllib.parse.quote(query)}/"
    if kind == "video":
        url = f"{base}/search/videos/{urllib.parse.quote(query)}/"
    try:
        html = http_get(url).decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"  · pexels fetch fail: {e}")
        return 0

    # extract media URLs
    if kind == "video":
        # mp4 links
        urls = re.findall(r'https://videos\.pexels\.com/video-files/[^"\\\s]+\.mp4', html)
    else:
        # large jpg
        urls = re.findall(r'https://images\.pexels\.com/photos/[^"\\\s]+\.jpe?g[^"\\\s]*', html)
    urls = list(dict.fromkeys(urls))[:count]
    if not urls:
        print(f"  · pexels: 0 result for '{query}'")
        return 0

    saved = 0
    for i, u in enumerate(urls):
        ext = "mp4" if kind == "video" else "jpg"
        path_out = os.path.join(out_dir, f"pexels_{i:02d}.{ext}")
        if safe_save(u, path_out):
            print(f"    pexels[{i}] → {path_out}")
            saved += 1
        time.sleep(0.5)
    return saved


# ─────────────── Pixabay ───────────────
def fetch_pixabay(query, kind, count, out_dir):
    """Scrape Pixabay search."""
    typ = "videos" if kind == "video" else "images"
    url = f"https://pixabay.com/{typ}/search/{urllib.parse.quote(query)}/"
    try:
        html = http_get(url).decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"  · pixabay fetch fail: {e}")
        return 0
    if kind == "video":
        urls = re.findall(r'https://cdn\.pixabay\.com/video/[^"\\\s]+\.mp4', html)
    else:
        urls = re.findall(r'https://cdn\.pixabay\.com/photo/[^"\\\s]+\.(?:jpg|jpeg|png)', html)
    urls = list(dict.fromkeys(urls))[:count]
    if not urls:
        print(f"  · pixabay: 0 result for '{query}'")
        return 0

    saved = 0
    for i, u in enumerate(urls):
        ext = "mp4" if kind == "video" else u.rsplit(".", 1)[-1]
        path_out = os.path.join(out_dir, f"pixabay_{i:02d}.{ext}")
        if safe_save(u, path_out):
            print(f"    pixabay[{i}] → {path_out}")
            saved += 1
        time.sleep(0.5)
    return saved


# ─────────────── Mixkit ───────────────
def fetch_mixkit(query, kind, count, out_dir):
    if kind != "video":
        return 0
    url = f"https://mixkit.co/free-stock-video/?keyword={urllib.parse.quote(query)}"
    try:
        html = http_get(url).decode("utf-8", errors="ignore")
    except Exception:
        return 0
    urls = list(dict.fromkeys(re.findall(r'https://assets\.mixkit\.co/videos/[^"\\\s]+\.mp4', html)))[:count]
    saved = 0
    for i, u in enumerate(urls):
        path_out = os.path.join(out_dir, f"mixkit_{i:02d}.mp4")
        if safe_save(u, path_out):
            print(f"    mixkit[{i}] → {path_out}")
            saved += 1
    return saved


# ─────────────── Wikimedia Commons ───────────────
def fetch_wikimedia(query, count, out_dir):
    """Wikimedia Commons via official API (public domain images)."""
    api_url = (
        "https://commons.wikimedia.org/w/api.php"
        "?action=query&list=search&srnamespace=6"
        f"&srsearch={urllib.parse.quote(query)}"
        f"&srlimit={count*3}&format=json"
    )
    try:
        data = json.loads(http_get(api_url, accept="application/json"))
    except Exception as e:
        print(f"  · wikimedia api fail: {e}")
        return 0
    files = [item["title"] for item in data.get("query", {}).get("search", [])]
    saved = 0
    for fn in files:
        if saved >= count:
            break
        info_url = (
            "https://commons.wikimedia.org/w/api.php"
            f"?action=query&titles={urllib.parse.quote(fn)}"
            "&prop=imageinfo&iiprop=url&iiurlwidth=1080&format=json"
        )
        try:
            info = json.loads(http_get(info_url, accept="application/json"))
            for _, page in info.get("query", {}).get("pages", {}).items():
                infos = page.get("imageinfo", [])
                if not infos:
                    continue
                u = infos[0].get("thumburl") or infos[0].get("url")
                if not u:
                    continue
                ext = "jpg" if u.lower().endswith((".jpg", ".jpeg")) else "png"
                path_out = os.path.join(out_dir, f"wiki_{saved:02d}.{ext}")
                if safe_save(u, path_out):
                    print(f"    wiki[{saved}] → {path_out}")
                    saved += 1
                    break
        except Exception as e:
            print(f"    wiki info fail: {e}")
    return saved


# ─────────────── Main ───────────────
def main():
    if len(sys.argv) < 6:
        print("Usage: asset_fetch.py <shot_id> <image|video> <query> <count> <out_dir>")
        sys.exit(1)
    shot, kind, query, count, out_dir = (
        sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), sys.argv[5]
    )
    os.makedirs(out_dir, exist_ok=True)
    print(f"[{shot}] kind={kind} query='{query}' count={count}")
    total = 0
    total += fetch_pexels(query, kind, count, out_dir)
    total += fetch_pixabay(query, kind, count, out_dir)
    if kind == "video":
        total += fetch_mixkit(query, kind, count, out_dir)
    if kind == "image":
        total += fetch_wikimedia(query, count, out_dir)
    print(f"  ✓ total CC: {total}")
    # write credits log
    with open(os.path.join(out_dir, "credits.json"), "w") as f:
        json.dump({
            "shot": shot, "kind": kind, "query": query,
            "sources": ["pexels", "pixabay"] + (["mixkit"] if kind == "video" else ["wikimedia"]),
        }, f, indent=2)


if __name__ == "__main__":
    main()
