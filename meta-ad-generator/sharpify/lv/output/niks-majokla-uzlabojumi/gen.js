const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'html');
const IMG_BASE = 'file:///C:/Users/Ritvars Volfs/meta-ad-generator-v2/meta-ad-generator/output/niks-majokla-uzlabojumi/images';

const niches = [
  {
    slug: 'logi',
    tag: 'Logu un durvju montāžai',
    badge: 'Logu & durvju meistariem',
    archedH: 'Tu montē logus.',
    archedEm: 'Mēs montēsim',
    archedH2: 'Tavu klientu plūsmu.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu montē nākamo&nbsp;logu.',
    notifBody: '3 logu nomaiņa<br>Mārupe'
  },
  {
    slug: 'fasade',
    tag: 'Fasādes apdarei & siltināšanai',
    badge: 'Fasādes meistariem',
    archedH: 'Tu siltini mājas.',
    archedEm: 'Mēs sasildīsim',
    archedH2: 'Tavu klientu plūsmu.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu stāvi uz sastatnēm.',
    notifBody: 'Fasādes siltināšana<br>Jūrmala'
  },
  {
    slug: 'jumiki',
    tag: 'Jumta meistariem',
    badge: 'Jumiķiem',
    archedH: 'Tu klāj jumtus.',
    archedEm: 'Mēs uzklāsim',
    archedH2: 'Tavu klientu plūsmu.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu strādā uz jumta.',
    notifBody: 'Jumta seguma maiņa<br>Rīga'
  },
  {
    slug: 'terases',
    tag: 'Terasēm & labiekārtošanai',
    badge: 'Terašu un dārzu meistariem',
    archedH: 'Tu veido dārzus.',
    archedEm: 'Mēs iekoposim',
    archedH2: 'Tavu klientu plūsmu.',
    stickerH1: 'Klienti pierakstās <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu ieklāj nākamo&nbsp;terasi.',
    notifBody: 'Terases izbūve<br>Ogre'
  },
  {
    slug: 'virtuves',
    tag: 'Virtuves mēbeļu izgatavotājiem',
    badge: 'Virtuves meistariem',
    archedH: 'Tu būvē virtuves.',
    archedEm: 'Mēs uzbūvēsim',
    archedH2: 'Tavu klientu plūsmu.',
    stickerH1: 'Pasūtījumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu uzstādi nākamo&nbsp;virtuvi.',
    notifBody: 'Virtuves uzmērīšana<br>Mārupe'
  },
  {
    slug: 'brugesana',
    tag: 'Bruģēšanai & piebraucamajiem ceļiem',
    badge: 'Bruģēšanas meistariem',
    archedH: 'Tu bruģē piebraucamos.',
    archedEm: 'Mēs izbruģēsim',
    archedH2: 'Tavu klientu plūsmu.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu liec nākamo akmeni.',
    notifBody: 'Bruģa ieklāšana<br>Salaspils'
  }
];

const archedTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
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
.arch{position:absolute;top:130px;left:50%;transform:translateX(-50%);width:620px;height:460px;border-radius:310px 310px 20px 20px;overflow:hidden;border:1px solid rgba(245,158,11,0.25);box-shadow:0 30px 80px rgba(0,0,0,0.55),inset 0 0 0 6px rgba(255,255,255,0.04);z-index:3}
.arch img{width:100%;height:100%;object-fit:cover}
.arch::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(14,20,18,0.55) 100%)}
.ring{position:absolute;top:120px;left:50%;transform:translateX(-50%);width:640px;height:480px;border-radius:320px 320px 24px 24px;border:1px dashed rgba(245,158,11,0.25);z-index:2}
.content{position:absolute;left:60px;right:60px;bottom:80px;text-align:center;z-index:4}
h1{font-family:'Instrument Serif',serif;font-size:74px;line-height:0.98;color:#fff;letter-spacing:-0.02em;font-weight:400}
h1 em{font-style:italic;color:#F59E0B}
.sub{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:500;color:rgba(255,255,255,0.65);margin-top:18px;line-height:1.45;max-width:720px;margin-left:auto;margin-right:auto}
.chips{display:flex;justify-content:center;gap:10px;margin-top:22px;flex-wrap:wrap}
.chip{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);padding:8px 16px;border:1px solid rgba(255,255,255,0.15);border-radius:100px;letter-spacing:0.04em}
.chip.on{background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.5);color:#F59E0B}
.row{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:30px;flex-wrap:wrap}
.cta{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#0a0a0a;background:#F59E0B;padding:22px 42px;border-radius:100px;display:inline-flex;align-items:center;gap:12px}
.cta .arr{width:26px;height:26px;background:#0a0a0a;color:#F59E0B;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:14px}
.gift{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:500;color:rgba(255,255,255,0.7)}
.gift b{color:#F59E0B;font-weight:700}
</style>
</head>
<body>
<div class="ad">
<div class="grad"></div>
<div class="noise"></div>
<div class="top">
<div class="brand"><span class="dot"></span>MP Risinājums™</div>
<div class="menu">${n.tag} · LV</div>
</div>
<div class="ring"></div>
<div class="arch"><img src="${IMG_BASE}/${n.slug}.png"></div>
<div class="content">
<h1>${n.archedH} <em>${n.archedEm}</em><br>${n.archedH2}</h1>
<div class="sub">AI mārketings, automatizēti pieteikumi un CRM — viss, kas piesaista klientus Tavam biznesam.</div>
<div class="chips">
<span class="chip">Reklāmas</span>
<span class="chip">AI pieteikumi</span>
<span class="chip">CRM</span>
<span class="chip on">🎁 Mājaslapa bonusā</span>
</div>
<div class="row">
<div class="cta">Uzzināt vairāk <span class="arr">→</span></div>
<div class="gift">2'300+ uzņēmēju <b>jau izmanto</b></div>
</div>
</div>
</div>
</body>
</html>`;

const stickerTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
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
h1{font-family:'Montserrat',sans-serif;font-size:58px;font-weight:900;color:#fff;line-height:1.02;letter-spacing:-0.01em}
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
<img class="bg" src="${IMG_BASE}/${n.slug}.png">
<div class="tint"></div>
<div class="notif">
<div class="notif-ico">S</div>
<div class="notif-t">
<div class="notif-title">Jauns pieteikums</div>
<div class="notif-body">${n.notifBody}</div>
<div class="notif-time">pirms 2 min</div>
</div>
</div>
<div class="card">
<div class="badge">${n.badge}</div>
<h1>${n.stickerH1}<br>${n.stickerH2}</h1>
<div class="sub">MP Risinājums™ AI sistēma — reklāmas, automatizēti pieteikumi un CRM vienuviet.</div>
<div class="row">
<div class="cta">Uzzināt vairāk →</div>
<div class="gift">🎁 <b>Dāvanā</b><br>jauna mājaslapa</div>
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
