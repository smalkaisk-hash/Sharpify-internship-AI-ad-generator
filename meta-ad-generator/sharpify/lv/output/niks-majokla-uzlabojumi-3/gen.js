const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'html');
const IMG_BASE = 'file:///C:/Users/Ritvars%20Volfs/meta-ad-generator-v2/meta-ad-generator/sharpify/lv/output/niks-majokla-uzlabojumi-3/images';

// ============================================================
// NICHES
// ============================================================
const niches = [
  {
    slug: 'elektriki',
    badge: 'Elektriķiem',
    archedH: 'Tu parūpējies, lai mājas ir drošas,',
    archedEm: 'kamēr nākamais objekts',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu velc nākamo&nbsp;kabeli.',
    notifBody: 'Elektroinstalācija<br>Ādaži',
    warnTrade: 'elektroinstalācijas',
    warnTradePerson: 'elektriķus',
    warnTopLabel: 'Top 5% elektriķi',
  },
  {
    slug: 'siltumsukni',
    badge: 'Siltumsūkņu speciālistiem',
    archedH: 'Tu parūpējies, lai mājas ir siltas par mazāk,',
    archedEm: 'kamēr nākamais siltumsūknis',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu uzstādi nākamo&nbsp;siltumsūkni.',
    notifBody: 'Gaiss-ūdens siltumsūknis<br>Jūrmala',
    warnTrade: 'siltumsūkņu',
    warnTradePerson: 'siltumsūkņu uzstādītājus',
    warnTopLabel: 'Top 5% uzstādītāji',
  },
  {
    slug: 'parketa',
    badge: 'Parketa meistariem',
    archedH: 'Tu parūpējies, lai grīdas mirdz,',
    archedEm: 'kamēr nākamā istaba',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu slīpē nākamo&nbsp;grīdu.',
    notifBody: 'Parketa slīpēšana<br>Rīga centrs',
    warnTrade: 'parketa',
    warnTradePerson: 'parketa meistarus',
    warnTopLabel: 'Top 5% parketnieki',
  },
];

// ============================================================
// TEMPLATE 1 — CIRCLE (ex-arched, full circle photo + tick marks)
// ============================================================
const circleTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0E1412}
.grad{position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(245,158,11,0.20) 0%,rgba(14,20,18,0) 55%),radial-gradient(circle at 20% 90%,rgba(56,120,80,0.12) 0%,rgba(14,20,18,0) 50%)}
.noise{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px);background-size:3px 3px;opacity:0.5}

.ring{position:absolute;top:76px;left:50%;transform:translateX(-50%);width:560px;height:560px;border-radius:50%;border:1px dashed rgba(245,158,11,0.28);z-index:2}
.ring2{position:absolute;top:50px;left:50%;transform:translateX(-50%);width:612px;height:612px;border-radius:50%;border:1px solid rgba(245,158,11,0.12);z-index:2}
.circle{position:absolute;top:90px;left:50%;transform:translateX(-50%);width:532px;height:532px;border-radius:50%;overflow:hidden;border:1px solid rgba(245,158,11,0.32);box-shadow:0 30px 80px rgba(0,0,0,0.6),inset 0 0 0 6px rgba(255,255,255,0.04);z-index:3}
.circle img{width:100%;height:100%;object-fit:cover}
.circle::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(14,20,18,0.55) 100%)}

.ticks{position:absolute;top:40px;left:50%;transform:translateX(-50%);width:632px;height:632px;z-index:2;pointer-events:none}
.tick{position:absolute;top:50%;left:50%;width:4px;height:12px;background:rgba(245,158,11,0.4);transform-origin:0 306px}

