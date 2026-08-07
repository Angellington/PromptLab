export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

export type SendMessageInput = {
  messages: ChatMessage[]
  prompt: string
  ambientContext: string
  model: string
}
