'use client';

import { motion } from 'framer-motion';
import type { BandType } from '@/types';

interface FrequencyMemoryProps {
  memories: number[];
  band: BandType;
  currentFrequency: number;
  isPowered: boolean;
  onJump: (freq: number) => void;
  onRemove: (freq: number) => void;
}

export function FrequencyMemory({
  memories, band, currentFrequency, isPowered, onJump, onRemove,
}: FrequencyMemoryProps) {
  const unit = band === 'FM' ? 'MHz' : 'kHz';

  return (
    <div className="p-3 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-[#444] uppercase tracking-widest">
          Frequency Memory
        </span>
        <span className="text-[9px] font-mono text-[#222]">{memories.length}/20</span>
      </div>

      {memories.length === 0 ? (
        <div className="text-[9px] font-mono text-[#222] text-center py-3">
          No frequencies saved
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {memories.map((freq) => {
            const isActive = freq === currentFrequency;
            return (
              <motion.div
                key={freq}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex items-center gap-1 px-2 py-1 rounded border text-[9px] font-mono ${
                  isActive
                    ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                    : 'border-[#1e1e1e] text-[#444]'
                }`}
              >
                <button
                  disabled={!isPowered}
                  onClick={() => onJump(freq)}
                  className="hover:text-[#00ff88] transition-colors disabled:cursor-not-allowed"
                >
                  {band === 'FM' ? freq.toFixed(1) : freq.toFixed(0)} {unit}
                </button>
                <button
                  onClick={() => onRemove(freq)}
                  className="text-[#222] hover:text-[#ff3333] transition-colors ml-0.5"
                >
                  ×
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
