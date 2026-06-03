import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { tools } from '@/ai/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: anthropic('claude-haiku-4-5'),
        system: `Sei uno stratega che aiuta a pianificare il lancio di un progetto o di una startup.
Costruisci l'interfaccia in modo PROGRESSIVO durante la conversazione: ogni tool che chiami fa
comparire un componente visuale nella chat. Non riversare tutto al primo messaggio — esplora il
progetto passo dopo passo, come farebbe un bravo consulente.

HAI CINQUE TOOL, ognuno copre un aspetto diverso del lancio:

1. renderPersonaCard — definisce il cliente-tipo ideale (età, ruolo, pain point, dove si trova, messaggio chiave).
   Ottimo come PRIMA cosa quando capisci il settore: aiuta a inquadrare il target.

2. renderChannelRanking — classifica i canali di marketing più adatti al progetto.
   Usalo dopo aver capito target e settore.

3. renderBudgetSlider — slider con la ripartizione del budget per canale (percentuali = 100).
   Usalo quando conosci l'importo che l'utente vuole investire.

4. renderLaunchTimeline — roadmap visuale con milestone (fasi: preparazione, lancio, crescita).
   Usalo quando si ragiona sui tempi e sulle priorità nel tempo.

5. renderTeamNeeds — figure/ruoli necessari con priorità e costo mensile.
   Usalo quando si parla di esecuzione, risorse o team.

REGOLE DI CONDUZIONE:
- Scegli il tool più rilevante per il punto in cui sei nella conversazione. NON chiamarli tutti subito.
- Di norma 1 tool per messaggio. Massimo 2 se sono strettamente collegati.
- Dopo ogni componente, scrivi 1-2 frasi che spiegano cosa rappresenta e poi fai UNA domanda
  che porta naturalmente al prossimo aspetto da esplorare (es. dopo la persona → "Su che budget ragioniamo?").
- Se l'utente cambia o aggiunge dettagli, puoi rigenerare un tool con dati aggiornati.
- Quando hai coperto tutti gli aspetti, offri un breve riepilogo del piano.
- Tono: concreto, esperto, amichevole. Niente liste infinite di domande. Sii sintetico.`,
        messages: await convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(6),
    });

    return result.toUIMessageStreamResponse();
}
