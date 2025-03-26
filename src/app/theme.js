import { createTheme } from '@mui/material/styles';

const commonComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        margin: 0,
        transition: 'all 0.3s ease',
        backgroundColor: 'transparent',
      },
      '#root': {
        backgroundColor: 'inherit',
      },
      '::selection': {
        backgroundColor: '#60a5fa',
        color: '#ffffff',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        transition: 'all 0.3s ease',
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0062ff',
      light: '#4d8bff',
      dark: '#004acc',
    },
    background: {
      default: '#f8faff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#64748b',
    },
  },
  components: {
    ...commonComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8faff',
        }
      }
    }
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
  },
  components: {
    ...commonComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111827',
        }
      }
    }
  },
}); 