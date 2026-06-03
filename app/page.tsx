'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

  const commandBar = (
    <div className="w-full max-w-xl">
      <div className="group relative">
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-teal-500/0 via-teal-500/30 to-teal-500/0 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-100" />
        <div className="relative flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 backdrop-blur transition-colors focus-within:border-teal-500/50">
          <span className="font-mono text-teal-400">›</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Scrivi un messaggio…"
            disabled={isBusy}
            className="w-full bg-transparent font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
          />
          {isBusy && <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />}
        </div>
      </div>
    </div>
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6">
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
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
              Descrivi il progetto che hai in mente. L'IA legge il tuo intento,
              genera i controlli giusti e ti spiega cosa significano.
            </p>
          </motion.div>

          {commandBar}

          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 font-mono text-xs text-neutral-400 transition-colors hover:border-teal-500/40 hover:text-teal-300"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-6 py-20">
            {messages.map((m) => (
              <div key={m.id}>
                {m.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md border border-neutral-800 bg-neutral-900 px-4 py-2.5 font-mono text-sm text-neutral-200">
                      {m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3"
                  >
                    {m.parts.map((part, i) => {
                      if (part.type === 'text' && part.text.trim()) {
                        return (
                          <div
                            key={i}
                            className="prose prose-invert prose-sm max-w-none font-mono prose-p:leading-relaxed prose-strong:text-teal-300 prose-li:marker:text-teal-500"
                          >
                            <Markdown remarkPlugins={[remarkGfm]}>{part.text}</Markdown>
                          </div>
                        );
                      }
                      if (part.type === 'tool-renderBudgetSlider') {
                        if (part.state === 'output-available') {
                          const parsed = budgetArgsSchema.safeParse(part.output);
                          if (!parsed.success) return null;
                          return <BudgetSlider key={i} {...parsed.data} />;
                        }
                        return <BudgetSkeleton key={i} />;
                      }
                      return null;
                    })}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 flex justify-center bg-gradient-to-t from-[#08090a] via-[#08090a] to-transparent pb-6 pt-4">
            {commandBar}
          </div>
        </>
      )}
    </main>
  );
}