import type { ChatMessage, SendMessageInput } from '../../features/chat/chatTypes'

type DeepSeekMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const DEFAULT_MODEL = 'deepseek-chat'

function toDeepSeekMessages(input: SendMessageInput): DeepSeekMessage[] {
  const history = input.messages
    .filter((message) => message.role !== 'system')
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))

  return [
    {
      role: 'system',
      content: [
        'Voce e o PromptLab, uma IA direta, criativa e pouco massante.',
        'Responda em portugues do Brasil.',
        `Ambiente atual: ${input.ambientContext}.`,
        'Use o ambiente como tom, mas priorize clareza e utilidade.',
      ].join(' '),
    },
    ...history,
    {
      role: 'user',
      content: input.prompt,
    },
  ]
}

async function sendToDeepSeek(input: SendMessageInput): Promise<string> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined

  if (!apiKey) {
    return createLocalFallback(input.prompt)
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_DEEPSEEK_MODEL ?? DEFAULT_MODEL,
      messages: toDeepSeekMessages(input),
      temperature: 0.85,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`DeepSeek respondeu com status ${response.status}`)
  }

  const data = (await response.json()) as DeepSeekResponse
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('DeepSeek nao retornou uma resposta valida.')
  }

  return content
}

function createLocalFallback(prompt: string) {
  return [
    'Estou pronto para conversar pelo DeepSeek assim que a chave estiver configurada.',
    '',
    `Enquanto isso, recebi: "${prompt}"`,
    '',
    'Configure `VITE_DEEPSEEK_API_KEY` para ativar a chamada real. Em producao, prefira um backend/proxy para nao expor a chave no navegador.',
  ].join('\n')
}

export const deepSeekClient = {
  sendMessage: sendToDeepSeek,
}

export function createAssistantMessage(content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
  }
}
