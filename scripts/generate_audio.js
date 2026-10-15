// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications.

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

/**
 * Complete list of all static narration phrases across ReasonQuest
 * Enforces 1:1 strict parity with on-screen text in UI components.
 */
export const phrases = [
  // ─── INTRO SCREEN ────────────────────────────────────────────────────────
  { text: "Welcome to the Geometry Court! I am Judge Tally.", style: 'statement' },
  { text: "Remember: no reason, no ruling!", style: 'emphasis' },
  { text: "Justify every step with closed rulebook reasons, verify conditions before concluding, use helper lines, and disprove false claims with counterexamples!", style: 'instruction' },

  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "Welcome to ReasonQuest and the Geometry Court!", style: 'statement' },
  { text: "Two sketches show the exact same case. In one sketch, two lines are marked parallel. In the other, they look parallel but are slightly off without marks.", style: 'statement' },
  { text: "The advocate claims: these two angles are equal! When is a judge legally allowed to accept it?", style: 'question' },
  { text: "Remember: in geometry court, no reason means no ruling! Let us discover the rulebook!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 0 (The First Case) ───────────────────────────────
  { text: "In the school mock-trial courtroom, Priyanka stepped up to the lectern with supreme confidence.", style: 'statement' },
  { text: "Looking at an angle diagram on the evidence board, she declared: Your Honor, angle x is clearly 70 degrees because it looks identical to angle y!", style: 'thinking' },
  { text: "Judge Tally struck the wooden gavel: Objection sustained! In geometry court, looking like it is not evidence. A diagram is merely a sketch artist drawing.", style: 'emphasis' },
  { text: "No reason, no ruling!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 (The Rulebook) ─────────────────────────────────
  { text: "Judge Tally unfurled the court rulebook. Every geometric fact carries a strict condition, an only if.", style: 'instruction' },
  { text: "Look at the Z-shape, F-shape, and C-shape between two lines.", style: 'statement' },
  { text: "Alternate angles are equal only if the lines are marked parallel with arrows!", style: 'emphasis' },
  { text: "A rule applied without its condition is an error, not a shortcut.", style: 'instruction' },

  // ─── STORY PHASE: PANEL 2 (Build the Chain) ──────────────────────────────
  { text: "Syafiq took the marker and began building an argument chain on the whiteboard.", style: 'statement' },
  { text: "Mark the given evidence first! Syafiq drew a dashed helper line through the middle vertex.", style: 'instruction' },
  { text: "Now we have two pairs of alternate angles that add together!", style: 'statement' },
  { text: "We deduce every step logically from the rulebook, without measuring the drawing.", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 3 (Verdict Delivered) ────────────────────────────
  { text: "Armed with solid evidence, Priyanka and Syafiq delivered their final closing argument.", style: 'statement' },
  { text: "When an opposing advocate claimed side-side-angle was a criterion, Priyanka objected with a clear counterexample.", style: 'statement' },
  { text: "Judge Tally struck the gavel: Verdict granted! Proof upheld beyond mathematical doubt!", style: 'celebration' },

  // ─── SIMULATION STATIONS ─────────────────────────────────────────────────
  { text: "Welcome to Station A — The Evidence Board!", style: 'instruction' },
  { text: "Rotate the transversal and test whether the line rails are parallel. Observe which rulebook facts hold and which break the moment lines are not parallel!", style: 'instruction' },
  { text: "Welcome to Station B — Prove It Parallel!", style: 'instruction' },
  { text: "A claim is on the table: line A B is parallel to line C D. Adjust the angle stepper until the evidence satisfies a converse rule to establish parallel lines!", style: 'instruction' },
  { text: "Welcome to Station C — The Full Hearing!", style: 'instruction' },
  { text: "Review the given marks, add a helper line if needed, put the scrambled docket steps into logical order, and assign the correct reason to each!", style: 'instruction' },
  { text: "Welcome to Station D — Objection Station!", style: 'instruction' },
  { text: "Advocate Ramesh has submitted an argument with one seeded logical flaw. Identify the flawed step, hit Objection, and issue the correct ruling!", style: 'instruction' },

  // ─── PRACTICE / GAMEPLAY FEEDBACK ────────────────────────────────────────
  { text: "Spot on! Legally sound ruling! ⚖️", style: 'celebration' },
  { text: "Objection sustained! Three correct rulings in a row! ⭐", style: 'celebration' },
  { text: "Order in the court! Incredible winning streak! 🔥", style: 'celebration' },
  { text: "Objection overruled — check the rulebook conditions, review the hints, and rule again! 💡", style: 'thinking' },
  { text: "Here is your first clue! Look at what is explicitly marked on the diagram exhibit.", style: 'encouragement' },
  { text: "Here is your final clue! Match the geometry condition to the rulebook closed list.", style: 'encouragement' },
  { text: "Case Won! Outstanding advocacy on this court docket! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Defend your verdict with valid geometric reasons to claim your badge!", style: 'emphasis' },
  { text: "Verdict Delivered! You defeated the court boss and claimed the World Badge! 🏅", style: 'celebration' },
  { text: "Answer courtroom questions correctly to defend your verdict beyond mathematical doubt!", style: 'statement' },
  { text: "Verdict granted! You defeated the court boss and claimed the World Badge!", style: 'celebration' },
  { text: "Court Order! You unlocked a new judicial badge!", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase of ReasonQuest!", style: 'statement' },
  { text: "Let us review the key principles of proof, angle conditions, and congruence criteria.", style: 'statement' },
  { text: "Which geometric rule did you almost use without checking its condition first?", style: 'question' },
  { text: "You have reasoned with precision and earned your place on the court!", style: 'celebration' },
  { text: "Outstanding! You have mastered angle conditions, deductive chains, and triangle congruence! Chief Advocate Badge earned! 🏆", style: 'celebration' },

  // ─── 22 CLOSED RULEBOOK REASONS ──────────────────────────────────────────
  { text: "because adjacent angles on a straight line sum to 180 degrees", style: 'instruction' },
  { text: "because angles around a point sum to 360 degrees", style: 'instruction' },
  { text: "because vertically opposite angles are equal", style: 'instruction' },
  { text: "because corresponding angles are equal, when lines are parallel", style: 'instruction' },
  { text: "because alternate angles are equal, when lines are parallel", style: 'instruction' },
  { text: "because co-interior angles sum to 180 degrees, when lines are parallel", style: 'instruction' },
  { text: "because the angle sum of a triangle is 180 degrees", style: 'instruction' },
  { text: "because the exterior angle of a triangle equals the sum of interior opposite angles", style: 'instruction' },
  { text: "because the base angles of an isosceles triangle opposite equal sides are equal", style: 'instruction' },
  { text: "because all interior angles of an equilateral triangle are 60 degrees", style: 'instruction' },
  { text: "because it is given in the problem statement", style: 'instruction' },
  { text: "because both triangles share the same common side", style: 'instruction' },
  { text: "because both triangles share the same common angle", style: 'instruction' },
  { text: "because corresponding angles are equal, the lines must be parallel", style: 'instruction' },
  { text: "because alternate angles are equal, the lines must be parallel", style: 'instruction' },
  { text: "because co-interior angles sum to 180 degrees, the lines must be parallel", style: 'instruction' },
  { text: "because of the side, side, side congruence criterion", style: 'instruction' },
  { text: "because of the side, angle, side congruence criterion", style: 'instruction' },
  { text: "because of the angle, side, angle congruence criterion", style: 'instruction' },
  { text: "because of the angle, angle, side congruence criterion", style: 'instruction' },
  { text: "because of the right angle, hypotenuse, side congruence criterion", style: 'instruction' },
  { text: "because corresponding parts of congruent triangles are equal", style: 'instruction' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline for ReasonQuest`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};
  let existingCount = 0;
  let newlyGenerated = 0;
  let skippedNoKey = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);
    const relativeWebPath = `/assets/audio/${fileName}`;

    if (fs.existsSync(destPath)) {
      mapping[text] = relativeWebPath;
      existingCount++;
      console.log(`[${i + 1}/${phrases.length}] ⏩ Existing: ${fileName}`);
      continue;
    }

    if (!apiKey) {
      // Record intended mapping for static lookup and dynamic fallback
      mapping[text] = relativeWebPath;
      skippedNoKey++;
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      mapping[text] = relativeWebPath;
      newlyGenerated++;
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js
// Static asset mapping for offline generated narration phrases in ReasonQuest

export const audioMap = ${JSON.stringify(mapping, null, 2)};

export default audioMap;
`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log(`\n✨ Audio mapping updated in src/utils/audioMap.js (${Object.keys(mapping).length} entries)!`);

  if (!apiKey && skippedNoKey > 0) {
    console.log(`\n⚠️ Note: ${skippedNoKey} phrases pending generation.`);
    console.log(`To generate remaining static .mp3 files, define VITE_ELEVENLABS_API_KEY in .env.local and re-run:`);
    console.log(`   node scripts/generate_audio.js\n`);
  } else {
    console.log(`🎉 Audio generation pipeline complete! Newly generated: ${newlyGenerated}, Existing: ${existingCount}.\n`);
  }
}

main().catch(console.error);
