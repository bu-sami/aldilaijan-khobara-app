import React from 'react';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import { Section } from '../components/layout-elements';
import { DataTable } from '../components/DataTable';
import { PrimaryButton } from '../components/buttons';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const SecurityLogsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch security logs data
  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockLogs = [
          { id: 1, timestamp: '2025-04-02 19:45:22', user: 'admin@example.com', action: 'LOGIN', status: 'SUCCESS', ipAddress: '192.168.1.1', userAgent: 'Chrome/120.0.0.0' },
          { id: 2, timestamp: '2025-04-02 18:30:15', user: 'john@example.com', action: 'PASSWORD_CHANGE', status: 'SUCCESS', ipAddress: '192.168.1.2', userAgent: 'Firefox/98.0' },
          { id: 3, timestamp: '2025-04-02 17:22:10', user: 'unknown', action: 'LOGIN', status: 'FAILED', ipAddress: '192.168.1.3', userAgent: 'Chrome/119.0.0.0' },
          { id: 4, timestamp: '2025-04-02 16:15:05', user: 'jane@example.com', action: 'PROFILE_UPDATE', status: 'SUCCESS', ipAddress: '192.168.1.4', userAgent: 'Safari/15.0' },
          { id: 5, timestamp: '2025-04-02 15:10:45', user: 'ahmed@example.com', action: 'LOGOUT', status: 'SUCCESS', ipAddress: '192.168.1.5', userAgent: 'Chrome/120.0.0.0' },
          { id: 6, timestamp: '2025-04-02 14:05:30', user: 'unknown', action: 'PASSWORD_RESET', status: 'FAILED', ipAddress: '192.168.1.6', userAgent: 'Edge/100.0.0.0' },
          { id: 7, timestamp: '2025-04-02 13:00:25', user: 'sara@example.com', action: 'LOGIN', status: 'SUCCESS', ipAddress: '192.168.1.7', userAgent: 'Chrome/120.0.0.0' },
          { id: 8, timestamp: '2025-04-02 12:45:20', user: 'admin@example.com', action: 'ROLE_UPDATE', status: 'SUCCESS', ipAddress: '192.168.1.1', userAgent: 'Chrome/120.0.0.0' },
          { id: 9, timestamp: '2025-04-02 11:30:15', user: 'unknown', action: 'LOGIN', status: 'FAILED', ipAddress: '192.168.1.8', userAgent: 'Firefox/97.0' },
          { id: 10, timestamp: '2025-04-02 10:15:10', user: 'john@example.com', action: 'LOGOUT', status: 'SUCCESS', ipAddress: '192.168.1.2', userAgent: 'Firefox/98.0' },
        ];
        
        setLogs(mockLogs);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch security logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Define columns for the security logs table
  const columns = [
    { 
      field: 'id', 
      headerName: language === 'ar' ? 'المعرف' : 'ID',
      width: 70 
    },
    { 
      field: 'timestamp', 
      headerName: language === 'ar' ? 'التاريخ والوقت' : 'Timestamp',
      width: 180 
    },
    { 
      field: 'user', 
      headerName: language === 'ar' ? 'المستخدم' : 'User',
      width: 200 
    },
    { 
      field: 'action', 
      headerName: language === 'ar' ? 'الإجراء' : 'Action',
      width: 150,
      renderCell: (params: any) => {
        let icon = null;
        let color = 'inherit';
        
        switch(params.value) {
          case 'LOGIN':
            icon = <VpnKeyIcon fontSize="small" />;
            color = 'primary.main';
            break;
          case 'LOGOUT':
            icon = <VpnKeyIcon fontSize="small" />;
            color = 'text.secondary';
            break;
          case 'PASSWORD_CHANGE':
          case 'PASSWORD_RESET':
            icon = <SecurityIcon fontSize="small" />;
            color = 'warning.main';
            break;
          case 'PROFILE_UPDATE':
          case 'ROLE_UPDATE':
            icon = <HistoryIcon fontSize="small" />;
            color = 'info.main';
            break;
        }
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', color }}>
            {icon}
            <Box sx={{ ml: 1 }}>
              {params.value === 'LOGIN' ? (language === 'ar' ? 'تسجيل الدخول' : 'Login') :
               params.value === 'LOGOUT' ? (language === 'ar' ? 'تسجيل الخروج' : 'Logout') :
               params.value === 'PASSWORD_CHANGE' ? (language === 'ar' ? 'تغيير كلمة المرور' : 'Password Change') :
               params.value === 'PASSWORD_RESET' ? (language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Password Reset') :
               params.value === 'PROFILE_UPDATE' ? (language === 'ar' ? 'تحديث الملف الشخصي' : 'Profile Update') :
               params.value === 'ROLE_UPDATE' ? (language === 'ar' ? 'تحديث الدور' : 'Role Update') :
               params.value}
            </Box>
          </Box>
        );
      }
    },
    { 
      field: 'status', 
      headerName: language === 'ar' ? 'الحالة' : 'Status',
      width: 120,
      renderCell: (params: any) => (
        <Box sx={{ 
          backgroundColor: params.value === 'SUCCESS' ? 'success.light' : 'error.light',
          color: params.value === 'SUCCESS' ? 'success.dark' : 'error.dark',
          borderRadius: 1,
          px: 1,
          py: 0.5
        }}>
          {params.value === 'SUCCESS' 
            ? (language === 'ar' ? 'نجاح' : 'Success')
            : (language === 'ar' ? 'فشل' : 'Failed')
          }
        </Box>
      )
    },
    { 
      field: 'ipAddress', 
      headerName: language === 'ar' ? 'عنوان IP' : 'IP Address',
      width: 150 
    },
    { 
      field: 'userAgent', 
      headerName: language === 'ar' ? 'متصفح المستخدم' : 'User Agent',
      width: 200 
    },
  ];

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminLayout title={language === 'ar' ? 'سجلات الأمان' : 'Security Logs'}>
      <Container maxWidth="lg">
        <Section 
          title={language === 'ar' ? 'سجلات الأمان والنشاط' : 'Security & Activity Logs'}
          description={language === 'ar' 
            ? 'مراقبة نشاط المستخدمين وأحداث الأمان في النظام' 
            : 'Monitor user activity and security events in the system'
          }
        >
          <Paper sx={{ p: 3, mb: 4 }}>
            {error && (
              <StatusMessage 
                type="error" 
                title={language === 'ar' ? 'خطأ' : 'Error'} 
                message={error} 
              />
            )}
            
            {loading ? (
              <LoadingIndicator message={language === 'ar' ? 'جاري تحميل السجلات...' : 'Loading logs...'} />
            ) : (
              <DataTable 
                rows={logs}
                columns={columns}
                loading={loading}
                pageSize={10}
                checkboxSelection={false}
                disableSelectionOnClick
                actions={[
                  {
                    label: language === 'ar' ? 'تصدير السجلات' : 'Export Logs',
                    onClick: () => {
                      // Handle export logs
                      console.log('Export logs clicked');
                    },
                    primary: false
                  },
                  {
                    label: language === 'ar' ? 'تنقية السجلات' : 'Filter Logs',
                    onClick: () => {
                      // Handle filter logs
                      console.log('Filter logs clicked');
                    },
                    primary: false
                  }
                ]}
              />
            )}
          </Paper>
        </Section>
        
        <Section title={language === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'سياسة كلمة المرور' : 'Password Policy'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {language === 'ar'
                      ? 'تكوين متطلبات قوة كلمة المرور وانتهاء الصلاحية'
                      : 'Configure password strength requirements and expiration'
                    }
                  </Typography>
                  <PrimaryButton size="small">
                    {language === 'ar' ? 'تكوين' : 'Configure'}
                  </PrimaryButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {language === 'ar'
                      ? 'إدارة إعدادات المصادقة الثنائية للمستخدمين'
                      : 'Manage two-factor authentication settings for users'
                    }
                  </Typography>
                  <PrimaryButton size="small">
                    {language === 'ar' ? 'تكوين' : 'Configure'}
                  </PrimaryButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'قفل الحساب' : 'Account Lockout'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {language === 'ar'
                      ? 'تكوين سياسات قفل الحساب بعد محاولات تسجيل الدخول الفاشلة'
                      : 'Configure account lockout policies after failed login attempts'
                    }
                  </Typography>
                  <PrimaryButton size="small">
                    {language === 'ar' ? 'تكوين' : 'Configure'}
                  </PrimaryButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'جلسات المستخدمين' : 'User Sessions'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {language === 'ar'
                      ? 'إدارة جلسات المستخدمين النشطة وإنهاء الجلسات عن بُعد'
                      : 'Manage active user sessions and terminate sessions remotely'
                    }
                  </Typography>
                  <PrimaryButton size="small">
                    {language === 'ar' ? 'إدارة' : 'Manage'}
                  </PrimaryButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Section>
      </Container>
    </AdminLayout>
  );
};

export default SecurityLogsPage;
