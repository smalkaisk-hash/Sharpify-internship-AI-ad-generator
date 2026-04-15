const https = require('https');
const querystring = require('querystring');

const TOKEN = 'REDACTED_TOKEN';
const ACCT = 'act_549172712351324';
const ADSET_ID = '120248038619730460';
const PAGE_ID = '116359515734204';
const IG_ID = '17841401853795292';
const LINK = 'https://reg.sharpify.lv/ai-workshops/';

const signature = 'Niks Jansons, CEO @ Sharpify';

const ads = [
  {
    name: 'Ad 2 - Whats Included',
    hash: '135e5b50b7e236c9a51065d059e982d4',
    message: `Tu izmanto Claude (vai citu AI), bet joprojām raksti prompt-us no nulles katru reizi?

Tad Tu zaudē 2-5 stundas katru dienu.

Lielākā daļa uzņēmēju neizmanto pat 20% no AI iespējām — ne nezināšanas dēļ, bet gan tāpēc, ka nav gatavas sistēmas.

Šeit ir tas, ko Tu saņem AI Rīku Komplektā:

🔹 128 slaidu prezentācija — pilna AI sistēma no pamatiem līdz ekspertu līmenim
🔹 74 min video apmācība — soli pa solim
🔹 27 AI skills + 10 workflows — gatavi .md faili
🔹 CLAUDE.md biznesa šablons — personalizē 10 minūtēs
🔹 Ātrais iestatīšanas ceļvedis — 25-30 min instalācija

Instalē vienreiz. Izmanto mūžīgi.

€19. Vienreizējs maksājums. Bez abonementa.

${signature}`,
    headline: 'Viss, kas Tev vajadzīgs. €19.',
    description: 'Vienreizējs maksājums. 7 dienu garantija.'
  },
  {
    name: 'Ad 4 - Before After',
    hash: '5c39b364fb2063e6faddedefd0de51bb',
    message: `Godīgi? Vairums uzņēmēju izmanto AI nepareizi.

Viņi raksta prompt-us no nulles. Viņi eksperimentē ar formulējumiem stundām. Viņi saņem nekonsekventus rezultātus.

Tad viņi domā: "AI nestrādā."

Problēma nav AI. Problēma ir sistēmas trūkums.

Ar AI Rīku Komplektu:
✅ Gatavi prompt-i — copy-paste un darbs gatavs
✅ 27 AI skills instalētas un konfigurētas
✅ Konsekventi rezultāti katrā sesijā
✅ Skaidra sistēma, kas strādā katru dienu
✅ Taupi 2-5 stundas dienā no pirmās dienas

€19. 7 dienu garantija. Mūžīga piekļuve.

${signature}`,
    headline: 'Beidz rakstīt prompt-us no nulles.',
    description: 'AI Rīku Komplekts — €19.'
  },
  {
    name: 'Ad 5 - Terminal',
    hash: 'ee6b0e73ec8093fb33611f99830f9ba2',
    message: `3 komandas. AI sistēma ir instalēta.

$ install sharpify-ai-kit
✓ 27 AI skills
✓ 10 workflows
✓ CLAUDE.md template
Done in 28 seconds.

Tā tam vajadzētu būt. Vienkārši, ātri, bez manuāla darba.

Ar AI Rīku Komplektu Tu saņem gatavu sistēmu:
🔹 27 skills — mārketings, pārdošana, saturs, workflow
🔹 10 automatizētus pipelines
🔹 128 slaidu prezentācija + 74 min video
🔹 CLAUDE.md biznesa šablons
🔹 Mūžīga piekļuve

No pirmās dienas — taupi 2-5 stundas dienā.

€19. Bez abonementa. Bez slēptām izmaksām.

${signature}`,
    headline: 'AI sistēma 28 sekundēs.',
    description: '€19. Mūžīga piekļuve.'
  },
  {
    name: 'Ad 8 - Skills Grid',
    hash: '8328a2d7ea1286f1953a552e3842a6f5',
    message: `Iedomājies: pilna AI komanda, gatava strādāt 24/7, Tavā datorā.

marketing-skill. sales-call. copywriting. brand-voice. email-sequences. lead-research. objection-handler. workflow-auto.

Un vēl 19 skills.

Katra — kā personīgs eksperts konkrētā jomā. Instalē vienreiz, izmanto mūžīgi.

Kopā AI Rīku Komplektā:
🔹 27 AI skills (5 kategorijas)
🔹 10 automatizēti workflows
🔹 128 slaidu prezentācija
🔹 74 min video apmācība
🔹 CLAUDE.md biznesa šablons

2 300+ uzņēmēji jau izmanto. 26 valstis.

€19. Bija €99. Taupi 81%.

${signature}`,
    headline: '27 AI ekspertu komanda. €19.',
    description: '5 kategorijās. Mūžīga piekļuve.'
  },
  {
    name: 'Ad 9 - Cursor IDE',
    hash: '8dd6822130f89c6ffa6d7afca66e03d6',
    message: `Skills. Hooks. Memory. Claude Code ir daudz iespēju.

Bet bez pareizas sistēmas tas paliek kā rīks, nevis darbarīks.

AI Rīku Komplekts ir gatavs setup:
🔹 27 .md skills faili — instalē .claude/skills/ mapē
🔹 10 workflows — gatavi pipelines
🔹 CLAUDE.md šablons — personalizē 10 minūtēs
🔹 74 min video — soli pa solim

Pēc 30 minūtēm Tev ir pilna AI sistēma, kas strādā ar Tavu biznesu.

Nav programmēšanas zināšanas vajadzīgas. Copy-paste un darbs gatavs.

€19. Vienreizējs maksājums. Mūžīga piekļuve.

${signature}`,
    headline: 'Gatavas .md skills Claude Code.',
    description: '€19. Bez abonementa.'
  },
  {
    name: 'Ad 10 - Installing',
    hash: '2c55b2f8132637ab2bcda4e1134c56e0',
    message: `28 sekundes. Tik daudz vajag, lai instalētu pilnu AI sistēmu.

$ install sharpify-ai-kit
✓ Loaded 27 AI skills
✓ Loaded 10 workflows
✓ Configured CLAUDE.md template
✓ Ready in 28.4s

Viss. Gatavs darbam.

Nav teorija. Nav "mēģini pats". Nav 40 stundu YouTube tutoriāli.

Gatava sistēma, kas strādā no pirmās dienas:
🔹 Mārketings, pārdošana, saturs, automatizācija
🔹 Konsekventi rezultāti katrā sesijā
🔹 Taupi 2-5 stundas dienā

2 300+ uzņēmēji 26 valstīs jau uzticas.

€19. Bija €99. Taupi 81%.

${signature}`,
    headline: 'Pilna AI sistēma 28 sekundēs.',
    description: 'Vienreizējs maksājums. €19.'
  },
  {
    name: 'Ad 11 - Spotify',
    hash: '06d3d38d03030b00476c9087a2448022',
    message: `Ja AI skills būtu Spotify playlist — tā būtu "Tava AI Komanda".

37 skaņdarbi. 2 300+ klausītāji. €19.

#1 marketing-skill · Meta ads, email, hooks · Taupi 2h/ned
#2 sales-call · Objections, scripts, closing · Taupi 1h/ned
#3 copywriting · Long-form, sales, ads · Taupi 3h/ned
#4 brand-voice · Konsekvents tonis visur · Taupi 1h/ned
#5 workflow-auto · End-to-end automation · Taupi 4h/ned

Un vēl 32 skaņdarbi.

Katrs — kā personīgs eksperts.

Instalē vienreiz. Izmanto mūžīgi.

€19. Bija €99. Taupi 81%.

${signature}`,
    headline: 'Tava AI playlist. 37 skaņdarbi.',
    description: 'Sākot no €19.'
  },
  {
    name: 'Ad 12 - GitHub',
    hash: '35a52a7750ac5066864097a5d7180ef9',
    message: `sharpify/ai-kit — 2,340 ⭐ · 487 forks · 1.2k watchers

Production-ready AI skills for Claude Code. Built by Niks Jansons. Used by 2,300+ entrepreneurs across 26 countries.

Kas iekļauts:
📁 skills/ — 27 production-ready AI skills
📁 workflows/ — 10 end-to-end automation pipelines
📄 CLAUDE.md — Business template, personalizē 10 minūtēs
📄 SETUP.md — Ātrais ceļvedis (25-30 min)
🎬 video-tutorial.md — 74 min soli pa solim

Topics: claude-code, ai-skills, marketing, sales, automation, productivity

Clone once. Use forever.

€19. Bija €99. 7 dienu garantija.

${signature}`,
    headline: 'sharpify/ai-kit · 2.3k ⭐',
    description: '€19. Mūžīga piekļuve.'
  },
  {
    name: 'Ad 14 - Settings Toggles',
    hash: 'ae493e485a31e7bedec2dcc781c60c8a',
    message: `Ieslēdz visas AI skills vienā sesijā.

● Marketing Skill — Aktīvs
● Brand Voice — Aktīvs
● Copywriting — Aktīvs
● Sales Call — Aktīvs
● Lead Research — Aktīvs
● Workflow Automation — Aktīvs
...un vēl 21 skills.

Visas konfigurētas. Visas gatavas. Visas strādā ar Tavu CLAUDE.md.

Nav jāmeklē kur instalēt. Nav jāmeklē kā konfigurēt. Nav jāmeklē pareizus promptu.

AI Rīku Komplekts:
🔹 27 AI skills + 10 workflows
🔹 128 slaidu prezentācija
🔹 74 min video apmācība
🔹 CLAUDE.md biznesa šablons
🔹 Mūžīga piekļuve

Instalē vienreiz. Ieslēdz visu. Sāc strādāt.

€19. Taupi 81%.

${signature}`,
    headline: '27 skills. Viss ieslēgts. €19.',
    description: 'Mūžīga piekļuve. Taupi 81%.'
  },
  {
    name: 'Ad 15 - Phone in Hand',
    hash: '7f02aee3779b9b83c9d9f1623ecb73d4',
    message: `Tu raksti promptu. Tu gaidi. Tu labo. Tu atkal raksti.

20 minūtes vēlāk — rezultāts neizskatās kā Tavs brand.

Šo pazīsti?

Ar AI Rīku Komplektu tā vairs nenotiek:
🔹 27 gatavas skills — katra savai jomai
🔹 CLAUDE.md zina Tavu biznesu
🔹 Konsekventi rezultāti katrā sesijā
🔹 Taupi 2-5 stundas dienā no 1. dienas

Jautā vienreiz. Saņem perfektu atbildi.

€19. Vienreizējs maksājums. 7 dienu garantija.

2 300+ uzņēmēji 26 valstīs jau uzticas.

${signature}`,
    headline: 'Tava AI kļūst par asistentu.',
    description: '27 AI skills. €19.'
  },
  {
    name: 'Ad 16 - Books Stack',
    hash: '06c8eb6d760f855822c1b7c2e2c965bb',
    message: `Pilna AI bibliotēka vienā komplektā.

Nevis 10 dažādi kursi. Nevis 40 stundu YouTube playlist. Nevis 100 atsevišķi prompt faili.

Viens komplekts. Visa sistēma.

🔹 128 slaidu prezentācija — no pamatiem līdz ekspertu līmenim
🔹 74 min video apmācība — soli pa solim
🔹 27 AI skills + 10 workflows — gatavi darbam
🔹 CLAUDE.md biznesa šablons
🔹 Ātrais iestatīšanas ceļvedis

Instalē vienreiz. Izmanto mūžīgi.

€19. Bija €99. 7 dienu garantija.

${signature}`,
    headline: 'Pilna AI bibliotēka. €19.',
    description: 'Vienreizējs maksājums.'
  },
  {
    name: 'Ad 21 - Product Gold',
    hash: '8641b9b16321172d05f4c6c33f12e675',
    message: `Nav abonementa. Pērc vienreiz — paliek mūžīgi.

Tā tam vajadzētu būt ar rīkiem, kas Tev kalpo katru dienu.

AI Rīku Komplekts nav abonements, nav mēneša maksa, nav slēpto izmaksu. Viens maksājums — un sistēma ir Tava uz visiem laikiem.

Kas iekļauts:
🔹 27 AI skills + 10 workflows
🔹 128 slaidu prezentācija
🔹 74 min video apmācība
🔹 CLAUDE.md biznesa šablons
🔹 Mūžīga piekļuve + visi atjauninājumi

€19. Bija €99. Taupi 81%.

2 300+ uzņēmēji 26 valstīs jau izmanto.

7 dienu naudas atgriešanas garantija.

${signature}`,
    headline: 'Nav abonementa. Pērc vienreiz.',
    description: 'Mūžīga piekļuve. €19.'
  },
  {
    name: 'Ad 24 - Marble Desk',
    hash: 'c976f4d92752078db1ba743605098f9b',
    message: `Tavs rīts sākas ar kafiju un 27 AI ekspertiem.

Nav jādomā, kā rakstīt promptu. Nav jāmeklē pareizos rīkus. Nav jāeksperimentē.

Atver Claude, izsauc skill, darbs gatavs.

AI Rīku Komplekts:
🔹 27 AI skills — mārketings, pārdošana, saturs, workflow
🔹 10 automatizēti pipelines
🔹 128 slaidu prezentācija
🔹 74 min video apmācība
🔹 CLAUDE.md biznesa šablons

Instalē vienreiz. Taupi 2-5 stundas katru dienu.

€19. Vienreizējs maksājums. Mūžīga piekļuve.

${signature}`,
    headline: 'Tavs rīts ar pareizajiem rīkiem.',
    description: '27 skills · 10 workflows · €19.'
  },
  {
    name: 'Ad 25 - Hands Typing',
    hash: '7367ed9b18c92f6a6e4d6ade8be45ff2',
    message: `Beidz rakstīt prompt-us no nulles.

Katru reizi sākt no sākuma — tas nav darbs ar AI. Tas ir eksperimentēšana.

Ar AI Rīku Komplektu Tev ir 27 gatavas skills — katra kā mini-eksperts savai jomai. Copy-paste, saņem rezultātu, virzies tālāk.

Kas iekļauts:
🔹 27 AI skills + 10 workflows
🔹 128 slaidu prezentācija
🔹 74 min video apmācība
🔹 CLAUDE.md biznesa šablons
🔹 Mūžīga piekļuve

No pirmās dienas — taupi 2-5 stundas dienā.

€19. Bija €99. Taupi 81%.

${signature}`,
    headline: 'Beidz rakstīt prompt-us no nulles.',
    description: 'Gatavas skills. €19.'
  },
  {
    name: 'Ad 26 - Beach',
    hash: '1ca8d80bd1d8f7fea5b75369b8189dd6',
    message: `Tu atpūties. AI strādā.

Šī nav fantāzija. Tā ir realitāte, kad Tev ir pareizi rīki.

Ar AI Rīku Komplektu:
🔹 27 AI skills raksta reklāmas, e-pastus, pārdošanas scenārijus
🔹 10 workflows automatizē atkārtojošos uzdevumus
🔹 CLAUDE.md zina Tavu zīmolu no galvas
🔹 Taupi 2-5 stundas dienā

Kamēr Tu dzer kokteili, Tavs bizness turpina augt.

€19. Vienreizējs maksājums. Mūžīga piekļuve.

2 300+ uzņēmēji 26 valstīs jau izmanto.

${signature}`,
    headline: 'Tu atpūties. AI strādā.',
    description: '27 AI skills. €19.'
  },
  {
    name: 'Ad 27 - Infinity Pool',
    hash: '64c5e4f66a95a70f1c8b4b3fc010fa14',
    message: `Iedzer kokteili. Bizness strādā bez Tevis.

Tu zini, kāpēc lielākā daļa uzņēmēju nevar atpūsties? Viņiem nav sistēmas. Katrs e-pasts, katra reklāma, katra pārdošanas saruna — viss caur viņiem.

Ar AI Rīku Komplektu Tu izej ārā no šīs lamatas:

🔹 27 AI skills kā personīga komanda
🔹 10 workflows — no sākuma līdz gatavam
🔹 128 slaidu prezentācija + 74 min video
🔹 CLAUDE.md biznesa šablons
🔹 Mūžīga piekļuve

Pēc 30 min setup — sistēma strādā. Tu atpūties.

€19. Bija €99. Taupi 81%.

${signature}`,
    headline: 'Iedzer kokteili. Bizness strādā.',
    description: 'AI Rīku Komplekts. €19.'
  }
];

function createAd(ad) {
  return new Promise((resolve, reject) => {
    const creative = JSON.stringify({
      object_story_spec: {
        page_id: PAGE_ID,
        instagram_user_id: IG_ID,
        link_data: {
          image_hash: ad.hash,
          link: LINK,
          message: ad.message,
          name: ad.headline,
          description: ad.description,
          call_to_action: {
            type: 'LEARN_MORE'
          }
        }
      }
    });

    const postData = querystring.stringify({
      name: ad.name,
      adset_id: ADSET_ID,
      status: 'PAUSED',
      creative: creative,
      access_token: TOKEN
    });

    const req = https.request({
      hostname: 'graph.facebook.com',
      port: 443,
      path: '/v21.0/' + ACCT + '/ads',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.id) {
            resolve(json.id);
          } else {
            reject(new Error(data));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  for (const ad of ads) {
    try {
      const id = await createAd(ad);
      console.log('OK ' + ad.name + ' => ' + id);
    } catch (e) {
      console.log('FAIL ' + ad.name + ': ' + e.message);
    }
  }
  console.log('Done.');
})();
