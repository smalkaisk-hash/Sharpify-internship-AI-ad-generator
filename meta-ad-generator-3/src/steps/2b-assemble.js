/**
 * Assembles 9 ad variations from the 3 headlines, 6 bullets, and 3 base texts
 * generated in step 2.
 *
 * Strategy:
 *   - 3 headlines × 3 base_texts = 9 combos (headline cycles fastest)
 *   - Each variation gets 3 bullets from the 6, using 9 pre-set subsets
 *     chosen for maximum coverage — every bullet appears in 4–5 variations
 */

// 9 pre-set bullet index triplets. Each combo is unique; all 6 bullets appear roughly equally.
const BULLET_COMBOS = [
  [0, 1, 2],
  [2, 3, 4],
  [4, 5, 0],
  [1, 3, 5],
  [0, 2, 4],
  [1, 2, 5],
  [0, 3, 4],
  [1, 4, 5],
  [0, 2, 5],
];

export function assembleVariations(components) {
  console.log('\nStep 2b: Assembling 9 variations...');

  const { headlines, bullets, base_texts, on_image_texts, cta } = components;

  const variations = [];

  for (let i = 0; i < 9; i++) {
    const headlineIndex  = i % 3;
    const baseTextIndex  = Math.floor(i / 3);
    const bulletIndices  = BULLET_COMBOS[i];

    const variation = {
      index:         i + 1,
      headline:      headlines[headlineIndex],
      bullets:       bulletIndices.map(bi => bullets[bi]),
      base_text:     base_texts[baseTextIndex],
      cta:           cta || 'Book Now',
      on_image_text: on_image_texts[baseTextIndex] || headlines[headlineIndex],
    };

    variations.push(variation);

    console.log(`  Variation ${i + 1}: H${headlineIndex + 1} + BT${baseTextIndex + 1} + bullets [${bulletIndices.map(b => b + 1).join(',')}]`);
  }

  return variations;
}
