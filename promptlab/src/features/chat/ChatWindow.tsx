import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { AmbientProfile } from '../../styles/ambient'
import { createAssistantMessage, ollamaClient } from '../../services/ai/ollamaClient'
import type { ChatMessage } from './chatTypes'
import { markdownToHtml } from './markdown'
import './ChatWindow.css'

type ChatWindowProps = {
  ambient: AmbientProfile
}

type ChatFormValues = {
  prompt: string
}

type ChatState = {
  messages: ChatMessage[]
  isSending: boolean
  error: string | null
}

type ChatAction =
  | { type: 'add-user-message'; message: ChatMessage }
  | { type: 'add-assistant-message'; message: ChatMessage }
  | { type: 'send-start' }
  | { type: 'send-error'; message: string }
  | { type: 'send-finish' }

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Bem-vindo ao PromptLab. Me diga o que você quer criar, testar ou lapidar com IA.',
    createdAt: new Date().toISOString(),
  },
]

const initialChatState: ChatState = {
  messages: initialMessages,
  isSending: false,
  error: null,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'add-user-message':
      return {
        ...state,
        messages: [...state.messages, action.message],
        error: null,
      }
    case 'add-assistant-message':
      return {
        ...state,
        messages: [...state.messages, action.message],
      }
    case 'send-start':
      return {
        ...state,
        isSending: true,
        error: null,
      }
    case 'send-error':
      return {
        ...state,
        error: action.message,
      }
    case 'send-finish':
      return {
        ...state,
        isSending: false,
      }
    default:
      return state
  }
}

export function ChatWindow({ ambient }: ChatWindowProps) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState("")
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setFocus,
  } = useForm<ChatFormValues>({
    defaultValues: {
      prompt: '',
    },
    mode: 'onChange',
  })

  const canSend = isValid && !state.isSending && Boolean(selectedModel)
  const ambientContext = useMemo(
    () => `${ambient.label}; trilha sugerida: ${ambient.playlistHint}`,
    [ambient],
  )
  const promptField = register('prompt', {
    required: 'Digite uma mensagem antes de enviar.',
    maxLength: {
      value: 4000,
      message: 'A mensagem deve ter no maximo 4000 caracteres.',
    },
    validate: (value) =>
      value.trim().length > 0 || 'Digite uma mensagem antes de enviar.',
  })

  useEffect(() => {
    let active = true
    ollamaClient.listModels().then((installedModels) => {
      if (!active) return
      setModels(installedModels)
      setSelectedModel((current) => current || installedModels[0] || "")
      setModelsError(installedModels.length === 0 ? "Nenhum modelo instalado. Use `ollama pull <modelo>` no terminal." : null)
    }).catch((error: unknown) => {
      if (!active) return
      setModelsError(error instanceof Error ? error.message : "Nao foi possivel listar os modelos locais.")
    }).finally(() => { if (active) setIsLoadingModels(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const thread = threadRef.current
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' })
  }, [state.messages, state.isSending])

  const handlePromptSubmit: SubmitHandler<ChatFormValues> = async (values) => {
    const cleanPrompt = values.prompt.trim()

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: cleanPrompt,
      createdAt: new Date().toISOString(),
    }

    reset()
    dispatch({ type: 'add-user-message', message: userMessage })
    dispatch({ type: 'send-start' })

    try {
      const content = await ollamaClient.sendMessage({
        messages: state.messages,
        prompt: cleanPrompt,
        ambientContext,
        model: selectedModel,
      })

      dispatch({
        type: 'add-assistant-message',
        message: createAssistantMessage(content),
      })
    } catch (requestError) {
      dispatch({
        type: 'send-error',
        message:
          requestError instanceof Error
            ? requestError.message
            : 'Nao foi possivel enviar a mensagem.',
      })
    } finally {
      dispatch({ type: 'send-finish' })
      setFocus('prompt')
    }
  }

  return (
    <Paper className="chat-window" elevation={0}>
      <Box ref={threadRef} className="chat-thread" aria-live="polite">
        {state.messages.map((message) => (
          <Box
            key={message.id}
            className={`chat-message chat-message--${message.role}`}
          >
            <Typography variant="caption" color="text.secondary">
              {message.role === 'user' ? 'Você' : 'PromptLab'}
            </Typography>
            <Box className="markdown-message" dangerouslySetInnerHTML={{ __html: markdownToHtml(message.content) }} />
          </Box>
        ))}
        {state.isSending ? (
          <Box className="chat-message chat-message--assistant">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <CircularProgress size={16} />
              <Typography color="text.secondary">Pensando no clima certo...</Typography>
            </Stack>
          </Box>
        ) : null}
      </Box>

      {modelsError ? <Alert severity="warning">{modelsError}</Alert> : null}

      {state.error ? <Alert severity="error">{state.error}</Alert> : null}

      <Box
        component="form"
        className="chat-composer"
        onSubmit={handleSubmit(handlePromptSubmit)}
      >
        <TextField
          name={promptField.name}
          inputRef={promptField.ref}
          onBlur={promptField.onBlur}
          onChange={promptField.onChange}
          placeholder="Escreva uma ideia, prompt, duvida ou teste de modelo..."
          error={Boolean(errors.prompt)}
          helperText={errors.prompt?.message}
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
        />
        <Box className="chat-composer__actions">
          <FormControl size="small" className="chat-model-select">
            <InputLabel id="ollama-model-label">Modelos no computador</InputLabel>
            <Select labelId="ollama-model-label" value={selectedModel} label="Modelos no computador" onChange={(event) => setSelectedModel(event.target.value)} disabled={isLoadingModels || models.length === 0 || state.isSending}>
              {models.map((model) => <MenuItem key={model} value={model}>{model}</MenuItem>)}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" disabled={!canSend}>
            {state.isSending ? "Enviando..." : "Enviar"}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
