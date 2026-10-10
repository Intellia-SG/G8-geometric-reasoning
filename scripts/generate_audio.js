// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications and TRD §8.

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
if (!apiKey) {
  console.log("\n⚠️ Note: VITE_ELEVENLABS_API_KEY is not defined in .env.local.");
  console.log("Audio generation script ready for when key is provided.\n");
  process.exit(0);
}

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

const phrases = [
  // ─── INTRO ────────────────────────────────────────────────────────────────
  { text: "Welcome to ReasonQuest and the Geometry Court!", style: 'statement' },
  { text: "Two sketches show the same case. In one, two lines are parallel; in the other, they are slightly off.", style: 'statement' },
  { text: "The claim is: these two angles are equal. When is a judge allowed to accept it?", style: 'question' },
  { text: "Let us discover the evidence: a ruling is only valid when the rulebook condition is met!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "In the school mock-trial courtroom, Priyanka stepped up to the lectern with supreme confidence.", style: 'statement' },
  { text: "Angle x is clearly 70 degrees because it looks identical to angle y!", style: 'thinking' },
  { text: "Judge Tally struck the wooden gavel: Objection sustained! Looking like it is not evidence. A diagram is merely a sketch artist drawing.", style: 'emphasis' },
  { text: "No reason, no ruling!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Judge Tally unfurled the court rulebook. Every geometric fact carries a strict condition, an only if.", style: 'instruction' },
  { text: "Look at the Z-shape, F-shape, and C-shape between two lines.", style: 'statement' },
  { text: "Alternate angles are equal only if the lines are marked parallel with arrows!", style: 'emphasis' },
  { text: "A rule applied without its condition is an error, not a shortcut.", style: 'instruction' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Syafiq took the marker and began building an argument chain on the whiteboard.", style: 'statement' },
  { text: "Mark the given evidence first! Syafiq drew a dashed helper line through the middle vertex.", style: 'instruction' },
  { text: "Now we have two pairs of alternate angles that add together!", style: 'statement' },
  { text: "We deduce every step logically from the rulebook, without measuring the drawing.", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "Armed with solid evidence, Priyanka and Syafiq delivered their final closing argument.", style: 'statement' },
  { text: "When an opposing advocate claimed side-side-angle was a criterion, Priyanka objected with a clear counterexample.", style: 'statement' },
  { text: "Judge Tally struck the gavel: Verdict granted! Proof upheld beyond mathematical doubt!", style: 'celebration' },

  // ─── SIMULATION STATIONS ─────────────────────────────────────────────────
  { text: "Welcome to Station A — The Evidence Board!", style: 'instruction' },
  { text: "Rotate the transversal and tilt the line rails to discover how alternate, corresponding, and co-interior angles behave. Notice when the rulebook facts hold and when they switch off!", style: 'instruction' },
  { text: "Welcome to Station B — Prove It Parallel!", style: 'instruction' },
  { text: "A claim is on the table: line A B is parallel to line C D. Adjust the angle stepper until the evidence satisfies a converse rule to establish parallel lines!", style: 'instruction' },
  { text: "Welcome to Station C — The Full Hearing!", style: 'instruction' },
  { text: "Review the given marks, add a helper line if needed, put the scrambled docket steps into logical order, and assign the correct reason to each!", style: 'instruction' },
  { text: "Welcome to Station D — Objection Station!", style: 'instruction' },
  { text: "A fellow advocate has submitted an argument containing one seeded logical flaw. Find the flawed step, hit Objection, and provide the correct ruling!", style: 'instruction' },

  // ─── REFLECT & GAMIFICATION ──────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase of ReasonQuest!", style: 'statement' },
  { text: "Let us review the key principles of proof, angle conditions, and congruence criteria.", style: 'statement' },
  { text: "Which rule did you almost use without checking its condition first?", style: 'question' },
  { text: "You have reasoned with precision and earned your place on the court!", style: 'celebration' },
  { text: "Order in the court! Incredible winning streak! 🔥", style: 'celebration' },
  { text: "Objection sustained! Three correct rulings in a row! ⭐", style: 'celebration' },
  { text: "Spot on! Legally sound ruling! ⚖️", style: 'celebration' },
  { text: "Objection overruled — check the rulebook conditions, review the hints, and rule again! 💡", style: 'thinking' },
  { text: "Case Won! Outstanding advocacy on this court docket! 🌟", style: 'celebration' },
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
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
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
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in ReasonQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio generation completed successfully!\n");
}

main().catch(console.error);
