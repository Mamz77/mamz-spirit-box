'use client';

import { audioEngine } from './AudioEngine';
import type { BandType } from '@/types';

interface SweepConfig {
  band: BandType;
  speed: number;
  reverse: boolean;
  hold: boolean;
  onFrequencyChange: (freq: number) => void;
  onSignalUpdate: (strength: number, staticLevel: number) => void;
  onAnomalyDetected: (freq: number, strength: number) => void;
}

export class SweepEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private config: SweepConfig | null = null;
  private isRunning = false;
  private anomalyThreshold = 70;
  private lastAnomalyTime = 0;

  private getRange(band: BandType) {
    return band === 'FM'
      ? { min: 87.5, max: 108.0, step: 0.1 }
      : { min: 530, max: 1710, step: 10 };
  }

  private roundFreq(freq: number, band: BandType): number {
    if (band === 'FM') return Math.round(freq * 10) / 10;
    return Math.round(freq / 10) * 10;
  }

  start(config: SweepConfig, currentFreq: number): void {
    this.stop();
    this.config = config;
    this.isRunning = true;
    let freq = currentFreq;

    this.intervalId = setInterval(() => {
      if (!this.config || this.config.hold) return;

      const range = this.getRange(this.config.band);

      // Step frequency
      const dir = this.config.reverse ? -1 : 1;
      freq += range.step * dir;
      if (freq > range.max) freq = range.min;
      if (freq < range.min) freq = range.max;
      freq = this.roundFreq(freq, this.config.band);

      // Play sweep audio
      audioEngine.playSweepTransition();

      // Simulate signal activity
      const baseNoise = 0.3 + Math.random() * 0.4;
      const signalBurst = Math.random() < 0.15; // 15% chance of signal burst
      const strength = signalBurst ? 40 + Math.random() * 55 : Math.random() * 35;
      const staticLevel = 60 + Math.random() * 40;

      // Play radio fragment on signal burst
      if (signalBurst) {
        const fragmentDuration = 0.05 + Math.random() * 0.15;
        audioEngine.playRadioFragment(freq, this.config.band, fragmentDuration);
        audioEngine.setNoiseLevel(0.2 + Math.random() * 0.3);
        audioEngine.setRadioLevel(0.3 + Math.random() * 0.5);
      } else {
        audioEngine.setNoiseLevel(baseNoise);
        audioEngine.setRadioLevel(0.05);
      }

      this.config.onFrequencyChange(freq);
      this.config.onSignalUpdate(strength, staticLevel);

      // Anomaly detection
      if (strength > this.anomalyThreshold && Date.now() - this.lastAnomalyTime > 3000) {
        this.lastAnomalyTime = Date.now();
        this.config.onAnomalyDetected(freq, strength);
      }
    }, config.speed);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    audioEngine.setNoiseLevel(0.6);
    audioEngine.setRadioLevel(0);
  }

  updateSpeed(speed: number): void {
    if (!this.isRunning || !this.config) return;
    this.config.speed = speed;
    // Restart with new speed
    const currentConfig = { ...this.config };
    this.stop();
    // Get current frequency from store
    this.start(currentConfig, 87.5);
  }

  get running(): boolean {
    return this.isRunning;
  }
}

export const sweepEngine = new SweepEngine();
