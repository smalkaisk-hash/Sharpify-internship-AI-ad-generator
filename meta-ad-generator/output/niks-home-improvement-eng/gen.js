const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'html');
const IMG_BASE = 'file:///C:/Users/Ritvars Volfs/meta-ad-generator-v2/meta-ad-generator/output/niks-home-improvement-eng/images';

const niches = [
  {
    slug: 'windows',
    img: 'logi',
    tag: 'For window & door installers',
    badge: 'Window installers',
    archedH: 'You finish the install.',
    archedEm: 'Your next client&rsquo;s',
    archedH2: 'already waiting.',
    stickerH1: 'Jobs book <span class="accent">themselves</span>,',
    stickerH2: 'while you focus on the next&nbsp;install.',
    notifBody: '5 windows replacement<br>Boston, MA'
  },
  {
    slug: 'siding',
    img: 'fasade',
    tag: 'For siding & insulation pros',
    badge: 'Siding contractors',
    archedH: 'You finish the siding.',
    archedEm: 'Your next client&rsquo;s',
    archedH2: 'already waiting.',
    stickerH1: 'Jobs book <span class="accent">themselves</span>,',
    stickerH2: 'while you focus on the next&nbsp;house.',
    notifBody: 'Full siding replacement<br>Seattle, WA'
  },
  {
    slug: 'roofing',
    img: 'jumiki',
    tag: 'For roofing contractors',
    badge: 'Roofers',
    archedH: 'You finish the roof.',
    archedEm: 'Your next client&rsquo;s',
    archedH2: 'already waiting.',
    stickerH1: 'Jobs book <span class="accent">themselves</span>,',
    stickerH2: 'while you focus on the next&nbsp;roof.',
    notifBody: 'Full roof replacement<br>Denver, CO'
  },
  {
    slug: 'decks',
    img: 'terases',
    tag: 'For deck & outdoor living builders',
    badge: 'Deck builders',
    archedH: 'You finish the deck.',
    archedEm: 'Your next client&rsquo;s',
    archedH2: 'already waiting.',
    stickerH1: 'Jobs book <span class="accent">themselves</span>,',
    stickerH2: 'while you focus on the next&nbsp;deck.',
    notifBody: 'Backyard deck build<br>Tampa, FL'
  },
  {
    slug: 'kitchens',
    img: 'virtuves',
    tag: 'For kitchen remodelers & installers',
    badge: 'Kitchen installers',
    archedH: 'You finish the kitchen.',
    archedEm: 'Your next client&rsquo;s',
    archedH2: 'already waiting.',
    stickerH1: 'Orders book <span class="accent">themselves</span>,',
    stickerH2: 'while you focus on the next&nbsp;kitchen.',
    notifBody: 'Full kitchen remodel<br>Phoenix, AZ'
  },
  {
    slug: 'paving',
    img: 'brugesana',
    tag: 'For paving & driveway pros',
    badge: 'Paving contractors',
    archedH: 'You finish the driveway.',
    archedEm: 'Your next client&rsquo;s',
    archedH2: 'already waiting.',
    stickerH1: 'Jobs book <span class="accent">themselves</span>,',
    stickerH2: 'while you focus on the next&nbsp;driveway.',
    notifBody: 'Driveway paving<br>Austin, TX'
  }
];

