"""Build a randomised, brief-driven Pollinations image prompt.

Each call samples a random scene/composition/lighting combination, but the
subject, mood, and setting are derived from the client's own brief.txt so
the output is visually tailored to the actual brand.
"""
from __future__ import annotations

import json
import random
import re
from pathlib import Path

from adgen import paths
from adgen.palette.runner import detect_category

# ── Scene pools keyed by detected category ────────────────────────────────────
# "{subject}" is replaced at runtime with the brief-derived subject description.

_SCENES: dict[str, list[str]] = {
    "travel": [
        "{subject} on tropical beach with turquoise water and white sand, vacation lifestyle, warm golden hour light, aspirational travel editorial",
        "{subject} exploring cobblestone street in European old town, travel adventure, warm afternoon light, editorial travel photography",
        "aerial view of stunning Mediterranean coastline with turquoise water, no people, dramatic natural light, travel destination photography",
        "{subject} standing on hotel balcony overlooking ocean at sunset, luxury vacation, warm golden tones, lifestyle editorial",
        "wide shot of Greek island village with whitewashed buildings and blue domes, golden hour, vibrant travel destination photography",
        "{subject} with luggage at beautiful European city square, excited traveller, bright clear daylight, travel lifestyle editorial",
        "panoramic view of tropical resort pool and palm trees, luxury holiday setting, vivid colours, no people, premium travel photography",
        "{subject} hiking on scenic coastal trail, sea views, adventure travel, bright sunny daylight, aspirational lifestyle",
    ],
    "beauty": [
        "close-up portrait of {subject} with radiant luminous glowing skin, no products, no hands, serene expression, warm golden light, clean cream background",
        "{subject} in white spa robe by tall window, morning light flooding in, peaceful expression, lush greenery outside, editorial lifestyle",
        "side profile of {subject} with flawless skin, soft dreamy bokeh, warm amber tones, elegant and serene",
        "overhead aesthetic shot of {subject} lying on white linen treatment bed, face relaxed, soft dramatic shadows, luxury spa atmosphere",
        "{subject} sitting in front of large softbox studio light, glowing skin close-up, clean minimal background, beauty campaign quality",
        "atmospheric luxury spa interior, warm candles, marble surfaces, white orchids, no people, golden reflections, premium beauty editorial",
        "{subject} in elegant minimalist bathroom, steamy mirror, morning ritual, soft diffused light, serene and confident",
        "wide-angle luxury beauty clinic interior, clean white walls, accent lighting, serene and inviting, no people, premium feel",
    ],
    "luxury": [
        "{subject} in tailored coat on minimalist terrace, city skyline at dusk, aspirational lifestyle",
        "{subject} descending marble staircase, chandelier light, high fashion editorial",
        "{subject} in silk dress by floor-to-ceiling window, golden afternoon light, penthouse interior",
        "close-up of {subject} with luxury product on dark velvet surface",
    ],
    "health": [
        "{subject} drinking fresh green smoothie, bright kitchen, natural morning light",
        "{subject} doing yoga on rooftop at sunrise, clean sky background",
        "{subject} smiling after workout, fresh and energetic, clean white studio",
        "close-up of healthy meal prep in front of {subject}, vibrant vegetables, clean marble surface",
    ],
    "fitness": [
        "{subject} in athletic wear mid-stretch, clean minimal gym, natural light",
        "dynamic shot of {subject} running on open road at sunrise, motion blur background",
        "{subject} lifting weights, determined expression, clean white studio, dramatic side lighting",
        "{subject} in yoga pose on beach at golden hour, soft warm tones",
    ],
    "food": [
        "hero overhead shot of gourmet dish, {subject} in background, warm restaurant ambiance",
        "chef {subject} plating elegant dish, bokeh restaurant background, warm ambient light",
        "flat lay of artisan ingredients on marble, soft natural light, editorial food styling",
        "{subject} enjoying specialty coffee, wooden table, warm morning atmosphere",
    ],
    "b2b": [
        "confident {subject} at standing desk, modern open office, natural light",
        "{subject} presenting to small team, bright contemporary workspace",
        "{subject} on video call, clean home office, bookshelves in background, professional tone",
        "close-up of {subject} working on laptop, minimal desk setup, morning light",
    ],
    "tech": [
        "{subject} interacting with sleek interface, dark futuristic background",
        "{subject} using minimalist laptop, clean white desk, cool blue ambient light",
        "{subject} in front of server room, confident posture, cool clinical lighting",
        "abstract tech environment with {subject} in soft focus background",
    ],
    "industrial": [
        "skilled {subject} applying liquid epoxy resin on warehouse floor, wide squeegee tool, industrial floor coating work, dramatic factory lighting",
        "{subject} smoothing freshly poured glossy epoxy flooring in large industrial hall, bent over with long-handled roller, blue coveralls, professional editorial",
        "{subject} operating angle grinder on concrete floor surface preparation, sparks, protective gear, industrial construction site",
        "close-up of {subject} pouring pigmented epoxy compound on concrete floor, hands-on skilled trade work, commercial facility",
        "{subject} inspecting freshly coated glossy epoxy floor in warehouse, kneeling, checking surface quality, industrial editorial",
        "wide shot of epoxy flooring installation crew working on large industrial floor, {subject} in foreground with floor roller, professional construction photography",
    ],
    "real-estate": [
        "bright minimal living room with floor-to-ceiling windows, premium furniture, warm afternoon light, no people, interior editorial",
        "aerial drone view of modern residential neighbourhood, clean suburban streets, bright sunny day, aspirational property photography",
        "{subject} holding house keys in front of bright modern home exterior, proud expression, real estate lifestyle editorial",
        "luxury apartment building exterior, clean architectural photography, blue sky, aspirational urban living",
        "freshly renovated kitchen with marble surfaces and premium appliances, warm morning light, interior design editorial",
        "{subject} reviewing property plans at bright modern desk, confident professional, real estate editorial",
    ],
    "automotive": [
        "sleek modern car on empty mountain road, dramatic landscape, golden hour light, automotive editorial photography",
        "car showroom interior with multiple vehicles under bright spotlights, clean professional automotive photography",
        "{subject} standing confidently next to luxury car in urban setting, editorial lifestyle photography",
        "close-up of premium car interior — leather seats, dashboard detail, soft ambient lighting, automotive luxury editorial",
        "sports car on wet city street at night, reflections, cinematic automotive photography",
        "{subject} receiving car keys at modern dealership, smiling, bright professional environment",
    ],
    "education": [
        "{subject} studying at bright modern desk with laptop, focused and motivated expression, clean home office",
        "modern open classroom with students engaged in learning, bright natural light, educational editorial",
        "{subject} presenting confidently to engaged audience in bright training room, professional atmosphere",
        "graduation moment — {subject} in cap and gown, proud expression, outdoor sunny ceremony",
        "online learning setup — warm desk lamp, laptop screen glowing, {subject} focused, aspirational lifestyle",
        "close-up of {subject} taking notes with coffee nearby, café or library setting, productive lifestyle editorial",
    ],
    "finance": [
        "{subject} reviewing documents at clean modern desk, confident expression, soft natural light, professional editorial",
        "growing plant emerging from jar of coins on white surface, financial growth concept, clean editorial",
        "{subject} shaking hands with financial advisor in bright professional office, trust and confidence",
        "sleek modern bank branch interior, bright airy space, premium professional atmosphere, no people",
        "{subject} smiling while checking phone with good financial news, bright city backdrop, lifestyle editorial",
        "abstract concept — stacked savings coins and green chart on clean marble, financial lifestyle editorial",
    ],
    "fashion": [
        "{subject} walking confidently on clean city street, stylish curated outfit, bright urban editorial photography",
        "{subject} in statement outfit against minimal architectural backdrop, fashion editorial photography",
        "flat lay of fashion items on clean white surface, editorial product styling, soft diffused natural light",
        "{subject} browsing clothing rack in bright minimalist boutique, aspirational fashion lifestyle",
        "close-up of clothing texture and craftsmanship detail on {subject}, editorial fashion photography",
        "{subject} wearing seasonal outfit in front of large window, golden afternoon light, fashion editorial",
    ],
    "home": [
        "bright minimal living room with premium furniture and curated décor, warm afternoon light, interior design editorial, no people",
        "stunning kitchen renovation — clean marble surfaces, premium appliances, warm lighting, no people, interior editorial",
        "{subject} relaxing in beautifully furnished room, warm inviting home atmosphere, lifestyle editorial",
        "cosy reading nook with warm lamp light, styled bookshelves, premium textiles, inviting home atmosphere",
        "close-up of premium furniture detail — material texture, finish quality, interior product photography",
        "before/after style composition of renovated space, bright transformation editorial, interior design photography",
    ],
    "events": [
        "elegant wedding reception setup — long table with lush florals, soft candlelight, romantic atmosphere, no people",
        "{subject} couple at golden hour outdoor ceremony, emotional moment, soft warm editorial light",
        "beautifully styled event venue interior, floral arrangements, warm ambient lighting, premium event photography, no people",
        "{subject} laughing with guests at celebration, candid joyful moment, warm bokeh background",
        "close-up of wedding detail — bouquet on white surface, natural light, editorial wedding photography",
        "{subject} photographer capturing moment at outdoor event, golden hour natural light, editorial event coverage",
    ],
    "legal": [
        "{subject} at clean minimal desk reviewing documents, confident professional expression, natural office light",
        "modern law office interior — leather chairs, bookshelves, clean professional atmosphere, no people",
        "{subject} consulting with client across clean conference table, professional trust-building, editorial photography",
        "close-up of {subject} signing important document, professional hands, clean desk surface, editorial",
        "{subject} standing confidently in bright modern office corridor, professional editorial portrait",
    ],
    "pets": [
        "happy dog being examined by caring {subject} veterinarian, bright clean clinic, warm friendly atmosphere",
        "{subject} playing with energetic dog in sunny park, joyful lifestyle, warm natural light",
        "close-up of cute pet looking at camera, bright clean background, warm friendly editorial photography",
        "{subject} holding a happy cat, warm home setting, genuine connection, lifestyle photography",
        "modern bright veterinary clinic interior, clean professional environment, no people",
        "{subject} walking dog on scenic morning path, golden hour light, active lifestyle editorial",
    ],
    "retail": [
        "{subject} in stylish outfit walking through minimal boutique, editorial fashion",
        "{subject} holding premium product packaging, textured surface, clean lifestyle",
        "{subject} with shopping bag, bright city street, fashion editorial aesthetic",
    ],
}

