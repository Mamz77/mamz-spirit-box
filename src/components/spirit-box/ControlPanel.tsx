'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { BandType, ScanMode } from '@/types';

interface ControlPanelProps {
  isPowered: boolean;
  isScanning: boolean;
  band: BandType;
  sweepSpeed: number;
  reverseMode: boolean;
  holdMode: boolean;
  scanMode: ScanMode;
  volume: number;
  squelch: number;
  onToggleScan: () => void;
  onBandChange: (band: BandType) => void;
  onSpeedChange: (speed: number) => void;
  onToggleReverse: () => void;
  onToggleHold: () => void;
  onVolumeChange: (vol: number) => void;
  onSquelchChange: (sq: number) => void;
  onSaveFrequency: () => void;
}

interface ButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  color?: 'green' | 'amber' | 'red' | 'cyan';
  size?: 'sm' | 'md';
}

function CtrlButton({ label, active, onClick, disabled, color = 'green', size = 'md' }: ButtonProps) {
  const colors = {
    green: active
      ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_12px_rgba(0,255,136,0.3)]'
      : 'border-[#1e1e1e] text-[#444] hover:border-[#00ff88]/40 hover:text-[#00ff88]/60',
    amber: active
      ? 'border-[#ffb300] text-[#ffb300] bg-[#ffb300]/10 shadow-[0_0_12px_rgba(255,179,0,0.3)]'
      : 'border-[#1e1e1e] text-[#444] hover:border-[#ffb300]/40 hover:text-[#ffb300]/60',
    red: active
      ? 'border-[#ff3333] text-[#ff3333] bg-[#ff3333]/10 shadow-[0_0_12px_rgba(255,51,51,0.3)]'
      : 'border-[#1e1e1e] text-[#444] hover:border-[#ff3333]/40 hover:text-[#ff3333]/60',
    cyan: active
      ? 'border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10 shadow-[0_0_12px_rgba(0,212,255,0.3)]'
      : 'border-[#1e1e1e] text-[#444] hover:border-[#00d4ff]/40 hover:text-[#00d4ff]/60',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border rounded font-mono uppercase tracking-wider transition-all duration-150 select-none',
        size === 'sm' ? 'text-[9px] px-2 py-1' : 'text-[10px] px-3 py-1.5',
        colors[color],
        disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
      )}
    >
      {label}
    </motion.button>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  color?: string;
  unit?: string;
}

function CtrlSlider({ label, value, min, max, step = 1, onChange, disabled, color = '#00ff88', unit }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-mono text-[#444] uppercase tracking-widest">{label}</span>
        <span className="text-[9px] font-mono" style={{ color }}>
          {typeof value === 'number' && unit ? `${value}${unit}` : value}
        </span>
      </div>
      <div className="relative h-1.5 bg-[#111] border border-[#1e1e1e] rounded-full">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}50` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

export function ControlPanel({
  isPowered, isScanning, band, sweepSpeed, reverseMode, holdMode,
  volume, squelch, onToggleScan, onBandChange, onSpeedChange,
  onToggleReverse, onToggleHold, onVolumeChange, onSquelchChange, onSaveFrequency,
}: ControlPanelProps) {
  const disabled = !isPowered;

  return (
    <div className="grid grid-cols-1 gap-3 p-3 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg">
      {/* Scan control row */}
      <div className="flex flex-wrap gap-2 items-center">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onToggleScan}
          disabled={disabled}
          className={cn(
            'flex-1 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-widest border transition-all duration-150',
            isScanning
              ? 'border-[#ff3333] text-[#ff3333] bg-[#ff3333]/10 shadow-[0_0_16px_rgba(255,51,51,0.3)]'
              : 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_16px_rgba(0,255,136,0.2)]',
            disabled && 'opacity-30 cursor-not-allowed'
          )}
        >
          {isScanning ? '■ Stop Scan' : '▶ Start Scan'}
        </motion.button>
      </div>

      {/* Band selector */}
      <div>
        <div className="text-[9px] font-mono text-[#444] uppercase tracking-widest mb-1.5">Band</div>
        <div className="flex gap-2">
          <CtrlButton label="FM" active={band === 'FM'} onClick={() => onBandChange('FM')} disabled={disabled} color="green" />
          <CtrlButton label="AM" active={band === 'AM'} onClick={() => onBandChange('AM')} disabled={disabled} color="amber" />
        </div>
      </div>

      {/* Sweep speed */}
      <CtrlSlider
        label="Sweep Speed"
        value={sweepSpeed}
        min={50}
        max={2000}
        step={50}
        onChange={onSpeedChange}
        disabled={disabled}
        color="#00d4ff"
        unit="ms"
      />

      {/* Volume & squelch */}
      <CtrlSlider
        label="Volume"
        value={Math.round(volume * 100)}
        min={0}
        max={100}
        onChange={(v) => onVolumeChange(v / 100)}
        disabled={disabled}
        color="#00ff88"
        unit="%"
      />
      <CtrlSlider
        label="Squelch"
        value={squelch}
        min={0}
        max={100}
        onChange={onSquelchChange}
        disabled={disabled}
        color="#ffb300"
        unit="%"
      />

      {/* Mode buttons */}
      <div>
        <div className="text-[9px] font-mono text-[#444] uppercase tracking-widest mb-1.5">Modes</div>
        <div className="flex flex-wrap gap-2">
          <CtrlButton label="REV" active={reverseMode} onClick={onToggleReverse} disabled={disabled} color="amber" size="sm" />
          <CtrlButton label="HOLD" active={holdMode} onClick={onToggleHold} disabled={disabled} color="cyan" size="sm" />
          <CtrlButton label="SAVE FREQ" onClick={onSaveFrequency} disabled={disabled} color="green" size="sm" />
        </div>
      </div>
    </div>
  );
}
