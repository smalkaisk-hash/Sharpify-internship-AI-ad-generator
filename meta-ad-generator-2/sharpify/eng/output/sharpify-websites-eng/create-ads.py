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
        "name": "Ad — Google Search Creative",
        "image_hash": "22d92f2d1043223dcabee5d5f12b8f48",
        "message": """Are you a business owner who knows you need a website — but every option feels too expensive, too complicated, or too slow?

You're not alone. Most people looking for a website hit the same wall:

✅ Agencies want 2,000+ EUR and 6-8 weeks of your time
✅ Freelancers are hit or miss — and you've heard the horror stories
✅ DIY builders like Wix take forever and still look generic
✅ You end up doing nothing — and losing clients every day because of it

We built a system that eliminates all of that.

You fill out a 10-minute questionnaire. Our team designs a professional, custom website for your business. You get it delivered on WhatsApp in 1-3 days.

🔹 Custom design — not a template
🔹 Mobile-responsive on every device
🔹 Contact forms + WhatsApp chat included
🔹 SEO optimized from day one
🔹 Satisfaction guaranteed

2,300+ businesses across 26 countries already trust us. Starting at 59 EUR. One-time payment.

👉 See how it works

Niks Jansons, CEO @ Sharpify""",
        "headline": "Still searching for the right website?",
        "description": "Sharpify — Professional Websites"
    },
    {
        "name": "Ad — iMessage Creative",
        "image_hash": "015937b14fcaebad98dd2d0b888283f5",
        "message": """Have you ever seen a competitor's website and thought — how do they look so professional?

Meanwhile you're stuck with no website, or one that looks like it was built ten years ago. And you know it's costing you clients.

Most business owners we talk to have the same story:

✅ They've been meaning to get a website for months
✅ Every quote they got was way too high
✅ They tried building one themselves and gave up
✅ They know they're losing credibility every day without one

Here's what we do differently.

You tell us about your business. We build you a custom, professional website — and deliver it on WhatsApp in 1-3 days. No meetings. No back-and-forth. No tech skills needed.

🔹 Individual design tailored to your brand
🔹 Works perfectly on phones, tablets, and desktop
🔹 Contact forms and WhatsApp chat built in
🔹 SEO basics so people can actually find you

Starting at 59 EUR. One payment. That's it.

👉 Get your website

Niks Jansons, CEO @ Sharpify""",
        "headline": "Your competitor's website is better than yours. Fix that.",
        "description": "Sharpify — Professional Websites"
    },
    {
        "name": "Ad — ChatGPT Creative",
        "image_hash": "a0cd75941294d371f06601447a856012",
        "message": """You've probably asked Google, YouTube, or even ChatGPT the same question: "What's the cheapest way to get a professional website?"

And you keep getting the same answers — Wix, Squarespace, WordPress. Tools where YOU do all the work. And after 20 hours of dragging boxes around, it still looks like a template.

Here's what nobody tells you:

✅ A bad website hurts you more than no website at all
✅ DIY builders waste your time — time you should spend on your business
✅ Agencies charge thousands for something that should take days, not months
✅ You don't need to learn web design. You need someone to just do it.

That's exactly what we do.

🔹 You fill out a short questionnaire about your business
🔹 Our team builds a custom website from scratch
🔹 You get it delivered on WhatsApp in 1-3 days
🔹 You review it and request changes until it's perfect

2,300+ businesses. 26 countries. Starting at 59 EUR. One-time payment.

👉 Stop doing it yourself

Niks Jansons, CEO @ Sharpify""",
        "headline": "You don't need another website builder. You need a website.",
        "description": "Sharpify — Professional Websites"
    },
    {
        "name": "Ad — Reddit Creative",
        "image_hash": "be193789be9a2eb3775b095a1e9259bf",
        "message": """If you just started a business — or you've been running one for years without a proper website — this is for you.

Every day, potential clients Google your name. They look for your business. And they find… nothing. Or worse — an old page that makes your service look unprofessional.

Sound familiar?

✅ You know a website would bring you more clients
✅ But every agency quote felt like robbery
✅ You tried building one yourself and it looked terrible
✅ So you've been putting it off — for weeks, months, maybe years

We get it. That's exactly why we created this.

🔹 A professional, custom-designed website for your business
🔹 Mobile-ready, fast-loading, SEO optimized
🔹 Contact forms and WhatsApp chat included
🔹 Delivered in 1-3 days — not weeks

Starter — 59 EUR. Pro — 199 EUR. One-time payment. No subscriptions.

Built by the same team that has served 2,300+ businesses in 26 countries.

👉 Stop putting it off

Niks Jansons, CEO @ Sharpify""",
        "headline": "How long have you been \"meaning to get a website\"?",
        "description": "Sharpify — Professional Websites"
    },
    {
        "name": "Ad — Amazon Creative",
        "image_hash": "c57e46735b6b9193e137b4030b73add1",
        "message": """What if you could buy a professional website the same way you buy on Amazon?

Pick it. Pay for it. Get it delivered.

That is exactly how we work.

59 EUR. Custom-designed for your business. Mobile-responsive. SEO optimized. Delivered in 1-3 days.

2,300+ businesses served. 26 countries.

✅ No tech skills needed — we handle everything
✅ No templates — every website is custom-designed for your brand
✅ No subscriptions — one payment and it's yours forever
✅ No guessing — we deliver on WhatsApp and you tell us what to change

🔹 Custom design for your business
🔹 Mobile-responsive on all devices
🔹 Contact forms + WhatsApp chat
🔹 SEO optimized so clients can find you
🔹 Revision rounds included

Starter — 59 EUR | Pro — 199 EUR

👉 It really is that simple

Niks Jansons, CEO @ Sharpify""",
        "headline": "Buying a website should be this easy.",
        "description": "Sharpify — Professional Websites"
    },
    {
        "name": "Ad — Notification Creative",
        "image_hash": "0d34b59fc80ea19e86684e0665003167",
        "message": """Right now, somewhere, a business owner just like you is getting a quote from a web agency.

The quote says 3,000 EUR. Timeline: 6-8 weeks. Three rounds of revisions. A project manager who takes 48 hours to reply.

Meanwhile, our clients get a different notification:

"Your website is ready."

Two days after they filled out a 10-minute questionnaire. For 59 EUR.

✅ No endless email chains with designers
✅ No learning WordPress at midnight
✅ No spending thousands on something that should be simple
✅ No waiting weeks for a first draft

🔹 A real team builds your website from scratch
🔹 Custom design, not a template
🔹 Mobile-responsive, SEO optimized
🔹 Delivered on WhatsApp — you review and request changes

2,300+ businesses across 26 countries already got theirs. Your turn.

👉 Get yours now

Niks Jansons, CEO @ Sharpify""",
        "headline": "They're still writing proposals. We already finished your website.",
        "description": "Sharpify — Professional Websites"
    },
    {
        "name": "Ad — Tinder Creative",
        "image_hash": "ee233754db145199c8e08daf74ce4e3c",
        "message": """Let's be honest — finding someone to build your website is exhausting.

You've probably already been through this:

✅ An agency that wanted 2,000+ EUR for a "basic" site
✅ A freelancer who disappeared after the first payment
✅ A weekend spent fighting with Wix, only to hate the result
✅ A friend who "knows a guy" — and the guy never delivered

At some point you just give up and go without one. But every week without a website, you're losing clients to someone who has one.

We built Sharpify to fix that. One simple process:

🔹 You tell us about your business (10-minute questionnaire)
🔹 We design a custom, professional website
🔹 You get it on WhatsApp in 1-3 days
🔹 You request changes until it's perfect

59 EUR. One-time payment. No subscriptions. No surprises.

2,300+ businesses in 26 countries already made the switch.

👉 Your turn

Niks Jansons, CEO @ Sharpify""",
        "headline": "Done wasting time on the wrong website builders?",
        "description": "Sharpify — Professional Websites"
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
            print(f"  ✓ {ad['name']} — ID: {result.get('id', 'unknown')}")
    except urllib.error.HTTPError as e:
        error = json.loads(e.read().decode())
        print(f"  ✗ {ad['name']} — Error: {error.get('error', {}).get('message', 'unknown')}")

print("\nDone! All ads created as PAUSED.")
