'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { micEngine } from '@/lib/audio/MicrophoneEngine';

interface AudioVizState {
  waveform: Uint8Array;
  frequency: Uint8Array;
  micWaveform: Uint8Array;
  micLevel: number;
}

export function useAudioVisualization(active: boolean, micActive: boolean) {
  const rafRef = useRef<number>(0);
  const [vizData, setVizData] = useState<AudioVizState>({
    waveform: new Uint8Array(128),
    frequency: new Uint8Array(128),
    micWaveform: new Uint8Array(128),
    micLevel: 0,
  });

  const tick = useCallback(() => {
    if (!active) return;
    const { waveform, frequency } = audioEngine.getAnalyserData();
    const micWaveform = micActive ? micEngine.getWaveform() : new Uint8Array(128);
    const micLevel = micActive ? micEngine.getNoiseLevel() : 0;

    setVizData({ waveform, frequency, micWaveform, micLevel });
    rafRef.current = requestAnimationFrame(tick);
  }, [active, micActive]);

  useEffect(() => {
    if (active) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, tick]);

  return vizData;
}
