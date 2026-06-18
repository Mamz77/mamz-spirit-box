# Mamz Spirit Box

> Professional browser-based Spirit Box for paranormal investigation  
> Created by **Mamad Shirali** · [Telegram](https://t.me/Mamd_shirali)

---

## Overview

Mamz Spirit Box is the most realistic browser-based Spirit Box experience available — built with Next.js, Web Audio API, and advanced DSP simulation. This is not a fake ghost simulator or random word generator. It authentically recreates how real Spirit Box devices work: rapid RF frequency sweeping, static noise, radio interference, signal detection, and EVP session recording.

---

## Features

- **Real FM/AM Frequency Sweeping** — 87.5–108.0 MHz and 530–1710 kHz with authentic step increments
- **Advanced Web Audio DSP** — Pink noise generator, band-pass filters, wave shaper distortion, dynamic compressor
- **Real-time Spectrum Analyzer** — FFT visualization with waveform overlay
- **Signal & Static Meters** — Visual signal strength, static intensity, and quality indicators
- **Adjustable Sweep Speed** — 50ms to 2000ms per step
- **Reverse Sweep Mode** — Bidirectional frequency scanning
- **Frequency Hold** — Pause sweep at current frequency
- **Frequency Memory** — Save and recall up to 20 frequencies
- **EVP Session System** — Record, log, and export investigation sessions
- **Microphone Input** — Live mic analysis with waveform visualization
- **Export Reports** — JSON and TXT session export
- **PWA Support** — Install on Android/iOS, works offline
- **Neutral AI Analysis** — Session summaries without paranormal claims

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | App framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Zustand | State management |
| Web Audio API | DSP audio engine |
| PWA / next-pwa | Offline support |

---

## Installation

```bash
git clone https://github.com/mamadshirali/mamz-spirit-box.git
cd mamz-spirit-box
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repository to Vercel dashboard for automatic deployments.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Landing page
│   ├── globals.css
│   └── app/
│       ├── page.tsx        # Spirit Box app page
│       └── AppClient.tsx   # Client wrapper
├── components/
│   ├── landing/            # Landing page sections
│   └── spirit-box/         # Device components
├── hooks/
│   ├── useSpiritBox.ts     # Main controller hook
│   └── useAudioVisualization.ts
├── lib/
│   ├── audio/
│   │   ├── AudioEngine.ts  # Web Audio DSP engine
│   │   ├── SweepEngine.ts  # Frequency sweep controller
│   │   └── MicrophoneEngine.ts
│   └── utils/
│       ├── cn.ts
│       └── sessionExport.ts
├── store/
│   └── spiritBoxStore.ts   # Zustand state
└── types/
    └── index.ts            # TypeScript types
```

---

## How It Works

### Audio Engine

The `AudioEngine` class creates a real Web Audio API signal chain:

```
Noise Generator → Band-Pass Filter → High-Pass Filter → Low-Pass Filter → Wave Shaper → Compressor → Master Gain → Analyser → Output
```

Pink noise is generated using the Paul Kellet algorithm. Radio fragments are synthesized using oscillators with frequency modulation mapped to the RF band being scanned.

### Sweep Engine

The `SweepEngine` steps through frequencies at the configured interval, triggering audio events at each step. A 15% probability random signal burst simulates receiving a station fragment. Anomaly detection fires when signal strength exceeds 70% with a 3-second cooldown.

### Session System

EVP sessions are stored in Zustand (persisted to localStorage). Events are automatically logged when anomalies are detected. Sessions export to JSON (full structured data) or TXT (human-readable investigation report).

---

## License

MIT

---

## Credits

**Created by Mamad Shirali**  
Telegram: [https://t.me/Mamd_shirali](https://t.me/Mamd_shirali)

Brand: **Mamz**
