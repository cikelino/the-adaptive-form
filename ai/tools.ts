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
    .describe('Ripartizione del budget per canale. Le percentuali devono sommare a 100.'),
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

// ── PersonaCard ──────────────────────────────────────────────────────────────

export const personaArgsSchema = z.object({
  name: z.string().describe('Nome fittizio della persona, es. "Giulia"'),
  emoji: z.string().describe('Emoji/avatar rappresentativo, es. "🧑‍💼"'),
  age: z.string().describe('Fascia d\'età, es. "28-35"'),
  role: z.string().describe('Occupazione o ruolo, es. "Manager urbana attenta al benessere"'),
  painPoints: z.array(z.string()).min(2).max(4).describe('Problemi/bisogni principali del target'),
  channels: z.array(z.string()).min(2).max(4).describe('Dove si trova online, es. ["Instagram", "Podcast"]'),
  keyMessage: z.string().describe('Il messaggio chiave che risuona con questa persona (1 frase)'),
});

export type PersonaArgs = z.infer<typeof personaArgsSchema>;

// ── LaunchTimeline ───────────────────────────────────────────────────────────

const milestoneSchema = z.object({
  week: z.string().describe('Etichetta temporale, es. "Sett. 1-2" o "Mese 1"'),
  title: z.string().describe('Titolo della milestone, es. "Validazione idea"'),
  description: z.string().describe('Cosa fare in questa fase (max 15 parole)'),
  phase: z.enum(['preparazione', 'lancio', 'crescita']).describe('Fase del progetto'),
});

export const timelineArgsSchema = z.object({
  milestones: z
    .array(milestoneSchema)
    .min(3)
    .max(6)
    .describe('Milestone in ordine cronologico dal primo all\'ultimo'),
});

export type TimelineArgs = z.infer<typeof timelineArgsSchema>;

// ── TeamNeeds ────────────────────────────────────────────────────────────────

const roleSchema = z.object({
  title: z.string().describe('Titolo del ruolo, es. "Social Media Manager"'),
  emoji: z.string().describe('Emoji rappresentativa'),
  type: z.enum(['interno', 'freelance', 'agenzia']).describe('Tipo di collaborazione consigliata'),
  priority: z.enum(['subito', 'presto', 'dopo']).describe('Urgenza dell\'assunzione'),
  monthlyCost: z.number().describe('Costo mensile stimato in euro'),
});

export const teamNeedsArgsSchema = z.object({
  roles: z
    .array(roleSchema)
    .min(2)
    .max(5)
    .describe('Ruoli necessari ordinati per priorità'),
});

export type TeamNeedsArgs = z.infer<typeof teamNeedsArgsSchema>;

// ── Tool registry ────────────────────────────────────────────────────────────

export const tools = {
  renderBudgetSlider: tool({
    description:
      "Mostra uno slider per raffinare il budget con ripartizione per canale. Chiamare quando si conosce l'importo che l'utente vuole investire.",
    inputSchema: budgetArgsSchema,
    execute: async ({ budget, currency, allocations }) => ({
      budget,
      currency: currency ?? '€',
      allocations,
    }),
  }),

  renderChannelRanking: tool({
    description:
      'Mostra una classifica interattiva dei canali di marketing consigliati in base al tipo di progetto. Chiamare dopo aver capito settore e target.',
    inputSchema: channelRankingArgsSchema,
    execute: async ({ channels }) => ({ channels }),
  }),

  renderPersonaCard: tool({
    description:
      'Mostra una card del cliente-tipo (buyer persona) del progetto: età, ruolo, pain point, canali e messaggio chiave. Chiamare quando si vuole definire il target ideale.',
    inputSchema: personaArgsSchema,
    execute: async (args) => args,
  }),

  renderLaunchTimeline: tool({
    description:
      'Mostra una timeline visuale con le milestone del lancio (preparazione → lancio → crescita). Chiamare quando si pianifica la roadmap nel tempo.',
    inputSchema: timelineArgsSchema,
    execute: async ({ milestones }) => ({ milestones }),
  }),

  renderTeamNeeds: tool({
    description:
      'Mostra i ruoli/figure necessari per realizzare il progetto con priorità e costo mensile stimato. Chiamare quando si parla di team, risorse o esecuzione.',
    inputSchema: teamNeedsArgsSchema,
    execute: async ({ roles }) => ({ roles }),
  }),
};
