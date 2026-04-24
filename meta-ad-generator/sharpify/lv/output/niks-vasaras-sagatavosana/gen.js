const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'html');
const IMG_BASE = 'file:///C:/Users/Ritvars Volfs/meta-ad-generator-v2/meta-ad-generator/sharpify/lv/output/niks-vasaras-sagatavosana/images';

const niches = [
  {
    slug: 'kondicionieri',
    tag: 'Kondicionieru uzstādīšanai',
    badge: 'Kondicionieru meistariem',
    archedH: 'Tu parūpējies, lai birojos ir dzesēts gaiss,',
    archedEm: 'kamēr nākamais objekts',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu uzstādi nākamo&nbsp;kondicionieri.',
    notifBody: 'Kondicionieru uzstādīšana<br>Rīga',
    hazardHead: 'Vasara sākas<br>šo piektdien.',
    hazardSub: '28°C prognoze un pilni telefoni <em>kondicionieru meistariem</em>. Vai Tavs kalendārs gatavs?',
    postcardScript: 'Sveicieni no pilna<br>kondicionieru kalendāra!',
    postcardFooter: 'Rīga · Mārupe · Jūrmala',
    postcardStamp: 'KOND.'
  },
  {
    slug: 'darza-projektesana',
    tag: 'Dārza projektēšanai',
    badge: 'Dārza projektētājiem',
    archedH: 'Tu parūpējies, lai pagalmi izskatās kā žurnālā,',
    archedEm: 'kamēr nākamais pasūtījums',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu zīmē nākamo&nbsp;pagalmu.',
    notifBody: 'Dārza projekts<br>Mārupe',
    hazardHead: 'Sezona sākas<br>šonedēļ.',
    hazardSub: 'Privātmāju īpašnieki jau plāno pavasara darbus — <em>dārza projektētājiem</em> telefoni silti.',
    postcardScript: 'Sveicieni no pilna<br>projektu kalendāra!',
    postcardFooter: 'Piņķi · Baltezers · Ķekava',
    postcardStamp: 'DĀRZS'
  },
  {
    slug: 'laistisanas',
    tag: 'Laistīšanas sistēmu montāžai',
    badge: 'Laistīšanas speciālistiem',
    archedH: 'Tu parūpējies, lai zālieni ir zaļi visu vasaru,',
    archedEm: 'kamēr nākamais objekts',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu ieklāj nākamo&nbsp;sistēmu.',
    notifBody: 'Laistīšanas sistēma<br>Jūrmala',
    hazardHead: 'Zāliens<br>izžūst 6 dienās.',
    hazardSub: 'Tikko pavasaris — un īpašnieki jau meklē <em>laistīšanas sistēmu meistarus</em>. Kalendārs gatavs?',
    postcardScript: 'Sveicieni no zaļa<br>zāliena un pilna grafika!',
    postcardFooter: 'Jūrmala · Saulkrasti · Ādaži',
    postcardStamp: 'LAIST.'
  },
  {
    slug: 'ara-apgaismojums',
    tag: 'Āra apgaismojuma montāžai',
    badge: 'Āra apgaismojuma meistariem',
    archedH: 'Tu parūpējies, lai pagalmi spīd pēc saulrieta,',
    archedEm: 'kamēr nākamais klients',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu liec nākamo gaismu&nbsp;pagalmā.',
    notifBody: 'Dārza apgaismojums<br>Ogre',
    hazardHead: 'Vakari paliek<br>gari un silti.',
    hazardSub: 'Privātmāju īpašnieki grib baudīt pagalmu vēlāk — <em>āra apgaismojuma meistariem</em> sezona tikko sākas.',
    postcardScript: 'Sveicieni no silta<br>vakara pagalmā!',
    postcardFooter: 'Ogre · Garkalne · Sigulda',
    postcardStamp: 'GAIS.'
  }
];

