'use client';

import { motion } from 'framer-motion';
import type { SignalMetrics } from '@/types';

interface SignalMeterProps {
  signal: SignalMetrics;
  isPowered: boolean;
}

const LED_COUNT = 12;

function getColorForLevel(index: number, total: number): string {
  const pct = index / total;
  if (pct < 0.5) return '#00ff88';
  if (pct < 0.75) return '#ffb300';
  return '#ff3333';
}

export function SignalMeter({ signal, isPowered }: SignalMeterProps) {
  const activeLeds = isPowered ? Math.round((signal.strength / 100) * LED_COUNT) : 0;

  return (
    <div className="flex flex-col gap-3 p-3 bg-black border border-[#1e1e1e] rounded-lg">
      {/* Signal Strength */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">Signal</span>
          <span className="text-[10px] font-mono text-[#00ff88]">
            {isPowered ? `${signal.strength.toFixed(0)}%` : '---'}
          </span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: LED_COUNT }).map((_, i) => {
            const active = i < activeLeds;
            const color = getColorForLevel(i, LED_COUNT);
            return (
              <motion.div
                key={i}
                animate={active ? { opacity: 1 } : { opacity: 0.1 }}
                transition={{ duration: 0.05 }}
                style={{
                  flex: 1,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: active ? color : '#111',
                  boxShadow: active ? `0 0 6px ${color}` : 'none',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Static Level */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">Static</span>
          <span className="text-[10px] font-mono text-[#ffb300]">
            {isPowered ? `${signal.staticLevel.toFixed(0)}%` : '---'}
          </span>
        </div>
        <div className="relative h-2 bg-[#0a0a0a] border border-[#1e1e1e] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: isPowered ? `${signal.staticLevel}%` : '0%' }}
            transition={{ duration: 0.05 }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: '#ffb300', boxShadow: '0 0 8px rgba(255,179,0,0.5)' }}
          />
        </div>
      </div>

      {/* Quality */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">Quality</span>
          <span className="text-[10px] font-mono text-[#00d4ff]">
            {isPowered ? `${signal.quality.toFixed(0)}%` : '---'}
          </span>
        </div>
        <div className="relative h-2 bg-[#0a0a0a] border border-[#1e1e1e] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: isPowered ? `${signal.quality}%` : '0%' }}
            transition={{ duration: 0.1 }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: '#00d4ff', boxShadow: '0 0 8px rgba(0,212,255,0.5)' }}
          />
        </div>
      </div>
    </div>
  );
}
