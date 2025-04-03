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

const ValuationRequestsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [valuationRequests, setValuationRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    status: '',
    type: '',
    client: '',
    dateRange: [null, null],
  });

  // Fetch valuation requests data
  React.useEffect(() => {
    const fetchValuationRequests = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockValuationRequests = [
          { 
            id: 1, 
            propertyAddress: 'Commercial Building in Sharq', 
            client: 'Kuwait Bank', 
            type: 'Commercial', 
            status: 'Completed', 
            requestDate: '2025-03-15',
            completionDate: '2025-03-28',
            valuationAmount: 2500000,
            assignedTo: 'Ahmed Ali',
          },
          { 
            id: 2, 
            propertyAddress: 'Residential Complex in Jabriya', 
            client: 'Investment Co.', 
            type: 'Residential', 
            status: 'In Progress', 
            requestDate: '2025-03-20',
            completionDate: null,
            valuationAmount: null,
            assignedTo: 'Sara Khan',
          },
          { 
            id: 3, 
            propertyAddress: 'Industrial Facility in Shuwaikh', 
            client: 'Industrial Group', 
            type: 'Industrial', 
            status: 'Completed', 
            requestDate: '2025-03-10',
            completionDate: '2025-03-20',
            valuationAmount: 3200000,
            assignedTo: 'Mohammed Hassan',
          },
          { 
            id: 4, 
            propertyAddress: 'Villa in Mishref', 
            client: 'Private Client', 
            type: 'Residential', 
            status: 'Pending', 
            requestDate: '2025-03-25',
            completionDate: null,
            valuationAmount: null,
            assignedTo: null,
          },
          { 
            id: 5, 
            propertyAddress: 'Land in Sabah Al-Salem', 
            client: 'Development Co.', 
            type: 'Land', 
            status: 'In Progress', 
            requestDate: '2025-03-22',
            completionDate: null,
            valuationAmount: null,
            assignedTo: 'Fatima Al-Ali',
          },
        ];
        
        setValuationRequests(mockValuationRequests);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch valuation requests');
      } finally {
        setLoading(false);
      }
    };

    fetchValuationRequests();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to valuation requests
  const filteredValuationRequests = valuationRequests.filter((request: any) => {
    if (filters.status && request.status !== filters.status) return false;
    if (filters.type && request.type !== filters.type) return false;
    if (filters.client && !request.client.includes(filters.client)) return false;
    
    // Date range filtering
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const requestDate = new Date(request.requestDate);
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      
      if (requestDate < startDate || requestDate > endDate) return false;
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
      field: 'propertyAddress', 
      headerName: language === 'ar' ? 'عنوان العقار' : 'Property Address',
      width: 250 
    },
    { 
      field: 'client', 
      headerName: language === 'ar' ? 'العميل' : 'Client',
      width: 150 
    },
    { 
      field: 'type', 
      headerName: language === 'ar' ? 'النوع' : 'Type',
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {language === 'ar' 
            ? (params.value === 'Residential' ? 'سكني' : 
               params.value === 'Commercial' ? 'تجاري' : 
               params.value === 'Industrial' ? 'صناعي' : 
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
        if (params.value === 'Completed') color = 'success';
        else if (params.value === 'In Progress') color = 'info';
        else if (params.value === 'Pending') color = 'warning';
        
        return (
          <Chip 
            label={
              language === 'ar' 
                ? (params.value === 'Completed' ? 'مكتمل' : 
                   params.value === 'In Progress' ? 'قيد التنفيذ' : 
                   params.value === 'Pending' ? 'معلق' : params.value)
                : params.value
            } 
            color={color as any} 
            size="small" 
          />
        );
      }
    },
    { 
      field: 'requestDate', 
      headerName: language === 'ar' ? 'تاريخ الطلب' : 'Request Date',
      width: 120 
    },
    { 
      field: 'completionDate', 
      headerName: language === 'ar' ? 'تاريخ الإكمال' : 'Completion Date',
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {params.value || (language === 'ar' ? 'غير مكتمل' : 'Not completed')}
        </Typography>
      )
    },
    { 
      field: 'valuationAmount', 
      headerName: language === 'ar' ? 'مبلغ التقييم' : 'Valuation Amount',
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {params.value ? `KWD ${params.value.toLocaleString()}` : (language === 'ar' ? 'غير متوفر' : 'N/A')}
        </Typography>
      )
    },
    { 
      field: 'assignedTo', 
      headerName: language === 'ar' ? 'معين إلى' : 'Assigned To',
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {params.value || (language === 'ar' ? 'غير معين' : 'Unassigned')}
        </Typography>
      )
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
            onClick={() => console.log('View valuation request', params.row.id)}
          >
            {language === 'ar' ? 'عرض' : 'View'}
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => console.log('Edit valuation request', params.row.id)}
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
    <AdminLayout title={language === 'ar' ? 'إدارة طلبات التقييم' : 'Valuation Request Management'}>
      <Container maxWidth="lg">
        <Section 
          title={language === 'ar' ? 'قائمة طلبات التقييم' : 'Valuation Request List'}
          description={language === 'ar' 
            ? 'إدارة طلبات التقييم وتقارير التقييم' 
            : 'Manage valuation requests and valuation reports'
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
                  name: 'status',
                  label: language === 'ar' ? 'الحالة' : 'Status',
                  value: filters.status,
                  onChange: (value) => handleFilterChange('status', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Pending', label: language === 'ar' ? 'معلق' : 'Pending' },
                    { value: 'In Progress', label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress' },
                    { value: 'Completed', label: language === 'ar' ? 'مكتمل' : 'Completed' },
                  ]
                },
                {
                  type: 'select',
                  name: 'type',
                  label: language === 'ar' ? 'النوع' : 'Type',
                  value: filters.type,
                  onChange: (value) => handleFilterChange('type', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Residential', label: language === 'ar' ? 'سكني' : 'Residential' },
                    { value: 'Commercial', label: language === 'ar' ? 'تجاري' : 'Commercial' },
                    { value: 'Industrial', label: language === 'ar' ? 'صناعي' : 'Industrial' },
                    { value: 'Land', label: language === 'ar' ? 'أرض' : 'Land' },
                  ]
                },
                {
                  type: 'text',
                  name: 'client',
                  label: language === 'ar' ? 'العميل' : 'Client',
                  value: filters.client,
                  onChange: (value) => handleFilterChange('client', value),
                },
                {
                  type: 'dateRange',
                  name: 'dateRange',
                  label: language === 'ar' ? 'نطاق التاريخ' : 'Date Range',
                  value: filters.dateRange,
                  onChange: (value) => handleFilterChange('dateRange', value),
                }
              ]}
              onReset={() => setFilters({
                status: '',
                type: '',
                client: '',
                dateRange: [null, null],
              })}
            />
            
            {loading ? (
              <LoadingIndicator message={language === 'ar' ? 'جاري تحميل طلبات التقييم...' : 'Loading valuation requests...'} />
            ) : (
              <DataTable 
                rows={filteredValuationRequests}
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
                    label: language === 'ar' ? 'إضافة طلب تقييم' : 'Add Valuation Request',
                    onClick: () => {
                      // Handle add valuation request
                      console.log('Add valuation request clicked');
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

export default ValuationRequestsPage;
