import React from 'react';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';
import { PrimaryButton } from './buttons';
import { PasswordField } from './inputs';
import { StatusMessage } from './feedback';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  maxWidth: 400,
  margin: '0 auto',
}));

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  error?: string;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error, loading }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { language } = React.useContext(ThemeContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {language === 'ar' 
            ? 'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم' 
            : 'Enter your email and password to access the dashboard'}
        </Typography>
      </Box>

      <StyledPaper>
        {error && (
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login Error'} 
            message={error} 
          />
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          
          <PasswordField
            label={language === 'ar' ? 'كلمة المرور' : 'Password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Box sx={{ mt: 3 }}>
            <PrimaryButton
              type="submit"
              fullWidth
              disabled={loading}
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </PrimaryButton>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default LoginForm;
