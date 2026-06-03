'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TimelineArgs } from '@/ai/tools';

const phaseColor = {
  preparazione: { dot: 'bg-sky-400', line: 'border-sky-500/30', text: 'text-sky-400' },
  lancio: { dot: 'bg-teal-400', line: 'border-teal-500/30', text: 'text-teal-400' },
  crescita: { dot: 'bg-violet-400', line: 'border-violet-500/30', text: 'text-violet-400' },
};

export function LaunchTimeline({ milestones }: TimelineArgs) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur"
    >
      {/* Header */}
      <div className="mb-1 flex items-center gap-2 text-teal-400">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Roadmap di lancio</span>
      </div>
      <p className="mb-5 font-mono text-xs text-neutral-500">Clicca una tappa per i dettagli.</p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-neutral-800" />

        <div className="space-y-1">
          {milestones.map((m, i) => {
            const c = phaseColor[m.phase];
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(isActive ? null : i)}
                aria-expanded={isActive}
                className="relative flex w-full items-start gap-3 rounded-lg px-1 py-2 text-left transition-colors hover:bg-neutral-800/30"
              >
                {/* Dot */}
                <span aria-hidden="true" className={`relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-neutral-950 ${c.dot}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${c.text}`}>{m.week}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">· {m.phase}</span>
                  </div>
                  <p className="font-mono text-sm text-neutral-100">{m.title}</p>
                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-1 font-mono text-xs leading-relaxed text-neutral-400">{m.description}</p>
                  </motion.div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
