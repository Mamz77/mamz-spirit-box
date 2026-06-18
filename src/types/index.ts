// Audio & DSP Types
export type BandType = 'FM' | 'AM';
export type SweepDirection = 'forward' | 'reverse';
export type ScanMode = 'auto' | 'manual' | 'hold';
export type NoiseType = 'white' | 'pink' | 'static' | 'interference';

export interface FrequencyRange {
  min: number;
  max: number;
  step: number;
  unit: 'MHz' | 'kHz';
}

export interface RadioStation {
  id: string;
  frequency: number;
  band: BandType;
  label?: string;
}

export interface AudioFragment {
  id: string;
  type: 'speech' | 'music' | 'static' | 'interference' | 'noise';
  duration: number;
  generatedAt: number;
}

export interface SignalMetrics {
  strength: number;       // 0-100
  staticLevel: number;    // 0-100
  interference: number;   // 0-100
  quality: number;        // 0-100
}

// Session & EVP Types
export interface EVPEvent {
  id: string;
  timestamp: number;
  sessionTime: number;
  frequency: number;
  band: BandType;
  type: 'audio-anomaly' | 'speech-pattern' | 'static-burst' | 'signal-peak' | 'marker';
  description: string;
  signalStrength: number;
  audioData?: Float32Array;
  note?: string;
}

export interface InvestigationSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  location?: string;
  notes?: string;
  events: EVPEvent[];
  frequenciesScanned: number[];
  peakSignalStrength: number;
  totalAnomalies: number;
  band: BandType;
}

export interface SessionReport {
  session: InvestigationSession;
  summary: string;
  timeline: TimelineEntry[];
  frequencyActivity: FrequencyActivity[];
  conclusion: string;
}

export interface TimelineEntry {
  time: number;
  event: string;
  significance: 'low' | 'medium' | 'high';
}

export interface FrequencyActivity {
  frequency: number;
  hits: number;
  anomalies: number;
  peakStrength: number;
}

// UI State Types
export interface SpiritBoxState {
  isPowered: boolean;
  isScanning: boolean;
  band: BandType;
  currentFrequency: number;
  sweepSpeed: number;       // ms between jumps (50-2000)
  sweepDirection: SweepDirection;
  scanMode: ScanMode;
  volume: number;           // 0-1
  squelch: number;          // 0-100
  signal: SignalMetrics;
  frequencyMemory: number[];
  reverseMode: boolean;
  holdMode: boolean;
  micEnabled: boolean;
  sessionActive: boolean;
  currentSession: InvestigationSession | null;
  allSessions: InvestigationSession[];
  aiModeEnabled: boolean;
}

// Audio Engine Types
export interface AudioEngineConfig {
  context: AudioContext;
  masterGain: GainNode;
  noiseGain: GainNode;
  radioGain: GainNode;
  analyser: AnalyserNode;
  compressor: DynamicsCompressorNode;
}

export interface FilterBank {
  lowPass: BiquadFilterNode;
  highPass: BiquadFilterNode;
  bandPass: BiquadFilterNode;
  notch: BiquadFilterNode;
}

export interface MicrophoneSession {
  stream: MediaStream;
  source: MediaStreamAudioSourceNode;
  analyser: AnalyserNode;
  recorder: MediaRecorder;
  chunks: BlobPart[];
}

// AI Analysis Types
export interface AIAnalysisResult {
  sessionId: string;
  generatedAt: number;
  summary: string;
  frequencyReport: string;
  timelineAnalysis: string;
  anomalyCount: number;
  significantEvents: EVPEvent[];
  conclusion: string;
}
