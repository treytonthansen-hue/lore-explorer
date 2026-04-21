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
  const trimmedQuery = query.trim()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GAMES
    return GAMES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) || g.subtitle.toLowerCase().includes(q),
    )
  }, [query])

  const exploreGame = (gameName, region = '') => {
    const cleanName = gameName.trim()
    if (!cleanName) return
    localStorage.setItem('loreExplorerActiveGame', cleanName)
    const params = new URLSearchParams({
      game: cleanName,
      ...(region ? { region } : {}),
    })
    navigate(`/library?${params.toString()}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    exploreGame(trimmedQuery)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="parchment-panel wood-frame scroll-surface border border-gold/20 p-8 md:p-12">
        <h1 className="mb-8 text-center font-[family-name:var(--font-display)] text-4xl font-semibold tracking-wide text-gold-bright md:text-5xl">
          Welcome to the Archives
        </h1>
        <label htmlFor="game-search" className="mb-2 block text-sm font-semibold text-gold">
          Select a game
        </label>
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="game-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games... (e.g. Dragon's Dogma, Divinity)"
            className="w-full rounded-md border border-gold/30 bg-wood-deep/80 px-4 py-3 font-[family-name:var(--font-body)] text-lg text-parchment placeholder:text-parchment-dim/50 outline-none ring-gold/40 focus:border-gold/50 focus:ring-2"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!trimmedQuery}
            className="skyrim-button rounded-md px-4 py-3 font-[family-name:var(--font-display)] text-sm tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
          >
            Explore Lore
          </button>
        </form>
        <ul className="mt-6 space-y-2 text-left" role="listbox" aria-label="Matching games">
          {filtered.length === 0 ? (
            <li>
              <button
                type="button"
                onClick={() => exploreGame(trimmedQuery)}
                disabled={!trimmedQuery}
                className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gold/20 bg-wood-deep/50 px-4 py-3 text-left transition-colors hover:border-gold/45 hover:bg-wood-deep/75 hover:shadow-[0_0_14px_rgba(197,160,89,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="font-[family-name:var(--font-display)] text-parchment">
                  Explore lore for {trimmedQuery || 'your game'}
                </span>
              </button>
            </li>
          ) : (
            filtered.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => exploreGame(g.name, g.subtitle)}
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
