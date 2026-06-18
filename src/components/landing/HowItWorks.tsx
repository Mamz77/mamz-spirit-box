'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Power On',
    desc: 'Tap the power button to initialize the Web Audio API engine. The device boots like real equipment — signal chain, filters, noise floor.',
  },
  {
    num: '02',
    title: 'Select Band & Speed',
    desc: 'Choose FM or AM band. Set sweep speed from 50ms (fast) to 2000ms (slow). Enable reverse mode for bidirectional scanning.',
  },
  {
    num: '03',
    title: 'Start Scan',
    desc: 'The sweep engine rapidly steps through frequencies. Audio fragments, static, and interference are mixed through the DSP chain in real-time.',
  },
  {
    num: '04',
    title: 'Start EVP Session',
    desc: 'Begin a session to automatically log audio anomalies. Add location notes, place markers at significant moments, enable microphone input.',
  },
  {
    num: '05',
    title: 'Review & Export',
    desc: 'Stop the session to generate a full investigation report. Export as JSON for analysis or TXT for documentation.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 border-t border-[#1e1e1e]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-[10px] font-mono text-[#444] uppercase tracking-[0.4em] mb-4">
            Workflow
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#e8e8e8]"
            style={{ fontFamily: '"Orbitron", monospace' }}
          >
            How It Works
          </h2>
        </motion.div>

        <div className="flex flex-col gap-px">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 p-5 border border-[#1e1e1e] bg-[#0a0a0a] first:rounded-t-xl last:rounded-b-xl hover:border-[#2a2a2a] transition-colors"
            >
              <div
                className="text-3xl font-bold font-mono shrink-0 leading-none"
                style={{
                  color: '#00ff88',
                  textShadow: '0 0 20px rgba(0,255,136,0.3)',
                  fontFamily: '"Orbitron", monospace',
                }}
              >
                {step.num}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#e8e8e8] mb-1.5" style={{ fontFamily: '"Orbitron", monospace' }}>
                  {step.title}
                </h3>
                <p className="text-[#444] text-xs leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
