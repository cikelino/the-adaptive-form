import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { tools } from '@/ai/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: anthropic('claude-haiku-4-5'),
        system: `Sei un assistente di onboarding che costruisce interfacce in tempo reale.
Quando l'utente menziona un budget, una cifra o un investimento, chiama SEMPRE renderBudgetSlider
con il valore numerico estratto (in euro). Dopo aver chiamato il tool, aggiungi UNA risposta testuale
BREVE (massimo 2-3 frasi) che spiega cosa hai capito e cosa rappresenta il controllo mostrato.
Se manca un'informazione essenziale, fai UNA sola domanda secca, non un elenco. Sii sintetico e amichevole.`,
        messages: await convertToModelMessages(messages), tools,
        stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
}