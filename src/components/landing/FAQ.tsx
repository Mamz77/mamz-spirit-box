'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Is this a real Spirit Box?',
    a: 'Mamz Spirit Box is a browser-based simulation that authentically recreates how real Spirit Box devices work — rapid frequency sweeping, static noise, radio interference, and signal detection — using the Web Audio API. It does not connect to actual radio broadcasts.',
  },
  {
    q: 'What is a Spirit Box?',
    a: "A Spirit Box (or Ghost Box) is an AM/FM radio modified to continuously sweep through frequencies, creating an audio stream of fragments that paranormal investigators analyze for potential EVP (Electronic Voice Phenomena). They're standard equipment in serious paranormal research.",
  },
  {
    q: 'How does the audio engine work?',
    a: 'The Web Audio API powers a real DSP chain: a pink noise generator, band-pass and high-pass filters, wave shaper distortion, and dynamic compression. At each frequency step, the engine generates appropriate audio artifacts including radio-like fragments and interference.',
  },
  {
    q: 'Can I use my microphone?',
    a: "Yes. Enable the mic input to capture ambient audio alongside the Spirit Box sweep. Your browser will ask for microphone permission. Mic audio is visualized separately in the spectrum analyzer and can be included in EVP session exports.",
  },
  {
    q: 'Are investigation sessions stored?',
    a: 'Sessions are stored locally in your browser via localStorage. Export as JSON (full data) or TXT (investigation report) for permanent records. Sessions are never sent to a server.',
  },
  {
    q: 'Does the AI analysis claim paranormal activity?',
    a: 'Never. The analysis uses strictly neutral, scientific language: "audio anomaly detected", "speech-like pattern observed", "unusual frequency activity". It generates investigation summaries without making paranormal claims.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 border-t border-[#1e1e1e]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-[10px] font-mono text-[#444] uppercase tracking-[0.4em] mb-4">
            Reference
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#e8e8e8]"
            style={{ fontFamily: '"Orbitron", monospace' }}
          >
            FAQ
          </h2>
        </motion.div>

        <div className="flex flex-col gap-1">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border border-[#1e1e1e] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm text-[#e8e8e8] font-mono hover:bg-[#0a0a0a] transition-colors"
              >
                <span>{faq.q}</span>
                <span
                  className="text-[#00ff88] ml-4 shrink-0 transition-transform duration-200"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-xs text-[#444] leading-relaxed border-t border-[#1e1e1e] pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
