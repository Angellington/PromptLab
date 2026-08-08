import { Box, Button, Typography } from '@mui/material'
import type { SoundPeriod } from './useAmbientSound'

const periodLabels: Record<SoundPeriod, string> = {
  dawn: 'Som da madrugada',
  morning: 'Som da manhã',
  evening: 'Som da tarde',
  night: 'Som da noite',
}

type AmbientSoundIndicatorProps = {
  isPlaying: boolean
  needsInteraction: boolean
  period: SoundPeriod
  onToggle: () => void
}

export function AmbientSoundIndicator({
  isPlaying,
  needsInteraction,
  period,
  onToggle,
}: AmbientSoundIndicatorProps) {
  const label = needsInteraction
    ? 'Clique para iniciar a música'
    : isPlaying
      ? periodLabels[period]
      : 'Música pausada'

  return (
    <Button
      className={`sound-indicator ${isPlaying ? 'sound-indicator--playing' : ''}`}
      onClick={onToggle}
      size="small"
      aria-label={isPlaying ? 'Pausar música ambiente' : 'Tocar música ambiente'}
    >
      <Box className="sound-equalizer" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </Box>
      <Typography component="span" variant="caption">
        {label}
      </Typography>
    </Button>
  )
}
