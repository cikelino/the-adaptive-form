import { tool } from 'ai';
import { z } from 'zod';

// ── BudgetSlider ─────────────────────────────────────────────────────────────

const allocationSchema = z.object({
  channel: z.string().describe('Nome del canale, es. "Meta Ads"'),
  emoji: z.string().describe('Emoji rappresentativa, es. "📱"'),
  percentage: z.number().min(0).max(100).describe('Percentuale del budget'),
});

export const budgetArgsSchema = z.object({
  budget: z.number().describe('Il budget in euro estratto dal testo, es. 5000'),
  currency: z.string().default('€').describe('Il simbolo della valuta'),
  allocations: z
    .array(allocationSchema)
    .min(2)
    .max(5)
    .describe(
      'Ripartizione del budget per canale. Le percentuali devono sommare a 100.',
    ),
});

export type BudgetArgs = z.infer<typeof budgetArgsSchema>;

// ── ChannelRanking ───────────────────────────────────────────────────────────

const channelSchema = z.object({
  name: z.string().describe('Nome del canale, es. "Instagram"'),
  emoji: z.string().describe('Emoji rappresentativa'),
  reason: z.string().describe('Motivo per cui è consigliato per questo progetto (max 12 parole)'),
  difficulty: z.enum(['bassa', 'media', 'alta']).describe('Difficoltà di gestione'),
  minBudget: z.number().describe('Budget minimo mensile consigliato in euro'),
});

export const channelRankingArgsSchema = z.object({
  channels: z
    .array(channelSchema)
    .min(3)
    .max(5)
    .describe('Canali ordinati dal più al meno consigliato per il progetto'),
});

export type ChannelRankingArgs = z.infer<typeof channelRankingArgsSchema>;

// ── Tool registry ────────────────────────────────────────────────────────────

export const tools = {
  renderBudgetSlider: tool({
    description:
      "Mostra uno slider per raffinare il budget con ripartizione per canale. Chiamare quando l'utente menziona denaro, cifre o investimenti.",
    inputSchema: budgetArgsSchema,
    execute: async ({ budget, currency, allocations }) => ({
      budget,
      currency: currency ?? '€',
      allocations,
    }),
  }),

  renderChannelRanking: tool({
    description:
      'Mostra una classifica interattiva dei canali di marketing consigliati in base al tipo di progetto descritto. Chiamare dopo aver capito il settore/tipo di business.',
    inputSchema: channelRankingArgsSchema,
    execute: async ({ channels }) => ({ channels }),
  }),
};
