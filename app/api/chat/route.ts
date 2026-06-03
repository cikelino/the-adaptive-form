import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { tools } from '@/ai/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic('claude-haiku-4-5'), // modello veloce ed economico, ottimo nel tool calling
    system: `Sei un motore di UI generativa per l'onboarding di un progetto.
Analizza l'intento dell'utente e attiva il componente più adatto tramite i tool.
Se l'utente menziona un budget, una cifra o un investimento, chiama SEMPRE renderBudgetSlider
con il valore numerico estratto (in euro). Non rispondere a parole se puoi usare un tool.`,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(2),
  });

  return result.toUIMessageStreamResponse();
}