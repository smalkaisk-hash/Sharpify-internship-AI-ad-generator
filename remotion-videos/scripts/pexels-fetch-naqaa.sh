#!/usr/bin/env bash
# Fetch portrait Pexels video clips for Naqaa Beauty real-life ads.
set -eu
set -a; source "c:/Users/Ritvars Volfs/meta-ad-generator-v2/.env"; set +a
OUT="c:/Users/Ritvars Volfs/meta-ad-generator-v2/remotion-videos/public/videos/naqaa-reallife"
mkdir -p "$OUT"

# name|query  (one per line)
declare -a JOBS=(
  "v1-dirty-water|showerhead water drops macro"
  "v1-clean-shower|woman shower smile"
  "v2-morning-ritual|bathroom morning sunlight"
  "v2-hair-shine|woman hair brushing"
  "v3-aromatic|rose petals water slow motion"
)

fetch_one() {
  local name="$1" query="$2"
  echo "[$name] query: $query"
  local json
  json=$(curl -sS -H "Authorization: $PEXELS_API_KEY" \
    --data-urlencode "query=$query" \
    --data-urlencode "orientation=portrait" \
    --data-urlencode "size=medium" \
    --data-urlencode "per_page=5" \
    -G "https://api.pexels.com/videos/search")
  # pick the first video file with width between 720 and 1920 (avoid 4K for speed)
  local url
  url=$(echo "$json" | python -c "
import sys, json
d = json.load(sys.stdin)
best = None
for v in d.get('videos', []):
    for f in v['video_files']:
        if f.get('file_type') == 'video/mp4' and 720 <= f['width'] <= 1920:
            if best is None or f['width'] > best[0]:
                best = (f['width'], f['link'])
    if best: break
print(best[1] if best else '')
")
  if [ -z "$url" ]; then
    echo "  !! no suitable clip found for $name"
    return
  fi
  echo "  downloading: $url"
  curl -sSL -o "$OUT/$name.mp4" "$url"
  echo "  saved: $OUT/$name.mp4 ($(du -h "$OUT/$name.mp4" | cut -f1))"
}

for job in "${JOBS[@]}"; do
  name="${job%%|*}"
  query="${job#*|}"
  fetch_one "$name" "$query" &
done
wait
echo "---"
ls -lh "$OUT"
