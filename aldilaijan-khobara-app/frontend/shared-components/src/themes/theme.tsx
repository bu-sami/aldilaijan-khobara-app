import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create ltr cache
const cacheLtr = createCache({
  key: 'mui',
});

// Define theme with color palette from documentation
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#C6A052', // Gold/Bronze from Aldilaijan
      light: '#D9BC7D',
      dark: '#A88735',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4D5159', // Dark Gray/Slate from Khobara
      light: '#6E727A',
      dark: '#2F333A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA000',
    },
    info: {
      main: '#1976D2',
    },
    success: {
      main: '#388E3C',
    },
  },
  typography: {
    fontFamily: 'Tajawal, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          padding: '8px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

// Create English theme
const themeEn = createTheme({
  ...theme,
  direction: 'ltr',
  typography: {
    ...theme.typography,
    fontFamily: 'Poppins, Arial, sans-serif',
  },
});

interface ThemeContextProps {
  toggleDirection: () => void;
  direction: 'rtl' | 'ltr';
  language: 'ar' | 'en';
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  toggleDirection: () => {},
  direction: 'rtl',
  language: 'ar',
});

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

export const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
  const [direction, setDirection] = React.useState<'rtl' | 'ltr'>('rtl');
  const [language, setLanguage] = React.useState<'ar' | 'en'>('ar');

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'rtl' ? 'ltr' : 'rtl'));
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <ThemeContext.Provider value={{ toggleDirection, direction, language }}>
      <CacheProvider value={direction === 'rtl' ? cacheRtl : cacheLtr}>
        <ThemeProvider theme={direction === 'rtl' ? theme : themeEn}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};

export default theme;
