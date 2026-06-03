'use client';

import { motion } from 'framer-motion';
import type { TeamNeedsArgs } from '@/ai/tools';

const priorityStyle = {
  subito: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
  presto: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
  dopo: 'text-neutral-400 border-neutral-700 bg-neutral-800/30',
};

const typeLabel = {
  interno: 'Interno',
  freelance: 'Freelance',
  agenzia: 'Agenzia',
};

export function TeamNeeds({ roles }: TeamNeedsArgs) {
  const total = roles.reduce((sum, r) => sum + r.monthlyCost, 0);

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
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Di chi hai bisogno</span>
      </div>
      <p className="mb-5 font-mono text-xs text-neutral-500">Le figure chiave per partire.</p>

      <div className="space-y-2">
        {roles.map((r) => (
          <div
            key={r.title}
            className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5"
          >
            <span className="text-base shrink-0">{r.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm text-neutral-100">{r.title}</span>
                <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${priorityStyle[r.priority]}`}>
                  {r.priority}
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-500">{typeLabel[r.type]}</span>
            </div>
            <span className="shrink-0 font-mono text-xs text-teal-300">
              €{r.monthlyCost.toLocaleString('it-IT')}
              <span className="text-neutral-600">/m</span>
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Costo team / mese</span>
        <span className="font-display text-xl text-neutral-100">€{total.toLocaleString('it-IT')}</span>
      </div>
    </motion.div>
  );
}
