import { createTheme } from '@mui/material/styles';

// Common styles for both themes
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
        backgroundColor: '#99C2FF', // Accessible blue for selection
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

// Light Theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#004ECC',  // Updated WCAG-compliant primary blue
      light: '#4d8bff',
      dark: '#003C99',  // Accessible hover color
    },
    background: {
      default: '#FFFFFF',  // Pure white background
      paper: '#F8F9FA',    // Light gray for surfaces
    },
    text: {
      primary: '#222222',  // High-contrast dark text
      secondary: '#4F4F4F', // Secondary text color
    },
    success: { main: '#198754' },
    warning: { main: '#FFC107' },
    error: { main: '#DC3545' },
    info: { main: '#17A2B8' },
  },
  components: {
    ...commonComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#66A3FF',  // Lighter blue for dark mode accessibility
      light: '#99C2FF',
      dark: '#3B82F6',
    },
    background: {
      default: '#121212',  // Dark gray for dark mode background
      paper: '#1E1E1E',     // Slightly lighter for surfaces
    },
    text: {
      primary: '#FFFFFF',  // High-contrast white text
      secondary: '#BDBDBD', // Secondary gray text
    },
    success: { main: '#27AE60' },
    warning: { main: '#FFCA2C' },
    error: { main: '#FF6B81' },
    info: { main: '#5BC0DE' },
  },
  components: {
    ...commonComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
        },
      },
    },
  },
});
 