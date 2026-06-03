'use client';

import { useEffect, useMemo, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PlanCanvas } from '@/components/plan-canvas';
import { derivePlan, isToolPart, planMeta, type PlanSlot } from '@/lib/plan';
import { exportPlan } from '@/lib/export-plan';

const SUGGESTIONS = [
  'Voglio lanciare un brand di caffè biologico',
  'Sto avviando una startup di fitness, budget 12k',
  'Apro un negozio di ceramiche artigianali',
];

export default function Page() {
  const [chatKey, setChatKey] = useState(0);
  return <Chat key={chatKey} onReset={() => setChatKey((k) => k + 1)} />;
}

// Chip mostrato nella chat quando l'AI genera/aggiorna un elemento del piano.
function ToolChip({ type, ready }: { type: string; ready: boolean }) {
  const meta = planMeta(type);
  if (!meta) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
        ready
          ? 'border-teal-500/30 bg-teal-500/10 text-teal-300'
          : 'border-neutral-800 bg-neutral-900/60 text-neutral-500'
      }`}
    >
      <span>{meta.emoji}</span>
      {ready ? (
        <span>{meta.label} → aggiunto al piano</span>
      ) : (
        <>
          <span>Preparo: {meta.label}</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
        </>
      )}
    </div>
  );
}

function Chat({ onReset }: { onReset: () => void }) {
  const [input, setInput] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { messages, sendMessage, status } = useChat();

  // ── Stato del piano: unisce dati AI ed edit utente ──────────────────────────
  // L'AI è la sorgente di verità; gli edit utente sono applicati finché la
  // versione del tool non cambia (una rigenerazione li azzera, come voluto).
  const aiPlan = useMemo(() => derivePlan(messages), [messages]);
  const [edits, setEdits] = useState<Record<string, { version: string; data: unknown }>>({});

  const slots: PlanSlot[] = aiPlan.map((s) => {
    const edit = edits[s.type];
    return edit && edit.version === s.version ? { ...s, data: edit.data } : s;
  });

  const updateSlot = (type: string, data: unknown) => {
    const slot = aiPlan.find((s) => s.type === type);
    if (!slot) return;
    setEdits((prev) => ({ ...prev, [type]: { version: slot.version, data } }));
  };

  // ── Scroll-to-bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const dist = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setShowScrollDown(dist > 280);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [messages.length]);

  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  // ── Helpers ─────────────────────────────────────────────────────────────────
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

  // ── Stato iniziale (hero) ───────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6">
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
              Il tuo piano di lancio
              <br />
              <span className="italic text-teal-300">si costruisce mentre parli.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md font-mono text-sm leading-relaxed text-neutral-400">
              Descrivi il progetto che hai in mente. L&apos;IA legge il tuo intento, costruisce
              il piano pezzo per pezzo e lo rende esportabile.
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
      </main>
    );
  }

  // ── Workspace two-pane ──────────────────────────────────────────────────────
  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl gap-8 px-6">
        {/* Colonna chat */}
        <section className="relative flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between bg-gradient-to-b from-[#08090a] via-[#08090a]/90 to-transparent py-4">
            <button
              onClick={onReset}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2 font-mono text-xs text-neutral-300 backdrop-blur transition-all hover:border-teal-500/50 hover:text-teal-200"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-teal-500/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <svg className="transition-transform group-hover:rotate-90" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuova chat
            </button>

            {/* Apri piano (mobile) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-2 font-mono text-xs text-teal-300 backdrop-blur transition-colors hover:bg-teal-500/20 lg:hidden"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              Piano {slots.length > 0 && `(${slots.length})`}
            </button>
          </div>

          {/* Messaggi */}
          <div className="flex-1 space-y-6 pb-28">
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
                      if (isToolPart(part)) {
                        const ready = (part as { state?: string }).state === 'output-available';
                        return <ToolChip key={i} type={part.type} ready={ready} />;
                      }
                      return null;
                    })}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Command bar + scroll-to-bottom */}
          <div className="sticky bottom-0 z-20 bg-gradient-to-t from-[#08090a] via-[#08090a] to-transparent pb-6 pt-4">
            <div className="relative flex justify-center">
              <AnimatePresence>
                {showScrollDown && (
                  <motion.button
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    onClick={scrollToBottom}
                    className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 shadow-lg backdrop-blur transition-colors hover:border-teal-500/50 hover:text-teal-300"
                    aria-label="Vai in fondo"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
              {commandBar}
            </div>
          </div>
        </section>

        {/* Canvas (desktop) */}
        <aside className="hidden w-[380px] shrink-0 lg:block">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pb-6">
            <PlanCanvas slots={slots} onUpdate={updateSlot} onExport={() => exportPlan(slots)} />
          </div>
        </aside>
      </main>

      {/* Canvas (mobile drawer) */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto border-l border-neutral-800 bg-[#0c0d0e] p-5"
            >
              <PlanCanvas
                slots={slots}
                onUpdate={updateSlot}
                onExport={() => exportPlan(slots)}
                onClose={() => setDrawerOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
