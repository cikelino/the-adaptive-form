'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import type { ChannelRankingArgs } from '@/ai/tools';

const difficultyColor = {
  bassa: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  media: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
  alta: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
};

export function ChannelRanking({
  channels: initial,
  onChange,
}: ChannelRankingArgs & { onChange?: (next: ChannelRankingArgs) => void }) {
  const [channels, setChannels] = useState(initial);

  const reorder = (next: typeof initial) => {
    setChannels(next);
    onChange?.({ channels: next });
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
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Canali consigliati</span>
      </div>
      <p className="mb-5 font-mono text-xs text-neutral-500">
        Ordinati per rilevanza. Trascina per personalizzare.
      </p>

      <Reorder.Group axis="y" values={channels} onReorder={reorder} className="space-y-2">
        {channels.map((ch, i) => (
          <Reorder.Item
            key={ch.name}
            value={ch}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div
              layout
              className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-3 transition-colors hover:border-neutral-700"
            >
              {/* Rank */}
              <span className="mt-0.5 font-mono text-[11px] text-neutral-600 w-4 shrink-0">
                {i + 1}.
              </span>

              {/* Emoji */}
              <span className="mt-0.5 text-base shrink-0">{ch.emoji}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm text-neutral-100">{ch.name}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${difficultyColor[ch.difficulty]}`}
                  >
                    {ch.difficulty}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs leading-relaxed text-neutral-500">{ch.reason}</p>
                <p className="mt-1 font-mono text-[10px] text-neutral-600">
                  min. €{ch.minBudget.toLocaleString('it-IT')}/mese
                </p>
              </div>

              {/* Drag handle */}
              <svg
                className="mt-1 shrink-0 text-neutral-700"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="9" cy="6" r="2" />
                <circle cx="15" cy="6" r="2" />
                <circle cx="9" cy="12" r="2" />
                <circle cx="15" cy="12" r="2" />
                <circle cx="9" cy="18" r="2" />
                <circle cx="15" cy="18" r="2" />
              </svg>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </motion.div>
  );
}
