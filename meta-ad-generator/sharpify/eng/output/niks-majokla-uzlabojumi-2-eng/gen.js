const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'html');
const IMG_BASE = 'file:///C:/Users/Ritvars Volfs/meta-ad-generator-v2/meta-ad-generator/output/niks-majokla-uzlabojumi-2-eng/images';

const niches = [
  { slug: 'notekcaurules', badge: 'Gutter installers',     magTitleA: 'Is your',      magTitleEm: 'schedule', magTitleB: 'full all season?',       magSub: 'AI ad system that brings in new clients every week to gutter installation businesses.',          warnTrade: 'gutter installation', warnTradePerson: 'gutter installation businesses' },
  { slug: 'zogi',          badge: 'Fence builders',        magTitleA: 'Is your',      magTitleEm: 'calendar', magTitleB: 'full this summer?',      magSub: 'AI ad system that brings in new clients every week to fence building businesses.',                warnTrade: 'fence building',      warnTradePerson: 'fence building businesses' },
  { slug: 'zaliens',       badge: 'Artificial lawn pros',  magTitleA: 'Do you have',  magTitleEm: 'enough',   magTitleB: 'orders all summer?',     magSub: 'AI ad system that brings in new clients every week to artificial lawn installers.',                warnTrade: 'artificial lawn',     warnTradePerson: 'artificial lawn businesses' },
  { slug: 'saulespaneli',  badge: 'Solar panel pros',      magTitleA: 'Is your next', magTitleEm: 'project',  magTitleB: 'already booked?',        magSub: 'AI ad system that brings in new clients every week to solar panel installers.',                    warnTrade: 'solar panel',         warnTradePerson: 'solar panel installers' },
  { slug: 'garazasdurvis', badge: 'Garage door installers',magTitleA: 'Do you have',  magTitleEm: 'enough',   magTitleB: 'clients?',                magSub: 'AI ad system that brings in new clients every week to garage door installers.',                    warnTrade: 'garage door',         warnTradePerson: 'garage door installers' },
  { slug: 'pirts',         badge: 'Sauna builders',        magTitleA: 'Is your next', magTitleEm: 'sauna',    magTitleB: 'already ordered?',        magSub: 'AI ad system that brings in new clients every week to sauna building businesses.',                 warnTrade: 'sauna building',      warnTradePerson: 'sauna building businesses' },
  { slug: 'vannasistabas', badge: 'Bathroom renovators',   magTitleA: 'Is your',      magTitleEm: 'queue',    magTitleB: 'full this season?',      magSub: 'AI ad system that brings in new clients every week to bathroom renovation businesses.',            warnTrade: 'bathroom renovation', warnTradePerson: 'bathroom renovation businesses' },
  { slug: 'flizetaji',     badge: 'Tile installers',       magTitleA: 'Is your',      magTitleEm: 'schedule', magTitleB: 'full all season?',       magSub: 'AI ad system that brings in new clients every week to tile installation businesses.',             warnTrade: 'tiling',              warnTradePerson: 'tile installation businesses' }
];

