import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span
            className="text-sm font-bold text-[#00ff88]"
            style={{ fontFamily: '"Orbitron", monospace' }}
          >
            Mamz Spirit Box
          </span>
          <span className="text-[10px] font-mono text-[#222]">
            Created by Mamad Shirali
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://t.me/Mamd_shirali"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#1e1e1e] text-[#444] text-[10px] font-mono uppercase tracking-wider hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
          >
            Telegram
          </a>
          <a
            href="https://github.com/mamadshirali/mamz-spirit-box"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#1e1e1e] text-[#444] text-[10px] font-mono uppercase tracking-wider hover:border-[#888] hover:text-[#888] transition-all"
          >
            GitHub
          </a>
          <Link
            href="/app"
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#00ff88]/40 text-[#00ff88] text-[10px] font-mono uppercase tracking-wider hover:bg-[#00ff88]/10 transition-all"
          >
            Launch App
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-[8px] font-mono text-[#111]">
        Mamz Spirit Box · All investigation data stored locally · No paranormal claims made · Browser-based simulation only
      </div>
    </footer>
  );
}
