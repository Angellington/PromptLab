import { createTheme } from '@mui/material/styles'

export const promptLabTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#76e4d2',
    },
    secondary: {
      main: '#f4b36d',
    },
    background: {
      default: '#0b1117',
      paper: 'rgba(13, 20, 27, 0.86)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#a9b4c3',
    },
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '1.85rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: 0,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})
