import React from 'react';
import { ThemeProvider } from './contexts/theme-context';
import { AuthProvider } from './services/auth-context';
import { NotificationProvider } from './contexts/notification-context';
import { LocationProvider } from './contexts/location-context';

// App providers wrapper component
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
