import { GoogleGenerativeAI } from '@google/generative-ai'

/** Prefer newer models; we fall back automatically if one is unavailable. */
const MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
]

export const DEFAULT_MODEL = MODEL_FALLBACKS[0]

export function buildSpoilerShieldInstruction(shieldEnabled, selectedGame) {
  const baseRules = `You are the Archivist in "Lore Explorer AI," a fantasy video-game lore assistant.

Default spoiler behavior:
- Favor spoiler-light answers first.
- Use concise, clear lore explanations.
- If a question requests major plot reveals, comply carefully and mark sensitive details.`

  if (!shieldEnabled) {
    return `${baseRules}

Spoiler Shield is OFF. You may discuss spoilers when needed to answer accurately.
Stay in character as a scholarly archivist.`
  }

  return `${baseRules}

Spoiler Shield is ON.
CRITICAL: The user has activated a Spoiler Shield. You are FORBIDDEN from mentioning ending plot points, final bosses, or major character deaths from ${
    selectedGame || 'the selected game'
  } unless the user explicitly asks for spoilers.
If a user asks a general lore question, keep your answers focused on world history and early-game legends only.

Additional enforcement rules:
- Never volunteer endgame revelations.
- If uncertain whether a detail is late-game, treat it as a spoiler and avoid it.
- If the user explicitly asks for spoilers, preface with: "Spoiler warning requested by user."

Stay in character as a scholarly archivist. If refusing detail, be polite and brief.`
}

function toGeminiHistory(messages) {
  const trimmed = [...messages]
  while (trimmed.length > 0 && trimmed[0].role !== 'user') {
    trimmed.shift()
  }
  return trimmed.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))
}

function modelOrder(preferred) {
  const first = (preferred || '').trim()
  const rest = MODEL_FALLBACKS.filter((m) => m !== first)
  return first ? [first, ...rest] : [...MODEL_FALLBACKS]
}

function isLikelyModelNotFound(err) {
  const s = `${err?.message || err || ''}`.toLowerCase()
  return (
    s.includes('not found') ||
    s.includes('404') ||
    s.includes('invalid model') ||
    s.includes('does not exist') ||
    s.includes('unsupported')
  )
}

function formatApiError(err) {
  if (err && typeof err.message === 'string' && err.message) return err.message
  return String(err)
}

function extractResponseText(result) {
  const response = result?.response
  if (!response) {
    throw new Error('No response from Gemini. Check your API key and network.')
  }
  try {
    const t = response.text()
    if (t && t.trim()) return t.trim()
  } catch (e) {
    throw new Error(formatApiError(e))
  }
  throw new Error(
    'The model returned no usable text (it may have been blocked by safety filters). Try rephrasing or lowering the Spoiler Shield.',
  )
}

/**
 * @param {object} opts
 * @param {string} opts.apiKey
 * @param {string} [opts.model]
 * @param {boolean} opts.spoilerShieldEnabled
 * @param {Array<{ role: 'user' | 'assistant', text: string }>} opts.historyMessages
 * @param {string} opts.userMessage
 * @returns {Promise<string>}
 */
export async function sendLoreReply({
  apiKey,
  model: modelName,
  spoilerShieldEnabled,
  explorationGame,
  explorationRegion,
  historyMessages,
  userMessage,
}) {
  if (!apiKey?.trim()) {
    throw new Error(
      'Missing API key. Add VITE_GEMINI_API_KEY to your .env file in the project root, save, then restart npm run dev.',
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim())
  const contextInstruction = explorationGame
    ? `\n\nCurrent exploration context (hidden app state):\n- Selected game: ${explorationGame}\n${
        explorationRegion ? `- Region/setting: ${explorationRegion}\n` : ''
      }Prioritize lore relevance to this game unless the user asks to switch games.`
    : ''
  const systemInstruction =
    buildSpoilerShieldInstruction(spoilerShieldEnabled, explorationGame) +
    contextInstruction
  const history = toGeminiHistory(historyMessages)
  const contents = [...history, { role: 'user', parts: [{ text: userMessage }] }]

  const models = modelOrder(modelName)
  let lastError = null

  for (const modelId of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction,
      })
      const result = await model.generateContent({ contents })
      return extractResponseText(result)
    } catch (err) {
      lastError = err
      if (isLikelyModelNotFound(err) && models.indexOf(modelId) < models.length - 1) {
        continue
      }
      throw new Error(formatApiError(err))
    }
  }

  throw new Error(formatApiError(lastError))
}
