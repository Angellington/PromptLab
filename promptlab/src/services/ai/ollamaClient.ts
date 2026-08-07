import type { ChatMessage, SendMessageInput } from '../../features/chat/chatTypes'

type OllamaMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type OllamaChatResponse = {
  message?: { content?: string }
}

const OLLAMA_BASE_URL = ((import.meta.env.VITE_OLLAMA_BASE_URL as string | undefined) ?? "http://localhost:11434").replace(/\/$/, "")

function toOllamaMessages(input: SendMessageInput): OllamaMessage[] {
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
        'Você e o PromptLab, uma IA direta, criativa e pouco massante.',
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

async function listModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
    if (!response.ok) throw new Error(`Ollama respondeu com status ${response.status}.`)
    const data = (await response.json()) as { models?: Array<{ name?: string }> }

    return (data.models ?? []).map((model) => model.name).filter((name): name is string => Boolean(name))
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Nao foi possivel conectar ao Ollama. Confirme que ele esta rodando em localhost:11434.")
    throw error
  }
}

async function sendMessage(input: SendMessageInput): Promise<string> {
  let response: Response
  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: input.model, messages: toOllamaMessages(input), stream: false, options: { temperature: 0.85 } }),
    })
  } catch {
    throw new Error("Nao foi possivel conectar ao Ollama. Confirme que ele esta rodando em localhost:11434.")
  }
  if (!response.ok) throw new Error(`Ollama respondeu com status ${response.status}.`)
  const data = (await response.json()) as OllamaChatResponse
  const content = data.message?.content?.trim()
  console.log("content", content)
  if (!content) throw new Error("Ollama nao retornou uma resposta valida.")
  return content
}

export const ollamaClient = { listModels, sendMessage }

export function createAssistantMessage(content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
  }
}
