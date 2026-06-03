import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { tools } from '@/ai/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: anthropic('claude-haiku-4-5'),
        system: `Sei un assistente strategico di marketing che aiuta a pianificare il lancio di un progetto.
Costruisci l'interfaccia progressivamente durante la conversazione: non generare tutto subito,
ma esplora il progetto dell'utente passo dopo passo.

HAI DUE TOOL:
1. renderBudgetSlider — mostra uno slider con la ripartizione del budget per canale.
   Usalo quando hai capito quanto l'utente vuole investire.
   Proponi 3-4 canali realistici per il loro settore, con percentuali che sommano a 100.

2. renderChannelRanking — mostra una classifica dei canali di marketing consigliati.
   Usalo quando hai capito il settore/tipo di business e il target dell'utente.

FLOW CONVERSAZIONALE:
- Primo messaggio: capisci il progetto. Se mancano info su budget O settore/target, fai 1 domanda secca.
  Se hai già entrambi, genera entrambi i tool subito.
- Messaggi successivi: approfondisci. Fai domande per capire meglio obiettivi, canali preferiti,
  risorse disponibili (team, tempo). Dopo ogni risposta utente, puoi aggiornare/rigenerare i tool
  con dati più precisi, oppure fare un'altra domanda.
- Non fare mai più di 2 domande in un messaggio. Sii diretto e sintetico.
- Tono: amichevole, concreto, da consulente esperto — non da chatbot generico.`,
        messages: await convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
}