_FALLBACK_SCENES = [
    "{subject} in elegant aspirational setting, premium aesthetic, soft natural light",
    "minimalist studio shot, {subject} with professional confidence, clean background",
    "{subject} in lifestyle moment, warm tones, commercial editorial quality",
]

# ── Concept-specific scene overrides (applied regardless of category) ─────────

_CONCEPT_SCENES: dict[str, list[str]] = {
    "product-flat": [
        "hero product flat lay on clean white surface, soft diffused studio light, "
        "minimal drop shadow, commercial product photography, no people",
        "product displayed on textured marble surface, natural side light, clean editorial "
        "food-and-product styling, no people, sharp focus",
        "overhead flat lay of product on linen texture, warm morning light, "
        "minimal props, premium lifestyle product photography",
        "product on white seamless background, professional studio lighting, "
        "sharp commercial photography, no watermarks, no text",
    ],
    "before-after": [
        "split composition: left side dim desaturated problem state, right side bright "
        "vibrant transformed result, same {subject} in both halves, strong center divider",
        "diptych: left half shows {subject} looking frustrated and dull, right half shows "
        "{subject} confident and glowing after transformation, dramatic lighting contrast",
        "before and after comparison, same {subject}, left panel muted and stressed, "
        "right panel bright and satisfied, clean minimal background",
    ],
    "social-proof": [
        "authentic group of satisfied diverse customers in warm natural light, "
        "genuine smiles, lifestyle editorial, no studio feel",
        "collage-style composition of multiple happy {subject} faces, "
        "warm candid photography, real people, community feel",
        "close-up portrait of happy {subject} after achieving goal, "
        "authentic expression, warm natural light, testimonial photography style",
        "{subject} showing result to camera with genuine pride, "
        "natural indoor light, authentic and unscripted feel",
    ],
}

