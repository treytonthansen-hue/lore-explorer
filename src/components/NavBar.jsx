import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  [
    'nav-stone rounded-md px-3 py-2 text-sm font-[family-name:var(--font-display)] tracking-wide transition-colors',
    isActive
      ? 'bg-gold/20 text-gold-bright shadow-[inset_0_0_0_1px_rgba(197,160,89,0.6)]'
      : 'text-parchment-dim hover:bg-wood-light/60 hover:text-parchment',
  ].join(' ')

export default function NavBar() {
  return (
    <header className="wood-frame scroll-surface sticky top-0 z-50 border-b border-gold/25">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
        <NavLink
          to="/"
          className="mx-auto inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-widest text-gold-bright no-underline drop-shadow-sm"
        >
          <span aria-hidden="true" className="inline-flex text-gold/90">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current">
              <path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="2" strokeWidth="1.5" />
            </svg>
          </span>
          Lore Explorer
          <span aria-hidden="true" className="inline-flex text-gold/90">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current">
              <path d="M7 4l10 16M17 4L7 20M12 2v20M2 12h20" strokeWidth="1.2" />
            </svg>
          </span>
        </NavLink>
        <div className="sword-divider" role="presentation" aria-hidden="true" />
        <nav className="mx-auto flex flex-wrap items-center gap-1 sm:gap-2" aria-label="Main">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            Library
          </NavLink>
          <NavLink to="/discovery" className={linkClass}>
            Discovery
          </NavLink>
          <NavLink to="/archive" className={linkClass}>
            Archive
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
