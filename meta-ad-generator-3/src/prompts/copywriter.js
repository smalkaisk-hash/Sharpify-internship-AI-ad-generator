import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const read = (file) => readFileSync(resolve(__dirname, file), 'utf8');

export const COMPONENTS_SYSTEM_PROMPT = read('components.md');
export const REFINER_SYSTEM_PROMPT    = read('refiner.md');
export const DESIGNER_SYSTEM_PROMPT   = read('designer.md') + '\n\n' + read('style-guide.md') + '\n\n' + read('color-theory.md') + '\n\n' + read('../data/palettes-neutral.md');
