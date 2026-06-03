import type { PlanSlot } from './plan';

const esc = (s: unknown) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

const eur = (n: number) => '€' + Number(n).toLocaleString('it-IT');

function section(title: string, body: string) {
  return `<section><h2>${esc(title)}</h2>${body}</section>`;
}

function bodyFor(slot: PlanSlot): string {
  const d = slot.data;
  switch (slot.type) {
    case 'tool-renderPersonaCard':
      return section(
        `${d.emoji} Cliente tipo · ${d.name}`,
        `<p class="muted">${esc(d.age)} — ${esc(d.role)}</p>
         <h3>Cosa la frena</h3>
         <ul>${d.painPoints.map((p: string) => `<li>${esc(p)}</li>`).join('')}</ul>
         <h3>Dove la trovi</h3>
         <p>${d.channels.map((c: string) => `<span class="tag">${esc(c)}</span>`).join(' ')}</p>
         <blockquote>${esc(d.keyMessage)}</blockquote>`,
      );

    case 'tool-renderValueProp':
      return section(
        '💡 Proposta di valore',
        `<p class="big" style="font-size:22px">“${esc(d.headline)}”</p>
         <p class="muted">Invece di: <s>${esc(d.alternative)}</s></p>
         <h3>Problema</h3><p>${esc(d.problem)}</p>
         <h3>Soluzione</h3><p>${esc(d.solution)}</p>
         <h3>Perché te</h3>
         <ul>${d.differentiators.map((x: string) => `<li>${esc(x)}</li>`).join('')}</ul>`,
      );

    case 'tool-renderChannelRanking':
      return section(
        '📡 Canali consigliati',
        `<table>
          <thead><tr><th>#</th><th>Canale</th><th>Perché</th><th>Difficoltà</th><th>Min/mese</th></tr></thead>
          <tbody>${d.channels
            .map(
              (c: { name: string; emoji: string; reason: string; difficulty: string; minBudget: number }, i: number) =>
                `<tr><td>${i + 1}</td><td>${esc(c.emoji)} ${esc(c.name)}</td><td>${esc(c.reason)}</td><td>${esc(
                  c.difficulty,
                )}</td><td>${eur(c.minBudget)}</td></tr>`,
            )
            .join('')}</tbody>
        </table>`,
      );

    case 'tool-renderBudgetSlider':
      return section(
        '💰 Budget di lancio',
        `<p class="big">${eur(d.budget)}</p>
         <table>
          <thead><tr><th>Canale</th><th>%</th><th>Importo</th></tr></thead>
          <tbody>${d.allocations
            .map(
              (a: { channel: string; emoji: string; percentage: number }) =>
                `<tr><td>${esc(a.emoji)} ${esc(a.channel)}</td><td>${a.percentage}%</td><td>${eur(
                  Math.round((d.budget * a.percentage) / 100),
                )}</td></tr>`,
            )
            .join('')}</tbody>
        </table>`,
      );

    case 'tool-renderLaunchTimeline':
      return section(
        '🗓️ Roadmap di lancio',
        `<ol class="timeline">${d.milestones
          .map(
            (m: { week: string; title: string; description: string; phase: string }) =>
              `<li><strong>${esc(m.week)}</strong> · <em>${esc(m.phase)}</em><br><b>${esc(
                m.title,
              )}</b><br><span class="muted">${esc(m.description)}</span></li>`,
          )
          .join('')}</ol>`,
      );

    case 'tool-renderTeamNeeds': {
      const total = d.roles.reduce((s: number, r: { monthlyCost: number }) => s + r.monthlyCost, 0);
      return section(
        '👥 Team necessario',
        `<table>
          <thead><tr><th>Ruolo</th><th>Tipo</th><th>Priorità</th><th>Costo/mese</th></tr></thead>
          <tbody>${d.roles
            .map(
              (r: { title: string; emoji: string; type: string; priority: string; monthlyCost: number }) =>
                `<tr><td>${esc(r.emoji)} ${esc(r.title)}</td><td>${esc(r.type)}</td><td>${esc(
                  r.priority,
                )}</td><td>${eur(r.monthlyCost)}</td></tr>`,
            )
            .join('')}</tbody>
          <tfoot><tr><td colspan="3"><b>Totale</b></td><td><b>${eur(total)}</b></td></tr></tfoot>
        </table>`,
      );
    }

    default:
      return '';
  }
}

export function buildPlanHtml(slots: PlanSlot[]): string {
  const date = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title>Piano di lancio</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: ui-sans-serif, system-ui, sans-serif; color: #1a1a1a; max-width: 760px; margin: 0 auto; padding: 48px 32px; line-height: 1.55; }
  header { border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 32px; }
  header h1 { margin: 0; font-size: 28px; }
  header p { margin: 4px 0 0; color: #777; font-size: 13px; }
  section { margin-bottom: 36px; page-break-inside: avoid; }
  h2 { font-size: 18px; border-left: 3px solid #0d9488; padding-left: 10px; }
  h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .05em; color: #555; margin-bottom: 6px; }
  .muted { color: #777; } .big { font-size: 32px; font-weight: 700; margin: 4px 0 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #eee; }
  th { color: #777; font-weight: 600; font-size: 11px; text-transform: uppercase; }
  tfoot td { border-top: 2px solid #ddd; border-bottom: none; }
  .tag { display: inline-block; background: #f0fdfa; color: #0d9488; border-radius: 999px; padding: 2px 10px; font-size: 12px; margin: 2px; }
  blockquote { border-left: 3px solid #0d9488; background: #f0fdfa; margin: 12px 0 0; padding: 10px 14px; font-style: italic; color: #115e59; }
  ol.timeline { list-style: none; padding: 0; } ol.timeline li { padding: 10px 0; border-bottom: 1px solid #eee; }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; color: #aaa; font-size: 11px; text-align: center; }
  @media print { body { padding: 0; } }
</style></head>
<body>
  <header><h1>Piano di lancio</h1><p>Generato il ${date} · The Adaptive Form</p></header>
  ${slots.map(bodyFor).join('')}
  <footer>Documento generato automaticamente da un assistente AI. Da validare prima dell'uso.</footer>
</body></html>`;
}

// Stampa tramite iframe nascosto same-origin: evita il blocco popup e il
// SecurityError cross-origin di window.open. L'utente può "Salva come PDF".
export function exportPlan(slots: PlanSlot[]) {
  if (slots.length === 0) return;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = win?.document;
  if (!win || !doc) {
    iframe.remove();
    return;
  }

  doc.open();
  doc.write(buildPlanHtml(slots));
  doc.close();

  const cleanup = () => setTimeout(() => iframe.remove(), 1000);
  win.onafterprint = cleanup;

  // Attende il render del documento prima di stampare.
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
}
