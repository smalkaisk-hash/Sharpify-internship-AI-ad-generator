import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env — check meta-ad-generator-3/.env first, then root Meta-ad-generator-v2/.env
const localEnv = resolve(__dirname, '../.env');
const rootEnv  = resolve(__dirname, '../../.env');

if (existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else {
  dotenv.config({ path: rootEnv });
}

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    'ANTHROPIC_API_KEY is not set.\n' +
    'Add it to meta-ad-generator-3/.env or Meta-ad-generator-v2/.env:\n' +
    '  ANTHROPIC_API_KEY=sk-ant-...'
  );
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const COPY_MODEL   = process.env.COPY_MODEL   || 'claude-haiku-4-5-20251001';
export const DESIGN_MODEL = process.env.DESIGN_MODEL || 'claude-sonnet-4-6';

export default anthropic;

/**
 * Make an Anthropic messages call and parse the JSON response.
 * Accepts { model, max_tokens, system, messages } params.
 * System prompt is automatically cached (ephemeral) for cost savings.
 * Retries once if JSON parsing fails.
 */
export async function callAndParseJSON(params, retries = 1) {
  const { model, max_tokens, system, messages } = params;

  // Wrap system string in a cached block; pass arrays through as-is
  const systemBlocks = typeof system === 'string'
    ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }]
    : system;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await anthropic.messages.create({
      model,
      max_tokens,
      system: systemBlocks,
      messages,
    });

    const text = response.content[0]?.text || '';
    const cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      if (attempt < retries) {
        console.warn('  JSON parse failed, retrying...');
        continue;
      }
      throw new Error(`JSON parse failed after ${retries + 1} attempts.\nRaw response:\n${text}`);
    }
  }
}