_COMPOSITIONS = [
    "subject positioned left third, open negative space on right for text overlay",
    "subject positioned right third, clean open space on left for headline",
    "subject in lower half, clean background above for text",
    "subject slightly off-center, generous breathing room around edges",
]

# Copy-space clauses ensure the AI leaves a dark/light zone where ad text will land.
# Keyed by palette theme ("Dark" / "Light").
_COPY_SPACE: dict[str, str] = {
    "Dark": (
        "naturally dark shadowed area occupying the bottom third of the frame "
        "suitable for white text overlay — no bright highlights in that zone"
    ),
    "Light": (
        "clean soft-light area in the bottom third of the frame "
        "suitable for dark text overlay — no busy patterns or high contrast in that zone"
    ),
}

_LIGHTING: dict[str, list[str]] = {
    "Light": [
        "bright airy lighting, soft natural light, clean bright tones",
        "warm golden hour light, soft diffused glow, lifestyle editorial feel",
        "clean studio lighting, soft even shadows, fresh and pure atmosphere",
        "overcast natural daylight, even soft tones, Nordic minimal aesthetic",
    ],
    "Dark": [
        "dramatic moody lighting, deep rich tones, cinematic shadows",
        "low-key studio lighting, dark background, luxury photography feel",
        "candlelight warm glow, dark atmospheric backdrop, intimate luxury",
        "dramatic side-lighting, strong contrast, editorial high-fashion",
    ],
}

