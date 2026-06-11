import { callAndParseJSON, COPY_MODEL } from '../client.js';
import { COMPONENTS_SYSTEM_PROMPT } from '../prompts/copywriter.js';
import { formatContextForPrompt } from '../context-builder.js';

export async function generateComponents(clientContext) {
  console.log('\nStep 2: Generating copy components (headlines, bullets, base texts)...');

  const contextStr = formatContextForPrompt(clientContext);

  const components = await callAndParseJSON({
    model: COPY_MODEL,
    max_tokens: 1500,
    system: COMPONENTS_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate copy components for this client. Return JSON only.\n\n${contextStr}`,
      },
    ],
  });

  console.log(`  Headlines: ${components.headlines?.length ?? 0}`);
  console.log(`  Bullets:   ${components.bullets?.length ?? 0}`);
  console.log(`  Base texts: ${components.base_texts?.length ?? 0}`);
  components.headlines?.forEach(h => console.log(`    H: "${h}"`));

  return components;
}
