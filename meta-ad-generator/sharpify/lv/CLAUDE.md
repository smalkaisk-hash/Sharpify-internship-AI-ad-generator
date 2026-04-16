# Sharpify LV Account — Rules

Rules specific to the LATVIAN Sharpify ad account. For shared rules see `sharpify/CLAUDE.md`.

---

## Routing

Trigger `reklamas-meta-sharpify` skill when user says:
- "make ads for LV account"
- "Latvian ads for [niche]"
- "LV ads for būvnieki / skaistumkopšana / IT / etc"
- "reklāmas priekš [niša]"
- "MP Risinājums ads", "jauniklienti campaign"

Do NOT use this workflow if the user names a third-party business — route to `clients/` workspace (full-pipeline) instead.

---

## Account + Product

- **Account:** `act_549172712351324`
- **Product:** MP Risinājums™ (Latvian client-acquisition system)
- **Landing page:** `https://jauniklienti.netlify.app/` (quiz funnel — BUT see "No quiz funnels" rule below)
- **Lead gen form ID:** `944838491325482`

---

## Copy Rules

### "Parūpējies" headline formula (arched template)

The correct care-theme headline formula:

**"Tu parūpējies, lai [client outcome], kamēr nākamais [klients/objekts/pasūtījums] jau gaida rindā."**

NOT "Tu parūpējies par [product noun]" — in LV, "parūpēties par X" implies maintenance/caring-for X (ongoing care), which doesn't fit installation trades. Nobody says "tu parūpējies par durvīm" — that reads as if the contractor is caring for doors like a caretaker.

**Examples:**
- garāžas durvis: "Tu parūpējies, lai garāžām ir kvalitatīvi vārti, kamēr nākamais klients jau gaida rindā."
- flīzētāji: "Tu parūpējies, lai flīzes ir perfektas, kamēr nākamais objekts jau gaida rindā."
- jumiķi: "Tu parūpējies, lai ūdens nebojā māju, kamēr nākamais klients jau gaida rindā." (NOT "lai jumti ir sausi" — gutters don't dry roofs; they direct water AWAY)
- saules paneļi: "Tu parūpējies, lai mājas ražo strāvu, kamēr nākamais objekts jau gaida rindā."
- žogi: "Tu parūpējies, lai pagalmi ir droši, kamēr nākamais pasūtījums jau gaida rindā."

**`[outcome]` must be factually accurate for the trade** — would a contractor in this niche actually claim this? Vary the italic noun per niche so headlines are unique across the adset (klients / objekts / pasūtījums / pirts / remonts).

Font size 46px with this formula (fits ~48 chars on line 1 at 960px width in Instrument Serif).

The sticker template (`Pieteikumi nāk paši, kamēr Tu [activity]`) doesn't have this issue — keep it as-is.

### No "€10k+/month" targeting claims

In warning-style ads ("Meklējam 5 X meistarus ar savu firmu, kas..."), do NOT use "kas gatavi augt līdz €10k+ mēnesī ar AI mārketinga sistēmu". Use "kas gatavi uzņemt jaunus klientus katru mēnesi ar AI mārketinga sistēmu" instead.

**Why:** Promising €10k+ monthly revenue as a targeting qualifier is too aggressive / claim-heavy for Meta warning ads. Client-acquisition framing is safer and truer to the offer.

**Exception:** Real past client results in case-study carousels ("Baiba Aucīte 3 gados līdz €10K/mēn") are fine — factual outcomes, not a promise to new leads.

### "Bezmaksas mājaslapa" IS allowed

The mājaslapa bonus can be labeled "🎁 BEZMAKSAS mājaslapa dāvanā" — it's a real free add-on when purchasing MP Risinājums. Doesn't contradict the ENG "Playbook not free" rule — different product.

### Correct LV abbreviations in notification cards

- Auto-serviss: use **"TA"** (Tehniskā apskate), NOT "TO"
- Prefer **"bremžu maiņa"** over "bremžu nomaiņa" — shorter, more colloquial

---

## Funnel Rules

### No quiz funnels

Don't propose "Quiz Leadgen" style funnels (ad → landing page with quiz → lead form). Straight lead-form ads consistently outperform quiz funnels on this account.

**Why:** Account history shows 0 leads across €35+ spend on 4 different niches (roofing, IT, beauty, foundations) all running quiz funnels. The conversion path is too long.

**How to apply:** Default to Meta's native lead gen form (ID `944838491325482`) with `destination_type=ON_AD`. If user asks for a quiz funnel, flag the historical data first.

---

## Targeting (proven stack)

For Sharpify LV business audiences, start with:
- Age 25-65 (65 required by Advantage Audience)
- Country LV (location_types `home`, `recent`)
- Interests: Business / Business development / Business leaders / Entrepreneurship / Small business / Artificial intelligence / B2B
- Placements: FB + IG, all mobile + desktop positions

---

## Niches — Proven Winners

See `sharpify/lv/notes.md` for detailed winning patterns (Salona īpašniece formula, landscape 16:9 workshop, etc.) with specific performance data.

---

See also:
- `meta-ad-generator/CLAUDE.md` — global rules
- `sharpify/CLAUDE.md` — shared Sharpify rules (palette, video workflow)
- `sharpify/lv/notes.md` — LV-specific learnings log
- `sharpify/formats/` — proven ad formats
