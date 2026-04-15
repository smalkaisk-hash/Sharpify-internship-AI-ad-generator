"""
Create 6 PAUSED draft ads in the VIDEO ai workshop ad set.
Each ad uses a different AI Toolkit video + its custom copy.
"""
import json
import os
import sys
import time
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
ADSET_ID = "120248038482870460"  # VIDEO ai workshop
PAGE_ID = "116359515734204"  # Sharpify Latvia FB page
IG_ID = "17841401853795292"
LANDING_URL = "https://reg.sharpify.lv/ai-workshops/"

# Ad copy for each video
ads_data = [
    {
        "key": "aitoolkit-v1-timesaved.mp4",
        "name": "AI Toolkit - V1 - Time Saved",
        "video_id": "2067934020432737",
        "headline": "Pārstāj zaudēt 14h nedēļā",
        "message": (
            "Vai Tu zini, cik laika katru nedēļu zaudē uz uzdevumiem, ko AI var izdarīt sekundēs?\n\n"
            "Lielākā daļa uzņēmēju tērē 10-15 stundas nedēļā rakstot sociālo tīklu postus, reklāmas, "
            "e-pastus un prompt-us — bez sistēmas.\n\n"
            "AI Rīku Komplekts: 27 gatavi AI skills, 128 slaidu prezentācija, 74 min video apmācība. "
            "Instalē vienreiz, lieto mūžīgi.\n\n"
            "🎯 Taupi laiku no 1. dienas\n"
            "💰 No €99 → €19 (taupi 81%)\n"
            "🔒 7 dienu naudas atgriešanas garantija"
        ),
    },
    {
        "key": "aitoolkit-v2-oldvsnew.mp4",
        "name": "AI Toolkit - V2 - Old vs New",
        "video_id": "925194883618604",
        "headline": "No 2 stundām uz 8 sekundēm",
        "message": (
            "\"Hey ChatGPT, can you help me write a marketing post about...\"\n\n"
            "2 stundas vēlāk — rezultāts joprojām neder. Atpazīsti?\n\n"
            "Jaunais veids: ievadi /marketing-post un 8 sekundes vēlāk tev ir perfekts rezultāts, "
            "kas atbilst tavam zīmolam.\n\n"
            "27 AI skills. 10 workflows. 128 slaidu apmācība. Viss par €19."
        ),
    },
    {
        "key": "aitoolkit-v3-ailevels.mp4",
        "name": "AI Toolkit - V3 - AI Levels",
        "video_id": "1449378853139913",
        "headline": "Pārlec uz AI 5. līmeni",
        "message": (
            "Ir 5 AI lietošanas līmeņi. Lielākā daļa uzņēmēju ir 1. vai 2. — vienkārši ChatGPT hobijs bez sistēmas.\n\n"
            "5. līmenis ir tur, kur AI strādā Tavā vietā — autonomi skills, gatavi prompt-i, automatizēti workflows.\n\n"
            "AI Rīku Komplekts Tevi pārvieto uz 5. līmeni vienā dienā. Bez mācībām. Bez stundām YouTube.\n\n"
            "No €99 → €19 · Tūlītēja piekļuve · Mūžīga licence"
        ),
    },
    {
        "key": "aitoolkit-v4-unboxing.mp4",
        "name": "AI Toolkit - V4 - Unboxing",
        "video_id": "1628800034838658",
        "headline": "€305 vērtība par €19",
        "message": (
            "Kas tieši ir AI Rīku Komplektā?\n\n"
            "✅ 128 slaidu prezentācija — pilna AI sistēma\n"
            "✅ 27 AI skills — mārketingam, pārdošanai, saturam\n"
            "✅ 10 automatizēti workflows\n"
            "✅ 74 min video apmācība — soli pa solim\n"
            "✅ CLAUDE.md biznesa šablons\n\n"
            "Kopējā vērtība: €305\n"
            "Šodien: €19 (taupi 94%)\n\n"
            "Tūlītēja piekļuve. Mūžīga licence. 7 dienu garantija."
        ),
    },
    {
        "key": "aitoolkit-v5-instructor.mp4",
        "name": "AI Toolkit - V5 - Instructor",
        "video_id": "915616577955532",
        "headline": "Mācies no īsta AI eksperta",
        "message": (
            "Pirms Tu pērc kārtējo \"AI kursu\" no YouTube gura — pajautā: kas Tevi māca?\n\n"
            "AI Rīku Komplekts ir veidots no Nika Jansona — uzņēmēja, kurš:\n\n"
            "✓ Apkalpojis 2 300+ uzņēmumus 26 valstīs\n"
            "✓ Saģenerējis €50M+ saviem klientiem\n"
            "✓ Forbes 30 Under 30\n"
            "✓ Ieguvis 1.3M+ pieteikumus ar AI sistēmām\n\n"
            "Mācies no tā, kas patiešām lieto AI katru dienu, nevis tikai pārdod kursus par to.\n\n"
            "No €99 → €19"
        ),
    },
    {
        "key": "aitoolkit-v6-dayinlife.mp4",
        "name": "AI Toolkit - V6 - Day in Life",
        "video_id": "941290402028001",
        "headline": "Pabeidz darbu 4.5h ātrāk",
        "message": (
            "Viens un tas pats darbs. Pavisam cits ātrums.\n\n"
            "📝 Instagram posts: 2 stundas → 8 sekundes\n"
            "💼 Reklāmas kopija: 1.5 stundas → 30 sekundes\n"
            "📧 Klientu e-pasts: 30 minūtes → 10 sekundes\n\n"
            "Tas nav teorija — tā ir sistēma, ko Tu vari sākt lietot pēc 30 minūtēm.\n\n"
            "AI Rīku Komplekts: 27 skills + 10 workflows + 128 slaidi + 74 min video. €19. Mūžīga piekļuve."
        ),
    },
]

