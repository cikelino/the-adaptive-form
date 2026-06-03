# The Adaptive Form

> Non un chatbot, ma un **workspace generativo**: l'AI assembla un piano di lancio
> strutturato e modificabile mentre conversi, esportabile come deliverable.

Un assistente strategico che aiuta a pianificare il lancio di un progetto o di una
startup. Invece di rispondere con muri di testo, l'AI **costruisce l'interfaccia in
tempo reale**: legge il tuo intento e genera componenti interattivi (Generative UI)
che si accumulano in un canvas laterale, pronti per essere affinati ed esportati.

## ✨ Cosa lo rende diverso

- **Generative UI** — l'AI decide *quali componenti mostrare* in base alla conversazione, non solo cosa scrivere.
- **Canvas persistente** — gli elementi generati non scorrono via nella chat: si raccolgono in un pannello modificabile.
- **Editabile** — trascini lo slider del budget, riordini i canali: le modifiche restano nel piano.
- **Esportabile** — un click genera un documento di lancio pronto per *Salva come PDF*. Questo è il vero deliverable.

## 🧩 I 5 tool generativi

| Tool | Componente | Interazione |
|---|---|---|
| `renderPersonaCard` | Card cliente-tipo | Età, pain point, canali, messaggio chiave |
| `renderChannelRanking` | Classifica canali | Drag-to-reorder |
| `renderBudgetSlider` | Slider budget | Ripartizione live per canale |
| `renderLaunchTimeline` | Roadmap verticale | Milestone espandibili |
| `renderTeamNeeds` | Figure necessarie | Priorità + costo mensile totale |

## 🏗️ Architettura

Progetto **full-stack** in un unico codebase Next.js (App Router).

```
Browser (Frontend)              Server (Backend)            Anthropic
  useChat()  ──── POST /api/chat ────▶  route.ts  ──── API ────▶  Claude
     ▲                                     │                         │
     └────────── stream risposta ──────────┴◀────────────────────────┘
```

- **Frontend** — `app/page.tsx`, `components/*`: chat, stato del piano, canvas.
- **Backend** — `app/api/chat/route.ts`: riceve i messaggi, custodisce la chiave API,
  orchestra i tool e fa lo streaming della risposta di Claude.

## 🛠️ Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript
- [Vercel AI SDK](https://sdk.vercel.ai) (`ai`, `@ai-sdk/react`, `@ai-sdk/anthropic`)
- [Claude Haiku 4.5](https://www.anthropic.com) come modello LLM
- [Framer Motion](https://www.framer.com/motion/) per le animazioni
- [Tailwind CSS](https://tailwindcss.com) + [Zod](https://zod.dev) per la validazione degli schemi tool

## 🚀 Sviluppo locale

```bash
npm install
```

Crea un file `.env.local` con la tua chiave Anthropic:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

Poi avvia il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## ☁️ Deploy su Vercel

1. Importa il repo su [vercel.com](https://vercel.com) (login con GitHub).
2. In **Settings → Environment Variables** aggiungi `ANTHROPIC_API_KEY`.
3. Deploy. Vercel esegue l'API route come serverless function.

> ⚠️ L'hosting è gratuito, ma ogni messaggio consuma token Anthropic a carico del proprietario della chiave.