# Guard: both dicts must share the same keys so .get(theme, _LIGHTING["Light"]) and
# .get(theme, _COPY_SPACE["Light"]) always produce a consistent pair — mismatched
# defaults produce contradictory lighting+copy-space combos (e.g. bright light + dark zone).
assert set(_LIGHTING) == set(_COPY_SPACE), (
    f"_LIGHTING and _COPY_SPACE must have the same theme keys. "
    f"Got LIGHTING={sorted(_LIGHTING)} vs COPY_SPACE={sorted(_COPY_SPACE)}"
)

_QUALITY = (
    "ultra high quality, 8k, sharp focus, commercial advertising photography, "
    "no watermarks, no text"
)

# Prepended to every positive prompt — keeps output PG-13 across all models.
_SAFETY_PREFIX = (
    "family-friendly, fully clothed, professional, appropriate for all ages, PG-13, "
    "no nudity, no revealing clothing, no suggestive poses"
)

_NEGATIVE = (
    "nudity, bare skin, revealing clothing, suggestive poses, sexual content, "
    "adult content, NSFW, violence, gore, weapons, drugs, alcohol, smoking, "
    "text, words, letters, logos, watermarks, signs, banners, "
    "low quality, blurry, pixelated, cartoon, illustration, painting, "
    "multiple faces, crowd, cluttered background, ugly, deformed"
)


# ── Brief parsing ─────────────────────────────────────────────────────────────

def _parse_brief_sections(text: str) -> dict[str, str]:
    """Parse 'Section: value (possibly multiline + bullet list)' into a dict."""
    sections: dict[str, str] = {}
    current_key: str | None = None
    current_lines: list[str] = []

    for line in text.splitlines():
        stripped = line.strip()
        match = re.match(r'^([A-Za-z][A-Za-z\s]{1,40}):\s*(.*)', stripped)
        if match and not stripped.startswith("-"):
            if current_key:
                sections[current_key] = " ".join(current_lines).strip()
            current_key = match.group(1).strip().lower()
            rest = match.group(2).strip()
            current_lines = [rest] if rest else []
        elif stripped.startswith("-") and current_key:
            current_lines.append(stripped[1:].strip())
        elif stripped and current_key:
            current_lines.append(stripped)

    if current_key:
        sections[current_key] = " ".join(current_lines).strip()

    return sections


def _subject_from_audience(audience: str) -> str:
    """Derive a photographic subject description from the target audience field."""
    if not audience:
        return "person"

    text = audience.lower()
    is_female = any(w in text for w in ("women", "woman", "female", "she", "her"))
    is_male = any(w in text for w in ("men", "man", "male", "he", "his"))

    age_match = re.search(r"aged?\s+(\d+)\s*[–\-]\s*(\d+)", text)
    age_desc = ""
    if age_match:
        mid = (int(age_match.group(1)) + int(age_match.group(2))) // 2
        buckets = [(30, "in her late twenties", "in his late twenties"),
                   (40, "in her early thirties", "in his early thirties"),
                   (50, "in her early forties",  "in his early forties"),
                   (99, "in her fifties",         "in his fifties")]
        for threshold, f_label, m_label in buckets:
            if mid < threshold:
                age_desc = f_label if (is_female or not is_male) else m_label
                break

    if is_female or not is_male:
        return f"elegant woman {age_desc}".strip()
    return f"confident man {age_desc}".strip()


