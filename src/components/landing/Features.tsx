'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '📡',
    title: 'Real RF Sweep Simulation',
    desc: 'Authentic FM (87.5–108 MHz) and AM (530–1710 kHz) frequency sweeping with adjustable scan speed, reverse mode, and frequency hold.',
    color: '#00ff88',
  },
  {
    icon: '🎛️',
    title: 'Advanced Web Audio DSP',
    desc: 'Full Web Audio API signal chain: pink noise generator, band-pass filters, dynamic compressor, wave shaper distortion, and gain automation.',
    color: '#00d4ff',
  },
  {
    icon: '📊',
    title: 'Spectrum Analyzer',
    desc: 'Real-time FFT visualization showing frequency energy distribution, waveform overlay, and microphone input — exactly like professional RF equipment.',
    color: '#ffb300',
  },
  {
    icon: '🎙️',
    title: 'EVP Recording System',
    desc: 'Capture investigation sessions with timestamped event logging, anomaly detection, marker placement, and export to JSON or TXT reports.',
    color: '#ff3333',
  },
  {
    icon: '💾',
    title: 'Frequency Memory',
    desc: 'Save up to 20 significant frequencies for rapid recall. One-tap jump between saved channels with visual active indicator.',
    color: '#00ff88',
  },
  {
    icon: '📱',
    title: 'PWA — Works Offline',
    desc: 'Install on Android or desktop. Full offline capability via Service Worker caching. No internet required once installed.',
    color: '#00d4ff',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-[10px] font-mono text-[#444] uppercase tracking-[0.4em] mb-4">
            Capabilities
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#e8e8e8]"
            style={{ fontFamily: '"Orbitron", monospace' }}
          >
            Professional Grade Features
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] hover:border-[#2a2a2a] transition-colors group"
            >
              <div className="text-2xl mb-3">{feat.icon}</div>
              <h3
                className="text-sm font-bold mb-2 transition-colors group-hover:text-[#e8e8e8]"
                style={{ color: feat.color, fontFamily: '"Orbitron", monospace', fontSize: '0.75rem' }}
              >
                {feat.title}
              </h3>
              <p className="text-[#444] text-xs leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
