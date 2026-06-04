'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BudgetSlider } from '@/components/budget-slider';
import { ChannelRanking } from '@/components/channel-ranking';
import { PersonaCard } from '@/components/persona-card';
import { ValueProposition } from '@/components/value-proposition';
import { LaunchTimeline } from '@/components/launch-timeline';
import { TeamNeeds } from '@/components/team-needs';
import { PLAN_ITEMS, planMeta, type PlanSlot } from '@/lib/plan';

// Placeholder mostrato mentre l'AI sta generando un elemento del piano.
function ArtifactSkeleton({ type }: { type: string }) {
  const meta = planMeta(type);
  return (
    <div className="w-full max-w-md animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="mb-4 flex items-center gap-2 text-neutral-600">
        <span aria-hidden="true">{meta?.emoji}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{meta?.label}</span>
      </div>
      <div className="space-y-2.5">
        <div className="h-3 w-3/4 rounded bg-neutral-800" />
        <div className="h-3 w-1/2 rounded bg-neutral-800" />
        <div className="h-16 w-full rounded-lg bg-neutral-800/60" />
      </div>
    </div>
  );
}

function Artifact({ slot, onUpdate }: { slot: PlanSlot; onUpdate: (data: unknown) => void }) {
  switch (slot.type) {
    case 'tool-renderPersonaCard':
      return <PersonaCard {...slot.data} />;
    case 'tool-renderValueProp':
      return <ValueProposition {...slot.data} />;
    case 'tool-renderChannelRanking':
      return <ChannelRanking {...slot.data} onChange={onUpdate} />;
    case 'tool-renderBudgetSlider':
      return <BudgetSlider {...slot.data} onChange={onUpdate} />;
    case 'tool-renderLaunchTimeline':
      return <LaunchTimeline {...slot.data} />;
    case 'tool-renderTeamNeeds':
      return <TeamNeeds {...slot.data} />;
    default:
      return null;
  }
}

export function PlanCanvas({
  slots,
  pendingTypes = [],
  onUpdate,
  onExport,
  onClose,
  onCollapse,
}: {
  slots: PlanSlot[];
  pendingTypes?: string[];
  onUpdate: (type: string, data: unknown) => void;
  onExport: () => void;
  onClose?: () => void;
  onCollapse?: () => void;
}) {
  const isEmpty = slots.length === 0 && pendingTypes.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header (fisso) */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div>
          <h2 className="font-display text-lg text-neutral-100">Il tuo piano</h2>
          <p className="font-mono text-[11px] text-neutral-500">
            {isEmpty ? 'In costruzione…' : `${slots.length} element${slots.length === 1 ? 'o' : 'i'}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            disabled={isEmpty}
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 font-mono text-xs text-teal-300 transition-colors hover:bg-teal-500/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Esporta
          </button>
          {/* Collassa (desktop): riduce il pannello a icona */}
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="hidden rounded-lg border border-neutral-800 p-1.5 text-neutral-500 transition-colors hover:border-neutral-700 hover:text-neutral-300 lg:block"
              aria-label="Riduci il pannello a icona"
              title="Riduci a icona"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </button>
          )}
          {/* Chiudi (mobile drawer) */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg border border-neutral-800 p-1.5 text-neutral-500 transition-colors hover:text-neutral-300 lg:hidden"
              aria-label="Chiudi"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Body (scroll interno) */}
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-800 px-6 py-12 text-center">
          <p className="font-mono text-xs leading-relaxed text-neutral-600">
            Gli elementi del tuo piano di lancio
            <br />
            appariranno qui mentre conversi.
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {PLAN_ITEMS.map((p) => (
              <span
                key={p.type}
                className="rounded-full border border-neutral-800 px-2.5 py-1 font-mono text-[10px] text-neutral-700"
              >
                {p.emoji} {p.label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="scroll-area grid min-h-0 flex-1 content-start gap-4 overflow-y-auto pr-1"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          <AnimatePresence mode="popLayout">
            {slots.map((slot) => (
              <motion.div
                key={slot.version}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="flex justify-center"
              >
                <Artifact slot={slot} onUpdate={(data) => onUpdate(slot.type, data)} />
              </motion.div>
            ))}
            {pendingTypes.map((type) => (
              <motion.div
                key={`pending-${type}`}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="flex justify-center"
              >
                <ArtifactSkeleton type={type} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
