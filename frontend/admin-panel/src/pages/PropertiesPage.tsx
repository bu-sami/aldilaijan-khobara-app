import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button, Chip } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import { Section } from '../components/layout-elements';
import { DataTable } from '../components/DataTable';
import { PrimaryButton } from '../components/buttons';
import { FilterBar } from '../components/FilterBar';

const PropertiesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [properties, setProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    type: '',
    status: '',
    location: '',
    priceRange: [0, 1000000],
  });

  // Fetch properties data
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProperties = [
          { 
            id: 1, 
            title: 'Luxury Villa in Salmiya', 
            type: 'Villa', 
            status: 'Active', 
            location: 'Salmiya', 
            price: 450000,
            bedrooms: 5,
            bathrooms: 6,
            area: 500,
            createdAt: '2025-03-15',
          },
          { 
            id: 2, 
            title: 'Apartment in Kuwait City', 
            type: 'Apartment', 
            status: 'Pending', 
            location: 'Kuwait City', 
            price: 120000,
            bedrooms: 2,
            bathrooms: 2,
            area: 120,
            createdAt: '2025-03-18',
          },
          { 
            id: 3, 
            title: 'Commercial Space in Hawally', 
            type: 'Commercial', 
            status: 'Active', 
            location: 'Hawally', 
            price: 350000,
            bedrooms: 0,
            bathrooms: 2,
            area: 300,
            createdAt: '2025-03-20',
          },
          { 
            id: 4, 
            title: 'Penthouse in Sharq', 
            type: 'Apartment', 
            status: 'Sold', 
            location: 'Sharq', 
            price: 550000,
            bedrooms: 4,
            bathrooms: 4,
            area: 350,
            createdAt: '2025-03-10',
          },
          { 
            id: 5, 
            title: 'Land in Jahra', 
            type: 'Land', 
            status: 'Active', 
            location: 'Jahra', 
            price: 800000,
            bedrooms: 0,
            bathrooms: 0,
            area: 1000,
            createdAt: '2025-03-25',
          },
        ];
        
        setProperties(mockProperties);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to properties
  const filteredProperties = properties.filter((property: any) => {
    if (filters.type && property.type !== filters.type) return false;
    if (filters.status && property.status !== filters.status) return false;
    if (filters.location && property.location !== filters.location) return false;
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false;
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
      field: 'title', 
      headerName: language === 'ar' ? 'العنوان' : 'Title',
      width: 250 
    },
    { 
      field: 'type', 
      headerName: language === 'ar' ? 'النوع' : 'Type',
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {language === 'ar' 
            ? (params.value === 'Villa' ? 'فيلا' : 
               params.value === 'Apartment' ? 'شقة' : 
               params.value === 'Commercial' ? 'تجاري' : 
               params.value === 'Land' ? 'أرض' : params.value)
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
        let color = 'default';
        if (params.value === 'Active') color = 'success';
        else if (params.value === 'Pending') color = 'warning';
        else if (params.value === 'Sold') color = 'info';
        
        return (
          <Chip 
            label={
              language === 'ar' 
                ? (params.value === 'Active' ? 'نشط' : 
                   params.value === 'Pending' ? 'معلق' : 
                   params.value === 'Sold' ? 'مباع' : params.value)
                : params.value
            } 
            color={color as any} 
            size="small" 
          />
        );
      }
    },
    { 
      field: 'location', 
      headerName: language === 'ar' ? 'الموقع' : 'Location',
      width: 150 
    },
    { 
      field: 'price', 
      headerName: language === 'ar' ? 'السعر' : 'Price',
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {`KWD ${params.value.toLocaleString()}`}
        </Typography>
      )
    },
    { 
      field: 'area', 
      headerName: language === 'ar' ? 'المساحة' : 'Area',
      width: 100,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {`${params.value} m²`}
        </Typography>
      )
    },
    { 
      field: 'bedrooms', 
      headerName: language === 'ar' ? 'غرف النوم' : 'Bedrooms',
      width: 100 
    },
    { 
      field: 'bathrooms', 
      headerName: language === 'ar' ? 'الحمامات' : 'Bathrooms',
      width: 100 
    },
    { 
      field: 'createdAt', 
      headerName: language === 'ar' ? 'تاريخ الإنشاء' : 'Created At',
      width: 150 
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
            onClick={() => console.log('View property', params.row.id)}
          >
            {language === 'ar' ? 'عرض' : 'View'}
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => console.log('Edit property', params.row.id)}
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
    <AdminLayout title={language === 'ar' ? 'إدارة العقارات' : 'Property Management'}>
      <Container maxWidth="lg">
        <Section 
          title={language === 'ar' ? 'قائمة العقارات' : 'Property List'}
          description={language === 'ar' 
            ? 'إدارة قوائم العقارات والمعاملات' 
            : 'Manage property listings and transactions'
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
                  type: 'select',
                  name: 'type',
                  label: language === 'ar' ? 'النوع' : 'Type',
                  value: filters.type,
                  onChange: (value) => handleFilterChange('type', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Villa', label: language === 'ar' ? 'فيلا' : 'Villa' },
                    { value: 'Apartment', label: language === 'ar' ? 'شقة' : 'Apartment' },
                    { value: 'Commercial', label: language === 'ar' ? 'تجاري' : 'Commercial' },
                    { value: 'Land', label: language === 'ar' ? 'أرض' : 'Land' },
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
                    { value: 'Pending', label: language === 'ar' ? 'معلق' : 'Pending' },
                    { value: 'Sold', label: language === 'ar' ? 'مباع' : 'Sold' },
                  ]
                },
                {
                  type: 'select',
                  name: 'location',
                  label: language === 'ar' ? 'الموقع' : 'Location',
                  value: filters.location,
                  onChange: (value) => handleFilterChange('location', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Kuwait City', label: language === 'ar' ? 'مدينة الكويت' : 'Kuwait City' },
                    { value: 'Salmiya', label: language === 'ar' ? 'السالمية' : 'Salmiya' },
                    { value: 'Hawally', label: language === 'ar' ? 'حولي' : 'Hawally' },
                    { value: 'Sharq', label: language === 'ar' ? 'الشرق' : 'Sharq' },
                    { value: 'Jahra', label: language === 'ar' ? 'الجهراء' : 'Jahra' },
                  ]
                },
                {
                  type: 'range',
                  name: 'priceRange',
                  label: language === 'ar' ? 'نطاق السعر' : 'Price Range',
                  value: filters.priceRange,
                  onChange: (value) => handleFilterChange('priceRange', value),
                  min: 0,
                  max: 1000000,
                  step: 10000,
                  format: (value) => `KWD ${value.toLocaleString()}`
                }
              ]}
              onReset={() => setFilters({
                type: '',
                status: '',
                location: '',
                priceRange: [0, 1000000],
              })}
            />
            
            {loading ? (
              <LoadingIndicator message={language === 'ar' ? 'جاري تحميل العقارات...' : 'Loading properties...'} />
            ) : (
              <DataTable 
                rows={filteredProperties}
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
                    label: language === 'ar' ? 'إضافة عقار' : 'Add Property',
                    onClick: () => {
                      // Handle add property
                      console.log('Add property clicked');
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

export default PropertiesPage;
