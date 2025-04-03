import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, Grid, Link, Avatar } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { useNotification } from '../contexts/notification-context';
import { ThemeContext } from '../contexts/theme-context';
import { StyledTextField, PasswordField } from '../components/inputs';
import { PrimaryButton, OutlinedPrimaryButton } from '../components/buttons';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import { Section } from '../components/layout-elements';
import FileUpload from '../components/FileUpload';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const { language } = React.useContext(ThemeContext);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (file: File) => {
    setAvatar(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProfileLoading(true);
      setProfileError(null);
      
      // Create form data if there's an avatar
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      
      if (avatar) {
        formData.append('avatar', avatar);
      }
      
      // Call the update profile API
      // await updateProfile(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification(
        language === 'ar' 
          ? 'تم تحديث الملف الشخصي بنجاح' 
          : 'Profile updated successfully',
        'success'
      );
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError(language === 'ar' ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }
    
    try {
      setPasswordLoading(true);
      setPasswordError(null);
      
      // Call the change password API
      // await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      addNotification(
        language === 'ar' 
          ? 'تم تغيير كلمة المرور بنجاح' 
          : 'Password changed successfully',
        'success'
      );
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminLayout title={language === 'ar' ? 'الملف الشخصي' : 'Profile'}>
      <Container maxWidth="lg">
        <Section title={language === 'ar' ? 'معلومات الملف الشخصي' : 'Profile Information'}>
          <Paper sx={{ p: 3, mb: 4 }}>
            {profileError && (
              <StatusMessage 
                type="error" 
                title={language === 'ar' ? 'خطأ' : 'Error'} 
                message={profileError} 
              />
            )}
            
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
                  <Avatar
                    src={user?.avatarUrl || undefined}
                    sx={{ width: 100, height: 100 }}
                  >
                    <PersonOutlineIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                </Grid>
                
                <Grid item xs={12}>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    acceptedFileTypes="image/*"
                    maxFileSizeMB={2}
                    label={language === 'ar' ? 'صورة الملف الشخصي' : 'Profile Picture'}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label={language === 'ar' ? 'الاسم الأول' : 'First Name'}
                    name="firstName"
                    fullWidth
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label={language === 'ar' ? 'اسم العائلة' : 'Last Name'}
                    name="lastName"
                    fullWidth
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    name="email"
                    type="email"
                    fullWidth
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    name="phone"
                    fullWidth
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <PrimaryButton
                      type="submit"
                      disabled={profileLoading}
                    >
                      {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                    </PrimaryButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Section>
        
        <Section title={language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}>
          <Paper sx={{ p: 3 }}>
            {passwordError && (
              <StatusMessage 
                type="error" 
                title={language === 'ar' ? 'خطأ' : 'Error'} 
                message={passwordError} 
              />
            )}
            
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <PasswordField
                    label={language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                    name="currentPassword"
                    fullWidth
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PasswordField
                    label={language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                    name="newPassword"
                    fullWidth
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PasswordField
                    label={language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                    name="confirmPassword"
                    fullWidth
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <PrimaryButton
                      type="submit"
                      disabled={passwordLoading}
                    >
                      {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                    </PrimaryButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Section>
      </Container>
    </AdminLayout>
  );
};

export default ProfilePage;