// ==================== F1: ARCHED SAAS ====================
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
.arch{position:absolute;top:50px;left:50%;transform:translateX(-50%);width:620px;height:460px;border-radius:310px 310px 20px 20px;overflow:hidden;border:1px solid rgba(245,158,11,0.25);box-shadow:0 30px 80px rgba(0,0,0,0.55),inset 0 0 0 6px rgba(255,255,255,0.04);z-index:3}
.arch img{width:100%;height:100%;object-fit:cover}
.arch::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(14,20,18,0.55) 100%)}
.ring{position:absolute;top:40px;left:50%;transform:translateX(-50%);width:640px;height:480px;border-radius:320px 320px 24px 24px;border:1px dashed rgba(245,158,11,0.25);z-index:2}
.content{position:absolute;left:60px;right:60px;bottom:80px;text-align:center;z-index:4}
h1{font-family:'Instrument Serif',serif;font-size:46px;line-height:1.12;color:#fff;letter-spacing:-0.02em;font-weight:400}
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
<div class="ring"></div>
<div class="arch"><img src="${IMG_BASE}/${n.slug}.png"></div>
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
<div class="cta">Uzzināt vairāk <span class="arr">→</span></div>
<div class="gift">2'300+ uzņēmēju <b>jau izmanto</b></div>
</div>
</div>
</div>
</body>
</html>`;

// ==================== F2: STICKER + NOTIFICATION ====================
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

// ==================== F3 (NEW): SUN WARNING / HEAT ALERT ====================
const hazardTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:linear-gradient(180deg,#7A1F08 0%,#C44513 35%,#E8761B 65%,#F4A836 100%)}
.sun{position:absolute;top:-180px;left:50%;transform:translateX(-50%);width:880px;height:880px;border-radius:50%;background:radial-gradient(circle,rgba(255,220,130,0.55) 0%,rgba(255,180,80,0.22) 45%,rgba(255,180,80,0) 70%);z-index:1}
.rays{position:absolute;inset:0;background:conic-gradient(from 0deg at 50% 22%,transparent 0deg,rgba(255,255,255,0.05) 14deg,transparent 28deg,rgba(255,255,255,0.05) 42deg,transparent 56deg,rgba(255,255,255,0.05) 70deg,transparent 84deg);z-index:1;mask-image:radial-gradient(circle at 50% 22%,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 60%)}
.header{position:absolute;top:36px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;z-index:5;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.22)}
.org{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:800;color:#fff;letter-spacing:0.28em;text-transform:uppercase}
.date{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:0.12em;text-transform:uppercase}
.body-w{position:absolute;inset:0;padding:110px 70px 70px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:5}
.chip{display:inline-flex;align-items:center;gap:10px;background:#0a0a0a;color:#FFC300;padding:11px 22px;border-radius:8px;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:0.24em;margin-bottom:26px;box-shadow:0 8px 24px rgba(0,0,0,0.35)}
.chip .pulse{width:10px;height:10px;background:#FFC300;border-radius:50%;box-shadow:0 0 0 0 rgba(255,195,0,0.5)}
.big{font-family:'Space Grotesk',sans-serif;font-weight:900;font-size:104px;color:#fff;line-height:0.92;letter-spacing:-0.035em;text-transform:uppercase;margin-bottom:34px;text-shadow:0 6px 0 rgba(0,0,0,0.18)}
.frame{position:relative;width:540px;height:340px;margin-bottom:28px;border-radius:14px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.45),inset 0 0 0 4px rgba(255,255,255,0.9),inset 0 0 0 10px rgba(0,0,0,0.35)}
.frame img{width:100%;height:100%;object-fit:cover}
.frame::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,0.35) 100%)}
.frame-label{position:absolute;bottom:12px;left:14px;background:rgba(0,0,0,0.75);color:#FFC300;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:800;padding:6px 12px;letter-spacing:0.2em;text-transform:uppercase;border-radius:4px;z-index:3}
.sub{font-family:'Inter',sans-serif;font-size:24px;font-weight:500;color:#fff;line-height:1.35;max-width:820px;margin-bottom:24px}
.sub em{font-style:normal;color:#FFEB8A;font-weight:800;text-decoration:underline;text-decoration-color:rgba(255,235,138,0.5);text-underline-offset:4px}
.cta{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;color:#0a0a0a;background:#FFC300;padding:24px 52px;border-radius:12px;display:inline-flex;align-items:center;gap:16px;text-transform:uppercase;letter-spacing:0.05em;box-shadow:0 10px 30px rgba(0,0,0,0.35)}
.cta .arr{width:38px;height:38px;background:#0a0a0a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.proof{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:rgba(255,255,255,0.72);margin-top:14px;text-transform:uppercase;letter-spacing:0.22em}
.proof b{color:#FFEB8A;font-weight:800}
</style>
</head>
<body>
<div class="ad">
<div class="sun"></div>
<div class="rays"></div>
<div class="header">
<div class="org">★ MP Risinājums™ · Vasaras sezonas atskaite</div>
<div class="date">Aprīlis · 2026</div>
</div>
<div class="body-w">
<div class="chip"><span class="pulse"></span>Karstuma viļņa brīdinājums</div>
<div class="big">${n.hazardHead}</div>
<div class="frame"><img src="${IMG_BASE}/${n.slug}.png"><div class="frame-label">${n.badge}</div></div>
<div class="sub">${n.hazardSub}</div>
<div class="cta">Aizpildīt kalendāru <span class="arr"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC300" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
<div class="proof"><b>2'300+ uzņēmēju</b> · AI mārketinga sistēma</div>
</div>
</div>
</body>
</html>`;

// ==================== F4 (NEW): POSTCARD / RETRO-TRAVEL ====================
const postcardTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#E8D9B8}
.paper{position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,#F4E7C8 0%,#E8D9B8 45%,#D4C094 100%)}
.grain{position:absolute;inset:0;background-image:radial-gradient(rgba(120,80,40,0.07) 1px,transparent 1px),radial-gradient(rgba(0,0,0,0.04) 1px,transparent 1px);background-size:4px 4px,7px 7px;opacity:0.85}
.card{position:absolute;left:60px;right:60px;top:60px;bottom:60px;background:#FFFCF2;border-radius:10px;box-shadow:0 24px 60px rgba(60,40,20,0.35),inset 0 0 0 1px rgba(0,0,0,0.06);padding:48px 52px;transform:rotate(-0.6deg)}
.card::before{content:"";position:absolute;inset:14px;border:2px dashed rgba(20,20,20,0.18);border-radius:4px;pointer-events:none}
.top-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:26px;position:relative;z-index:2}
.kicker{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:#6B4A1F;letter-spacing:0.35em;text-transform:uppercase;padding-top:8px}
.stamp{width:118px;height:138px;background:#F4E07A;border:3px double rgba(20,20,20,0.45);padding:10px 8px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;transform:rotate(4deg);position:relative;box-shadow:0 6px 14px rgba(0,0,0,0.15);flex-shrink:0}
.stamp::before{content:"";position:absolute;inset:-3px;background:radial-gradient(circle,transparent 3px,#F4E07A 3.5px);background-size:10px 10px;background-position:-5px -5px;z-index:-1;border-radius:2px}
.stamp-top{font-family:'Playfair Display',serif;font-weight:900;font-style:italic;font-size:14px;color:#1a1a1a;line-height:1;letter-spacing:0.04em}
.stamp-mid{font-family:'Playfair Display',serif;font-weight:900;font-size:28px;color:#1a1a1a;line-height:1}
.stamp-bot{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:800;color:#1a1a1a;letter-spacing:0.18em}
.photo{position:relative;width:100%;height:430px;border-radius:6px;overflow:hidden;box-shadow:0 12px 30px rgba(60,40,20,0.25),inset 0 0 0 6px #FFFCF2,inset 0 0 0 7px rgba(0,0,0,0.2);margin-bottom:20px;z-index:2}
.photo img{width:100%;height:100%;object-fit:cover;filter:saturate(0.88) contrast(0.96) sepia(0.08)}
.postmark{position:absolute;top:32px;right:150px;width:180px;height:180px;border:3px solid rgba(120,40,40,0.6);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-12deg);color:rgba(120,40,40,0.7);z-index:3;mix-blend-mode:multiply}
.postmark-top{font-family:'Playfair Display',serif;font-weight:900;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:2px}
.postmark-mid{font-family:'Playfair Display',serif;font-weight:900;font-size:24px;letter-spacing:0.02em}
.postmark-bot{font-family:'Playfair Display',serif;font-weight:700;font-style:italic;font-size:12px;margin-top:2px;letter-spacing:0.08em}
.postmark::before{content:"";position:absolute;left:-28px;right:-28px;top:50%;height:2px;background:rgba(120,40,40,0.35);transform:rotate(18deg)}
.script{font-family:'Caveat',cursive;font-size:76px;color:#3D2813;line-height:0.95;font-weight:700;margin-top:6px;letter-spacing:-0.005em;position:relative;z-index:2}
.script em{font-family:'Playfair Display',serif;font-weight:700;font-style:italic;color:#C44513}
.divider{display:flex;align-items:center;gap:10px;margin-top:16px;position:relative;z-index:2}
.divider::before,.divider::after{content:"";flex:1;height:1px;background:rgba(60,40,20,0.25)}
.divider-text{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;color:#6B4A1F;letter-spacing:0.3em;text-transform:uppercase}
.footer{display:flex;justify-content:space-between;align-items:center;margin-top:22px;position:relative;z-index:2}
.cities{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:600;color:#6B4A1F;letter-spacing:0.04em}
.cities b{color:#3D2813;font-weight:800}
.cta{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:800;color:#FFFCF2;background:#3D2813;padding:20px 42px;border-radius:100px;display:inline-flex;align-items:center;gap:12px;box-shadow:0 8px 20px rgba(60,40,20,0.3)}
.cta .arr{width:30px;height:30px;background:#F4E07A;color:#3D2813;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:900}
.brand{font-family:'Playfair Display',serif;font-style:italic;font-size:16px;font-weight:700;color:#3D2813;letter-spacing:0.04em}
.brand b{color:#C44513;font-weight:900}
</style>
</head>
<body>
<div class="ad">
<div class="paper"></div>
<div class="grain"></div>
<div class="card">
<div class="top-row">
<div class="kicker">No: Niks Jansons &nbsp;·&nbsp; Sharpify HQ</div>
<div class="stamp">
<div class="stamp-top">LATVIJA</div>
<div class="stamp-mid">★</div>
<div class="stamp-bot">${n.postcardStamp} · 2026</div>
</div>
</div>
<div class="photo">
<img src="${IMG_BASE}/${n.slug}.png">
<div class="postmark">
<div class="postmark-top">Vasara</div>
<div class="postmark-mid">2026</div>
<div class="postmark-bot">sezona · atvērta</div>
</div>
</div>
<div class="script">${n.postcardScript}</div>
<div class="divider"><span class="divider-text">MP Risinājums™</span></div>
<div class="footer">
<div class="cities">📍 <b>${n.postcardFooter}</b></div>
<div class="cta">Pieteikties <span class="arr">→</span></div>
</div>
</div>
</div>
</body>
</html>`;

// ==================== WRITE ALL ====================
for (const n of niches) {
  fs.writeFileSync(path.join(OUT, `${n.slug}-1-arched.html`), archedTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-2-sticker.html`), stickerTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-3-hazard.html`), hazardTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-4-postcard.html`), postcardTpl(n));
  console.log(`  Wrote: ${n.slug} (4 styles)`);
}

console.log(`Done! ${niches.length * 4} HTML files generated.`);
