import { useEffect, useState } from 'react'
import { Box, Paper, Snackbar, Stack, Typography } from '@mui/material'

type NowPlayingToastProps = {
  notificationKey: number
  trackTitle: string
}

export function NowPlayingToast({ notificationKey, trackTitle }: NowPlayingToastProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (notificationKey > 0) setOpen(true)
  }, [notificationKey])

  return (
    <Snackbar
      key={notificationKey}
      open={open}
      autoHideDuration={4500}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Paper className="now-playing-card" elevation={8}>
        <Box className="now-playing-card__icon" aria-hidden="true">♫</Box>
        <Stack spacing={0.25}>
          <Typography variant="overline" color="text.secondary">
            Tocando agora
          </Typography>
          <Typography variant="body2">{trackTitle}</Typography>
        </Stack>
      </Paper>
    </Snackbar>
  )
}
