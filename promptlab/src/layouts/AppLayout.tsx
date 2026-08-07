import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import { useAmbientProfile } from '../styles/useAmbientProfile'
import './AppLayout.css'

export function AppLayout() {
  const ambient = useAmbientProfile()

  return (
    <Box
      className="app-shell"
      sx={{
        '--ambient-bg': ambient.background,
        '--ambient-glow': ambient.glow,
        '--ambient-panel': ambient.panel,
      }}
    >
      <Container maxWidth="xl" className="app-frame">
        <Box component="header" className="app-header">
          <Stack spacing={0.5}>
            <Typography variant="overline" color="text.secondary">
              PromptLab
            </Typography>
            <Typography variant="h1">Chat ambiental</Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              size="small"
              label={ambient.label}
              sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                color: 'text.primary',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
            <Button component={NavLink} to="/chat" size="small">
              Chat
            </Button>
            <Button component={NavLink} to="/settings" size="small">
              Ajustes
            </Button>
          </Stack>
        </Box>

        <Box component="main" className="app-main">
          <Outlet context={ambient} />
        </Box>
      </Container>
    </Box>
  )
}
