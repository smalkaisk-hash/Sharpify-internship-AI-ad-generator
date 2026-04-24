#!/usr/bin/env bash
# Fetch Pexels media for the Sharpify Construction LV ad:
# 1 background video for the hook + 3 portrait hero photos for the phone mockups.
set -eu
set -a; source "c:/Users/Ritvars Volfs/meta-ad-generator-v2/.env"; set +a
VID_OUT="c:/Users/Ritvars Volfs/meta-ad-generator-v2/remotion-videos/public/videos/construction-lv"
IMG_OUT="c:/Users/Ritvars Volfs/meta-ad-generator-v2/remotion-videos/public/photos/construction-lv"
mkdir -p "$VID_OUT" "$IMG_OUT"

fetch_video() {
  local name="$1" query="$2"
  echo "[video:$name] $query"
  local json
  json=$(curl -sS -H "Authorization: $PEXELS_API_KEY" \
    --data-urlencode "query=$query" \
    --data-urlencode "orientation=portrait" \
    --data-urlencode "size=medium" \
    --data-urlencode "per_page=5" \
    -G "https://api.pexels.com/videos/search")
  local url
  url=$(echo "$json" | python -c "
import sys, json
d = json.load(sys.stdin)
best=None
for v in d.get('videos', []):
    for f in v['video_files']:
        if f.get('file_type')=='video/mp4' and 720<=f['width']<=1920:
            if best is None or f['width']>best[0]:
                best=(f['width'], f['link'])
    if best: break
print(best[1] if best else '')
")
  [ -z "$url" ] && { echo "  !! no match for $name"; return; }
  curl -sSL -o "$VID_OUT/$name.mp4" "$url"
  echo "  saved: $VID_OUT/$name.mp4 ($(du -h "$VID_OUT/$name.mp4" | cut -f1))"
}

fetch_photo() {
  local name="$1" query="$2"
  echo "[photo:$name] $query"
  local json
  json=$(curl -sS -H "Authorization: $PEXELS_API_KEY" \
    --data-urlencode "query=$query" \
    --data-urlencode "orientation=landscape" \
    --data-urlencode "size=large" \
    --data-urlencode "per_page=5" \
    -G "https://api.pexels.com/v1/search")
  local url
  url=$(echo "$json" | python -c "
import sys, json
d = json.load(sys.stdin)
for p in d.get('photos', []):
    # prefer 'large' sized url
    print(p['src'].get('large2x') or p['src'].get('large') or p['src']['original'])
    break
")
  [ -z "$url" ] && { echo "  !! no match for $name"; return; }
  curl -sSL -o "$IMG_OUT/$name.jpg" "$url"
  echo "  saved: $IMG_OUT/$name.jpg ($(du -h "$IMG_OUT/$name.jpg" | cut -f1))"
}

# --- Hook BG video (1) ---
fetch_video "hook-site" "construction site aerial" &

# --- Phone mockup hero photos (3) ---
fetch_photo "hero-roofing" "roof worker installing shingles" &
fetch_photo "hero-building" "concrete building construction exterior" &
fetch_photo "hero-renovation" "modern apartment interior renovation" &

wait
echo "---"
echo "videos:"; ls -lh "$VID_OUT"
echo "photos:"; ls -lh "$IMG_OUT"
