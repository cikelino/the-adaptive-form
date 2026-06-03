'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BudgetSlider } from '@/components/budget-slider';
import { BudgetSkeleton } from '@/components/budget-skeleton';
import { ChannelRanking } from '@/components/channel-ranking';
import { PersonaCard } from '@/components/persona-card';
import { LaunchTimeline } from '@/components/launch-timeline';
import { TeamNeeds } from '@/components/team-needs';
import {
  budgetArgsSchema,
  channelRankingArgsSchema,
  personaArgsSchema,
  timelineArgsSchema,
  teamNeedsArgsSchema,
} from '@/ai/tools';

const TOOL_TYPES = [
  'tool-renderBudgetSlider',
  'tool-renderChannelRanking',
  'tool-renderPersonaCard',
  'tool-renderLaunchTimeline',
  'tool-renderTeamNeeds',
];

const SUGGESTIONS = [
  'Voglio lanciare un brand di caffè biologico',
  'Sto avviando una startup di fitness, budget 12k',
  'Apro un negozio di ceramiche artigianali',
];

function isToolPart(part: { type: string }) {
  return TOOL_TYPES.includes(part.type);
}

function ToolComponent({ part, index }: { part: { type: string; state?: string; output?: unknown }, index: number }) {
  const ready = part.state === 'output-available';

  switch (part.type) {
    case 'tool-renderBudgetSlider': {
      if (!ready) return <BudgetSkeleton key={index} />;
      const parsed = budgetArgsSchema.safeParse(part.output);
      return parsed.success ? <BudgetSlider key={index} {...parsed.data} /> : null;
    }
    case 'tool-renderChannelRanking': {
      if (!ready) return <BudgetSkeleton key={index} />;
      const parsed = channelRankingArgsSchema.safeParse(part.output);
      return parsed.success ? <ChannelRanking key={index} {...parsed.data} /> : null;
    }
    case 'tool-renderPersonaCard': {
      if (!ready) return <BudgetSkeleton key={index} />;
      const parsed = personaArgsSchema.safeParse(part.output);
      return parsed.success ? <PersonaCard key={index} {...parsed.data} /> : null;
    }
    case 'tool-renderLaunchTimeline': {
      if (!ready) return <BudgetSkeleton key={index} />;
      const parsed = timelineArgsSchema.safeParse(part.output);
      return parsed.success ? <LaunchTimeline key={index} {...parsed.data} /> : null;
    }
    case 'tool-renderTeamNeeds': {
      if (!ready) return <BudgetSkeleton key={index} />;
      const parsed = teamNeedsArgsSchema.safeParse(part.output);
      return parsed.success ? <TeamNeeds key={index} {...parsed.data} /> : null;
    }
    default:
      return null;
  }
}

// Groups consecutive tool parts together, text parts stay standalone
type Segment =
  | { kind: 'text'; text: string; index: number }
  | { kind: 'tools'; parts: Array<{ type: string; state?: string; output?: unknown; index: number }> };

function segmentParts(parts: Array<{ type: string; state?: string; output?: unknown; text?: string }>): Segment[] {
  const segments: Segment[] = [];
  let toolGroup: Array<{ type: string; state?: string; output?: unknown; index: number }> = [];

  const flushTools = () => {
    if (toolGroup.length > 0) {
      segments.push({ kind: 'tools', parts: toolGroup });
      toolGroup = [];
    }
  };

  parts.forEach((part, i) => {
    if (part.type === 'text') {
      const text = (part as { type: 'text'; text: string }).text;
      if (text.trim()) {
        flushTools();
        segments.push({ kind: 'text', text, index: i });
      }
    } else if (isToolPart(part)) {
      toolGroup.push({ ...part, index: i });
    } else {
      flushTools();
    }
  });

  flushTools();
  return segments;
}

export default function Page() {
  const [chatKey, setChatKey] = useState(0);

  return <Chat key={chatKey} onReset={() => setChatKey((k) => k + 1)} />;
}

function Chat({ onReset }: { onReset: () => void }) {
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
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
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
          {/* Top bar with reset button */}
          <div className="sticky top-0 z-10 flex items-center justify-between py-4">
            <button
              onClick={onReset}
              className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 font-mono text-xs text-neutral-500 backdrop-blur transition-colors hover:border-neutral-700 hover:text-neutral-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Nuova chat
            </button>
          </div>

          <div className="flex-1 space-y-6 pb-20">
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
                    className="flex flex-col gap-4"
                  >
                    {segmentParts(m.parts as Parameters<typeof segmentParts>[0]).map((seg, si) => {
                      if (seg.kind === 'text') {
                        return (
                          <div
                            key={si}
                            className="prose prose-invert prose-sm max-w-none font-mono prose-p:leading-relaxed prose-strong:text-teal-300 prose-li:marker:text-teal-500"
                          >
                            <Markdown remarkPlugins={[remarkGfm]}>{seg.text}</Markdown>
                          </div>
                        );
                      }
                      // Tool group — side by side on md+, stacked on mobile
                      return (
                        <div
                          key={si}
                          className={
                            seg.parts.length > 1
                              ? 'grid grid-cols-1 gap-4 md:grid-cols-2'
                              : 'flex'
                          }
                        >
                          {seg.parts.map((part) => (
                            <ToolComponent key={part.index} part={part} index={part.index} />
                          ))}
                        </div>
                      );
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
