import { Alert, Paper, Stack, Typography } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import type { AmbientProfile } from '../styles/ambient'

export function SettingsPage() {
  const ambient = useOutletContext<AmbientProfile>()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: 'var(--ambient-panel)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h2">Preparacao</Typography>
        <Alert severity="info">
          Os modelos instalados no Ollama aparecem automaticamente ao lado do
          botao Enviar. O Ollama precisa estar em execucao no computador.
        </Alert>
        <Typography color="text.secondary">
          Ambiente atual: {ambient.label}. Trilha sugerida: {ambient.playlistHint}.
        </Typography>
        <Typography color="text.secondary">
          Endereco padrao: http://localhost:11434. Para altera-lo, configure
          VITE_OLLAMA_BASE_URL.
        </Typography>
      </Stack>
    </Paper>
  )
}
