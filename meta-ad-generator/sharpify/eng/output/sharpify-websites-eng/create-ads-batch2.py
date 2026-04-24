import json, urllib.request, urllib.parse, sys, os
from pathlib import Path
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')

def load_env():
    for parent in Path(__file__).resolve().parents:
        env = parent / '.env'
        if env.exists():
            for line in env.read_text().splitlines():
                if '=' in line and not line.lstrip().startswith('#'):
                    k, _, v = line.partition('=')
                    os.environ.setdefault(k.strip(), v.strip())
            return

load_env()
TOKEN = os.environ['META_ACCESS_TOKEN']
ACCOUNT = "act_1184056475376090"
PAGE_ID = "116359515734204"
INSTAGRAM_ID = "17841401853795292"
ADSET_ID = "120242514313810328"
LINK = "https://web.sharpify.lv/"
API = "https://graph.facebook.com/v21.0"

ads = [
    {
        "name": "Ad — Notes App Creative",
        "image_hash": "ffdc648f21c11c08c1f2b8a3f7833620",
        "message": """You've had "get a website" on your to-do list for how long now?

Be honest. It's been sitting there for weeks. Maybe months. Maybe since you started your business.

And every week it doesn't get done, you lose a little more:

\u2705 A potential client Googles you and finds nothing
\u2705 Someone asks for your website and you say "it's coming soon"
\u2705 You see a competitor with a clean, professional site and think \u2014 I need that
\u2705 But then you check agency prices and close the tab

Here's why it never gets done: every option felt too expensive, too complicated, or too slow.

Until now.

\U0001f539 You fill out a 10-minute questionnaire about your business
\U0001f539 Our team builds a custom website from scratch
\U0001f539 You get it delivered on WhatsApp in 1-3 days
\U0001f539 You review it and request changes until it's perfect

Starter \u2014 59 EUR. Pro \u2014 199 EUR. One-time payment.

Finally check it off your list.

\U0001f449 Do it today

Niks Jansons, CEO @ Sharpify""",
        "headline": "Check this off your list. \u20ac59.",
        "description": "Sharpify \u2014 Professional Websites"
    },
    {
        "name": "Ad — Package Tracking Creative",
        "image_hash": "b41d20773ba91e7626a74bb3fea0c8b7",
        "message": """What if getting a website was as simple as tracking a package?

Monday: you place your order and fill out a 10-minute questionnaire.
Tuesday: our team is building your custom website.
Wednesday: you get it delivered on WhatsApp. Done.

No meetings. No proposals. No "let's circle back next week." No learning WordPress at 11 PM.

Most business owners we talk to have been putting this off because every option felt like a project:

\u2705 Agencies want weeks of meetings before they even start
\u2705 Freelancers need constant direction and still miss deadlines
\u2705 DIY builders eat up your weekends and still look generic
\u2705 And the whole time, clients are looking for you online and finding nothing

We made it simple on purpose.

\U0001f539 Custom design tailored to your brand \u2014 not a template
\U0001f539 Mobile-responsive on every device
\U0001f539 Contact forms + WhatsApp chat included
\U0001f539 SEO optimized so people can actually find you
\U0001f539 Revision rounds included \u2014 we fix it until you love it

2,300+ businesses across 26 countries. Starting at 59 EUR.

\U0001f449 Place your order

Niks Jansons, CEO @ Sharpify""",
        "headline": "Order Monday. Live Wednesday.",
        "description": "Sharpify \u2014 Professional Websites"
    },
    {
        "name": "Ad — LinkedIn Post Creative",
        "image_hash": "a7227f056423872c314a8061b73c108b",
        "message": """"I ran my business for over a year without a website. I kept telling myself referrals were enough. Then I got one \u2014 and 4 new enquiries came in the first week."

That's what most of our clients say after they finally stop putting it off.

The truth is, people check your website before they call you. Before they trust you. Before they spend money with you. And if they find nothing \u2014 they go to someone who does have one.

\u2705 You've been meaning to get a website for months
\u2705 Every quote you got was way too high
\u2705 You tried doing it yourself and gave up
\u2705 You know it's costing you clients but it never feels urgent enough

We hear this every single day. That's why we built a system that takes 10 minutes of your time and gives you a finished website in 1-3 days.

\U0001f539 Custom-designed for your business
\U0001f539 Mobile-ready, fast-loading, SEO optimized
\U0001f539 Contact forms and WhatsApp chat built in
\U0001f539 Delivered on WhatsApp \u2014 you review and request changes

Starter \u2014 59 EUR. Pro \u2014 199 EUR. One payment. No subscriptions.

Stop telling yourself you'll do it next month.

\U0001f449 Do it now

Niks Jansons, CEO @ Sharpify""",
        "headline": "14 months of lost clients. Don't repeat that.",
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
            print(f"  OK {ad['name']} — ID: {result.get('id', 'unknown')}")
    except urllib.error.HTTPError as e:
        error = json.loads(e.read().decode())
        print(f"  FAIL {ad['name']} — Error: {error.get('error', {}).get('message', 'unknown')}")

print("\nDone!")
