import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GAMES = [
  { id: '1', name: 'Elden Ring', subtitle: 'Lands Between' },
  { id: '2', name: 'Dark Souls III', subtitle: 'Ashen One' },
  { id: '3', name: 'The Elder Scrolls V: Skyrim', subtitle: 'Tamriel' },
  { id: '4', name: 'The Witcher 3', subtitle: 'Continent' },
  { id: '5', name: 'Bloodborne', subtitle: 'Yharnam' },
  { id: '6', name: 'Dragon Age: Inquisition', subtitle: 'Thedas' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GAMES
    return GAMES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) || g.subtitle.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="parchment-panel wood-frame scroll-surface border border-gold/20 p-8 md:p-12">
        <h1 className="mb-8 text-center font-[family-name:var(--font-display)] text-4xl font-semibold tracking-wide text-gold-bright md:text-5xl">
          Welcome to the Archives
        </h1>
        <label htmlFor="game-search" className="mb-2 block text-sm font-semibold text-gold">
          Select a game
        </label>
        <input
          id="game-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games… (e.g. Elden, Witcher)"
          className="w-full rounded-md border border-gold/30 bg-wood-deep/80 px-4 py-3 font-[family-name:var(--font-body)] text-lg text-parchment placeholder:text-parchment-dim/50 outline-none ring-gold/40 focus:border-gold/50 focus:ring-2"
          autoComplete="off"
        />
        <ul className="mt-6 space-y-2 text-left" role="listbox" aria-label="Matching games">
          {filtered.length === 0 ? (
            <li className="rounded-md border border-gold/15 bg-wood-deep/40 px-4 py-3 text-parchment-dim">
              No games match &ldquo;{query}&rdquo;. Try another search.
            </li>
          ) : (
            filtered.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/library?game=${encodeURIComponent(g.name)}&region=${encodeURIComponent(g.subtitle)}`,
                    )
                  }
                  className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gold/15 bg-wood-deep/50 px-4 py-3 text-left transition-colors hover:border-gold/40 hover:bg-wood-deep/75 hover:shadow-[0_0_14px_rgba(197,160,89,0.3)]"
                >
                  <span className="font-[family-name:var(--font-display)] text-parchment">
                    {g.name}
                  </span>
                  <span className="text-sm text-parchment-dim">{g.subtitle}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
