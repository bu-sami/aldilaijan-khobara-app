import React from 'react';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import { Section } from '../components/layout-elements';
import { DataTable } from '../components/DataTable';

const UsersPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch users data
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockUsers = [
          { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'Admin', status: 'Active' },
          { id: 2, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Manager', status: 'Active' },
          { id: 3, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'Agent', status: 'Active' },
          { id: 4, firstName: 'Ahmed', lastName: 'Ali', email: 'ahmed@example.com', role: 'Appraiser', status: 'Inactive' },
          { id: 5, firstName: 'Sara', lastName: 'Khan', email: 'sara@example.com', role: 'Agent', status: 'Active' },
        ];
        
        setUsers(mockUsers);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Define columns for the data table
  const columns = [
    { 
      field: 'id', 
      headerName: language === 'ar' ? 'المعرف' : 'ID',
      width: 70 
    },
    { 
      field: 'firstName', 
      headerName: language === 'ar' ? 'الاسم الأول' : 'First Name',
      width: 150 
    },
    { 
      field: 'lastName', 
      headerName: language === 'ar' ? 'اسم العائلة' : 'Last Name',
      width: 150 
    },
    { 
      field: 'email', 
      headerName: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
      width: 200 
    },
    { 
      field: 'role', 
      headerName: language === 'ar' ? 'الدور' : 'Role',
      width: 120 
    },
    { 
      field: 'status', 
      headerName: language === 'ar' ? 'الحالة' : 'Status',
      width: 120,
      renderCell: (params: any) => (
        <Box sx={{ 
          backgroundColor: params.value === 'Active' ? 'success.light' : 'error.light',
          color: params.value === 'Active' ? 'success.dark' : 'error.dark',
          borderRadius: 1,
          px: 1,
          py: 0.5
        }}>
          {params.value === 'Active' 
            ? (language === 'ar' ? 'نشط' : 'Active')
            : (language === 'ar' ? 'غير نشط' : 'Inactive')
          }
        </Box>
      )
    },
  ];

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}>
      <Container maxWidth="lg">
        <Section title={language === 'ar' ? 'قائمة المستخدمين' : 'User List'}>
          <Paper sx={{ p: 3, mb: 4 }}>
            {error && (
              <StatusMessage 
                type="error" 
                title={language === 'ar' ? 'خطأ' : 'Error'} 
                message={error} 
              />
            )}
            
            {loading ? (
              <LoadingIndicator message={language === 'ar' ? 'جاري تحميل المستخدمين...' : 'Loading users...'} />
            ) : (
              <DataTable 
                rows={users}
                columns={columns}
                loading={loading}
                pageSize={10}
                checkboxSelection
                disableSelectionOnClick
                onRowClick={(params) => {
                  // Handle row click
                  console.log('Row clicked:', params.row);
                }}
                actions={[
                  {
                    label: language === 'ar' ? 'إضافة مستخدم' : 'Add User',
                    onClick: () => {
                      // Handle add user
                      console.log('Add user clicked');
                    },
                    primary: true
                  },
                  {
                    label: language === 'ar' ? 'تصدير' : 'Export',
                    onClick: () => {
                      // Handle export
                      console.log('Export clicked');
                    },
                    primary: false
                  }
                ]}
              />
            )}
          </Paper>
        </Section>
      </Container>
    </AdminLayout>
  );
};

export default UsersPage;
