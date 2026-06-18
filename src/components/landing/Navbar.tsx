'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md border-b border-[#1e1e1e]' : ''
      }`}
    >
      <Link href="/" className="flex items-center gap-2">
        <span
          className="text-sm font-bold text-[#00ff88]"
          style={{ fontFamily: '"Orbitron", monospace', textShadow: '0 0 10px rgba(0,255,136,0.4)' }}
        >
          Mamz Spirit Box
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-5">
          {['Features', 'How It Works', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-[10px] font-mono text-[#444] uppercase tracking-widest hover:text-[#888] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <Link
          href="/app"
          className="px-4 py-2 rounded border border-[#00ff88]/40 text-[#00ff88] text-[10px] font-mono uppercase tracking-wider hover:bg-[#00ff88]/10 transition-all"
        >
          Launch App
        </Link>
      </div>
    </motion.nav>
  );
}
