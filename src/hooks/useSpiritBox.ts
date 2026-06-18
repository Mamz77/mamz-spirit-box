'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSpiritBoxStore } from '@/store/spiritBoxStore';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { sweepEngine } from '@/lib/audio/SweepEngine';
import { micEngine } from '@/lib/audio/MicrophoneEngine';

export function useSpiritBox() {
  const store = useSpiritBoxStore();
  const audioReady = useRef(false);

  const initAudio = useCallback(async () => {
    if (audioReady.current) {
      await audioEngine.resume();
      return;
    }
    await audioEngine.initialize();
    audioReady.current = true;
  }, []);

  const togglePower = useCallback(async () => {
    await initAudio();
    const next = !store.isPowered;
    store.setPower(next);
    if (!next) {
      sweepEngine.stop();
      store.setScanning(false);
    } else {
      audioEngine.setFilterForBand(store.band);
      audioEngine.setVolume(store.volume);
    }
  }, [store, initAudio]);

  const toggleScan = useCallback(async () => {
    if (!store.isPowered) return;
    await audioEngine.resume();

    if (store.isScanning) {
      sweepEngine.stop();
      store.setScanning(false);
    } else {
      store.setScanning(true);
      sweepEngine.start(
        {
          band: store.band,
          speed: store.sweepSpeed,
          reverse: store.reverseMode,
          hold: store.holdMode,
          onFrequencyChange: (freq) => store.setFrequency(freq),
          onSignalUpdate: (strength, staticLevel) => {
            store.updateSignal({ strength, staticLevel, quality: strength * 0.8 });
          },
          onAnomalyDetected: (freq, strength) => {
            if (store.sessionActive) {
              store.addEvent({
                frequency: freq,
                band: store.band,
                type: strength > 80 ? 'speech-pattern' : 'audio-anomaly',
                description:
                  strength > 80
                    ? 'Speech-like pattern observed at this frequency'
                    : 'Unusual audio anomaly detected during sweep',
                signalStrength: strength,
              });
            }
          },
        },
        store.currentFrequency
      );
    }
  }, [store]);

  const toggleMic = useCallback(async () => {
    if (!store.micEnabled) {
      try {
        await micEngine.start();
        store.setMicEnabled(true);
      } catch {
        console.error('Microphone access denied');
      }
    } else {
      micEngine.stop();
      store.setMicEnabled(false);
    }
  }, [store]);

  // Sync volume to audio engine
  useEffect(() => {
    if (audioReady.current) {
      audioEngine.setVolume(store.isPowered ? store.volume : 0);
    }
  }, [store.volume, store.isPowered]);

  // Sync band filter
  useEffect(() => {
    if (audioReady.current) {
      audioEngine.setFilterForBand(store.band);
    }
  }, [store.band]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sweepEngine.stop();
      micEngine.stop();
    };
  }, []);

  return {
    ...store,
    togglePower,
    toggleScan,
    toggleMic,
    initAudio,
  };
}
