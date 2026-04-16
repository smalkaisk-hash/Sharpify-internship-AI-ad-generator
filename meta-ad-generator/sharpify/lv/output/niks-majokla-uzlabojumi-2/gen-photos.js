const { spawn } = require('child_process');
const path = require('path');

const SCRIPT = path.resolve(__dirname, '../../scripts/generate-image.js');
const IMG_DIR = __dirname + '/images';

const prompts = [
  {
    slug: 'notekcaurules',
    prompt: 'Documentary-style candid photograph of a professional installing rain gutters on a residential house. Close-up showing hands securing an aluminum gutter to the roof fascia with brackets and screws, ladder visible. Overcast natural daylight, slightly desaturated muted colors, realistic work-in-progress scene. Shot on 35mm lens, shallow depth of field. No text, no logos, no AI-looking artifacts.'
  },
  {
    slug: 'zogi',
    prompt: 'Documentary-style candid photograph of a fence installer working on a wooden or metal residential fence. Hands holding a post driver or screwing a panel in place, fence partially complete in the frame. Overcast natural daylight, slightly desaturated muted colors, Baltic suburban backyard. Shot on 35mm lens, shallow depth of field. No text, no logos.'
  },
  {
    slug: 'zaliens',
    prompt: 'Documentary-style candid photograph of artificial turf being installed in a residential backyard. Close-up on hands unrolling and seaming a strip of synthetic grass, utility knife and turf pegs visible on the ground. Overcast natural daylight, slightly desaturated muted colors. Shot on 35mm lens, shallow depth of field. No text, no logos.'
  },
  {
    slug: 'saulespaneli',
    prompt: 'Documentary-style candid photograph of solar panel installers on a residential house roof mounting photovoltaic modules. Two workers in safety harnesses positioning a panel onto the mounting rails, clear sky with soft clouds. Slightly desaturated muted colors, realistic work-in-progress scene. Shot on 35mm lens, shallow depth of field. No text, no logos.'
  },
  {
    slug: 'garazasdurvis',
    prompt: 'Documentary-style candid photograph of a garage door installer working on a sectional residential garage door. Hands adjusting the torsion spring and track hardware, partially installed door visible. Overcast natural daylight, slightly desaturated muted colors. Shot on 35mm lens, shallow depth of field. No text, no logos.'
  },
  {
    slug: 'pirts',
    prompt: 'Documentary-style candid photograph of a traditional Baltic wooden sauna being built in a backyard. Close-up on carpenter hands fitting thermo-treated aspen planks onto sauna walls, wood shavings on the ground. Natural warm tones inside a partially built sauna, soft window light. Shot on 35mm lens, shallow depth of field. No text, no logos.'
  },
  {
    slug: 'vannasistabas',
    prompt: 'Documentary-style candid photograph of a bathroom remodel mid-renovation — a contractor installing a modern walk-in shower or vanity. Hands holding a level against tiled wall, tools and tile spacers on the floor, exposed plumbing visible. Natural cool daylight from window, slightly desaturated muted colors. Shot on 35mm lens, shallow depth of field. No text, no logos.'
  },
  {
    slug: 'flizetaji',
    prompt: 'Documentary-style candid photograph of a tile setter laying large-format porcelain floor tiles in a residential room. Close-up on gloved hands pressing a tile into thinset with a rubber mallet, trowel and tile spacers visible, level line chalked on the floor. Natural cool daylight, slightly desaturated muted colors. Shot on 35mm lens, shallow depth of field. No text, no logos.'
  }
];

async function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`Exit ${code}`)));
  });
}

(async () => {
  for (const { slug, prompt } of prompts) {
    const out = `${IMG_DIR}/${slug}.png`;
    console.log(`\n=== Generating ${slug} ===`);
    try {
      await run('node', [SCRIPT, JSON.stringify(prompt), JSON.stringify(out)]);
    } catch (e) {
      console.error(`FAILED: ${slug} — ${e.message}. Retrying once after 3s...`);
      await new Promise(r => setTimeout(r, 3000));
      try {
        await run('node', [SCRIPT, JSON.stringify(prompt), JSON.stringify(out)]);
      } catch (e2) {
        console.error(`FAILED AGAIN: ${slug} — skipping`);
      }
    }
  }
  console.log('\nAll photo generations attempted.');
})();
