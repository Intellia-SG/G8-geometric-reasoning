// src/hooks/useAudio.js
// Audio Engine adhering strictly to audio_generation_pipeline (5).md
// - Static audioMap lookup
// - Dynamic ElevenLabs generation (no browser TTS fallback)
// - Eager preloading of upcoming segments for seamless playback
// - Synthesized Web Audio SFX

import { useRef, useCallback, useEffect } from 'react';
import { audioMap } from '../utils/audioMap.js';
import { VOICE_ID, VOICE_MODEL, VOICE_SETTINGS } from '../config/audio.config.js';

const blobCache = new Map();

export function useAudio(audioEnabled = true) {
  const currentAudioRef = useRef(null);
  const playingRef      = useRef(false);
  const narrateIdRef    = useRef(0);

  useEffect(() => {
    if (!audioEnabled) {
      narrateIdRef.current++;
      stopAll();
    }
  }, [audioEnabled]);

  const stopAll = useCallback(() => {
    narrateIdRef.current++;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    playingRef.current = false;
  }, []);

  /**
   * Fetch audio URL with priority:
   * 1. Static asset from audioMap
   * 2. In-memory blobCache
   * 3. Dynamic generation via ElevenLabs API (if VITE_ELEVENLABS_API_KEY is defined)
   * 4. Returns null (silent skip, no browser Web Speech API fallback)
   */
  const getAudioUrl = useCallback(async (text, style = 'statement') => {
    if (!text) return null;

    // 1. Static audioMap match
    if (audioMap && audioMap[text]) {
      return audioMap[text];
    }

    // 2. Memory cache check
    const cacheKey = `${text}__${style}`;
    if (blobCache.has(cacheKey)) {
      return blobCache.get(cacheKey);
    }

    // 3. Dynamic ElevenLabs generation
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) return null;

    try {
      const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
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

      if (!res.ok) {
        return null;
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      blobCache.set(cacheKey, url);
      return url;
    } catch {
      // Skip narration silently without crashing or robotic voices
      return null;
    }
  }, []);

  /**
   * Play an audio URL with fallback to dynamic ElevenLabs fetch if static file 404s
   */
  const playUrlWithFallback = useCallback((url, text, style, expectedId) => {
    return new Promise((resolve) => {
      if (!audioEnabled || narrateIdRef.current !== expectedId) {
        resolve();
        return;
      }

      const audio = new Audio(url);
      currentAudioRef.current = audio;

      audio.onended = () => {
        currentAudioRef.current = null;
        resolve();
      };

      audio.onerror = async () => {
        currentAudioRef.current = null;
        // If static audio file was missing (e.g. 404), attempt dynamic ElevenLabs fetch
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        if (apiKey && narrateIdRef.current === expectedId) {
          try {
            const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
            const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
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
            if (res.ok && narrateIdRef.current === expectedId) {
              const blob = await res.blob();
              const dynUrl = URL.createObjectURL(blob);
              blobCache.set(`${text}__${style}`, dynUrl);
              const dynAudio = new Audio(dynUrl);
              currentAudioRef.current = dynAudio;
              dynAudio.onended = () => { currentAudioRef.current = null; resolve(); };
              dynAudio.onerror = () => { currentAudioRef.current = null; resolve(); };
              dynAudio.play().catch(() => resolve());
              return;
            }
          } catch {
            // Silently resolve
          }
        }
        resolve();
      };

      audio.play().catch(() => resolve());
    });
  }, [audioEnabled]);

  /**
   * Narrates an array of segments with eager preloading of upcoming segments
   * to eliminate latency gaps between sentences.
   */
  const narrate = useCallback(async (segments) => {
    if (!segments || !segments.length || !audioEnabled) return;

    stopAll();
    const currentId = ++narrateIdRef.current;
    playingRef.current = true;

    for (let i = 0; i < segments.length; i++) {
      if (narrateIdRef.current !== currentId) break;

      const currentSeg = segments[i];

      // Eagerly preload the NEXT segment while this segment is preparing / playing
      if (i + 1 < segments.length) {
        const nextSeg = segments[i + 1];
        getAudioUrl(nextSeg.text, nextSeg.style).catch(() => {});
      }

      const url = await getAudioUrl(currentSeg.text, currentSeg.style);
      if (narrateIdRef.current !== currentId) break;

      if (url) {
        await playUrlWithFallback(url, currentSeg.text, currentSeg.style, currentId);
      } else {
        // No audio available, small pause for text pacing
        await new Promise((r) => setTimeout(r, 200));
      }

      if (narrateIdRef.current !== currentId) break;
      await new Promise((r) => setTimeout(r, 120));
    }

    if (narrateIdRef.current === currentId) {
      playingRef.current = false;
    }
  }, [audioEnabled, stopAll, getAudioUrl, playUrlWithFallback]);

  // Tone-based sound synthesizer for instant zero-latency feedback
  const playTone = useCallback((frequencies, durations) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let offset = 0;
      frequencies.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.22, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.2);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.2);
        offset += (durations[i] || 150) / 1000;
      });
    } catch { /* ignore WebAudio errors */ }
  }, [audioEnabled]);

  const sounds = {
    correct: () => playTone([880, 1100, 1320], [100, 100, 180]),
    wrong:   () => playTone([220, 180], [180, 200]),
    badge:   () => playTone([523, 659, 784, 1047], [90, 90, 90, 240]),
    streak:  () => playTone([440, 880, 1100], [70, 70, 180]),
    levelUp: () => playTone([523, 659, 784, 1047, 1319], [60, 60, 60, 60, 250]),
    click:   () => playTone([440], [50]),
    defeat:  () => playTone([300, 240, 180], [120, 120, 250]),
  };

  return {
    narrate,
    stopAll,
    sounds,
    say:       (text) => ({ text, style: 'statement' }),
    ask:       (text) => ({ text, style: 'question' }),
    cheer:     (text) => ({ text, style: 'celebration' }),
    celebrate: (text) => ({ text, style: 'celebration' }),
    emphasize: (text) => ({ text, style: 'emphasis' }),
    think:     (text) => ({ text, style: 'thinking' }),
    instruct:  (text) => ({ text, style: 'instruction' }),
    encourage: (text) => ({ text, style: 'encouragement' }),
  };
}

export default useAudio;
