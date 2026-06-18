'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration, formatSessionTime, exportAsJSON, exportAsTXT } from '@/lib/utils/sessionExport';
import type { InvestigationSession, EVPEvent } from '@/types';

interface EVPPanelProps {
  sessionActive: boolean;
  currentSession: InvestigationSession | null;
  allSessions: InvestigationSession[];
  onStartSession: (location?: string) => void;
  onStopSession: () => void;
  onAddMarker: (note: string) => void;
  onDeleteSession: (id: string) => void;
}

function EventBadge({ type }: { type: EVPEvent['type'] }) {
  const config = {
    'audio-anomaly': { label: 'ANOMALY', color: '#ffb300' },
    'speech-pattern': { label: 'SPEECH', color: '#00ff88' },
    'static-burst': { label: 'STATIC', color: '#888' },
    'signal-peak': { label: 'PEAK', color: '#00d4ff' },
    marker: { label: 'MARK', color: '#ff3333' },
  };
  const c = config[type];
  return (
    <span
      className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border"
      style={{ color: c.color, borderColor: `${c.color}40`, backgroundColor: `${c.color}10` }}
    >
      {c.label}
    </span>
  );
}

export function EVPPanel({
  sessionActive, currentSession, allSessions,
  onStartSession, onStopSession, onAddMarker, onDeleteSession,
}: EVPPanelProps) {
  const [location, setLocation] = useState('');
  const [markerNote, setMarkerNote] = useState('');
  const [showSessions, setShowSessions] = useState(false);
  const [showMarkerInput, setShowMarkerInput] = useState(false);

  const handleStart = () => {
    onStartSession(location || undefined);
    setLocation('');
  };

  const handleMarker = () => {
    if (!markerNote.trim()) return;
    onAddMarker(markerNote.trim());
    setMarkerNote('');
    setShowMarkerInput(false);
  };

  const sessionDuration = currentSession
    ? Date.now() - currentSession.startTime
    : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Session control */}
      <div className="p-3 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono text-[#444] uppercase tracking-widest">
            EVP Session
          </span>
          {sessionActive && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff3333]" />
              <span className="text-[8px] font-mono text-[#ff3333]">REC</span>
            </motion.div>
          )}
        </div>

        {!sessionActive ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (optional)"
              className="w-full bg-black border border-[#1e1e1e] rounded px-2 py-1.5 text-[10px] font-mono text-[#888] placeholder-[#222] focus:outline-none focus:border-[#00ff88]/40"
            />
            <button
              onClick={handleStart}
              className="w-full py-2 rounded border border-[#00ff88]/40 text-[#00ff88] text-[10px] font-mono uppercase tracking-wider hover:bg-[#00ff88]/10 transition-colors"
            >
              Start Session
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-[#444]">
              <div>
                <div className="text-[#222] mb-0.5">Duration</div>
                <div className="text-[#00ff88]">{formatDuration(sessionDuration)}</div>
              </div>
              <div>
                <div className="text-[#222] mb-0.5">Events</div>
                <div className="text-[#ffb300]">{currentSession?.events.length ?? 0}</div>
              </div>
              <div>
                <div className="text-[#222] mb-0.5">Anomalies</div>
                <div className="text-[#ff3333]">{currentSession?.totalAnomalies ?? 0}</div>
              </div>
              <div>
                <div className="text-[#222] mb-0.5">Peak</div>
                <div className="text-[#00d4ff]">
                  {(currentSession?.peakSignalStrength ?? 0).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowMarkerInput(!showMarkerInput)}
                className="flex-1 py-1.5 rounded border border-[#ffb300]/40 text-[#ffb300] text-[9px] font-mono uppercase tracking-wider hover:bg-[#ffb300]/10 transition-colors"
              >
                + Marker
              </button>
              <button
                onClick={onStopSession}
                className="flex-1 py-1.5 rounded border border-[#ff3333]/40 text-[#ff3333] text-[9px] font-mono uppercase tracking-wider hover:bg-[#ff3333]/10 transition-colors"
              >
                Stop
              </button>
            </div>

            <AnimatePresence>
              {showMarkerInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-1 overflow-hidden"
                >
                  <input
                    type="text"
                    value={markerNote}
                    onChange={(e) => setMarkerNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMarker()}
                    placeholder="Note..."
                    className="flex-1 bg-black border border-[#1e1e1e] rounded px-2 py-1 text-[9px] font-mono text-[#888] placeholder-[#222] focus:outline-none focus:border-[#ffb300]/40"
                    autoFocus
                  />
                  <button
                    onClick={handleMarker}
                    className="px-2 rounded border border-[#ffb300]/40 text-[#ffb300] text-[9px] font-mono hover:bg-[#ffb300]/10 transition-colors"
                  >
                    OK
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Live event log */}
      {sessionActive && currentSession && currentSession.events.length > 0 && (
        <div className="p-3 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg max-h-40 overflow-y-auto">
          <div className="text-[9px] font-mono text-[#444] uppercase tracking-widest mb-2">
            Event Log
          </div>
          <div className="flex flex-col gap-1.5">
            {[...currentSession.events].reverse().map((event) => (
              <div key={event.id} className="flex items-start gap-2">
                <span className="text-[8px] font-mono text-[#222] whitespace-nowrap mt-0.5">
                  {formatSessionTime(event.sessionTime)}
                </span>
                <EventBadge type={event.type} />
                <span className="text-[8px] font-mono text-[#444] flex-1 leading-tight">
                  {event.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved sessions */}
      {allSessions.length > 0 && (
        <div className="p-3 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg">
          <button
            onClick={() => setShowSessions(!showSessions)}
            className="w-full flex items-center justify-between text-[9px] font-mono text-[#444] uppercase tracking-widest"
          >
            <span>Saved Sessions ({allSessions.length})</span>
            <span>{showSessions ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence>
            {showSessions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 flex flex-col gap-2">
                  {allSessions.map((s) => (
                    <div
                      key={s.id}
                      className="border border-[#1e1e1e] rounded p-2 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#00ff88]">
                          {new Date(s.startTime).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => exportAsJSON(s)}
                            className="text-[8px] font-mono text-[#444] hover:text-[#00d4ff] px-1 border border-[#1e1e1e] rounded transition-colors"
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => exportAsTXT(s)}
                            className="text-[8px] font-mono text-[#444] hover:text-[#00ff88] px-1 border border-[#1e1e1e] rounded transition-colors"
                          >
                            TXT
                          </button>
                          <button
                            onClick={() => onDeleteSession(s.id)}
                            className="text-[8px] font-mono text-[#444] hover:text-[#ff3333] px-1 border border-[#1e1e1e] rounded transition-colors"
                          >
                            DEL
                          </button>
                        </div>
                      </div>
                      <div className="text-[8px] font-mono text-[#222]">
                        {formatDuration(s.duration)} · {s.events.length} events · {s.totalAnomalies} anomalies
                        {s.location && ` · ${s.location}`}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
