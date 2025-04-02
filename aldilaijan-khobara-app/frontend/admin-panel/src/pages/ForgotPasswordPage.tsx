import React, { useState } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, Grid, Link } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { useNotification } from '../contexts/notification-context';
import { ThemeContext } from '../contexts/theme-context';
import { StyledTextField } from '../components/inputs';
import { PrimaryButton } from '../components/buttons';
import { StatusMessage } from '../components/feedback';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addNotification } = useNotification();
  const { language } = React.useContext(ThemeContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the password reset API
      // This would typically be in the auth context, but for simplicity we're just simulating it here
      // await authAPI.forgotPassword(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      addNotification(
        language === 'ar' 
          ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' 
          : 'Password reset link has been sent to your email',
        'success'
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {language === 'ar' ? 'نسيت كلمة المرور' : 'Forgot Password'}
        </Typography>
      </Box>
      
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        {submitted ? (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              {language === 'ar' ? 'تم إرسال رابط إعادة التعيين' : 'Reset Link Sent'}
            </Typography>
            <Typography variant="body1" paragraph>
              {language === 'ar'
                ? `لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. يرجى التحقق من بريدك الإلكتروني واتباع التعليمات.`
                : `We've sent a password reset link to ${email}. Please check your email and follow the instructions.`}
            </Typography>
            <Link href="/login" variant="body2">
              {language === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
            </Link>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <StatusMessage 
                type="error" 
                title={language === 'ar' ? 'خطأ' : 'Error'} 
                message={error} 
              />
            )}
            
            <Typography variant="body1" paragraph>
              {language === 'ar'
                ? 'أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.'
                : 'Enter your email address and we will send you a link to reset your password.'}
            </Typography>
            
            <StyledTextField
              label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    href="/login"
                    disabled={loading}
                  >
                    {language === 'ar' ? 'العودة' : 'Back'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PrimaryButton
                    type="submit"
                    fullWidth
                    disabled={loading}
                  >
                    {language === 'ar' ? 'إرسال' : 'Submit'}
                  </PrimaryButton>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
