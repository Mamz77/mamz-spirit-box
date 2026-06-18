'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpiritBox } from '@/hooks/useSpiritBox';
import { FrequencyDisplay } from './FrequencyDisplay';
import { SignalMeter } from './SignalMeter';
import { ScanVisualization } from './ScanVisualization';
import { ControlPanel } from './ControlPanel';
import { FrequencyMemory } from './FrequencyMemory';
import { EVPPanel } from './EVPPanel';

type Tab = 'device' | 'session' | 'memory';

export function SpiritBoxDevice() {
  const box = useSpiritBox();
  const [activeTab, setActiveTab] = useState<Tab>('device');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'device', label: 'Device' },
    { id: 'session', label: 'EVP Session' },
    { id: 'memory', label: 'Memory' },
  ];

  return (
    <div className="max-w-md mx-auto w-full flex flex-col gap-3">
      {/* Device frame */}
      <div
        className="relative rounded-xl border overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)',
          borderColor: '#1e1e1e',
          boxShadow: box.isPowered
            ? '0 0 40px rgba(0,255,136,0.08), inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'inset 0 1px 0 rgba(255,255,255,0.02)',
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e1e]">
          <div>
            <div className="text-[10px] font-mono text-[#444] uppercase tracking-[0.3em]">
              Mamz Spirit Box
            </div>
            <div className="text-[8px] font-mono text-[#222] uppercase tracking-widest">
              SB-X Pro Series
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Status LEDs */}
            <div className="flex gap-1.5">
              <motion.div
                animate={box.isPowered ? { opacity: [1, 0.4, 1] } : { opacity: 0.1 }}
                transition={box.isPowered ? { duration: 2, repeat: Infinity } : {}}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#00ff88', boxShadow: box.isPowered ? '0 0 6px #00ff88' : 'none' }}
              />
              <motion.div
                animate={box.isScanning ? { opacity: [1, 0.2, 1] } : { opacity: 0.1 }}
                transition={box.isScanning ? { duration: 0.5, repeat: Infinity } : {}}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#ffb300', boxShadow: box.isScanning ? '0 0 6px #ffb300' : 'none' }}
              />
              <motion.div
                animate={box.sessionActive ? { opacity: [1, 0.2, 1] } : { opacity: 0.1 }}
                transition={box.sessionActive ? { duration: 1.2, repeat: Infinity } : {}}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#ff3333', boxShadow: box.sessionActive ? '0 0 6px #ff3333' : 'none' }}
              />
            </div>

            {/* Power button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={box.togglePower}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ${
                box.isPowered
                  ? 'border-[#00ff88] text-[#00ff88] shadow-[0_0_16px_rgba(0,255,136,0.4)]'
                  : 'border-[#1e1e1e] text-[#222] hover:border-[#444] hover:text-[#444]'
              }`}
            >
              ⏻
            </motion.button>
          </div>
        </div>

        {/* Main display area */}
        <div className="p-4 flex flex-col gap-3">
          {/* Frequency display */}
          <FrequencyDisplay
            frequency={box.currentFrequency}
            band={box.band}
            isScanning={box.isScanning}
            isPowered={box.isPowered}
          />

          {/* Signal meter */}
          <SignalMeter signal={box.signal} isPowered={box.isPowered} />

          {/* Spectrum analyzer */}
          <ScanVisualization
            isPowered={box.isPowered}
            isScanning={box.isScanning}
            micActive={box.micEnabled}
          />

          {/* Mic toggle */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={box.toggleMic}
              disabled={!box.isPowered}
              className={`text-[9px] font-mono px-3 py-1 rounded border transition-all ${
                box.micEnabled
                  ? 'border-[#ffb300] text-[#ffb300] bg-[#ffb300]/10'
                  : 'border-[#1e1e1e] text-[#222] hover:border-[#444] hover:text-[#444]'
              } disabled:opacity-20 disabled:cursor-not-allowed`}
            >
              {box.micEnabled ? '● MIC ON' : '○ MIC OFF'}
            </button>
            <div className="text-[8px] font-mono text-[#222]">
              {box.isPowered
                ? `${box.band} · ${box.currentFrequency}${box.band === 'FM' ? ' MHz' : ' kHz'}`
                : 'STANDBY'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-[#1e1e1e] rounded-lg overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-[9px] font-mono uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-[#111] text-[#00ff88] border-b border-[#00ff88]/60'
                : 'bg-[#0a0a0a] text-[#444] hover:text-[#888]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'device' && (
        <ControlPanel
          isPowered={box.isPowered}
          isScanning={box.isScanning}
          band={box.band}
          sweepSpeed={box.sweepSpeed}
          reverseMode={box.reverseMode}
          holdMode={box.holdMode}
          scanMode={box.scanMode}
          volume={box.volume}
          squelch={box.squelch}
          onToggleScan={box.toggleScan}
          onBandChange={box.setBand}
          onSpeedChange={box.setSweepSpeed}
          onToggleReverse={box.toggleReverse}
          onToggleHold={box.toggleHold}
          onVolumeChange={box.setVolume}
          onSquelchChange={box.setSquelch}
          onSaveFrequency={box.saveFrequency}
        />
      )}

      {activeTab === 'session' && (
        <EVPPanel
          sessionActive={box.sessionActive}
          currentSession={box.currentSession}
          allSessions={box.allSessions}
          onStartSession={box.startSession}
          onStopSession={box.stopSession}
          onAddMarker={box.addMarker}
          onDeleteSession={box.deleteSession}
        />
      )}

      {activeTab === 'memory' && (
        <FrequencyMemory
          memories={box.frequencyMemory}
          band={box.band}
          currentFrequency={box.currentFrequency}
          isPowered={box.isPowered}
          onJump={box.jumpToMemory}
          onRemove={box.removeMemory}
        />
      )}
    </div>
  );
}
