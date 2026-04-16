const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'html');
const IMG_BASE = 'file:///C:/Users/Ritvars Volfs/meta-ad-generator-v2/meta-ad-generator/output/niks-majokla-uzlabojumi-2/images';

const niches = [
  {
    slug: 'notekcaurules',
    tag: 'Notekcauruļu montāžai',
    badge: 'Notekcauruļu meistariem',
    archedH: 'Tu parūpējies, lai ūdens nebojā māju,',
    archedEm: 'kamēr nākamais klients',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu montē nākamo&nbsp;notekcauruli.',
    notifBody: 'Notekcauruļu nomaiņa<br>Mārupe',
    magTitleA: 'Vai Tavs',
    magTitleEm: 'grafiks',
    magTitleB: 'ir pilns visu sezonu?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus notekcauruļu meistariem.',
    warnTrade: 'notekcauruļu',
    warnTradePerson: 'notekcauruļu meistarus'
  },
  {
    slug: 'zogi',
    tag: 'Žogu montāžai',
    badge: 'Žogu meistariem',
    archedH: 'Tu parūpējies, lai pagalmi ir droši,',
    archedEm: 'kamēr nākamais pasūtījums',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu liec nākamo žoga&nbsp;dēli.',
    notifBody: 'Žoga uzstādīšana<br>Ogre',
    magTitleA: 'Vai Tavs',
    magTitleEm: 'kalendārs',
    magTitleB: 'ir pilns šovasar?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus žogu montāžas meistariem.',
    warnTrade: 'žogu montāžas',
    warnTradePerson: 'žogu meistarus'
  },
  {
    slug: 'zaliens',
    tag: 'Mākslīgā zāliena ieklāšanai',
    badge: 'Mākslīgā zāliena speciālistiem',
    archedH: 'Tu parūpējies, lai pagalms spīd zaļš,',
    archedEm: 'kamēr nākamais klients',
    archedH2: 'jau rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu ieklāj nākamo&nbsp;rulli.',
    notifBody: 'Mākslīgais zāliens<br>Jūrmala',
    magTitleA: 'Vai Tev pietiek',
    magTitleEm: 'pasūtījumu',
    magTitleB: 'visu vasaru?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus mākslīgā zāliena meistariem.',
    warnTrade: 'mākslīgā zāliena',
    warnTradePerson: 'mākslīgā zāliena meistarus'
  },
  {
    slug: 'saulespaneli',
    tag: 'Saules paneļu uzstādīšanai',
    badge: 'Saules paneļu speciālistiem',
    archedH: 'Tu parūpējies, lai mājas ražo strāvu,',
    archedEm: 'kamēr nākamais objekts',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu uzstādi nākamo&nbsp;paneli.',
    notifBody: 'Saules paneļu montāža<br>Sigulda',
    magTitleA: 'Vai Tev gaida',
    magTitleEm: 'nākamais',
    magTitleB: 'objekts?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus saules paneļu uzstādītājiem.',
    warnTrade: 'saules paneļu',
    warnTradePerson: 'saules paneļu uzstādītājus'
  },
  {
    slug: 'garazasdurvis',
    tag: 'Garāžas durvju uzstādīšanai',
    badge: 'Garāžas durvju meistariem',
    archedH: 'Tu parūpējies, lai garāžām ir kvalitatīvi vārti,',
    archedEm: 'kamēr nākamais klients',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu uzstādi nākamās&nbsp;durvis.',
    notifBody: 'Garāžas durvis<br>Rīga',
    magTitleA: 'Vai Tev ir',
    magTitleEm: 'pietiekami',
    magTitleB: 'klientu?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus garāžas durvju meistariem.',
    warnTrade: 'garāžas durvju',
    warnTradePerson: 'garāžas durvju meistarus'
  },
  {
    slug: 'pirts',
    tag: 'Pirts būvei & apdarei',
    badge: 'Pirts meistariem',
    archedH: 'Tu parūpējies, lai klienti var baudīt pirti,',
    archedEm: 'kamēr nākamā pirts',
    archedH2: 'jau pasūtīta.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu būvē nākamo&nbsp;pirti.',
    notifBody: 'Pirts izbūve<br>Garkalne',
    magTitleA: 'Vai Tava',
    magTitleEm: 'sezona',
    magTitleB: 'jau ir aizpildīta?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus pirts būvētājiem.',
    warnTrade: 'pirts būves',
    warnTradePerson: 'pirts būvētājus'
  },
  {
    slug: 'vannasistabas',
    tag: 'Vannas istabu remontam',
    badge: 'Vannas istabu speciālistiem',
    archedH: 'Tu parūpējies, lai vannas istabas spīd,',
    archedEm: 'kamēr nākamais remonts',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu pabeidz vannas&nbsp;istabu.',
    notifBody: 'Vannas istabas remonts<br>Rīga',
    magTitleA: 'Vai Tavi',
    magTitleEm: 'mēneši',
    magTitleB: 'jau ir pilni?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus vannas istabu remonta meistariem.',
    warnTrade: 'vannas remonta',
    warnTradePerson: 'vannas istabu remonta meistarus'
  },
  {
    slug: 'flizetaji',
    tag: 'Flīzēšanai & apdares darbiem',
    badge: 'Flīzētājiem',
    archedH: 'Tu parūpējies, lai flīzes ir perfektas,',
    archedEm: 'kamēr nākamais objekts',
    archedH2: 'jau gaida rindā.',
    stickerH1: 'Pieteikumi nāk <span class="accent">paši</span>,',
    stickerH2: 'kamēr Tu liec nākamo&nbsp;flīzi.',
    notifBody: 'Flīzēšana<br>Salaspils',
    magTitleA: 'Vai Tavs',
    magTitleEm: 'kalendārs',
    magTitleB: 'ir pilns līdz rudenim?',
    magSub: 'AI reklāmu sistēma, kas Latvijā jau ik nedēļu atved jaunus klientus flīzēšanas meistariem.',
    warnTrade: 'flīzēšanas',
    warnTradePerson: 'flīzēšanas meistarus'
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

const magazineTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
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
.cta .arr svg{display:block}
</style>
</head>
<body>
<div class="ad">
<div class="grad"></div>
<div class="left">
<div class="top-tag">MP Risinājums™ &nbsp;·&nbsp; ${n.badge}</div>
<div class="middle">
<div class="title">${n.magTitleA} <em>${n.magTitleEm}</em><br>${n.magTitleB}</div>
<div class="sub">${n.magSub}</div>
<div class="stat-row">
<div class="stat"><div class="stat-n">2'300+</div><div class="stat-l">uzņēmēju</div></div>
<div class="stat"><div class="stat-n">26</div><div class="stat-l">valstis</div></div>
<div class="stat"><div class="stat-n">€50M+</div><div class="stat-l">klientu apgr.</div></div>
</div>
</div>
<div class="bottom">
<div class="cta">Uzzināt vairāk <span class="arr"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
</div>
</div>
<div class="right"><img src="${IMG_BASE}/${n.slug}.png"></div>
</div>
</body>
</html>`;

const warningTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
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
.cta .arr svg{display:block}
.proof{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.55);margin-top:18px;text-transform:uppercase;letter-spacing:0.2em}
.proof b{color:#FFC300;font-weight:800}
</style>
</head>
<body>
<div class="ad">
<div class="stripes"></div>
<div class="body-w">
<div class="chip"><span class="dot"></span>Atlase 2026<span class="dot"></span></div>
<div class="big">Vadi savu<br>${n.warnTrade} biznesu?</div>
<div class="frame">
<div class="frame-label">Pievienojies → Latvija</div>
<div class="photo"><img src="${IMG_BASE}/${n.slug}.png"></div>
<div class="frame-corner">Top 5% profesionāļi</div>
</div>
<div class="sub">Meklējam <em>5 ${n.warnTradePerson}</em> ar savu firmu, kas gatavi uzņemt jaunus klientus katru mēnesi ar AI mārketinga sistēmu.</div>
<div class="cta">Pieteikties <span class="arr"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFC300" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
<div class="proof"><b>2'300+ uzņēmēju</b> · jau sadarbībā ar Sharpify</div>
</div>
<div class="stripes"></div>
</div>
</body>
</html>`;

const calendarTpl = (n) => `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0a0a0a}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.4)}
.tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,20,18,0.7) 0%,rgba(14,20,18,0.92) 100%)}
.wrap{position:absolute;inset:0;padding:70px 70px 60px;display:flex;flex-direction:column;z-index:2}
.header{text-align:center;margin-bottom:30px}
.kicker{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;color:#F59E0B;text-transform:uppercase;letter-spacing:0.3em;margin-bottom:14px}
.title{font-family:'Instrument Serif',serif;font-size:60px;line-height:1.05;color:#fff;letter-spacing:-0.02em;font-weight:400}
.title em{font-style:italic;color:#F59E0B}
.cal{flex:1;background:#fff;border-radius:22px;padding:28px 32px;box-shadow:0 30px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(245,158,11,0.3);display:flex;flex-direction:column;max-height:620px}
.cal-head{display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:1px solid #e5e5e5;margin-bottom:18px}
.cal-month{font-family:'Inter',sans-serif;font-size:22px;font-weight:700;color:#0a0a0a}
.cal-sys{font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#888;display:flex;align-items:center;gap:8px}
.cal-sys::before{content:"";width:8px;height:8px;background:#22C55E;border-radius:50%}
.days{display:flex;flex-direction:column;gap:10px;flex:1}
.day{display:flex;align-items:stretch;gap:16px}
.day-label{width:90px;flex-shrink:0;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.08em;padding-top:10px}
.day-label b{display:block;font-size:18px;color:#0a0a0a;font-weight:800;text-transform:none;letter-spacing:0}
.slots{flex:1;display:flex;flex-direction:column;gap:6px}
.slot{background:#FEF3C7;border-left:4px solid #F59E0B;padding:10px 14px;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#78350F;display:flex;justify-content:space-between;align-items:center}
.slot.full{background:#DCFCE7;border-color:#22C55E;color:#14532D}
.slot .time{font-weight:500;color:#555;font-size:12px}
.slot .time.green{color:#15803D}
.footer{display:flex;justify-content:space-between;align-items:center;margin-top:24px}
.cta{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:800;color:#0a0a0a;background:#F59E0B;padding:22px 44px;border-radius:100px;display:inline-flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(245,158,11,0.35)}
.cta .arr{width:34px;height:34px;background:#0a0a0a;color:#F59E0B;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:900}
.proof{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:500;color:rgba(255,255,255,0.7);text-align:right}
.proof b{color:#F59E0B;font-weight:700}
</style>
</head>
<body>
<div class="ad">
<img class="bg" src="${IMG_BASE}/${n.slug}.png">
<div class="tint"></div>
<div class="wrap">
<div class="header">
<div class="kicker">MP Risinājums™ · Flīzētājiem</div>
<div class="title">Tāda izskatās <em>nedēļa</em>,<br>kad sistēma strādā Tavā&nbsp;vietā.</div>
</div>
<div class="cal">
<div class="cal-head">
<div class="cal-month">Šī nedēļa</div>
<div class="cal-sys">Sharpify App™ sinhronizēts</div>
</div>
<div class="days">
<div class="day"><div class="day-label">Pr<b>21.</b></div><div class="slots"><div class="slot full">Flīzēšana · Rīga <span class="time green">9:00 – 17:00</span></div></div></div>
<div class="day"><div class="day-label">Ot<b>22.</b></div><div class="slots"><div class="slot">Jauns pieteikums · Vannas istaba <span class="time">pirms 14 min</span></div><div class="slot full">Flīzēšana · Mārupe <span class="time green">10:00 – 16:00</span></div></div></div>
<div class="day"><div class="day-label">Tr<b>23.</b></div><div class="slots"><div class="slot full">Grīdas flīzēšana · Ogre <span class="time green">8:00 – 18:00</span></div></div></div>
<div class="day"><div class="day-label">Ce<b>24.</b></div><div class="slots"><div class="slot">Jauns pieteikums · Terase <span class="time">pirms 1 h</span></div><div class="slot full">Apmērīšana · Jūrmala <span class="time green">11:00</span></div></div></div>
<div class="day"><div class="day-label">Pk<b>25.</b></div><div class="slots"><div class="slot full">Flīzēšana · Salaspils <span class="time green">9:00 – 17:00</span></div></div></div>
</div>
</div>
<div class="footer">
<div class="cta">Uzzināt vairāk <span class="arr">→</span></div>
<div class="proof"><b>2'300+ uzņēmēji</b><br>jau izmanto sistēmu</div>
</div>
</div>
</div>
</body>
</html>`;

for (const n of niches) {
  fs.writeFileSync(path.join(OUT, `${n.slug}-1-arched.html`), archedTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-2-sticker.html`), stickerTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-3-magazine.html`), magazineTpl(n));
  fs.writeFileSync(path.join(OUT, `${n.slug}-4-warning.html`), warningTpl(n));
  console.log(`  Wrote: ${n.slug} (4 styles)`);
}

console.log(`Done! ${niches.length * 4} HTML files generated.`);
