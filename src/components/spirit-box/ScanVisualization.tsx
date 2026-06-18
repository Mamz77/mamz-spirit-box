'use client';

import { useEffect, useRef } from 'react';
import { useAudioVisualization } from '@/hooks/useAudioVisualization';

interface ScanVisualizationProps {
  isPowered: boolean;
  isScanning: boolean;
  micActive: boolean;
}

export function ScanVisualization({ isPowered, isScanning, micActive }: ScanVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizData = useAudioVisualization(isPowered, micActive);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!isPowered) {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#1e1e1e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      return;
    }

    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,255,136,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (H / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Frequency spectrum
    const freqData = isScanning ? vizData.frequency : new Uint8Array(128).fill(20);
    const barWidth = W / freqData.length;
    for (let i = 0; i < freqData.length; i++) {
      const barH = (freqData[i] / 255) * H;
      const pct = i / freqData.length;
      const r = pct < 0.5 ? 0 : Math.round(pct * 255);
      const g = pct < 0.5 ? 255 : Math.round((1 - pct) * 255);
      ctx.fillStyle = `rgba(${r},${g},136,0.6)`;
      ctx.fillRect(i * barWidth, H - barH, barWidth - 1, barH);
    }

    // Waveform overlay
    if (isScanning && vizData.waveform.length > 0) {
      ctx.strokeStyle = 'rgba(0,255,136,0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const sliceWidth = W / vizData.waveform.length;
      let x = 0;
      for (let i = 0; i < vizData.waveform.length; i++) {
        const v = vizData.waveform[i] / 128;
        const y = (v * H) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    }

    // Mic waveform
    if (micActive && vizData.micWaveform.length > 0) {
      ctx.strokeStyle = 'rgba(255,179,0,0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const sliceWidth = W / vizData.micWaveform.length;
      let x = 0;
      for (let i = 0; i < vizData.micWaveform.length; i++) {
        const v = vizData.micWaveform[i] / 128;
        const y = (v * H) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    }
  }, [vizData, isPowered, isScanning, micActive]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-[#1e1e1e] bg-black">
      <div className="absolute top-2 left-3 text-[9px] font-mono text-[#444] uppercase tracking-widest z-10">
        Spectrum Analyzer
      </div>
      {micActive && (
        <div className="absolute top-2 right-3 text-[9px] font-mono text-[#ffb300] uppercase tracking-widest z-10">
          ● MIC
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={512}
        height={80}
        className="w-full h-20 block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
