'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BudgetArgs } from '@/ai/tools';

export function BudgetSlider({ budget, currency = '€' }: BudgetArgs) {
  const [value, setValue] = useState(budget);

  const hint =
    value >= 7500
      ? 'Con questo budget sblocchi anche campagne Ads mirate.'
      : value >= 3000
        ? 'Budget solido per un lancio organico curato.'
        : 'Budget snello: meglio concentrarsi su un solo canale.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}            // entrata fade-in-up, niente "pop"
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
    >
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm text-neutral-400">Budget stimato</span>
        <span className="font-mono text-2xl text-teal-300">
          {currency}{value.toLocaleString('it-IT')}
        </span>
      </div>

      <input
        type="range"
        min={500}
        max={20000}
        step={500}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-teal-400"
      />

      <motion.p
        key={hint}                                // ri-anima quando il micro-copy cambia
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 text-sm text-neutral-300"
      >
        {hint}
      </motion.p>
    </motion.div>
  );
}