import { Box, Stack, Typography } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import { ChatWindow } from '../features/chat/ChatWindow'
import type { AmbientProfile } from '../styles/ambient'

export function ChatPage() {
  const ambient = useOutletContext<AmbientProfile>()

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h2">Conversa principal</Typography>
        <Typography color="text.secondary">
          {ambient.playlistHint}
        </Typography>
      </Box>
      <ChatWindow ambient={ambient} />
    </Stack>
  )
}
