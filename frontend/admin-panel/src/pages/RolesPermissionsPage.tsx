import React from 'react';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import { Section } from '../components/layout-elements';
import { DataTable } from '../components/DataTable';

const RolesPermissionsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [roles, setRoles] = React.useState([]);
  const [permissions, setPermissions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch roles and permissions data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockRoles = [
          { id: 1, name: 'Admin', description: 'Full system access', usersCount: 3 },
          { id: 2, name: 'Manager', description: 'Manage properties and transactions', usersCount: 5 },
          { id: 3, name: 'Agent', description: 'Handle properties and clients', usersCount: 8 },
          { id: 4, name: 'Appraiser', description: 'Create and manage valuations', usersCount: 4 },
          { id: 5, name: 'Client', description: 'View own properties and valuations', usersCount: 25 },
        ];
        
        const mockPermissions = [
          { id: 1, name: 'user:create', description: 'Create users' },
          { id: 2, name: 'user:read', description: 'View users' },
          { id: 3, name: 'user:update', description: 'Update users' },
          { id: 4, name: 'user:delete', description: 'Delete users' },
          { id: 5, name: 'role:manage', description: 'Manage roles and permissions' },
          { id: 6, name: 'property:create', description: 'Create properties' },
          { id: 7, name: 'property:read', description: 'View properties' },
          { id: 8, name: 'property:update', description: 'Update properties' },
          { id: 9, name: 'property:delete', description: 'Delete properties' },
          { id: 10, name: 'valuation:create', description: 'Create valuations' },
          { id: 11, name: 'valuation:read', description: 'View valuations' },
          { id: 12, name: 'valuation:update', description: 'Update valuations' },
          { id: 13, name: 'valuation:delete', description: 'Delete valuations' },
        ];
        
        setRoles(mockRoles);
        setPermissions(mockPermissions);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch roles and permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns for the roles table
  const roleColumns = [
    { 
      field: 'id', 
      headerName: language === 'ar' ? 'المعرف' : 'ID',
      width: 70 
    },
    { 
      field: 'name', 
      headerName: language === 'ar' ? 'الاسم' : 'Name',
      width: 150 
    },
    { 
      field: 'description', 
      headerName: language === 'ar' ? 'الوصف' : 'Description',
      width: 250 
    },
    { 
      field: 'usersCount', 
      headerName: language === 'ar' ? 'عدد المستخدمين' : 'Users Count',
      width: 150 
    },
  ];

  // Define columns for the permissions table
  const permissionColumns = [
    { 
      field: 'id', 
      headerName: language === 'ar' ? 'المعرف' : 'ID',
      width: 70 
    },
    { 
      field: 'name', 
      headerName: language === 'ar' ? 'الاسم' : 'Name',
      width: 200 
    },
    { 
      field: 'description', 
      headerName: language === 'ar' ? 'الوصف' : 'Description',
      width: 300 
    },
  ];

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminLayout title={language === 'ar' ? 'الأدوار والصلاحيات' : 'Roles & Permissions'}>
      <Container maxWidth="lg">
        {error && (
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={error} 
          />
        )}
        
        {loading ? (
          <LoadingIndicator message={language === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'} />
        ) : (
          <>
            <Section title={language === 'ar' ? 'الأدوار' : 'Roles'}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <DataTable 
                  rows={roles}
                  columns={roleColumns}
                  loading={loading}
                  pageSize={5}
                  checkboxSelection
                  disableSelectionOnClick
                  onRowClick={(params) => {
                    // Handle row click
                    console.log('Role row clicked:', params.row);
                  }}
                  actions={[
                    {
                      label: language === 'ar' ? 'إضافة دور' : 'Add Role',
                      onClick: () => {
                        // Handle add role
                        console.log('Add role clicked');
                      },
                      primary: true
                    },
                    {
                      label: language === 'ar' ? 'تعديل الصلاحيات' : 'Edit Permissions',
                      onClick: () => {
                        // Handle edit permissions
                        console.log('Edit permissions clicked');
                      },
                      primary: false
                    }
                  ]}
                />
              </Paper>
            </Section>
            
            <Section title={language === 'ar' ? 'الصلاحيات' : 'Permissions'}>
              <Paper sx={{ p: 3 }}>
                <DataTable 
                  rows={permissions}
                  columns={permissionColumns}
                  loading={loading}
                  pageSize={10}
                  checkboxSelection={false}
                  disableSelectionOnClick
                  onRowClick={(params) => {
                    // Handle row click
                    console.log('Permission row clicked:', params.row);
                  }}
                />
              </Paper>
            </Section>
          </>
        )}
      </Container>
    </AdminLayout>
  );
};

export default RolesPermissionsPage;