.content{position:absolute;left:60px;right:60px;bottom:78px;text-align:center;z-index:4}
h1{font-family:'Instrument Serif',serif;font-size:46px;line-height:1.12;color:#fff;letter-spacing:-0.02em;font-weight:400}
h1 em{font-style:italic;color:#F59E0B}
.sub{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:500;color:rgba(255,255,255,0.65);margin-top:18px;line-height:1.45;max-width:720px;margin-left:auto;margin-right:auto}
.chips{display:flex;justify-content:center;gap:10px;margin-top:22px;flex-wrap:wrap}
.chip{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);padding:8px 16px;border:1px solid rgba(255,255,255,0.15);border-radius:100px;letter-spacing:0.04em}
.chip.on{background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.5);color:#F59E0B}
.row{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:28px;flex-wrap:wrap}
.cta{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:800;color:#0a0a0a;background:#F59E0B;padding:32px 68px;border-radius:100px;display:inline-flex;align-items:center;gap:18px;box-shadow:0 12px 30px rgba(245,158,11,0.35)}
.cta .arr{width:44px;height:44px;background:#0a0a0a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.cta .arr svg{display:block}
</style>
</head>
<body>
<div class="ad">
<div class="grad"></div>
<div class="noise"></div>
<div class="ring2"></div>
<div class="ring"></div>
<div class="ticks">
${Array.from({length:24}).map((_,i)=>`<div class="tick" style="transform:translate(-2px,-6px) rotate(${i*15}deg) translateY(-306px)"></div>`).join('')}
</div>
<div class="circle"><img src="${IMG_BASE}/${n.slug}.png"></div>
<div class="content">
<h1>${n.archedH}<br><em>${n.archedEm}</em> ${n.archedH2}</h1>
<div class="sub">AI mārketings, automatizēti pieteikumi un CRM — viss, kas piesaista klientus Tavam biznesam.</div>
<div class="chips">
<span class="chip">Reklāmas</span>
<span class="chip">AI pieteikumi</span>
<span class="chip">CRM</span>
<span class="chip on">🎁 Mājaslapa bonusā</span>
</div>
<div class="row">
<div class="cta">Uzzināt vairāk <span class="arr"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
</div>
</div>
</div>
</body>
</html>`;

// ============================================================
// TEMPLATE 2 — POLAROID (ex-sticker, cream polaroid card + washi tape notif)
// ============================================================
const polaroidTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&family=Caveat:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0a0a0a}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.88)}
.tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.55) 100%)}

.polaroid{position:absolute;left:50px;right:50px;bottom:60px;background:#f7ede0;padding:38px 46px 36px;transform:rotate(-1.2deg);box-shadow:0 30px 70px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.08);border-radius:3px}
.polaroid::before{content:"";position:absolute;top:-16px;left:50%;transform:translateX(-50%) rotate(-2deg);width:220px;height:34px;background:rgba(245,158,11,0.72);background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.22) 0 6px,transparent 6px 14px);box-shadow:0 2px 5px rgba(0,0,0,0.3)}
.badge{display:inline-block;font-family:'Montserrat',sans-serif;font-size:16px;font-weight:800;color:#b45309;text-transform:uppercase;letter-spacing:0.22em;margin-bottom:14px;padding:7px 16px;background:rgba(245,158,11,0.15);border-radius:100px;border:1px solid rgba(180,83,9,0.25)}
h1{font-family:'Montserrat',sans-serif;font-size:44px;font-weight:900;color:#14100d;line-height:1.05;letter-spacing:-0.01em}
h1 .accent{color:#b45309}
.sub{font-family:'Inter',sans-serif;font-size:22px;font-weight:500;color:rgba(20,16,13,0.68);margin-top:14px;line-height:1.38}
.row{display:flex;align-items:center;gap:18px;margin-top:24px}
.cta{font-family:'Montserrat',sans-serif;font-size:26px;font-weight:800;color:#f7ede0;background:#14100d;padding:20px 40px;border-radius:10px;box-shadow:0 8px 18px rgba(0,0,0,0.35)}
.gift{font-family:'Montserrat',sans-serif;font-size:16px;font-weight:700;color:rgba(20,16,13,0.85);text-transform:uppercase;letter-spacing:0.08em}
.gift b{color:#b45309}
.scrawl{position:absolute;bottom:14px;right:28px;font-family:'Caveat',cursive;font-size:22px;font-weight:600;color:rgba(20,16,13,0.5);transform:rotate(-2deg)}

.notif-wrap{position:absolute;top:72px;right:50px;width:380px;transform:rotate(2.6deg);z-index:5}
.tape{position:absolute;top:-20px;left:20%;width:120px;height:30px;background:#F59E0B;background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.25) 0 5px,transparent 5px 12px);transform:rotate(-6deg);box-shadow:0 3px 6px rgba(0,0,0,0.35);z-index:2}
.tape2{position:absolute;top:-14px;right:10%;width:90px;height:24px;background:#fff;background-image:repeating-linear-gradient(-45deg,rgba(0,0,0,0.08) 0 4px,transparent 4px 10px);transform:rotate(8deg);box-shadow:0 2px 5px rgba(0,0,0,0.3);z-index:2}
.notif{background:#fff;border-radius:20px;padding:20px 22px;box-shadow:0 20px 50px rgba(0,0,0,0.5);display:flex;gap:14px;align-items:flex-start}
.notif-ico{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#F59E0B,#D97706);display:flex;align-items:center;justify-content:center;color:#fff;font-size:23px;font-weight:900;flex-shrink:0;font-family:'Montserrat',sans-serif}
.notif-t{font-family:'Inter',sans-serif}
.notif-title{font-size:15px;font-weight:700;color:#0a0a0a;margin-bottom:2px}
.notif-body{font-size:14px;color:#555;line-height:1.3}
.notif-time{font-size:12px;color:#999;margin-top:4px}
</style>
</head>
<body>
<div class="ad">
<img class="bg" src="${IMG_BASE}/${n.slug}.png">
<div class="tint"></div>

<div class="notif-wrap">
<div class="tape"></div>
<div class="tape2"></div>
<div class="notif">
<div class="notif-ico">S</div>
<div class="notif-t">
<div class="notif-title">Jauns pieteikums</div>
<div class="notif-body">${n.notifBody}</div>
<div class="notif-time">pirms 2 min</div>
</div>
</div>
</div>

<div class="polaroid">
<div class="badge">${n.badge}</div>
<h1>${n.stickerH1}<br>${n.stickerH2}</h1>
<div class="sub">MP Risinājums™ AI sistēma — reklāmas, automatizēti pieteikumi un CRM vienuviet.</div>
<div class="row">
<div class="cta">Uzzināt vairāk →</div>
<div class="gift">🎁 <b>Dāvanā</b><br>jauna mājaslapa</div>
</div>
<div class="scrawl">— Niks</div>
</div>
</div>
</body>
</html>`;

// ============================================================
// TEMPLATE 3 — VOLTAGE (ex-warning, red hazard + lightning bolts)
// ============================================================
const voltageTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0a0a0a;display:flex;flex-direction:column}
.stripes{height:58px;flex-shrink:0;background:repeating-linear-gradient(-45deg,#DC2626 0 44px,#0a0a0a 44px 88px);position:relative}
.stripes::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:#FCA5A5;opacity:0.6}
.stripes::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:#FCA5A5;opacity:0.6}

.body-w{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:30px 60px;position:relative;text-align:center}

.bolt{position:absolute;color:#DC2626;opacity:0.85}
.bolt.b1{top:38px;left:60px;font-size:52px;transform:rotate(-12deg)}
.bolt.b2{top:38px;right:60px;font-size:52px;transform:rotate(12deg)}

.chip{display:inline-flex;align-items:center;gap:10px;background:#DC2626;color:#fff;padding:10px 22px;border-radius:6px;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:0.24em;margin-bottom:18px;box-shadow:0 0 20px rgba(220,38,38,0.4)}
.chip .dot{width:8px;height:8px;background:#fff;border-radius:50%}
.big{font-family:'Space Grotesk',sans-serif;font-weight:900;font-size:68px;color:#fff;line-height:0.95;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:52px;text-shadow:4px 4px 0 rgba(220,38,38,0.4),0 0 40px rgba(220,38,38,0.2)}
.big span{color:#DC2626}

.frame{position:relative;width:580px;height:360px;margin-bottom:26px}
.frame::before{content:"";position:absolute;inset:-12px;background:#DC2626;border-radius:4px;z-index:1}
.frame::after{content:"";position:absolute;inset:-22px;border:3px dashed #DC2626;border-radius:6px;opacity:0.5;z-index:0}
.photo{position:relative;width:100%;height:100%;z-index:2;overflow:hidden;border-radius:2px;background:#111}
.photo img{width:100%;height:100%;object-fit:cover;object-position:center 22%}
.frame-label{position:absolute;top:-46px;left:0;background:#0a0a0a;color:#DC2626;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:900;padding:7px 16px;letter-spacing:0.25em;text-transform:uppercase;z-index:3;border:2px solid #DC2626}
.frame-corner{position:absolute;bottom:-46px;right:0;background:#DC2626;color:#fff;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:900;padding:7px 16px;letter-spacing:0.2em;text-transform:uppercase;z-index:3}

.sub{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:600;color:#fff;line-height:1.3;max-width:820px;margin-bottom:26px;margin-top:10px}
.sub em{font-style:normal;color:#DC2626;font-weight:900}
.cta{font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:900;color:#fff;background:#DC2626;padding:24px 54px;border-radius:10px;display:inline-flex;align-items:center;gap:16px;text-transform:uppercase;letter-spacing:0.08em;box-shadow:6px 6px 0 rgba(220,38,38,0.3),0 0 30px rgba(220,38,38,0.4)}
.cta .arr{width:38px;height:38px;background:#0a0a0a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.cta .arr svg{display:block}
.proof{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:rgba(255,255,255,0.6);margin-top:18px;text-transform:uppercase;letter-spacing:0.22em}
.proof b{color:#DC2626;font-weight:900}
</style>
</head>
<body>
<div class="ad">
<div class="stripes"></div>
<div class="body-w">
<div class="bolt b1">⚡</div>
<div class="bolt b2">⚡</div>
<div class="chip"><span class="dot"></span>Atlase 2026<span class="dot"></span></div>
<div class="big">Vadi savu<br><span>${n.warnTrade}</span> biznesu?</div>
<div class="frame">
<div class="frame-label">Pievienojies → Latvija</div>
<div class="photo"><img src="${IMG_BASE}/${n.slug}.png"></div>
<div class="frame-corner">${n.warnTopLabel}</div>
</div>
<div class="sub">Meklējam <em>5 ${n.warnTradePerson}</em> ar savu firmu, kas gatavi uzņemt jaunus klientus katru mēnesi ar AI mārketinga sistēmu.</div>
<div class="cta">Pieteikties <span class="arr"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
<div class="proof"><b>2'300+ uzņēmēju</b> · jau sadarbībā ar Sharpify</div>
</div>
<div class="stripes"></div>
</div>
</body>
</html>`;

// ============================================================
// RENDER ALL
// ============================================================
for (const n of niches) {
  fs.writeFileSync(path.join(OUT, `${n.slug}-1-circle.html`), circleTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-2-polaroid.html`), polaroidTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-3-voltage.html`), voltageTpl(n));
  console.log(`  Wrote: ${n.slug} (3 templates)`);
}

console.log(`Done! ${niches.length * 3} HTML files generated.`);
