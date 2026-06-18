'use client';

import Link from 'next/link';
import { SpiritBoxDevice } from '@/components/spirit-box/SpiritBoxDevice';

export function AppClient() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* App top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] bg-[#050505]">
        <Link
          href="/"
          className="text-[10px] font-mono text-[#222] hover:text-[#444] transition-colors uppercase tracking-widest"
        >
          ← Back
        </Link>
        <span
          className="text-[10px] font-mono font-bold text-[#00ff88]"
          style={{ fontFamily: '"Orbitron", monospace' }}
        >
          Mamz Spirit Box
        </span>
        <span className="text-[8px] font-mono text-[#111] uppercase tracking-widest">
          SB-X Pro
        </span>
      </div>

      {/* Device */}
      <div className="flex-1 flex items-start justify-center p-4 overflow-y-auto">
        <SpiritBoxDevice />
      </div>

      {/* Bottom bar */}
      <div className="px-4 py-2 border-t border-[#1e1e1e] bg-[#050505] flex items-center justify-center gap-6">
        <span className="text-[7px] font-mono text-[#111] uppercase tracking-widest">
          Created by Mamad Shirali
        </span>
        <a
          href="https://t.me/Mamd_shirali"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[7px] font-mono text-[#111] hover:text-[#222] transition-colors uppercase tracking-widest"
        >
          t.me/Mamd_shirali
        </a>
      </div>
    </div>
  );
}