# First, wait for videos to finish processing
def wait_for_video(video_id, max_wait=180):
    print(f"  Waiting for video {video_id} to process...", end="", flush=True)
    url = f"https://graph.facebook.com/v21.0/{video_id}?fields=status&access_token={TOKEN}"
    for i in range(max_wait // 5):
        r = requests.get(url).json()
        status = r.get('status', {}).get('video_status', 'unknown')
        if status == 'ready':
            print(f" ready ({(i+1)*5}s)")
            return True
        print(".", end="", flush=True)
        time.sleep(5)
    print(f" TIMEOUT (still {status})")
    return False

# Get video thumbnail URL
def get_thumbnail(video_id):
    # Use the default thumbnail Meta generates
    url = f"https://graph.facebook.com/v21.0/{video_id}/thumbnails?access_token={TOKEN}"
    r = requests.get(url).json()
    thumbs = r.get('data', [])
    if thumbs:
        # Prefer the preferred one
        preferred = [t for t in thumbs if t.get('is_preferred')]
        if preferred:
            return preferred[0]['uri']
        return thumbs[0]['uri']
    return None

results = []
for ad in ads_data:
    print(f"\n=== {ad['name']} ===")

    # Wait for video
    if not wait_for_video(ad['video_id']):
        print("  SKIP (video not ready)")
        continue

    # Get thumbnail
    thumb = get_thumbnail(ad['video_id'])
    if not thumb:
        print("  SKIP (no thumbnail available yet)")
        continue
    print(f"  thumb: {thumb[:80]}...")

    # Build creative
    creative_payload = {
        "name": ad['name'] + " Creative",
        "object_story_spec": json.dumps({
            "page_id": PAGE_ID,
            "instagram_user_id": IG_ID,
            "video_data": {
                "video_id": ad['video_id'],
                "title": ad['headline'],
                "message": ad['message'],
                "image_url": thumb,
                "call_to_action": {
                    "type": "SHOP_NOW",
                    "value": {
                        "link": LANDING_URL,
                    }
                }
            }
        }),
        "access_token": TOKEN,
    }

    creative_url = f"https://graph.facebook.com/v21.0/act_{ACCOUNT}/adcreatives"
    cr = requests.post(creative_url, data=creative_payload)
    if cr.status_code != 200:
        print(f"  ✗ Creative error: {cr.status_code} {cr.text}")
        continue
    creative_id = cr.json()['id']
    print(f"  creative_id: {creative_id}")

    # Create ad (PAUSED)
    ad_payload = {
        "name": ad['name'],
        "adset_id": ADSET_ID,
        "creative": json.dumps({"creative_id": creative_id}),
        "status": "PAUSED",
        "access_token": TOKEN,
    }

    ad_url = f"https://graph.facebook.com/v21.0/act_{ACCOUNT}/ads"
    ar = requests.post(ad_url, data=ad_payload)
    if ar.status_code != 200:
        print(f"  ✗ Ad error: {ar.status_code} {ar.text}")
        continue
    ad_id = ar.json()['id']
    print(f"  ✓ ad_id: {ad_id}")

    results.append({
        "name": ad['name'],
        "video_id": ad['video_id'],
        "creative_id": creative_id,
        "ad_id": ad_id,
    })

# Save results
with open(r'c:/Users/Ritvars Volfs/meta-ad-generator-v2/created-ads.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\n{'='*50}")
print(f"Created {len(results)}/6 ads")
print(f"All are PAUSED - ready for user review")
