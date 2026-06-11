const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'html');
const IMG_BASE = 'file:///C:/Users/Ritvars%20Volfs/meta-ad-generator-v2/meta-ad-generator/sharpify/eng/output/niks-majokla-uzlabojumi-4-eng/images';

// ============================================================
// TEMPLATE — MAGAZINE VERTICAL (photo top / copy+gift ticket bottom)
// ============================================================
const magazineVerticalTpl = (n) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0E1412;display:flex;flex-direction:column}

.top{height:470px;position:relative;overflow:hidden;clip-path:polygon(0 0, 100% 0, 100% 92%, 0 100%)}
.top img{width:100%;height:100%;object-fit:cover;object-position:${n.objPos || 'center 50%'}}
.top::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(14,20,18,0.75) 100%)}
.top-tag{position:absolute;top:36px;left:56px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;color:#fff;letter-spacing:0.3em;text-transform:uppercase;padding:10px 18px;background:rgba(14,20,18,0.6);backdrop-filter:blur(10px);border:1px solid rgba(245,158,11,0.4);border-radius:100px;z-index:2}
.top-tag b{color:#F59E0B}

.bottom{flex:1;padding:46px 60px 54px;display:flex;flex-direction:column;position:relative}
.grad{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(245,158,11,0.2) 0%,rgba(14,20,18,0) 65%);pointer-events:none}

.middle{position:relative;z-index:2}
.title{font-family:'Instrument Serif',serif;font-size:${n.titleSize || '58px'};line-height:1.08;color:#fff;letter-spacing:-0.02em;font-weight:400${n.titleNoWrap ? ';white-space:nowrap' : ''}}
.title em{font-style:italic;color:#F59E0B}
.sub{font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:500;color:rgba(255,255,255,0.72);margin-top:18px;line-height:1.5;max-width:800px}

.gift-ticket{position:relative;z-index:2;margin-top:30px;margin-bottom:32px;background:#F59E0B;border:3px dashed #0a0a0a;border-radius:16px;padding:26px 36px 26px 32px;display:flex;align-items:center;gap:26px;box-shadow:0 16px 40px rgba(245,158,11,0.4);transform:rotate(-0.5deg)}
.gift-ticket::before{content:"";position:absolute;left:-13px;top:50%;transform:translateY(-50%);width:24px;height:24px;background:#0E1412;border-radius:50%}
.gift-ticket::after{content:"";position:absolute;right:-13px;top:50%;transform:translateY(-50%);width:24px;height:24px;background:#0E1412;border-radius:50%}
.gift-icon{flex-shrink:0;width:72px;height:72px;display:flex;align-items:center;justify-content:center;background:#0a0a0a;border-radius:50%}
.gift-text{flex:1;min-width:0}
.gift-label{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:900;color:#0a0a0a;letter-spacing:0.32em;text-transform:uppercase;margin-bottom:5px;opacity:0.85}
.gift-main{font-family:'Instrument Serif',serif;font-size:40px;font-weight:400;color:#0a0a0a;line-height:1;letter-spacing:-0.01em}
.gift-main em{font-style:italic;font-weight:400}
.gift-note{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:rgba(10,10,10,0.78);margin-top:6px;letter-spacing:0.02em}

.bottom-row{display:flex;justify-content:center;align-items:center;position:relative;z-index:2}
.cta{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:800;color:#0a0a0a;background:#F59E0B;padding:28px 58px;border-radius:100px;display:inline-flex;align-items:center;gap:18px;box-shadow:0 12px 30px rgba(245,158,11,0.4)}
.cta .arr{width:44px;height:44px;background:#0a0a0a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.cta .arr svg{display:block}
</style>
</head>
<body>
<div class="ad">
<div class="top">
<img src="${IMG_BASE}/${n.photo}">
<div class="top-tag">MS SOLUTION &nbsp;·&nbsp; <b>${n.badge}</b></div>
</div>
<div class="bottom">
<div class="grad"></div>
<div class="middle">
<div class="title">${n.titleA} <em>${n.titleEm}</em> ${n.titleB}</div>
<div class="sub">${n.sub}</div>
</div>
<div class="gift-ticket">
<div class="gift-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg></div>
<div class="gift-text">
<div class="gift-label">This month only</div>
<div class="gift-main">Free professional <em>website</em></div>
<div class="gift-note">included with every MS Solution onboarding</div>
</div>
</div>
<div class="bottom-row">
<div class="cta">Learn More <span class="arr"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
</div>
</div>
</div>
</body>
</html>`;

// ============================================================
// TEMPLATE — POLAROID (full-bleed + cream card + washi notif)
// ============================================================
const polaroidTpl = (n) => `<!DOCTYPE html>
<html lang="en">
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
.badge{display:inline-block;font-family:'Montserrat',sans-serif;font-size:15px;font-weight:800;color:#b45309;text-transform:uppercase;letter-spacing:0.22em;margin-bottom:14px;padding:7px 16px;background:rgba(245,158,11,0.15);border-radius:100px;border:1px solid rgba(180,83,9,0.25)}
h1{font-family:'Montserrat',sans-serif;font-size:42px;font-weight:900;color:#14100d;line-height:1.05;letter-spacing:-0.01em}
h1 .accent{color:#b45309}
.sub{font-family:'Inter',sans-serif;font-size:21px;font-weight:500;color:rgba(20,16,13,0.68);margin-top:14px;line-height:1.38}
.row{display:flex;align-items:center;gap:18px;margin-top:24px}
.cta{font-family:'Montserrat',sans-serif;font-size:26px;font-weight:800;color:#f7ede0;background:#14100d;padding:20px 40px;border-radius:10px;box-shadow:0 8px 18px rgba(0,0,0,0.35)}
.gift{font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;color:rgba(20,16,13,0.85);text-transform:uppercase;letter-spacing:0.08em;line-height:1.3}
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
<img class="bg" src="${IMG_BASE}/${n.photo}">
<div class="tint"></div>

<div class="notif-wrap">
<div class="tape"></div>
<div class="tape2"></div>
<div class="notif">
<div class="notif-ico">S</div>
<div class="notif-t">
<div class="notif-title">New lead</div>
<div class="notif-body">${n.notifBody}</div>
<div class="notif-time">2 min ago</div>
</div>
</div>
</div>

<div class="polaroid">
<div class="badge">${n.badge}</div>
<h1>${n.stickerH1}<br>${n.stickerH2}</h1>
<div class="sub">MS Solution — targeted ads, AI lead handling, and CRM in one system.</div>
<div class="row">
<div class="cta">Learn More →</div>
<div class="gift">🎁 <b>Free website</b><br>included</div>
</div>
<div class="scrawl">— Niks</div>
</div>
</div>
</body>
</html>`;

// ============================================================
// TEMPLATE — CIRCLE (round photo + tick marks + care headline)
// ============================================================
const circleTpl = (n) => `<!DOCTYPE html>
<html lang="en">
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
h1{font-family:'Instrument Serif',serif;font-size:48px;line-height:1.12;color:#fff;letter-spacing:-0.02em;font-weight:400}
h1 em{font-style:italic;color:#F59E0B}
.sub{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:500;color:rgba(255,255,255,0.65);margin-top:18px;line-height:1.45;max-width:740px;margin-left:auto;margin-right:auto}
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
<div class="circle"><img src="${IMG_BASE}/${n.photo}"></div>
<div class="content">
<h1>${n.archedH}<br><em>${n.archedEm}</em> ${n.archedH2}</h1>
<div class="sub">AI marketing, automated lead handling, and CRM — the full system that books your next job while you're on the current one.</div>
<div class="chips">
<span class="chip">Ads</span>
<span class="chip">AI Leads</span>
<span class="chip">CRM</span>
<span class="chip on">🎁 Free website included</span>
</div>
<div class="row">
<div class="cta">Learn More <span class="arr"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
</div>
</div>
</div>
</body>
</html>`;

// ============================================================
// TEMPLATE — JOBSITE STICKER (certified installer badge)
// ============================================================
const jobsiteTpl = (n) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden}
.ad{width:1080px;height:1080px;position:relative;overflow:hidden;background:#0a0d0b}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.28) blur(3px) saturate(1.1);transform:scale(1.06)}
.tint{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(245,158,11,0.14) 0%,rgba(10,13,11,0) 55%),linear-gradient(180deg,rgba(10,13,11,0.3) 0%,rgba(10,13,11,0.78) 100%)}
.badge-pill{position:absolute;top:40px;left:56px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;color:#fff;letter-spacing:0.3em;text-transform:uppercase;padding:10px 18px;background:rgba(14,20,18,0.7);backdrop-filter:blur(10px);border:1px solid rgba(245,158,11,0.4);border-radius:100px;z-index:5}
.badge-pill b{color:#F59E0B}
.hazard-strip{position:absolute;top:52px;right:48px;width:220px;height:28px;background-image:repeating-linear-gradient(-45deg,#F59E0B 0 14px,#0a0a0a 14px 28px);transform:rotate(2deg);box-shadow:0 4px 10px rgba(0,0,0,0.4);z-index:4}
.sticker{position:absolute;top:150px;left:108px;width:790px;height:600px;background:#F59E0B;background-image:linear-gradient(135deg,#F5B544 0%,#F59E0B 40%,#D97706 100%);transform:rotate(-2.8deg);z-index:5;padding:32px 46px 36px;border-radius:14px;box-shadow:0 30px 70px rgba(0,0,0,0.55),0 0 0 2px rgba(0,0,0,0.2),inset 0 2px 0 rgba(255,255,255,0.4),inset 0 -2px 0 rgba(0,0,0,0.12)}
.sticker::before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.02) 0 1px,transparent 1px 3px),radial-gradient(circle at 20% 80%,rgba(0,0,0,0.06) 0%,transparent 30%),radial-gradient(circle at 85% 15%,rgba(255,255,255,0.18) 0%,transparent 25%);border-radius:14px;pointer-events:none;mix-blend-mode:overlay}
.peel{position:absolute;bottom:-8px;right:-6px;width:130px;height:130px;background:linear-gradient(135deg,rgba(255,255,255,0.55),#F5B544 45%,#D97706 85%);clip-path:polygon(100% 0,100% 100%,0 100%);transform:rotate(11deg);box-shadow:-6px -6px 14px rgba(0,0,0,0.35);border-radius:0 0 14px 0;z-index:2}
.peel-shadow{position:absolute;bottom:-2px;right:24px;width:118px;height:22px;background:radial-gradient(ellipse,rgba(0,0,0,0.5) 0%,transparent 70%);z-index:1}
.stk-top{display:flex;justify-content:space-between;align-items:center;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:800;color:#0a0a0a;letter-spacing:0.22em;text-transform:uppercase;padding-bottom:14px;border-bottom:2px dashed rgba(10,10,10,0.4);position:relative;z-index:3}
.stk-title{margin-top:30px;font-family:'Instrument Serif',serif;font-size:96px;font-weight:400;color:#0a0a0a;line-height:0.94;letter-spacing:-0.025em;position:relative;z-index:3}
.stk-title em{font-style:italic}
.stk-tag{margin-top:20px;font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:600;color:rgba(10,10,10,0.78);line-height:1.4;max-width:640px;position:relative;z-index:3}
.stk-footer{position:absolute;left:46px;right:46px;bottom:32px;display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:2px dashed rgba(10,10,10,0.4);z-index:3}
.stk-brand{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:900;color:#0a0a0a;letter-spacing:-0.01em}
.stk-brand sup{font-size:11px;vertical-align:top;margin-left:2px}
.stk-stats{display:flex;gap:22px;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:800;color:#0a0a0a;letter-spacing:0.1em;text-transform:uppercase;align-items:baseline}
.stk-stats b{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;font-size:20px;letter-spacing:-0.01em;margin-right:6px;text-transform:none}
.seal{position:absolute;top:652px;left:50px;width:208px;height:208px;border-radius:50%;background:#0a0a0a;border:2px solid #F59E0B;box-shadow:0 14px 30px rgba(0,0,0,0.6),0 0 0 6px rgba(10,10,10,0.25);transform:rotate(-14deg);z-index:7;display:flex;align-items:center;justify-content:center}
.seal::before{content:"";position:absolute;inset:10px;border:1px dashed rgba(245,158,11,0.6);border-radius:50%}
.seal-core{position:relative;z-index:2;text-align:center;color:#F59E0B}
.seal-core .bolt{font-size:34px;line-height:1;margin-bottom:2px}
.seal-core .top{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;line-height:1.1}
.seal-core .year{font-family:'Instrument Serif',serif;font-style:italic;font-size:18px;margin-top:3px;color:#fff}
.bottom-area{position:absolute;left:60px;right:60px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end;z-index:6;gap:30px}
.cta{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;color:#0a0a0a;background:#F59E0B;padding:26px 52px;border-radius:100px;display:inline-flex;align-items:center;gap:16px;box-shadow:0 10px 30px rgba(245,158,11,0.4)}
.cta .arr{width:42px;height:42px;background:#0a0a0a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}
.gift{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.82);text-align:right;letter-spacing:0.06em;line-height:1.5}
.gift b{color:#F59E0B;font-weight:800}
</style>
</head>
<body>
<div class="ad">
<img class="bg" src="${IMG_BASE}/${n.photo}">
<div class="tint"></div>
<div class="badge-pill">MS SOLUTION &nbsp;·&nbsp; <b>For Solar Installers</b></div>
<div class="hazard-strip"></div>
<div class="sticker">
<div class="stk-top">
<span>NR. 2300 · ALL MARKETS · 2026</span>
<span>⚡ CERTIFIED INSTALLER</span>
</div>
<div class="stk-title">Next installs<br><em>already lined up.</em></div>
<div class="stk-tag">AI ads + automated lead handling + CRM — the full system that keeps solar installers booked in their local area.</div>
<div class="stk-footer">
<div class="stk-brand">MS SOLUTION<sup>™</sup></div>
<div class="stk-stats">
<span><b>2,300+</b>CLIENTS</span>
<span><b>26</b>COUNTRIES</span>
<span><b>€50M+</b>GENERATED</span>
</div>
</div>
<div class="peel-shadow"></div>
<div class="peel"></div>
</div>
<div class="seal">
<div class="seal-core">
<div class="bolt">⚡</div>
<div class="top">CERTIFIED</div>
<div class="year">№ 2300</div>
</div>
</div>
<div class="bottom-area">
<div class="cta">Learn More <span class="arr"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div>
<div class="gift">🎁 <b>FREE WEBSITE</b><br>included with onboarding</div>
</div>
</div>
</body>
</html>`;

// ============================================================
// 5 ADS (2 roofing + 3 solar, mirroring LV-4 set)
// ============================================================
const ads = [
  {
    slug: 'roofing-1-ridge-magazine',
    tpl: magazineVerticalTpl,
    photo: 'roofing-ridge.png',
    objPos: 'center 38%',
    badge: 'For Roofers',
    titleA: 'Is your',
    titleEm: 'calendar',
    titleB: 'full through fall?',
    titleSize: '58px',
    titleNoWrap: true,
    sub: 'AI ad system that brings in homeowners planning roofing work, in your local service area — every week, without you lifting a finger.',
  },
  {
    slug: 'roofing-2-crew-polaroid',
    tpl: polaroidTpl,
    photo: 'roofing-crew.png',
    badge: 'For Roofers',
    stickerH1: 'New leads come in <span class="accent">on their own</span>,',
    stickerH2: 'while your crew takes care of the&nbsp;client.',
    notifBody: 'Roof replacement · Austin, TX',
  },
  {
    slug: 'solar-1-aerial-magazine',
    tpl: magazineVerticalTpl,
    photo: 'solar-aerial.png',
    objPos: 'center 35%',
    badge: 'For Solar Installers',
    titleA: 'You deliver',
    titleEm: 'green energy.',
    titleB: 'We’ll keep the next client lined up.',
    titleSize: '52px',
    sub: 'AI ad system that brings in homeowners planning solar installs, in your local service area — week after week.',
  },
  {
    slug: 'solar-2-macro-circle',
    tpl: circleTpl,
    photo: 'solar-macro.png',
    archedH: 'You make sure every panel performs.',
    archedEm: 'We’ll keep the next install',
    archedH2: 'already lined up.',
  },
  {
    slug: 'solar-3-jobsite-sticker',
    tpl: jobsiteTpl,
    photo: 'solar-aerial.png',
  },
];

for (const ad of ads) {
  fs.writeFileSync(path.join(OUT, `${ad.slug}.html`), ad.tpl(ad));
  console.log(`  Wrote: ${ad.slug}.html`);
}
console.log(`Done! ${ads.length} ENG HTML files generated.`);
