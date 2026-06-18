'use client';

import type { NoiseType, BandType } from '@/types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private radioGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private filterBank: {
    lowPass: BiquadFilterNode | null;
    highPass: BiquadFilterNode | null;
    bandPass: BiquadFilterNode | null;
  } = { lowPass: null, highPass: null, bandPass: null };
  private distortion: WaveShaperNode | null = null;
  private sweepOscillator: OscillatorNode | null = null;
  private isInitialized = false;
  private sweepInterval: ReturnType<typeof setInterval> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.ctx = new AudioContext({ sampleRate: 44100, latencyHint: 'interactive' });
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    // Master chain
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    // Radio gain
    this.radioGain = this.ctx.createGain();
    this.radioGain.gain.value = 0;

    // Noise gain
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.value = 0.6;

    // Filter bank
    this.filterBank.bandPass = this.ctx.createBiquadFilter();
    this.filterBank.bandPass.type = 'bandpass';
    this.filterBank.bandPass.frequency.value = 3000;
    this.filterBank.bandPass.Q.value = 0.5;

    this.filterBank.highPass = this.ctx.createBiquadFilter();
    this.filterBank.highPass.type = 'highpass';
    this.filterBank.highPass.frequency.value = 300;

    this.filterBank.lowPass = this.ctx.createBiquadFilter();
    this.filterBank.lowPass.type = 'lowpass';
    this.filterBank.lowPass.frequency.value = 8000;

    // Distortion for radio effect
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(200) as any;
    this.distortion.oversample = '4x';

    // Connect: noise -> noiseGain -> bandPass -> highPass -> lowPass -> distortion -> compressor -> masterGain -> analyser -> dest
    this.noiseGain.connect(this.filterBank.bandPass!);
    this.filterBank.bandPass!.connect(this.filterBank.highPass!);
    this.filterBank.highPass!.connect(this.filterBank.lowPass!);
    this.filterBank.lowPass!.connect(this.distortion!);
    this.distortion!.connect(this.compressor!);

    // Radio also goes through compressor
    this.radioGain.connect(this.compressor!);

    this.compressor.connect(this.masterGain!);
    this.masterGain.connect(this.analyser!);
    this.analyser.connect(this.ctx.destination);

    // Generate noise buffer
    this.noiseBuffer = this.generateNoiseBuffer('pink');
    this.startNoiseLoop();
    this.isInitialized = true;
  }

private makeDistortionCurve(amount: number): any {
  const samples = 256;
  const curve = new Float32Array(samples);

  const deg = Math.PI / 180;

  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] =
      ((3 + amount) * x * 20 * deg) /
      (Math.PI + amount * Math.abs(x));
  }

  return curve;
}

  return curve;
}

  private generateNoiseBuffer(type: NoiseType | 'pink'): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white' || type === 'static') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'interference') {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        const carrier = Math.sin(2 * Math.PI * 1000 * t);
        const noise = (Math.random() * 2 - 1) * 0.3;
        const burst = Math.random() < 0.001 ? (Math.random() * 2 - 1) * 2 : 0;
        data[i] = (carrier * 0.1 + noise + burst) * 0.5;
      }
    }
    return buffer;
  }

  private startNoiseLoop(): void {
    if (!this.ctx || !this.noiseBuffer || !this.noiseGain) return;
    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = this.noiseBuffer;
    this.noiseSource.loop = true;
    this.noiseSource.connect(this.noiseGain);
    this.noiseSource.start();
  }

  // Simulate a radio fragment with tones and noise
  playRadioFragment(frequency: number, band: BandType, duration: number): void {
    if (!this.ctx || !this.radioGain) return;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const modOsc = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();

    // Carrier based on radio frequency mapping
    const carrierFreq = band === 'FM'
      ? 200 + ((frequency - 87.5) / (108 - 87.5)) * 3000
      : 100 + ((frequency - 530) / (1710 - 530)) * 1000;

    osc.frequency.value = carrierFreq;
    osc.type = 'sawtooth';

    // Modulation
    modOsc.frequency.value = 3 + Math.random() * 12;
    modGain.gain.value = 20 + Math.random() * 80;
    modOsc.connect(modGain);
    modGain.connect(osc.frequency);

    const now = this.ctx.currentTime;
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.3 + Math.random() * 0.4, now + 0.01);
    oscGain.gain.linearRampToValueAtTime(0, now + duration - 0.01);

    osc.connect(oscGain);
    oscGain.connect(this.radioGain);

    modOsc.start(now);
    osc.start(now);
    modOsc.stop(now + duration);
    osc.stop(now + duration);
  }

  // Sweep transition: brief silence + noise burst
  playSweepTransition(): void {
    if (!this.ctx || !this.noiseGain) return;
    const now = this.ctx.currentTime;
    const currentGain = this.noiseGain.gain.value;

    // Quick burst
    this.noiseGain.gain.cancelScheduledValues(now);
    this.noiseGain.gain.setValueAtTime(currentGain, now);
    this.noiseGain.gain.linearRampToValueAtTime(1.0, now + 0.02);
    this.noiseGain.gain.linearRampToValueAtTime(currentGain, now + 0.06);
  }

  setVolume(vol: number): void {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.05);
  }

  setNoiseLevel(level: number): void {
    if (!this.noiseGain || !this.ctx) return;
    this.noiseGain.gain.linearRampToValueAtTime(level, this.ctx.currentTime + 0.05);
  }

  setRadioLevel(level: number): void {
    if (!this.radioGain || !this.ctx) return;
    this.radioGain.gain.linearRampToValueAtTime(level, this.ctx.currentTime + 0.05);
  }

  setFilterForBand(band: BandType): void {
    if (!this.filterBank.bandPass || !this.filterBank.lowPass) return;
    if (band === 'FM') {
      this.filterBank.bandPass.frequency.value = 4000;
      this.filterBank.bandPass.Q.value = 0.7;
      this.filterBank.lowPass.frequency.value = 12000;
    } else {
      this.filterBank.bandPass.frequency.value = 1500;
      this.filterBank.bandPass.Q.value = 1.2;
      this.filterBank.lowPass.frequency.value = 5000;
    }
  }

  getAnalyserData(): { waveform: Uint8Array; frequency: Uint8Array } {
    if (!this.analyser) {
      return { waveform: new Uint8Array(0), frequency: new Uint8Array(0) };
    }
    const waveform = new Uint8Array(this.analyser.frequencyBinCount);
    const frequency = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(waveform);
    this.analyser.getByteFrequencyData(frequency);
    return { waveform, frequency };
  }

  getSignalStrength(): number {
    if (!this.analyser) return 0;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    const sum = data.reduce((a, b) => a + b, 0);
    return Math.min(100, (sum / data.length / 255) * 500);
  }

  async resume(): Promise<void> {
    if (this.ctx?.state === 'suspended') await this.ctx.resume();
  }

  destroy(): void {
    this.noiseSource?.stop();
    this.noiseSource?.disconnect();
    this.sweepOscillator?.stop();
    this.sweepOscillator?.disconnect();
    this.ctx?.close();
    this.isInitialized = false;
    this.ctx = null;
  }

  get initialized(): boolean {
    return this.isInitialized;
  }

  get context(): AudioContext | null {
    return this.ctx;
  }
}

export const audioEngine = new AudioEngine();
