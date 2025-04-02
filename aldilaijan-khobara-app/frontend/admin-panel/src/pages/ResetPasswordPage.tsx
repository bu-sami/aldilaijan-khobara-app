import React, { useState } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, Grid, Link } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { useNotification } from '../contexts/notification-context';
import { ThemeContext } from '../contexts/theme-context';
import { StyledTextField, PasswordField } from '../components/inputs';
import { PrimaryButton } from '../components/buttons';
import { StatusMessage } from '../components/feedback';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addNotification } = useNotification();
  const { language } = React.useContext(ThemeContext);

  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError(language === 'ar' ? 'رمز إعادة التعيين غير صالح' : 'Invalid reset token');
      return;
    }
    
    if (password !== confirmPassword) {
      setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError(language === 'ar' ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the password reset API
      // This would typically be in the auth context, but for simplicity we're just simulating it here
      // await authAPI.resetPassword(token, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      addNotification(
        language === 'ar' 
          ? 'تم إعادة تعيين كلمة المرور بنجاح' 
          : 'Password has been reset successfully',
        'success'
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
        </Typography>
      </Box>
      
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        {!token && (
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={language === 'ar' ? 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية' : 'Invalid or expired reset token'} 
          />
        )}
        
        {submitted ? (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              {language === 'ar' ? 'تم إعادة تعيين كلمة المرور' : 'Password Reset Complete'}
            </Typography>
            <Typography variant="body1" paragraph>
              {language === 'ar'
                ? 'تم إعادة تعيين كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.'
                : 'Your password has been reset successfully. You can now login with your new password.'}
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
                ? 'أدخل كلمة المرور الجديدة الخاصة بك.'
                : 'Enter your new password.'}
            </Typography>
            
            <PasswordField
              label={language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            
            <PasswordField
              label={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
                    disabled={loading || !token}
                  >
                    {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
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

export default ResetPasswordPage;
