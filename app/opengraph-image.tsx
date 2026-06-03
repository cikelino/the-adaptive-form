import { ImageResponse } from 'next/og';

export const alt = 'The Adaptive Form — Il tuo piano di lancio si costruisce mentre parli';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: '#08090a',
          backgroundImage:
            'radial-gradient(60% 50% at 50% 0%, rgba(45,212,191,0.18), transparent 70%)',
          color: '#e6e6e6',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', color: '#2dd4bf', fontSize: 24, letterSpacing: 6 }}>
          GENERATIVE UI · LIVE DEMO
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 72, lineHeight: 1.05, color: '#fafafa' }}>
            Il tuo piano di lancio
          </div>
          <div style={{ display: 'flex', fontSize: 72, lineHeight: 1.05, color: '#5eead4' }}>
            si costruisce mentre parli.
          </div>
        </div>

        {/* Tool chips */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {['🧑‍💼 Cliente tipo', '💡 Valore', '📡 Canali', '💰 Budget', '🗓️ Roadmap', '👥 Team'].map(
            (t) => (
              <div
                key={t}
                style={{
                  display: 'flex',
                  border: '1px solid #27272a',
                  borderRadius: 999,
                  padding: '10px 20px',
                  fontSize: 24,
                  color: '#a3a3a3',
                }}
              >
                {t}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
