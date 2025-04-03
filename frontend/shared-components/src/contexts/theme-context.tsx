import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Define the context type
interface ThemeContextType {
  direction: 'ltr' | 'rtl';
  language: 'en' | 'ar';
  toggleDirection: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  theme: Theme;
}

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  direction: 'ltr',
  language: 'en',
  toggleDirection: () => {},
  setLanguage: () => {},
  theme: createTheme(),
});

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create ltr cache
const cacheLtr = createCache({
  key: 'muiltr',
});

// Define the color palette based on the provided specifications
const colors = {
  primary: {
    main: '#C6A052', // Gold
    light: '#D9BC7F',
    dark: '#A88534',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#4A4A4A', // Dark Gray
    light: '#6E6E6E',
    dark: '#333333',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFA000',
    light: '#FFB333',
    dark: '#CC8000',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#1976D2',
    light: '#4791DB',
    dark: '#115293',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#388E3C',
    light: '#5FAC62',
    dark: '#2E7031',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
  },
};

// Create the theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get stored direction and language from localStorage or use defaults
  const storedDirection = localStorage.getItem('direction') as 'ltr' | 'rtl';
  const storedLanguage = localStorage.getItem('language') as 'en' | 'ar';
  
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(storedDirection || 'ltr');
  const [language, setLanguage] = useState<'en' | 'ar'>(storedLanguage || 'en');

  // Create theme based on direction
  const theme = React.useMemo(
    () =>
      createTheme({
        direction,
        palette: colors,
        typography: {
          fontFamily: language === 'ar' ? '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif' : '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [direction, language]
  );

  // Toggle direction between LTR and RTL
  const toggleDirection = () => {
    const newDirection = direction === 'ltr' ? 'rtl' : 'ltr';
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setDirection(newDirection);
    setLanguage(newLanguage);
    localStorage.setItem('direction', newDirection);
    localStorage.setItem('language', newLanguage);
    document.dir = newDirection;
  };

  // Set specific language
  const handleSetLanguage = (lang: 'en' | 'ar') => {
    const newDirection = lang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(lang);
    setDirection(newDirection);
    localStorage.setItem('language', lang);
    localStorage.setItem('direction', newDirection);
    document.dir = newDirection;
  };

  // Set document direction on mount and when direction changes
  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  return (
    <ThemeContext.Provider
      value={{
        direction,
        language,
        toggleDirection,
        setLanguage: handleSetLanguage,
        theme,
      }}
    >
      <CacheProvider value={direction === 'rtl' ? cacheRtl : cacheLtr}>
        <StyledEngineProvider injectFirst>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </MuiThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
