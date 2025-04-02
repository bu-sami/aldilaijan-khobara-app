import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { useNotification } from '../contexts/notification-context';
import LoginForm from '../components/LoginForm';
import { ThemeContext } from '../contexts/theme-context';

const LoginPage: React.FC = () => {
  const { login, error, loading } = useAuth();
  const { addNotification } = useNotification();
  const { language } = React.useContext(ThemeContext);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      addNotification(
        language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful',
        'success'
      );
    } catch (err) {
      // Error is already handled in the auth context
      console.error('Login error:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {language === 'ar' ? 'نظام إدارة الدليجان وخبراء' : 'Aldilaijan & Khobara Management System'}
        </Typography>
      </Box>
      
      <LoginForm 
        onSubmit={handleLogin}
        error={error}
        loading={loading}
      />
    </Container>
  );
};

export default LoginPage;
