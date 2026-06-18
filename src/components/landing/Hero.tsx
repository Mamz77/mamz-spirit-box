'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16">
      {/* Radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,136,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,136,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/5"
        >
          <span className="text-[#00ff88] text-xs font-mono">Professional Paranormal Investigation Tool</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold mb-4 leading-tight tracking-tight"
          style={{
            fontFamily: '"Orbitron", monospace',
            color: '#e8e8e8',
          }}
        >
          Mamz{' '}
          <span
            style={{
              color: '#00ff88',
              textShadow: '0 0 30px rgba(0,255,136,0.5)',
            }}
          >
            Spirit Box
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[#888] text-lg max-w-xl mb-10 leading-relaxed"
        >
          The most realistic browser-based Spirit Box. Real RF sweep simulation,
          advanced Web Audio DSP, EVP session recording — no special hardware required.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-mono font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: '#00ff88',
              color: '#000',
              boxShadow: '0 0 30px rgba(0,255,136,0.4)',
            }}
          >
            Launch Spirit Box
          </Link>
          <a
            href="https://github.com/mamadshirali/mamz-spirit-box"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-[#1e1e1e] text-[#888] font-mono font-bold text-sm uppercase tracking-wider hover:border-[#444] hover:text-[#ccc] transition-all duration-200"
          >
            GitHub
          </a>
        </motion.div>

        {/* Live frequency animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center gap-6 text-[#1e1e1e]"
        >
          {['87.5 MHz', '92.1 MHz', '101.7 MHz', '1040 kHz', '107.9 MHz'].map((freq, i) => (
            <motion.span
              key={freq}
              animate={{
                color: ['#1e1e1e', '#00ff88', '#1e1e1e'],
                textShadow: ['none', '0 0 10px rgba(0,255,136,0.5)', 'none'],
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.8,
                repeat: Infinity,
                repeatDelay: 4,
              }}
              className="text-xs font-mono font-bold"
            >
              {freq}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
