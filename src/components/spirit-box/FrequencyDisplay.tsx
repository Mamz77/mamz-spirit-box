'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { BandType } from '@/types';

interface FrequencyDisplayProps {
  frequency: number;
  band: BandType;
  isScanning: boolean;
  isPowered: boolean;
}

export function FrequencyDisplay({ frequency, band, isScanning, isPowered }: FrequencyDisplayProps) {
  const formatted = band === 'FM'
    ? frequency.toFixed(1)
    : frequency.toFixed(0);

  const unit = band === 'FM' ? 'MHz' : 'kHz';

  return (
    <div className="relative flex flex-col items-center justify-center py-6 px-4 bg-black border border-[#1e1e1e] rounded-lg overflow-hidden">
      {/* CRT scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)',
        }}
      />

      {/* Scan line animation */}
      {isScanning && (
        <motion.div
          className="absolute inset-0 h-0.5 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-40"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Band indicator */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`text-xs font-mono font-bold px-2 py-0.5 border rounded ${
            band === 'FM'
              ? 'text-[#00ff88] border-[#00ff88]/40 bg-[#00ff88]/10'
              : 'text-[#ffb300] border-[#ffb300]/40 bg-[#ffb300]/10'
          }`}
        >
          {band}
        </div>
        {isScanning && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-xs font-mono text-[#00ff88]"
          >
            SCANNING
          </motion.div>
        )}
      </div>

      {/* Main frequency readout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isPowered ? frequency : 'off'}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.06 }}
          className="relative"
        >
          {isPowered ? (
            <span
              className="text-5xl font-mono font-bold tracking-widest"
              style={{
                color: '#00ff88',
                textShadow: '0 0 20px rgba(0,255,136,0.6), 0 0 40px rgba(0,255,136,0.3)',
                fontFamily: '"JetBrains Mono", "Courier New", monospace',
              }}
            >
              {formatted}
            </span>
          ) : (
            <span
              className="text-5xl font-mono font-bold tracking-widest text-[#1e1e1e]"
              style={{ fontFamily: '"JetBrains Mono", "Courier New", monospace' }}
            >
              ---.--
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Unit */}
      <div className={`mt-1 text-sm font-mono font-bold ${isPowered ? 'text-[#444]' : 'text-[#222]'}`}>
        {unit}
      </div>
    </div>
  );
}
