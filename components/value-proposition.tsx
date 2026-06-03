'use client';

import { motion } from 'framer-motion';
import type { ValuePropArgs } from '@/ai/tools';

export function ValueProposition({ headline, alternative, problem, solution, differentiators }: ValuePropArgs) {
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
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 00-4 12.7c.5.4.8 1 .9 1.6h6.2c.1-.6.4-1.2.9-1.6A7 7 0 0012 2z" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Proposta di valore</span>
      </div>
      <p className="mb-4 font-mono text-xs text-neutral-500">Il cuore dell&apos;offerta.</p>

      {/* Headline */}
      <p className="font-display text-2xl leading-snug text-neutral-100">“{headline}”</p>

      {/* Alternative (status quo) */}
      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-neutral-500">
        <span className="uppercase tracking-wider text-neutral-600">Invece di</span>
        <span className="line-through decoration-neutral-700">{alternative}</span>
      </div>

      {/* Problem → Solution */}
      <div className="mt-5 space-y-3">
        <div className="rounded-lg border border-rose-500/15 bg-rose-500/5 px-3 py-2.5">
          <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-rose-400/80">Problema</p>
          <p className="font-mono text-xs leading-relaxed text-neutral-200">{problem}</p>
        </div>
        <div className="flex justify-center text-neutral-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
        <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 px-3 py-2.5">
          <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-teal-400/80">Soluzione</p>
          <p className="font-mono text-xs leading-relaxed text-neutral-200">{solution}</p>
        </div>
      </div>

      {/* Differentiators */}
      <div className="mt-5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Perché te</p>
        <div className="space-y-1.5">
          {differentiators.map((d) => (
            <div key={d} className="flex items-start gap-2">
              <svg className="mt-0.5 shrink-0 text-teal-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="font-mono text-xs leading-relaxed text-neutral-300">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
