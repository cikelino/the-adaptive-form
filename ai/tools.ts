import { tool } from 'ai';
import { z } from 'zod';

export const budgetArgsSchema = z.object({
  budget: z.number().describe('Il budget in euro estratto dal testo, es. 5000'),
  currency: z.string().default('€').describe('Il simbolo della valuta'),
});

export type BudgetArgs = z.infer<typeof budgetArgsSchema>;

export const tools = {
  renderBudgetSlider: tool({
    description:
      "Mostra uno slider per raffinare il budget quando l'utente menziona denaro, una cifra o un investimento.",
    inputSchema: budgetArgsSchema,
    // L'execute restituisce i dati come "risultato": rende valida la cronologia
    // (così la chat continua) e permette al modello di spiegare il componente.
    execute: async ({ budget, currency }) => ({ budget, currency: currency ?? '€' }),
  }),
};