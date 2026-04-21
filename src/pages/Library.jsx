import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { sendLoreReply } from '../lib/geminiLoreChat'
import { addTome } from '../lib/tomeArchive'

const WELCOME_ID = 'welcome'

const initialMessages = [
  {
    id: WELCOME_ID,
    role: 'assistant',
    text: 'Greetings, seeker. Ask of any legend, and I shall weave what the archives permit. Adjust the Spoiler Shield before you ask-higher values bind me to vaguer chronicles.',
  },
]

// Internal ambient generator; no external audio links required.

/** Key comes from Vite (.env); vite.config.js also maps GEMINI_API_KEY -> this for convenience. */
function readGeminiKey() {
  const raw = import.meta.env.VITE_GEMINI_API_KEY
  return typeof raw === 'string' ? raw.trim() : ''
}

function buildGreeting(game, region) {
  if (!game) return initialMessages[0].text

  const lowered = game.toLowerCase()
  if (lowered.includes('skyrim')) {
    return 'Welcome, traveler. What legends of Tamriel shall we uncover today?'
  }
  if (lowered.includes('witcher')) {
    return 'Welcome, wayfarer. Which chronicles of the Continent call to you?'
  }
  if (lowered.includes('elden ring')) {
    return 'Welcome, Tarnished. Which mysteries of the Lands Between shall we unseal?'
  }
  if (lowered.includes('dark souls')) {
    return 'Welcome, Ashen One. Which embers of old lore shall we examine?'
  }
  if (lowered.includes('bloodborne')) {
    return 'Welcome, hunter. Which whispers of Yharnam seek your attention?'
  }
  return `Welcome, traveler. What legends of ${region || game} shall we uncover today?`
}

