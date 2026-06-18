'use client';

export class MicrophoneEngine {
  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private isActive = false;

  async start(): Promise<void> {
    if (this.isActive) return;
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.context = new AudioContext();
    this.source = this.context.createMediaStreamSource(this.stream);
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    this.source.connect(this.analyser);

    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.start(100);
    this.isActive = true;
  }

  stop(): void {
    this.recorder?.stop();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.context?.close();
    this.source?.disconnect();
    this.stream = null;
    this.context = null;
    this.source = null;
    this.analyser = null;
    this.recorder = null;
    this.isActive = false;
  }

  getWaveform(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  getNoiseLevel(): number {
    const data = this.getFrequencyData();
    if (!data.length) return 0;
    return (data.reduce((a, b) => a + b, 0) / data.length / 255) * 100;
  }

  async exportAudio(): Promise<Blob | null> {
    if (!this.chunks.length) return null;
    return new Blob(this.chunks, { type: 'audio/webm' });
  }

  get active(): boolean {
    return this.isActive;
  }
}

export const micEngine = new MicrophoneEngine();
