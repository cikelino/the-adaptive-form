'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence } from 'framer-motion';
import { BudgetSlider } from '@/components/budget-slider';
import { BudgetSkeleton } from '@/components/budget-skeleton';
import { budgetArgsSchema } from '@/ai/tools';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-16">
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) =>
            message.parts.map((part, i) => {
              // Best practice 2: il tool dà DATI, è il client che sceglie il componente.
              if (part.type === 'tool-renderBudgetSlider') {
                if (part.state === 'input-available') {
                  // Best practice 3 + 4: rivalido l'output dell'IA con lo STESSO schema.
                  const parsed = budgetArgsSchema.safeParse(part.input);
                  if (!parsed.success) return null;
                  return <BudgetSlider key={`${message.id}-${i}`} {...parsed.data} />;
                }
                // Best practice 5: skeleton mentre gli argomenti sono in streaming.
                return <BudgetSkeleton key={`${message.id}-${i}`} />;
              }

              if (part.type === 'text' && message.role === 'assistant') {
                return (
                  <p key={`${message.id}-${i}`} className="text-neutral-300">
                    {part.text}
                  </p>
                );
              }
              return null;
            })
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="sticky bottom-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Descrivi il progetto che vuoi lanciare..."
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 font-mono text-neutral-100 outline-none focus:border-teal-400"
          disabled={status === 'streaming'}
        />
      </form>
    </main>
  );
}