export default function Library() {
  const [spoilerShieldEnabled, setSpoilerShieldEnabled] = useState(true)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const logRef = useRef(null)
  const isProcessingRef = useRef(false)
  const processedTopicRef = useRef('')
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedGame = searchParams.get('game')?.trim() || ''
  const selectedRegion = searchParams.get('region')?.trim() || ''
  const activeGame = selectedGame
  const isSpoilerShieldOn = spoilerShieldEnabled

  const apiKey = readGeminiKey()
  const model =
    typeof import.meta.env.VITE_GEMINI_MODEL === 'string'
      ? import.meta.env.VITE_GEMINI_MODEL.trim()
      : ''

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = logRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const askArchivist = useCallback(
    async (text) => {
    if (!text || loading || isProcessingRef.current) return

    if (!apiKey) {
      return
    }

    const userMsg = { id: crypto.randomUUID(), role: 'user', text }
    const historyForApi = messages

    setDraft('')
    setMessages((prev) => [...prev, userMsg])
    isProcessingRef.current = true
    setLoading(true)

    try {
      const replyText = await sendLoreReply({
        apiKey,
        model: model || undefined,
        spoilerShieldEnabled: isSpoilerShieldOn,
        explorationGame: activeGame,
        explorationRegion: selectedRegion,
        historyMessages: historyForApi,
        userMessage: text,
      })

      const newTome = {
        id: crypto.randomUUID(),
        title: `Tome: ${text.slice(0, 52)}${text.length > 52 ? '...' : ''}`,
        question: text,
        answer: replyText,
      }

      addTome(newTome)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: replyText,
          question: text,
        },
      ])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      const isHighDemand =
        message.includes('503') ||
        /high demand/i.test(message) ||
        /unavailable/i.test(message)
      const friendlyMessage = isHighDemand
        ? 'The archives are currently shrouded in a heavy mist. I cannot reach the records at this moment. Please try your request again in a few moments, traveler.'
        : `The archives stirred but could not answer: ${message}`
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: friendlyMessage,
          question: text,
        },
      ])
    } finally {
      isProcessingRef.current = false
      setLoading(false)
    }
    },
    [
      apiKey,
      loading,
      messages,
      model,
      isSpoilerShieldOn,
      activeGame,
      selectedRegion,
    ],
  )

  useEffect(() => {
    const topic = searchParams.get('topic')?.trim()
    if (!topic) {
      processedTopicRef.current = ''
      return
    }
    if (loading) return
    if (processedTopicRef.current === topic) return
    processedTopicRef.current = topic
    setSearchParams({}, { replace: true })
    void askArchivist(topic)
  }, [askArchivist, loading, searchParams, setSearchParams])

  useEffect(() => {
    if (!activeGame) return
    localStorage.setItem('loreExplorerActiveGame', activeGame)
    const greeting = buildGreeting(activeGame, selectedRegion)
    isProcessingRef.current = false
    setLoading(false)
    setDraft('')
    processedTopicRef.current = ''
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: greeting,
      },
    ])
  }, [activeGame, selectedRegion])

  const onSubmit = async (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    await askArchivist(text)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:h-[calc(100svh-5rem)] md:min-h-0 md:py-10">
      <div className="chat-parchment scroll-surface flex min-h-[320px] flex-1 flex-col md:min-h-0">
        <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 px-4 py-3">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-gold-bright">
            Library - {activeGame || 'Lore Chat'}
          </h1>
          <div className="flex min-w-[200px] flex-1 flex-col gap-1 sm:max-w-xs sm:flex-none">
            <div className="flex items-center justify-between text-xs text-parchment-dim">
              <span>Spoiler Shield</span>
              <button
                type="button"
                onClick={() => setSpoilerShieldEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full border transition-colors ${
                  isSpoilerShieldOn
                    ? 'border-gold bg-[#4a382d] shadow-[0_0_16px_rgba(197,160,89,0.65)]'
                    : 'border-iron/60 bg-iron-dark/60'
                }`}
                aria-pressed={isSpoilerShieldOn}
                aria-label="Toggle Spoiler Shield"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-parchment shadow transition-transform ${
                    isSpoilerShieldOn ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="ornate-divider mx-4" role="presentation" aria-hidden="true" />
        <div
          ref={logRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
          role="log"
          aria-live="polite"
          aria-busy={loading}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === 'user'
                  ? 'scroll-surface ml-8 border border-iron/50 bg-[#d8ccb2] px-4 py-3 text-left shadow-[0_3px_10px_rgba(32,23,19,0.25)]'
                  : 'scroll-surface mr-8 border border-iron/50 bg-[#e1d6bf] px-4 py-3 text-left shadow-[0_3px_10px_rgba(32,23,19,0.22)]'
              }
            >
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-iron">
                {m.role === 'user' ? 'You' : 'Archivist'}
              </span>
              <p className="m-0 whitespace-pre-wrap text-ink">{m.text}</p>
            </div>
          ))}
          {loading && (
            <div className="scroll-surface mr-8 border border-iron/50 bg-[#e1d6bf] px-4 py-3 text-left italic text-ink/80">
              The Archivist consults the tomes...
            </div>
          )}
        </div>
        <form
          className="relative flex flex-shrink-0 gap-2 p-4"
          onSubmit={onSubmit}
        >
          {isSpoilerShieldOn && (
            <p className="absolute -top-3 left-4 text-[11px] italic text-ink/70">
              Shield Active: Protective wards are guarding against major plot revelations.
            </p>
          )}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about lore..."
            disabled={loading || !apiKey}
            className="min-w-0 flex-1 rounded-md border border-iron/60 bg-parchment/80 px-3 py-2 text-ink placeholder:text-ink/50 outline-none focus:border-gold/45 focus:ring-1 focus:ring-gold/30 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !draft.trim() || !apiKey}
            className="skyrim-button inline-flex items-center gap-2 rounded-md px-4 py-2 font-[family-name:var(--font-display)] text-sm tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden="true" className="inline-flex">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current">
                <path d="M5 19l4-1 9-9-3-3-9 9-1 4z" strokeWidth="1.5" />
                <path d="M14 5l3 3" strokeWidth="1.5" />
                <path d="M17 17h5v4h-5z" strokeWidth="1.2" />
              </svg>
            </span>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
