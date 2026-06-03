import { tool } from 'ai';
import { z } from 'zod';

// UN solo schema = single source of truth.
// Lo userà sia il tool (server) sia il componente React (client).
export const budgetArgsSchema = z.object({
  budget: z.number().describe('Il budget in euro estratto dal testo, es. 5000'),
  currency: z.string().default('€').describe('Il simbolo della valuta'),
});

// Best practice 4: il tipo lo derivo dallo schema, non lo riscrivo a mano.
export type BudgetArgs = z.infer<typeof budgetArgsSchema>;

export const tools = {
  // Niente "execute": è un tool di SOLA UI.
  // Il modello estrae gli argomenti, noi li renderizziamo come componente.
  renderBudgetSlider: tool({
    description:
      "Mostra uno slider per raffinare il budget quando l'utente menziona denaro, una cifra o un investimento.",
    inputSchema: budgetArgsSchema,
  }),
};