"""
Update VIDEO ai workshop ad set for max video views.
Applies proven Sharpify targeting (LV, business interests, 28-55).
"""
import json
import urllib.request
import urllib.parse

# Load env
env = {}
with open(r'c:/Users/Ritvars Volfs/meta-ad-generator-v2/.env') as f:
    for line in f:
        if '=' in line:
            k, v = line.strip().split('=', 1)
            env[k] = v

TOKEN = env['META_ACCESS_TOKEN']
ADSET_ID = "120248038482870460"  # VIDEO ai workshop

# Proven targeting from past Sharpify LV business video campaign
targeting = {
    "age_min": 25,
    "age_max": 65,
    "geo_locations": {
        "countries": ["LV"],
        "location_types": ["home", "recent"]
    },
    "flexible_spec": [
        {
            "interests": [
                {"id": "6003280183843", "name": "Business development"},
                {"id": "6003402305839", "name": "Business"},
                {"id": "6004040547748", "name": "Business-to-business"},
                {"id": "6788379980003", "name": "Business leaders"},
                {"id": "6866302901418", "name": "Business and Finance"},
                {"id": "6003371567474", "name": "Entrepreneurship"},
                {"id": "6002898176962", "name": "Artificial intelligence"},
                {"id": "6002884511422", "name": "Small business"},
            ]
        }
    ],
    "publisher_platforms": ["facebook", "instagram"],
    "facebook_positions": ["feed", "facebook_reels", "profile_feed", "story", "instream_video"],
    "instagram_positions": ["stream", "profile_reels", "story", "reels", "profile_feed", "explore"],
    "device_platforms": ["mobile", "desktop"],
    "targeting_automation": {
        "advantage_audience": 1
    },
}

# Update payload
params = {
    "access_token": TOKEN,
    "optimization_goal": "THRUPLAY",  # 15-sec video views = max eyes on your content
    "billing_event": "IMPRESSIONS",
    "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
    "targeting": json.dumps(targeting),
    "daily_budget": "1000",  # €10/day (in cents)
    "status": "PAUSED",  # Keep paused so user can review
}

url = f"https://graph.facebook.com/v21.0/{ADSET_ID}"
data = urllib.parse.urlencode(params).encode()
req = urllib.request.Request(url, data=data, method='POST')

try:
    with urllib.request.urlopen(req) as r:
        result = json.loads(r.read())
    print("SUCCESS:")
    print(json.dumps(result, indent=2, ensure_ascii=False))
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR {e.code}:")
    print(e.read().decode())
