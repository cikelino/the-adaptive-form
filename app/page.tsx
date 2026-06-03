'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import { BudgetSlider } from '@/components/budget-slider';
import { BudgetSkeleton } from '@/components/budget-skeleton';
import { budgetArgsSchema } from '@/ai/tools';

const SUGGESTIONS = [
  'Brand di caffè biologico, budget 5.000€',
  'Startup fitness, investo circa 12k',
  'Negozio di ceramiche, budget contenuto',
];

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput('');
  };

  const isEmpty = messages.length === 0;
  const isBusy = status === 'submitted' || status === 'streaming';

  return (
    <main
      className={`mx-auto flex min-h-screen max-w-3xl flex-col items-center gap-10 px-6 py-20 ${
        isEmpty ? 'justify-center' : 'justify-start'
      }`}
    >
      {/* Hero: c'è solo all'inizio, esce con grazia al primo invio */}
      <AnimatePresence>
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-teal-400/80">
              Generative UI · Live demo
            </p>
            <h1 className="font-display text-5xl leading-tight text-neutral-100 sm:text-6xl">
              L'interfaccia si costruisce
              <br />
              <span className="italic text-teal-300">mentre scrivi.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md font-mono text-sm leading-relaxed text-neutral-400">
              Descrivi il progetto che hai in mente. L'IA legge il tuo intento e
              genera i controlli giusti, in tempo reale.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command bar */}
      <motion.div layout className="w-full max-w-xl">
        <div className="group relative">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-teal-500/0 via-teal-500/30 to-teal-500/0 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-100" />
          <div className="relative flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 backdrop-blur transition-colors focus-within:border-teal-500/50">
            <span className="font-mono text-teal-400">›</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Descrivi il progetto che vuoi lanciare…"
              disabled={isBusy}
              className="w-full bg-transparent font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
            />
            {isBusy && <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />}
          </div>
        </div>

        {/* Chip: solo all'inizio, per testare in 3 secondi */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex flex-wrap justify-center gap-2"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 font-mono text-xs text-neutral-400 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Canvas: qui emergono i componenti generati */}
      <div className="flex w-full flex-col items-center gap-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) =>
            message.parts.map((part, i) => {
              if (part.type === 'tool-renderBudgetSlider') {
                if (part.state === 'input-available') {
                  const parsed = budgetArgsSchema.safeParse(part.input);
                  if (!parsed.success) return null;
                  return <BudgetSlider key={`${message.id}-${i}`} {...parsed.data} />;
                }
                return <BudgetSkeleton key={`${message.id}-${i}`} />;
              }
              if (part.type === 'text' && message.role === 'assistant' && part.text.trim()) {
                return (
                  <p
                    key={`${message.id}-${i}`}
                    className="max-w-md text-center font-mono text-sm text-neutral-400"
                  >
                    {part.text}
                  </p>
                );
              }
              return null;
            })
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}