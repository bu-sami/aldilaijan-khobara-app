import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';

// Create theme with RTL support
const getTheme = (isRTL: boolean) => createTheme({
  direction: isRTL ? 'rtl' : 'ltr',
  palette: {
    primary: {
      main: '#C6A052', // Gold/Bronze from Aldilaijan
    },
    secondary: {
      main: '#4D5159', // Dark Gray/Slate from Khobara
    },
  },
  typography: {
    fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Poppins, Arial, sans-serif',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isRTL = router.locale === 'ar';
  const theme = React.useMemo(() => getTheme(isRTL), [isRTL]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
