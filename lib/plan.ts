import type { ZodTypeAny } from 'zod';
import {
  budgetArgsSchema,
  channelRankingArgsSchema,
  personaArgsSchema,
  valuePropArgsSchema,
  timelineArgsSchema,
  teamNeedsArgsSchema,
} from '@/ai/tools';

// Metadata canonico dei tool: definisce ANCHE l'ordine logico nel piano.
export const PLAN_ITEMS: { type: string; label: string; emoji: string; schema: ZodTypeAny }[] = [
  { type: 'tool-renderPersonaCard', label: 'Cliente tipo', emoji: '🧑‍💼', schema: personaArgsSchema },
  { type: 'tool-renderValueProp', label: 'Proposta di valore', emoji: '💡', schema: valuePropArgsSchema },
  { type: 'tool-renderChannelRanking', label: 'Canali', emoji: '📡', schema: channelRankingArgsSchema },
  { type: 'tool-renderBudgetSlider', label: 'Budget', emoji: '💰', schema: budgetArgsSchema },
  { type: 'tool-renderLaunchTimeline', label: 'Roadmap', emoji: '🗓️', schema: timelineArgsSchema },
  { type: 'tool-renderTeamNeeds', label: 'Team', emoji: '👥', schema: teamNeedsArgsSchema },
];

export function planMeta(type: string) {
  return PLAN_ITEMS.find((p) => p.type === type);
}

export function isToolPart(part: { type: string }) {
  return PLAN_ITEMS.some((p) => p.type === part.type);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlanSlot = { type: string; version: string; data: any };

type LooseMessage = {
  id: string;
  parts: { type: string; state?: string; output?: unknown }[];
};

// Estrae dai messaggi l'ULTIMA versione valida di ogni tool, in ordine canonico.
export function derivePlan(messages: LooseMessage[]): PlanSlot[] {
  const latest: Record<string, PlanSlot> = {};

  for (const m of messages) {
    m.parts.forEach((part, i) => {
      const meta = planMeta(part.type);
      if (!meta || part.state !== 'output-available') return;
      const parsed = meta.schema.safeParse(part.output);
      if (!parsed.success) return;
      latest[part.type] = { type: part.type, version: `${m.id}:${i}`, data: parsed.data };
    });
  }

  return PLAN_ITEMS.filter((p) => latest[p.type]).map((p) => latest[p.type]);
}
