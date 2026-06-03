'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BudgetArgs } from '@/ai/tools';

const MIN = 500;
const MAX = 20000;

export function BudgetSlider({ budget, currency = '€' }: BudgetArgs) {
  const [value, setValue] = useState(Math.min(Math.max(budget, MIN), MAX));

  const hint =
    value >= 7500
      ? "Con questo budget puoi affiancare al lancio organico anche campagne Ads mirate."
      : value >= 3000
        ? 'Budget solido per un lancio organico curato su uno o due canali.'
        : 'Budget snello: conviene concentrare tutto su un singolo canale ad alto ritorno.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur"
    >
      <div className="mb-1 flex items-center gap-2 text-teal-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Budget di lancio</span>
      </div>
      <p className="mb-5 font-mono text-xs text-neutral-500">
        Stima proposta dall'IA. Trascina per affinarla.
      </p>

      <div className="font-display text-4xl text-neutral-100">
        {currency}
        {value.toLocaleString('it-IT')}
      </div>

      <input
        type="range"
        min={MIN}
        max={MAX}
        step={500}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-4 w-full"
      />
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-neutral-600">
        <span>{currency}{MIN.toLocaleString('it-IT')}</span>
        <span>{currency}{MAX.toLocaleString('it-IT')}</span>
      </div>

      <motion.div
        key={hint}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 flex items-start gap-2 rounded-lg border border-teal-500/15 bg-teal-500/5 px-3 py-2.5"
      >
        <span className="mt-px font-mono text-teal-400">✦</span>
        <p className="font-mono text-xs leading-relaxed text-teal-100/80">{hint}</p>
      </motion.div>
    </motion.div>
  );
}