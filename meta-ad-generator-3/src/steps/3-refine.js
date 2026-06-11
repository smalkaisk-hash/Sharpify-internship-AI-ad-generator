import { callAndParseJSON, COPY_MODEL } from '../client.js';
import { REFINER_SYSTEM_PROMPT } from '../prompts/copywriter.js';
import { validateComponents } from '../validator.js';

export async function refineComponents(components) {
  console.log('\nStep 3: Validating and refining components...');

  const { valid, issues } = validateComponents(components);

  if (valid) {
    console.log('  PASS — no issues found');
    return components;
  }

  console.log(`  REFINE — ${issues.length} issue(s):`);
  issues.forEach(i => console.log(`    • ${i}`));

  const refined = await callAndParseJSON({
    model: COPY_MODEL,
    max_tokens: 1500,
    system: REFINER_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Refine this ad copy components object. Issues to fix:\n${issues.map(i => `- ${i}`).join('\n')}\n\nInput JSON:\n${JSON.stringify(components, null, 2)}\n\nReturn the refined JSON only. Keep the exact same structure.`,
      },
    ],
  });

  console.log('  Refinement complete');
  return refined;
}
