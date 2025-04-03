import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button, Chip, TextField, MenuItem } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import { Section } from '../components/layout-elements';
import { DataTable } from '../components/DataTable';
import { PrimaryButton } from '../components/buttons';
import { FilterBar } from '../components/FilterBar';

const ClientsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [clients, setClients] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    type: '',
    status: '',
    search: '',
  });

  // Fetch clients data
  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockClients = [
          { 
            id: 1, 
            name: 'Kuwait Bank', 
            type: 'Corporate', 
            status: 'Active', 
            email: 'contact@kuwaitbank.com',
            phone: '+965 2222 3333',
            address: 'Kuwait City, Kuwait',
            createdAt: '2025-01-15',
            properties: 3,
            valuations: 5,
          },
          { 
            id: 2, 
            name: 'Investment Co.', 
            type: 'Corporate', 
            status: 'Active', 
            email: 'info@investmentco.com',
            phone: '+965 2222 4444',
            address: 'Sharq, Kuwait',
            createdAt: '2025-01-20',
            properties: 7,
            valuations: 4,
          },
          { 
            id: 3, 
            name: 'Ahmed Al-Sabah', 
            type: 'Individual', 
            status: 'Active', 
            email: 'ahmed@example.com',
            phone: '+965 9999 8888',
            address: 'Salmiya, Kuwait',
            createdAt: '2025-02-10',
            properties: 2,
            valuations: 1,
          },
          { 
            id: 4, 
            name: 'Sara Al-Ali', 
            type: 'Individual', 
            status: 'Inactive', 
            email: 'sara@example.com',
            phone: '+965 9999 7777',
            address: 'Jabriya, Kuwait',
            createdAt: '2025-02-15',
            properties: 1,
            valuations: 0,
          },
          { 
            id: 5, 
            name: 'Development Co.', 
            type: 'Corporate', 
            status: 'Active', 
            email: 'contact@developmentco.com',
            phone: '+965 2222 5555',
            address: 'Hawally, Kuwait',
            createdAt: '2025-03-01',
            properties: 5,
            valuations: 3,
          },
        ];
        
        setClients(mockClients);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to clients
  const filteredClients = clients.filter((client: any) => {
    if (filters.type && client.type !== filters.type) return false;
    if (filters.status && client.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(filters.search) ||
        client.address.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Define columns for the data table
  const columns = [
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
      field: 'type', 
      headerName: language === 'ar' ? 'النوع' : 'Type',
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {language === 'ar' 
            ? (params.value === 'Corporate' ? 'شركة' : 
               params.value === 'Individual' ? 'فرد' : params.value)
            : params.value
          }
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: language === 'ar' ? 'الحالة' : 'Status',
      width: 120,
      renderCell: (params: any) => {
        let color = params.value === 'Active' ? 'success' : 'error';
        
        return (
          <Chip 
            label={
              language === 'ar' 
                ? (params.value === 'Active' ? 'نشط' : 'غير نشط')
                : params.value
            } 
            color={color} 
            size="small" 
          />
        );
      }
    },
    { 
      field: 'email', 
      headerName: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
      width: 200 
    },
    { 
      field: 'phone', 
      headerName: language === 'ar' ? 'الهاتف' : 'Phone',
      width: 150 
    },
    { 
      field: 'properties', 
      headerName: language === 'ar' ? 'العقارات' : 'Properties',
      width: 100,
      renderCell: (params: any) => (
        <Chip 
          label={params.value} 
          color="primary" 
          size="small" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'valuations', 
      headerName: language === 'ar' ? 'التقييمات' : 'Valuations',
      width: 100,
      renderCell: (params: any) => (
        <Chip 
          label={params.value} 
          color="secondary" 
          size="small" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: language === 'ar' ? 'تاريخ الإنشاء' : 'Created At',
      width: 120 
    },
    {
      field: 'actions',
      headerName: language === 'ar' ? 'الإجراءات' : 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary"
            onClick={() => console.log('View client', params.row.id)}
          >
            {language === 'ar' ? 'عرض' : 'View'}
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => console.log('Edit client', params.row.id)}
          >
            {language === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
        </Box>
      )
    }
  ];

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة العملاء' : 'Client Management'}>
      <Container maxWidth="lg">
        <Section 
          title={language === 'ar' ? 'قائمة العملاء' : 'Client List'}
          description={language === 'ar' 
            ? 'إدارة عملاء الدليجان العقاري وخبراء للتقييم العقاري' 
            : 'Manage clients for both Aldilaijan Real Estate and Khobara Valuation'
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
            
            <FilterBar
              filters={[
                {
                  type: 'text',
                  name: 'search',
                  label: language === 'ar' ? 'بحث' : 'Search',
                  value: filters.search,
                  onChange: (value) => handleFilterChange('search', value),
                  placeholder: language === 'ar' ? 'بحث بالاسم، البريد الإلكتروني، الهاتف، العنوان' : 'Search by name, email, phone, address',
                },
                {
                  type: 'select',
                  name: 'type',
                  label: language === 'ar' ? 'النوع' : 'Type',
                  value: filters.type,
                  onChange: (value) => handleFilterChange('type', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Corporate', label: language === 'ar' ? 'شركة' : 'Corporate' },
                    { value: 'Individual', label: language === 'ar' ? 'فرد' : 'Individual' },
                  ]
                },
                {
                  type: 'select',
                  name: 'status',
                  label: language === 'ar' ? 'الحالة' : 'Status',
                  value: filters.status,
                  onChange: (value) => handleFilterChange('status', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Active', label: language === 'ar' ? 'نشط' : 'Active' },
                    { value: 'Inactive', label: language === 'ar' ? 'غير نشط' : 'Inactive' },
                  ]
                },
              ]}
              onReset={() => setFilters({
                type: '',
                status: '',
                search: '',
              })}
            />
            
            {loading ? (
              <LoadingIndicator message={language === 'ar' ? 'جاري تحميل العملاء...' : 'Loading clients...'} />
            ) : (
              <DataTable 
                rows={filteredClients}
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
                    label: language === 'ar' ? 'إضافة عميل' : 'Add Client',
                    onClick: () => {
                      // Handle add client
                      console.log('Add client clicked');
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

export default ClientsPage;
