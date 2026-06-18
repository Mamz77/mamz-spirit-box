import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SpiritBoxState,
  BandType,
  SweepDirection,
  ScanMode,
  SignalMetrics,
  InvestigationSession,
  EVPEvent,
} from '@/types';

const FM_RANGE = { min: 87.5, max: 108.0, step: 0.1 };
const AM_RANGE = { min: 530, max: 1710, step: 10 };

interface SpiritBoxActions {
  setPower: (on: boolean) => void;
  setScanning: (scanning: boolean) => void;
  setBand: (band: BandType) => void;
  setFrequency: (freq: number) => void;
  stepFrequency: (direction: 1 | -1) => void;
  setSweepSpeed: (speed: number) => void;
  setSweepDirection: (dir: SweepDirection) => void;
  setScanMode: (mode: ScanMode) => void;
  setVolume: (vol: number) => void;
  setSquelch: (sq: number) => void;
  updateSignal: (metrics: Partial<SignalMetrics>) => void;
  saveFrequency: () => void;
  removeMemory: (freq: number) => void;
  jumpToMemory: (freq: number) => void;
  toggleReverse: () => void;
  toggleHold: () => void;
  setMicEnabled: (en: boolean) => void;
  startSession: (location?: string) => void;
  stopSession: () => void;
  addEvent: (event: Omit<EVPEvent, 'id' | 'timestamp' | 'sessionTime'>) => void;
  addMarker: (note: string) => void;
  setAiMode: (en: boolean) => void;
  deleteSession: (id: string) => void;
}

const defaultSignal: SignalMetrics = {
  strength: 0,
  staticLevel: 80,
  interference: 40,
  quality: 0,
};

export const useSpiritBoxStore = create<SpiritBoxState & SpiritBoxActions>()(
  persist(
    (set, get) => ({
      isPowered: false,
      isScanning: false,
      band: 'FM',
      currentFrequency: 87.5,
      sweepSpeed: 300,
      sweepDirection: 'forward',
      scanMode: 'auto',
      volume: 0.7,
      squelch: 30,
      signal: defaultSignal,
      frequencyMemory: [],
      reverseMode: false,
      holdMode: false,
      micEnabled: false,
      sessionActive: false,
      currentSession: null,
      allSessions: [],
      aiModeEnabled: false,

      setPower: (on) => {
        set({ isPowered: on });
        if (!on) {
          set({ isScanning: false, signal: defaultSignal });
        }
      },

      setScanning: (scanning) => set({ isScanning: scanning }),

      setBand: (band) => {
        const freq = band === 'FM' ? 87.5 : 530;
        set({ band, currentFrequency: freq, signal: defaultSignal });
      },

      setFrequency: (freq) => {
        const { band } = get();
        const range = band === 'FM' ? FM_RANGE : AM_RANGE;
        const clamped = Math.max(range.min, Math.min(range.max, freq));
        const rounded = band === 'FM'
          ? Math.round(clamped * 10) / 10
          : Math.round(clamped / range.step) * range.step;
        set({ currentFrequency: rounded });
      },

      stepFrequency: (direction) => {
        const { band, currentFrequency, reverseMode } = get();
        const range = band === 'FM' ? FM_RANGE : AM_RANGE;
        const effectiveDir = reverseMode ? -direction : direction;
        let next = currentFrequency + (range.step * effectiveDir);
        if (next > range.max) next = range.min;
        if (next < range.min) next = range.max;
        const rounded = band === 'FM'
          ? Math.round(next * 10) / 10
          : Math.round(next / range.step) * range.step;
        set({ currentFrequency: rounded });
      },

      setSweepSpeed: (speed) => set({ sweepSpeed: Math.max(50, Math.min(2000, speed)) }),

      setSweepDirection: (dir) => set({ sweepDirection: dir }),

      setScanMode: (mode) => set({ scanMode: mode }),

      setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),

      setSquelch: (sq) => set({ squelch: Math.max(0, Math.min(100, sq)) }),

      updateSignal: (metrics) =>
        set((state) => ({ signal: { ...state.signal, ...metrics } })),

      saveFrequency: () => {
        const { currentFrequency, frequencyMemory } = get();
        if (!frequencyMemory.includes(currentFrequency) && frequencyMemory.length < 20) {
          set({ frequencyMemory: [...frequencyMemory, currentFrequency] });
        }
      },

      removeMemory: (freq) =>
        set((state) => ({
          frequencyMemory: state.frequencyMemory.filter((f) => f !== freq),
        })),

      jumpToMemory: (freq) => set({ currentFrequency: freq, isScanning: false }),

      toggleReverse: () =>
        set((state) => ({ reverseMode: !state.reverseMode })),

      toggleHold: () =>
        set((state) => ({ holdMode: !state.holdMode })),

      setMicEnabled: (en) => set({ micEnabled: en }),

      startSession: (location) => {
        const session: InvestigationSession = {
          id: `session_${Date.now()}`,
          startTime: Date.now(),
          duration: 0,
          location,
          events: [],
          frequenciesScanned: [],
          peakSignalStrength: 0,
          totalAnomalies: 0,
          band: get().band,
        };
        set({ sessionActive: true, currentSession: session });
      },

      stopSession: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        const ended: InvestigationSession = {
          ...currentSession,
          endTime: Date.now(),
          duration: Date.now() - currentSession.startTime,
        };
        set((state) => ({
          sessionActive: false,
          currentSession: null,
          allSessions: [ended, ...state.allSessions],
        }));
      },

      addEvent: (eventData) => {
        const { currentSession, sessionActive } = get();
        if (!sessionActive || !currentSession) return;
        const event: EVPEvent = {
          ...eventData,
          id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          timestamp: Date.now(),
          sessionTime: Date.now() - currentSession.startTime,
        };
        const updatedSession: InvestigationSession = {
          ...currentSession,
          events: [...currentSession.events, event],
          totalAnomalies: currentSession.totalAnomalies + 1,
          peakSignalStrength: Math.max(currentSession.peakSignalStrength, event.signalStrength),
        };
        set({ currentSession: updatedSession });
      },

      addMarker: (note) => {
        const { addEvent, currentFrequency, band, signal } = get();
        addEvent({
          frequency: currentFrequency,
          band,
          type: 'marker',
          description: note,
          signalStrength: signal.strength,
          note,
        });
      },

      setAiMode: (en) => set({ aiModeEnabled: en }),

      deleteSession: (id) =>
        set((state) => ({
          allSessions: state.allSessions.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'mamz-spirit-box',
      partialize: (state) => ({
        frequencyMemory: state.frequencyMemory,
        allSessions: state.allSessions,
        volume: state.volume,
        squelch: state.squelch,
        sweepSpeed: state.sweepSpeed,
        band: state.band,
      }),
    }
  )
);
