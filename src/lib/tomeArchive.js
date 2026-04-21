const TOMES_KEY = 'loreExplorerTomes'

export function loadTomes() {
  try {
    const raw = localStorage.getItem(TOMES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTomes(tomes) {
  localStorage.setItem(TOMES_KEY, JSON.stringify(tomes))
}

export function addTome(tome) {
  const current = loadTomes()
  const latest = current[0]
  if (
    latest &&
    latest.question?.trim() === tome.question?.trim() &&
    latest.answer?.trim() === tome.answer?.trim()
  ) {
    return current
  }
  const next = [tome, ...current]
  saveTomes(next)
  return next
}
