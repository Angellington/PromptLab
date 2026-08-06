import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { appRouter } from './routes/appRouter'
import { promptLabTheme } from './styles/theme'

function App() {
  return (
    <ThemeProvider theme={promptLabTheme}>
      <CssBaseline />
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  )
}

export default App
