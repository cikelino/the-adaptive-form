'use client';

import { motion } from 'framer-motion';
import type { PersonaArgs } from '@/ai/tools';

export function PersonaCard({ name, emoji, age, role, painPoints, channels, keyMessage }: PersonaArgs) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur"
    >
      {/* Header */}
      <div className="mb-1 flex items-center gap-2 text-teal-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Cliente tipo</span>
      </div>
      <p className="mb-5 font-mono text-xs text-neutral-500">Il target ideale del tuo progetto.</p>

      {/* Identity */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-2xl">
          {emoji}
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-neutral-100">{name}</span>
            <span className="font-mono text-xs text-neutral-500">{age}</span>
          </div>
          <p className="font-mono text-xs leading-snug text-neutral-400">{role}</p>
        </div>
      </div>

      {/* Pain points */}
      <div className="mt-5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Cosa la frena</p>
        <div className="space-y-1.5">
          {painPoints.map((p) => (
            <div key={p} className="flex items-start gap-2">
              <span className="mt-px font-mono text-rose-400/70">→</span>
              <p className="font-mono text-xs leading-relaxed text-neutral-300">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div className="mt-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Dove la trovi</p>
        <div className="flex flex-wrap gap-1.5">
          {channels.map((c) => (
            <span
              key={c}
              className="rounded-full border border-neutral-800 bg-neutral-950/60 px-2.5 py-1 font-mono text-[11px] text-neutral-300"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Key message */}
      <div className="mt-5 flex items-start gap-2 rounded-lg border border-teal-500/15 bg-teal-500/5 px-3 py-2.5">
        <span className="mt-px font-mono text-teal-400">“</span>
        <p className="font-mono text-xs italic leading-relaxed text-teal-100/80">{keyMessage}</p>
      </div>
    </motion.div>
  );
}