def _mood_from_tone(tone: str) -> str:
    """Extract concise visual mood keywords from the brand tone field."""
    if not tone:
        return "professional, aspirational"
    first = tone.split(".")[0].split("—")[0].strip()
    noise = {"latvian", "phrasing", "native", "speaks", "to", "real", "validation",
             "before", "solution", "only", "not", "and", "with", "the", "a", "an"}
    words = [w.strip().rstrip(",") for w in first.split()
             if w.lower().strip().rstrip(",") not in noise]
    return ", ".join(words[:5]).lower() if words else "professional, aspirational"


def _setting_from_product(product: str) -> str:
    """Pull a 1-2 word setting label from the product description."""
    mapping = {
        "clinic": "luxury clinic", "spa": "spa", "salon": "beauty salon",
        "studio": "studio", "office": "office", "restaurant": "restaurant",
        "store": "boutique", "shop": "boutique", "gym": "gym",
        "kitchen": "kitchen", "workshop": "workshop",
    }
    text = product.lower()
    for kw, label in mapping.items():
        if kw in text:
            return label
    return ""


# ── Main entry point ──────────────────────────────────────────────────────────

CONCEPTS = ("lifestyle", "product-flat", "before-after", "social-proof")


def build_prompt(domain: str, concept: str = "lifestyle") -> tuple[str, str]:
    """Return a freshly randomised, brief-driven (prompt, negative_prompt).

    concept: one of "lifestyle" (default), "product-flat", "before-after", "social-proof".
    Concept overrides the category-based scene pool when set to anything other than "lifestyle".
    """
    manifest = json.loads(
        (paths.scrape_dir(domain) / "manifest.json").read_text(encoding="utf-8")
    )
    copy = json.loads(
        (paths.copy_dir(domain) / "final.json").read_text(encoding="utf-8")
    )
    palette = json.loads(
        (paths.palette_dir(domain) / "chosen.json").read_text(encoding="utf-8")
    )

    brand_name = manifest.get("brand_name", domain)
    category = detect_category(manifest)
    theme = palette.get("theme", "Light")

    # Parse brief for client-specific visual context
    brief_sections: dict[str, str] = {}
    brief_file = paths.brief_path(domain)
    if brief_file.exists():
        brief_sections = _parse_brief_sections(brief_file.read_text(encoding="utf-8"))

    subject = _subject_from_audience(brief_sections.get("target audience", ""))
    mood = _mood_from_tone(brief_sections.get("brand tone", ""))
    setting = _setting_from_product(brief_sections.get("product", ""))

    # Concept override takes priority over category pool for non-lifestyle concepts
    if concept in _CONCEPT_SCENES:
        scene_pool = _CONCEPT_SCENES[concept]
    else:
        scene_pool = _SCENES.get(category or "", _FALLBACK_SCENES)

    scene = random.choice(scene_pool).replace("{subject}", subject)

    composition = random.choice(_COMPOSITIONS)
    lighting = random.choice(_LIGHTING.get(theme, _LIGHTING["Light"]))

    on_image_texts = copy.get("on_image_texts", [])
    mood_hint = random.choice(on_image_texts) if on_image_texts else ""

    copy_space = _COPY_SPACE.get(theme, _COPY_SPACE["Light"])
    concept_note = f"Concept: {concept}." if concept != "lifestyle" else ""
    parts = [
        f"Professional advertising photograph for {brand_name}.",
        _SAFETY_PREFIX + ".",
        concept_note,
        scene + ".",
        f"{setting} interior." if (setting and concept == "lifestyle") else "",
        f"Mood: {mood}." if mood else "",
        lighting + ".",
        composition + ".",
        copy_space + ".",
        f'Emotion: "{mood_hint}".' if mood_hint else "",
        _QUALITY + ".",
    ]

    prompt = " ".join(p for p in parts if p)
    return prompt, _NEGATIVE
