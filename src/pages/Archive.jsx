import { useMemo, useState } from 'react'
import { loadTomes } from '../lib/tomeArchive'

export default function Archive() {
  const tomes = useMemo(() => loadTomes(), [])
  const [selectedId, setSelectedId] = useState(tomes[0]?.id ?? null)
  const activeGame = localStorage.getItem('loreExplorerActiveGame')?.trim() || ''
  const selected = tomes.find((t) => t.id === selectedId) ?? null

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-gold-bright">
        Archive - {activeGame || 'Tomes'}
      </h1>
      {tomes.length === 0 ? (
        <div className="wood-frame scroll-surface border border-gold/25 px-5 py-6 text-parchment-dim">
          <div className="tome-stack-illustration" aria-hidden="true" />
          No Tomes Yet
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-[340px_1fr]">
          <aside className="wood-frame scroll-surface border border-gold/25 p-4">
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-sm tracking-wider text-gold-bright">
              Tome Index
            </h2>
            <div className="space-y-2">
              {tomes.map((tome) => (
                <button
                  key={tome.id}
                  type="button"
                  onClick={() => setSelectedId(tome.id)}
                  className={`w-full rounded-md border px-3 py-3 text-left text-sm transition-colors ${
                    selectedId === tome.id
                      ? 'border-gold bg-gold/15 text-parchment'
                      : 'border-gold/20 bg-wood-deep/30 text-parchment-dim hover:border-gold/45 hover:text-parchment'
                  }`}
                >
                  <span className="block font-[family-name:var(--font-display)]">{tome.title}</span>
                </button>
              ))}
            </div>
          </aside>
          <section className="chat-parchment scroll-surface p-5 text-left">
            <div className="ornate-divider mb-3" role="presentation" aria-hidden="true" />
            {selected && (
              <>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-ink">{selected.title}</h3>
                <p className="mt-2 text-xs text-ink/70">Question</p>
                <p className="text-sm text-ink">{selected.question}</p>
                <p className="mt-4 text-xs text-ink/70">Archivist Entry</p>
                <p className="whitespace-pre-wrap text-sm text-ink">{selected.answer}</p>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
