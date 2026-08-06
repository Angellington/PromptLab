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
          A rota de ajustes ja esta separada para receber selecao de modelo,
          audio, temas por horario e credenciais via backend/proxy.
        </Alert>
        <Typography color="text.secondary">
          Ambiente atual: {ambient.label}. Trilha sugerida: {ambient.playlistHint}.
        </Typography>
        <Typography color="text.secondary">
          Variaveis previstas: VITE_DEEPSEEK_API_KEY e VITE_DEEPSEEK_MODEL.
        </Typography>
      </Stack>
    </Paper>
  )
}
