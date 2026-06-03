'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BudgetArgs } from '@/ai/tools';

const MIN = 500;
const MAX = 20000;

export function BudgetSlider({
  budget,
  currency = '€',
  allocations,
  onChange,
}: BudgetArgs & { onChange?: (next: BudgetArgs) => void }) {
  const [value, setValue] = useState(Math.min(Math.max(budget, MIN), MAX));

  const update = (next: number) => {
    setValue(next);
    onChange?.({ budget: next, currency, allocations });
  };

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
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Budget di lancio</span>
      </div>
      <p className="mb-5 font-mono text-xs text-neutral-500">
        Stima proposta dall&apos;IA. Trascina per affinare.
      </p>

      {/* Value */}
      <div className="font-display text-4xl text-neutral-100">
        {currency}{value.toLocaleString('it-IT')}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={500}
        value={value}
        onChange={(e) => update(Number(e.target.value))}
        className="mt-4 w-full"
      />
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-neutral-600">
        <span>{currency}{MIN.toLocaleString('it-IT')}</span>
        <span>{currency}{MAX.toLocaleString('it-IT')}</span>
      </div>

      {/* Breakdown */}
      <div className="mt-5 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Ripartizione consigliata</p>
        {allocations.map((a) => {
          const amount = Math.round((value * a.percentage) / 100);
          return (
            <motion.div
              key={a.channel}
              layout
              className="flex items-center gap-3"
            >
              <span className="w-5 text-center text-sm">{a.emoji}</span>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-neutral-300">{a.channel}</span>
                  <span className="text-teal-300">
                    {currency}{amount.toLocaleString('it-IT')}
                    <span className="ml-1 text-neutral-600">({a.percentage}%)</span>
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                  <motion.div
                    className="h-full rounded-full bg-teal-500/60"
                    animate={{ width: `${a.percentage}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
