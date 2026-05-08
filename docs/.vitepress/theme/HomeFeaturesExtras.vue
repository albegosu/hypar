<script setup lang="ts">
interface Highlight {
  title: string
  details: string
  icon: string
}

interface Stage {
  num: string
  label: string
  status?: 'now' | 'next'
}

// Six highlights — what fragua actually does today. Pillars (above) explain
// why; these explain what's inside. Keep details to one short sentence.
const highlights: Highlight[] = [
  {
    title: 'Hybrid retrieval',
    details: 'pgvector cosine similarity combined with BM25, then MMR diversification.',
    icon: '<path d="M4 4h6v6H4z"/><path d="M14 14h6v6h-6z"/><path d="M10 10l4 4"/>',
  },
  {
    title: 'Multi-provider embeddings',
    details: 'Gemini, OpenAI or Ollama. Switch at runtime without re-ingesting.',
    icon: '<path d="M7 7h10v10H7z"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M12 3v4"/><path d="M12 17v4"/>',
  },
  {
    title: 'Durable ingestion',
    details: 'Workflow SDK with per-step retries; status polled, never lost on restart.',
    icon: '<path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h16"/><path d="M18 9l3 3-3 3"/>',
  },
  {
    title: 'Eval harness',
    details: 'Hit-rate, MRR, p50/p95 latency over a JSONL golden set, on every run.',
    icon: '<path d="M12 2v6"/><circle cx="12" cy="14" r="8"/><path d="M9 14l2 2 4-4"/>',
  },
  {
    title: 'Source citations',
    details: 'Inline [1], [2] markers persisted on every assistant message and audited.',
    icon: '<path d="M7 7h3v6H7z"/><path d="M14 7h3v6h-3z"/><path d="M7 17h10"/>',
  },
  {
    title: 'Rate limits and admin auth',
    details: '30/min chat, 10/min upload. Admin endpoints fail closed without a key.',
    icon: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>',
  },
]

const stages: Stage[] = [
  { num: '01', label: 'Traceability', status: 'now' },
  { num: '02', label: 'Measurable quality', status: 'next' },
  { num: '03', label: 'SOTA retrieval' },
  { num: '04', label: 'Robustness' },
  { num: '05', label: 'Pluggable' },
  { num: '06', label: 'Beyond text' },
  { num: '07', label: 'Real memory' },
  { num: '08', label: 'Knowledge graph' },
  { num: '09', label: 'Self-hosted' },
  { num: '10', label: 'Live product' },
]

const stack = ['Nuxt 3', 'pgvector', 'AI SDK', 'Workflow SDK', 'Prisma 7']
</script>

