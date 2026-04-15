"""
Upload 6 AI Toolkit videos to Meta Ad Account and store video IDs.
"""
import json
import os
import sys

# Need 'requests' for multipart upload; fall back to urllib if needed
try:
    import requests
except ImportError:
    print("Installing requests...")
    os.system("pip install requests")
    import requests

sys.stdout.reconfigure(encoding='utf-8')

# Load env
env = {}
with open(r'c:/Users/Ritvars Volfs/meta-ad-generator-v2/.env') as f:
    for line in f:
        if '=' in line:
            k, v = line.strip().split('=', 1)
            env[k] = v

TOKEN = env['META_ACCESS_TOKEN']
ACCOUNT = env['META_ACCOUNT_LV']

videos = [
    ("aitoolkit-v1-timesaved.mp4", "AI Toolkit - V1 - Time Saved"),
    ("aitoolkit-v2-oldvsnew.mp4", "AI Toolkit - V2 - Old vs New"),
    ("aitoolkit-v3-ailevels.mp4", "AI Toolkit - V3 - AI Levels"),
    ("aitoolkit-v4-unboxing.mp4", "AI Toolkit - V4 - Unboxing"),
    ("aitoolkit-v5-instructor.mp4", "AI Toolkit - V5 - Instructor"),
    ("aitoolkit-v6-dayinlife.mp4", "AI Toolkit - V6 - Day in Life"),
]

OUT_DIR = r"c:/Users/Ritvars Volfs/meta-ad-generator-v2/remotion-videos/out"
results = {}

for filename, title in videos:
    path = os.path.join(OUT_DIR, filename)
    if not os.path.exists(path):
        print(f"  MISSING: {path}")
        continue

    print(f"Uploading: {title}")
    size = os.path.getsize(path)
    print(f"  file size: {size / 1024 / 1024:.1f} MB")

    url = f"https://graph.facebook.com/v21.0/act_{ACCOUNT}/advideos"
    with open(path, 'rb') as f:
        files = {'source': (filename, f, 'video/mp4')}
        data = {
            'access_token': TOKEN,
            'title': title,
            'name': title,
        }
        r = requests.post(url, files=files, data=data, timeout=300)

    if r.status_code == 200:
        result = r.json()
        video_id = result.get('id')
        print(f"  ✓ video_id: {video_id}")
        results[filename] = {
            'title': title,
            'video_id': video_id,
        }
    else:
        print(f"  ✗ ERROR {r.status_code}: {r.text}")

# Save results
out_file = r'c:/Users/Ritvars Volfs/meta-ad-generator-v2/uploaded-videos.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(results)} video IDs to uploaded-videos.json")