const archedTpl = (n) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0E1412}
.grad{position:absolute;inset:0;background:radial-gradient(circle at 50% 110%,rgba(245,158,11,0.18) 0%,rgba(14,20,18,0) 55%),radial-gradient(circle at 20% 10%,rgba(56,120,80,0.12) 0%,rgba(14,20,18,0) 50%)}
.noise{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px);background-size:3px 3px;opacity:0.5}
.top{position:absolute;top:50px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;z-index:5}
.brand{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;color:#fff;letter-spacing:-0.01em}
.brand .dot{display:inline-block;width:8px;height:8px;background:#F59E0B;border-radius:50%;margin-right:10px;vertical-align:middle}
.menu{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:14px;color:rgba(255,255,255,0.5);letter-spacing:0.08em;text-transform:uppercase}
.arch{position:absolute;top:50px;left:50%;transform:translateX(-50%);width:620px;height:460px;border-radius:310px 310px 20px 20px;overflow:hidden;border:1px solid rgba(245,158,11,0.25);box-shadow:0 30px 80px rgba(0,0,0,0.55),inset 0 0 0 6px rgba(255,255,255,0.04);z-index:3}
.arch img{width:100%;height:100%;object-fit:cover}
.arch::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(14,20,18,0.55) 100%)}
.ring{position:absolute;top:40px;left:50%;transform:translateX(-50%);width:640px;height:480px;border-radius:320px 320px 24px 24px;border:1px dashed rgba(245,158,11,0.25);z-index:2}
.content{position:absolute;left:60px;right:60px;bottom:80px;text-align:center;z-index:4}
h1{font-family:'Instrument Serif',serif;font-size:58px;line-height:1.02;color:#fff;letter-spacing:-0.02em;font-weight:400}
h1 em{font-style:italic;color:#F59E0B}
.sub{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:500;color:rgba(255,255,255,0.65);margin-top:18px;line-height:1.45;max-width:720px;margin-left:auto;margin-right:auto}
.chips{display:flex;justify-content:center;gap:10px;margin-top:22px;flex-wrap:wrap}
.chip{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);padding:8px 16px;border:1px solid rgba(255,255,255,0.15);border-radius:100px;letter-spacing:0.04em}
.chip.on{background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.5);color:#F59E0B}
.row{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:30px;flex-wrap:wrap}
.cta{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#0a0a0a;background:#F59E0B;padding:22px 42px;border-radius:100px;display:inline-flex;align-items:center;gap:12px}
.cta .arr{width:34px;height:34px;background:#0a0a0a;color:#F59E0B;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:900}
.gift{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:500;color:rgba(255,255,255,0.7)}
.gift b{color:#F59E0B;font-weight:700}
</style>
</head>
<body>
<div class="ad">
<div class="grad"></div>
<div class="noise"></div>
<div class="top" style="display:none"></div>
<div class="ring"></div>
<div class="arch"><img src="${IMG_BASE}/${n.img}.png"></div>
<div class="content">
<h1>${n.archedH}<br><em>${n.archedEm}</em> ${n.archedH2}</h1>
<div class="sub">AI marketing, automated lead follow-up and CRM — everything that brings clients to your business.</div>
<div class="chips">
<span class="chip">Paid Ads</span>
<span class="chip">AI Follow-up</span>
<span class="chip">CRM</span>
<span class="chip on">🎁 Free website included</span>
</div>
<div class="row">
<div class="cta">Learn More <span class="arr">→</span></div>
<div class="gift">2,300+ businesses <b>already using</b></div>
</div>
</div>
</div>
</body>
</html>`;

const stickerTpl = (n) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0a0a0a}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.5) 100%)}
.card{position:absolute;left:60px;right:60px;bottom:80px;background:#0a0a0a;border-radius:28px;padding:48px 52px;transform:rotate(-1.4deg);box-shadow:0 30px 70px rgba(0,0,0,0.55),0 0 0 1px rgba(245,158,11,0.15);border-top:6px solid #F59E0B}
.badge{display:inline-block;font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:#F59E0B;text-transform:uppercase;letter-spacing:0.18em;margin-bottom:18px;padding:8px 18px;background:rgba(245,158,11,0.12);border-radius:100px}
h1{font-family:'Montserrat',sans-serif;font-size:46px;font-weight:900;color:#fff;line-height:1.05;letter-spacing:-0.01em}
h1 .accent{color:#F59E0B}
.sub{font-family:'Inter',sans-serif;font-size:26px;font-weight:500;color:rgba(255,255,255,0.72);margin-top:16px;line-height:1.35}
.row{display:flex;align-items:center;gap:18px;margin-top:26px}
.cta{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:800;color:#0a0a0a;background:#F59E0B;padding:22px 44px;border-radius:14px;box-shadow:0 10px 24px rgba(245,158,11,0.35)}
.gift{font-family:'Montserrat',sans-serif;font-size:18px;font-weight:700;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:0.08em}
.gift b{color:#F59E0B}
.notif{position:absolute;top:80px;right:50px;background:#fff;border-radius:20px;padding:18px 22px;width:360px;box-shadow:0 20px 50px rgba(0,0,0,0.5);transform:rotate(2.4deg);display:flex;gap:14px;align-items:flex-start}
.notif-ico{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#F59E0B,#D97706);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:900;flex-shrink:0;font-family:'Montserrat',sans-serif}
.notif-t{font-family:'Inter',sans-serif}
.notif-title{font-size:15px;font-weight:700;color:#0a0a0a;margin-bottom:2px}
.notif-body{font-size:14px;color:#555;line-height:1.3}
.notif-time{font-size:12px;color:#999;margin-top:4px}
</style>
</head>
<body>
<div class="ad">
<img class="bg" src="${IMG_BASE}/${n.img}.png">
<div class="tint"></div>
<div class="notif">
<div class="notif-ico">S</div>
<div class="notif-t">
<div class="notif-title">New lead</div>
<div class="notif-body">${n.notifBody}</div>
<div class="notif-time">2 min ago</div>
</div>
</div>
<div class="card">
<div class="badge">${n.badge}</div>
<h1>${n.stickerH1}<br>${n.stickerH2}</h1>
<div class="sub">Sharpify's AI system — paid ads, automated follow-up and CRM in one place.</div>
<div class="row">
<div class="cta">Learn More →</div>
<div class="gift">🎁 <b>Free website</b><br>included</div>
</div>
</div>
</div>
</body>
</html>`;

for (const n of niches) {
  fs.writeFileSync(path.join(OUT, `${n.slug}-1-arched.html`), archedTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-2-sticker.html`), stickerTpl(n));
  console.log(`  Wrote: ${n.slug}-1-arched.html + ${n.slug}-2-sticker.html`);
}
console.log(`Done! ${niches.length * 2} HTML files generated.`);