const magazineTpl = (n) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Playfair+Display:ital,wght@1,400;1,700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0E1412;display:flex}
.left{width:58%;height:100%;padding:70px 60px;display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:2}
.grad{position:absolute;inset:0;background:radial-gradient(circle at 20% 80%,rgba(245,158,11,0.15) 0%,rgba(14,20,18,0) 50%);z-index:1}
.right{width:42%;height:100%;position:relative;clip-path:polygon(8% 0, 100% 0, 100% 100%, 0% 100%);overflow:hidden}
.right img{width:100%;height:100%;object-fit:cover}
.right::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,0) 40%,rgba(14,20,18,0.3) 100%)}
.top-tag{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;color:#F59E0B;letter-spacing:0.3em;text-transform:uppercase;padding-bottom:14px;border-bottom:1px solid rgba(245,158,11,0.3);display:inline-block}
.middle{display:flex;flex-direction:column;justify-content:center;flex:1;padding:30px 0}
.title{font-family:'Instrument Serif',serif;font-size:86px;line-height:0.98;color:#fff;letter-spacing:-0.02em;font-weight:400}
.title em{font-style:italic;color:#F59E0B}
.sub{font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:500;color:rgba(255,255,255,0.7);margin-top:24px;line-height:1.5;max-width:440px}
.stat-row{display:flex;gap:30px;margin-top:28px}
.stat{font-family:'Space Grotesk',sans-serif}
.stat-n{font-size:30px;font-weight:700;color:#F59E0B;line-height:1;font-family:'Instrument Serif',serif;font-style:italic}
.stat-l{font-size:12px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.12em;margin-top:6px;font-weight:600}
.bottom{display:flex;justify-content:space-between;align-items:flex-end}
.cta{font-family:'Space Grotesk',sans-serif;font-size:36px;font-weight:800;color:#0a0a0a;background:#F59E0B;padding:34px 64px;border-radius:100px;display:inline-flex;align-items:center;gap:18px;box-shadow:0 10px 30px rgba(245,158,11,0.35)}
.cta .arr{width:50px;height:50px;background:#0a0a0a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
</style>
</head>
<body>
<div class="ad">
<div class="grad"></div>
<div class="left">
<div class="top-tag">MP Solution™ &nbsp;·&nbsp; ${n.badge}</div>
<div class="middle">
<div class="title">${n.magTitleA} <em>${n.magTitleEm}</em><br>${n.magTitleB}</div>
<div class="sub">${n.magSub}</div>
<div class="stat-row">
<div class="stat"><div class="stat-n">2,300+</div><div class="stat-l">business owners</div></div>
<div class="stat"><div class="stat-n">26</div><div class="stat-l">countries</div></div>
<div class="stat"><div class="stat-n">€50M+</div><div class="stat-l">client revenue</div></div>
</div>
</div>
<div class="bottom">
<div class="cta">Learn more <span class="arr"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
</div>
</div>
<div class="right"><img src="${IMG_BASE}/${n.slug}.png"></div>
</div>
</body>
</html>`;

const warningTpl = (n) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0a0a0a;display:flex;flex-direction:column}
.stripes{height:54px;flex-shrink:0;background:repeating-linear-gradient(-45deg,#FFC300 0 44px,#0a0a0a 44px 88px)}
.body-w{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:36px 60px;position:relative;text-align:center}
.chip{display:inline-flex;align-items:center;gap:10px;background:#FFC300;color:#0a0a0a;padding:10px 22px;border-radius:6px;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:0.26em;margin-bottom:18px}
.chip .dot{width:8px;height:8px;background:#0a0a0a;border-radius:50%}
.big{font-family:'Space Grotesk',sans-serif;font-weight:900;font-size:72px;color:#FFC300;line-height:0.95;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:64px;text-shadow:5px 5px 0 rgba(0,0,0,0.5)}
.frame{position:relative;width:600px;height:380px;margin-bottom:30px}
.frame::before{content:"";position:absolute;inset:-12px;background:#FFC300;border-radius:4px;z-index:1}
.frame::after{content:"";position:absolute;inset:-22px;border:3px dashed #FFC300;border-radius:6px;opacity:0.6;z-index:0}
.photo{position:relative;width:100%;height:100%;z-index:2;overflow:hidden;border-radius:2px;background:#111}
.photo img{width:100%;height:100%;object-fit:cover}
.frame-label{position:absolute;top:-46px;left:0;background:#0a0a0a;color:#FFC300;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:800;padding:7px 16px;letter-spacing:0.25em;text-transform:uppercase;z-index:3;border:2px solid #FFC300}
.frame-corner{position:absolute;bottom:-46px;right:0;background:#FFC300;color:#0a0a0a;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:900;padding:7px 16px;letter-spacing:0.2em;text-transform:uppercase;z-index:3}
.sub{font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:600;color:#fff;line-height:1.3;max-width:820px;margin-bottom:28px;margin-top:12px}
.sub em{font-style:normal;color:#FFC300;font-weight:800}
.cta{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;color:#0a0a0a;background:#FFC300;padding:26px 56px;border-radius:12px;display:inline-flex;align-items:center;gap:16px;text-transform:uppercase;letter-spacing:0.06em;box-shadow:6px 6px 0 rgba(255,195,0,0.3)}
.cta .arr{width:40px;height:40px;background:#0a0a0a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.proof{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.55);margin-top:18px;text-transform:uppercase;letter-spacing:0.2em}
.proof b{color:#FFC300;font-weight:800}
</style>
</head>
<body>
<div class="ad">
<div class="stripes"></div>
<div class="body-w">
<div class="chip"><span class="dot"></span>Intake 2026<span class="dot"></span></div>
<div class="big">Do you run a<br>${n.warnTrade} business?</div>
<div class="frame">
<div class="frame-label">Apply → Worldwide</div>
<div class="photo"><img src="${IMG_BASE}/${n.slug}.png"></div>
<div class="frame-corner">Top 5% pros</div>
</div>
<div class="sub">We're looking for <em>5 ${n.warnTradePerson}</em> ready to take on new clients every month with our AI marketing system.</div>
<div class="cta">Apply now <span class="arr"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFC300" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
<div class="proof"><b>2,300+ business owners</b> · already working with Sharpify</div>
</div>
<div class="stripes"></div>
</div>
</body>
</html>`;

for (const n of niches) {
  fs.writeFileSync(path.join(OUT, `${n.slug}-3-magazine-en.html`), magazineTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-4-warning-en.html`), warningTpl(n));
  console.log(`  Wrote: ${n.slug} (EN magazine + warning)`);
}

console.log(`Done! ${niches.length * 2} English HTML files generated.`);
