import json, urllib.request, urllib.parse, sys, os
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')

TOKEN = "REDACTED_TOKEN"
ACCOUNT = "act_1184056475376090"
PAGE_ID = "116359515734204"
INSTAGRAM_ID = "17841401853795292"
ADSET_ID = "120242514313810328"
LINK = "https://web.sharpify.lv/"
API = "https://graph.facebook.com/v21.0"

ads = [
    {
        "name": "Ad \u2014 Twitter Thread Creative",
        "image_hash": "30c25c60c8e4be8ca54b5b6f3a08d3c3",
        "message": "Here's an unpopular opinion: you don't need a 5,000 EUR website to look professional.\n\nYou need a clean design, mobile responsiveness, and a way for clients to contact you. That's it.\n\nBut most business owners get stuck in one of two camps:\n\n\u2705 No website at all \u2014 clients Google them and find nothing\n\u2705 A DIY site they built at 2am that looks like it's from 2012\n\nBoth are costing them clients every single day.\n\nHere's what a website actually needs to do:\n\n\U0001f539 Load fast on phones \u2014 63% of your traffic is mobile\n\U0001f539 Look professional enough to build trust\n\U0001f539 Have a clear way to contact you\n\U0001f539 Show up when someone Googles your name\n\nThat's the whole list. Everything else is vanity.\n\nWe've built websites for 2,300+ businesses in 26 countries. The ones that work? Simple. Clean. Fast. Built to convert.\n\nStarting at 59 EUR. Delivered in 1-3 days. One-time payment.\n\n\U0001f449 If you've been putting it off, this is your sign\n\nNiks Jansons, CEO @ Sharpify",
        "headline": "You don't need a \u20ac5,000 website.",
        "description": "Sharpify \u2014 Professional Websites"
    },
    {
        "name": "Ad \u2014 Siri Creative",
        "image_hash": "59ab1d58c04ba9b521875b0b0c02593f",
        "message": "\"I need a professional website for my business but I don't want to spend thousands or wait months.\"\n\nSound like you?\n\nThat's what every business owner says before they find us. And then they realize it doesn't have to be complicated.\n\n\u2705 You don't need to spend 2,000+ EUR on an agency\n\u2705 You don't need to learn WordPress or fight with Wix\n\u2705 You don't need to wait 6-8 weeks for a first draft\n\u2705 You don't need to figure out hosting, SEO, or mobile optimization\n\nAll you need to do is fill out a 10-minute questionnaire. Our team handles everything else.\n\n\U0001f539 Custom design tailored to your brand\n\U0001f539 Mobile-responsive on every device\n\U0001f539 Contact forms + WhatsApp chat included\n\U0001f539 SEO optimized from day one\n\U0001f539 Delivered on WhatsApp in 1-3 days\n\n2,300+ businesses across 26 countries. Starting at 59 EUR. One payment.\n\n\U0001f449 Just ask\n\nNiks Jansons, CEO @ Sharpify",
        "headline": "Just ask. We'll build it. \u20ac59.",
        "description": "Sharpify \u2014 Professional Websites"
    }
]

print(f"Creating {len(ads)} ads in PAUSED status...\n")

for ad in ads:
    creative = json.dumps({
        'object_story_spec': {
            'page_id': PAGE_ID,
            'instagram_user_id': INSTAGRAM_ID,
            'link_data': {
                'link': LINK,
                'image_hash': ad['image_hash'],
                'message': ad['message'],
                'name': ad['headline'],
                'description': ad['description'],
                'call_to_action': {
                    'type': 'LEARN_MORE',
                    'value': {'link': LINK}
                }
            }
        }
    })

    data = urllib.parse.urlencode({
        'name': ad['name'],
        'adset_id': ADSET_ID,
        'status': 'PAUSED',
        'creative': creative,
        'access_token': TOKEN
    }).encode()

    req = urllib.request.Request(f'{API}/{ACCOUNT}/ads', data=data, method='POST')

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            print(f"  OK {ad['name']} -- ID: {result.get('id', 'unknown')}")
    except urllib.error.HTTPError as e:
        error = json.loads(e.read().decode())
        print(f"  FAIL {ad['name']} -- Error: {error.get('error', {}).get('message', 'unknown')}")

print("\nDone!")