<template>
  <section class="hfx">
    <!-- What's inside -->
    <div class="hfx__block">
      <p class="hfx__eyebrow">What's inside</p>
      <div class="hfx__grid hfx__grid--2">
        <div v-for="h in highlights" :key="h.title" class="hfx__highlight">
          <span class="hfx__highlight-icon" v-html="`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'>${h.icon}</svg>`" />
          <div>
            <p class="hfx__highlight-title">{{ h.title }}</p>
            <p class="hfx__highlight-details">{{ h.details }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Roadmap track -->
    <div class="hfx__block">
      <div class="hfx__row">
        <p class="hfx__eyebrow">Roadmap — 10 stages, no calendar</p>
        <a
          href="https://github.com/albegosu/from-zero-rag/blob/main/PRODUCT-ROADMAP.md"
          class="hfx__link"
          target="_blank"
          rel="noopener"
        >View full roadmap →</a>
      </div>
      <div class="hfx__grid hfx__grid--5">
        <div
          v-for="s in stages"
          :key="s.num"
          class="hfx__stage"
          :class="{ 'hfx__stage--now': s.status === 'now', 'hfx__stage--next': s.status === 'next' }"
        >
          <p class="hfx__stage-num">
            {{ s.num }}<span v-if="s.status === 'now'"> · Now</span><span v-else-if="s.status === 'next'"> · Next</span>
          </p>
          <p class="hfx__stage-label">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <!-- Learner CTA -->
    <div class="hfx__block">
      <a href="/features/learning-quest" class="hfx__learner">
        <span class="hfx__learner-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3l10 5-10 5L2 8z" /><path d="M6 10v5c0 2 3 3 6 3s6-1 6-3v-5" />
          </svg>
        </span>
        <div class="hfx__learner-body">
          <p class="hfx__learner-title">Learning RAG from zero?</p>
          <p class="hfx__learner-details">
            Nine interactive challenges across three levels: embeddings, chunking, vector DB. Real code, instant validation.
          </p>
        </div>
        <span class="hfx__learner-cta">Start the quest →</span>
      </a>
    </div>

    <!-- Footer stack + stats -->
    <div class="hfx__block hfx__footer">
      <div>
        <p class="hfx__eyebrow">Built with</p>
        <div class="hfx__stack">
          <span v-for="s in stack" :key="s" class="hfx__chip">{{ s }}</span>
        </div>
      </div>
      <div class="hfx__stats">
        <div class="hfx__stat"><p class="hfx__stat-value">MIT</p><p class="hfx__stat-label">License</p></div>
        <div class="hfx__stat"><p class="hfx__stat-value">v0.4</p><p class="hfx__stat-label">Latest</p></div>
        <a class="hfx__stat hfx__stat--link" href="https://github.com/albegosu/from-zero-rag" target="_blank" rel="noopener">
          <p class="hfx__stat-value">GitHub</p><p class="hfx__stat-label">Source</p>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hfx {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 64px;
}
@media (min-width: 768px) { .hfx { padding: 0 48px 80px; } }
@media (min-width: 960px) { .hfx { padding: 0 64px 96px; } }

.hfx__block { margin-top: 48px; }
.hfx__row { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 16px; }

.hfx__eyebrow {
  font-size: 12px; font-weight: 500; margin: 0 0 16px;
  color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.06em;
}
.hfx__row .hfx__eyebrow { margin-bottom: 0; }

.hfx__link {
  font-size: 13px; color: var(--vp-c-brand-1); text-decoration: none; flex-shrink: 0;
}
.hfx__link:hover { text-decoration: underline; }

.hfx__grid { display: grid; gap: 12px; }
.hfx__grid--2 { grid-template-columns: 1fr; }
.hfx__grid--5 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 640px) {
  .hfx__grid--2 { grid-template-columns: repeat(2, 1fr); }
  .hfx__grid--5 { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
}

.hfx__highlight {
  display: flex; gap: 12px; padding: 14px;
  background: var(--vp-c-bg-soft); border-radius: 10px;
}
.hfx__highlight-icon {
  flex-shrink: 0; color: var(--vp-c-text-2); display: inline-flex;
  width: 22px; height: 22px;
}
.hfx__highlight-icon :deep(svg) { width: 100%; height: 100%; }
.hfx__highlight-title { font-size: 14px; font-weight: 500; margin: 0; color: var(--vp-c-text-1); }
.hfx__highlight-details { font-size: 13px; margin: 4px 0 0; color: var(--vp-c-text-2); line-height: 1.5; }

.hfx__stage {
  padding: 12px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
}
.hfx__stage--now {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}
.hfx__stage--next {
  border-color: var(--vp-c-divider);
}
.hfx__stage-num {
  font-size: 11px; font-weight: 500; margin: 0 0 4px;
  color: var(--vp-c-text-3); letter-spacing: 0.02em;
}
.hfx__stage--now .hfx__stage-num { color: var(--vp-c-brand-1); }
.hfx__stage-label { font-size: 13px; font-weight: 500; margin: 0; color: var(--vp-c-text-1); }

.hfx__learner {
  display: flex; align-items: center; gap: 16px;
  padding: 18px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none; color: inherit;
  transition: border-color .15s ease;
}
.hfx__learner:hover { border-color: var(--vp-c-brand-1); }
.hfx__learner-icon {
  flex-shrink: 0; width: 44px; height: 44px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--vp-c-bg); border-radius: 10px; color: var(--vp-c-text-2);
}
.hfx__learner-icon svg { width: 24px; height: 24px; }
.hfx__learner-body { flex: 1; min-width: 0; }
.hfx__learner-title { font-size: 15px; font-weight: 500; margin: 0 0 2px; color: var(--vp-c-text-1); }
.hfx__learner-details { font-size: 13px; margin: 0; color: var(--vp-c-text-2); line-height: 1.5; }
.hfx__learner-cta { font-size: 13px; color: var(--vp-c-brand-1); flex-shrink: 0; }

.hfx__footer {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 24px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
}
.hfx__stack { display: flex; gap: 6px; flex-wrap: wrap; }
.hfx__chip {
  font-size: 12px; padding: 4px 10px;
  background: var(--vp-c-bg-soft); border-radius: 999px; color: var(--vp-c-text-2);
}
.hfx__stats { display: flex; gap: 20px; align-items: flex-start; }
.hfx__stat { text-align: center; text-decoration: none; color: inherit; }
.hfx__stat-value { font-size: 18px; font-weight: 500; margin: 0; color: var(--vp-c-text-1); }
.hfx__stat-label { font-size: 11px; margin: 2px 0 0; color: var(--vp-c-text-3); }
.hfx__stat--link:hover .hfx__stat-value { color: var(--vp-c-brand-1); }
</style>
