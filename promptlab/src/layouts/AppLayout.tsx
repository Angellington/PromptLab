import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import { AmbientSoundIndicator } from '../features/audio/AmbientSoundIndicator'
import { NowPlayingToast } from '../features/audio/NowPlayingToast'
import { useAmbientSound } from '../features/audio/useAmbientSound'
import '../features/audio/AmbientSoundIndicator.css'
import { useAmbientProfile } from '../styles/useAmbientProfile'
import './AppLayout.css'

export function AppLayout() {
  const ambient = useAmbientProfile()
  const ambientSound = useAmbientSound()

  return (
    <Box
      className="app-shell"
      sx={{
        '--ambient-bg': ambient.background,
        '--ambient-glow': ambient.glow,
        '--ambient-panel': ambient.panel,
      }}
    >
      <NowPlayingToast
        notificationKey={ambientSound.notificationKey}
        trackTitle={ambientSound.trackTitle}
      />
      <Container maxWidth="xl" className="app-frame">
        <Box component="header" className="app-header">
          <Stack spacing={0.5}>
            <Typography variant="overline" color="text.secondary">
              PromptLab
            </Typography>
            <Typography variant="h1">Chat ambiental</Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <AmbientSoundIndicator {...ambientSound} onToggle={ambientSound.toggle} />
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
            {/* <Button component={NavLink} to="/settings" size="small">
              Ajustes
            </Button> */}
          </Stack>
        </Box>

        <Box component="main" className="app-main">
          <Outlet context={ambient} />
        </Box>
      </Container>
    </Box>
  )
}
