import { useNavigate } from 'react-router-dom'

const LORE_CARDS = [
  {
    id: '1',
    game: 'ELDEN RING',
    title: 'The Shattering',
    snippet: 'A ruinous war among Queen Marika\'s demigod offspring after the Elden Ring was broken.',
  },
  {
    id: '2',
    game: 'ELDEN RING',
    title: 'The Night of Black Knives',
    snippet: 'The assassination of Godwyn the Golden, a turning point that shattered divine order.',
  },
  {
    id: '3',
    game: 'THE WITCHER 3',
    title: 'The Conjunction of the Spheres',
    snippet: 'The cataclysm that brought monsters, magic, and humans into the same world.',
  },
  {
    id: '4',
    game: 'THE WITCHER 3',
    title: 'The Trial of the Grasses',
    snippet: 'The brutal alchemical mutations and ordeals that forge a Witcher from a child.',
  },
  {
    id: '5',
    game: 'DARK SOULS III',
    title: 'The Linking of the Fire',
    snippet: 'The recurring choice to rekindle the First Flame and prolong the Age of Fire.',
  },
  {
    id: '6',
    game: 'BLOODBORNE',
    title: 'The Healing Church',
    snippet: 'Yharnam\'s blood ministration institution, whose miracles hide dreadful consequences.',
  },
  {
    id: '7',
    game: 'Skyrim',
    title: 'The Night of Tears',
    snippet: 'A tragic clash in Saarthal that reshaped Nordic and Snow Elf history.',
  },
  {
    id: '8',
    game: 'Skyrim',
    title: 'The Falmer Rebellion',
    snippet: 'How betrayal, survival, and Dwemer influence transformed an entire people.',
  },
  {
    id: '9',
    game: 'Skyrim',
    title: 'The Dragon War',
    snippet: 'The age when dragon priests ruled and mortals first turned against dragonkind.',
  },
  {
    id: '10',
    game: 'Skyrim',
    title: 'The Rise of the Dawnguard',
    snippet: 'A frontier order forged to resist vampire domination in Skyrim.',
  },
]

export default function Discovery() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-gold-bright md:text-4xl">
          Discovery
        </h1>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {LORE_CARDS.map((card) => (
          <li key={card.id}>
            <article className="wood-frame parchment-panel scroll-surface flex h-full flex-col border border-gold/25 p-5 transition-all duration-200 hover:-translate-y-[5px] hover:border-gold hover:shadow-[0_0_16px_rgba(197,160,89,0.35)]">
              <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
                {card.game}
              </span>
              <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg text-parchment">
                {card.title}
              </h2>
              <p className="m-0 flex-1 text-sm leading-relaxed text-parchment-dim/95">
                {card.snippet}
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(`/library?topic=${encodeURIComponent(card.title)}`)
                }
                className="skyrim-button mt-4 self-start rounded px-3 py-1.5 text-xs font-[family-name:var(--font-display)] transition-colors"
              >
                Ask Archivist
              </button>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}


