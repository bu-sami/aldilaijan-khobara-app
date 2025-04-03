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
import { TabsContainer } from '../components/TabsContainer';

const TransactionsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [transactions, setTransactions] = React.useState([]);
  const [mojTransactions, setMojTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    type: '',
    status: '',
    dateRange: [null, null],
    propertyType: '',
  });

  // Fetch transactions data
  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTransactions = [
          { 
            id: 1, 
            property: 'Luxury Villa in Salmiya', 
            type: 'Sale', 
            status: 'Completed', 
            client: 'Ahmed Al-Sabah',
            amount: 450000,
            date: '2025-03-15',
            agent: 'Mohammed Hassan',
            propertyType: 'Villa',
          },
          { 
            id: 2, 
            property: 'Apartment in Kuwait City', 
            type: 'Rent', 
            status: 'In Progress', 
            client: 'Sara Al-Ali',
            amount: 1200,
            date: '2025-03-20',
            agent: 'Fatima Al-Ali',
            propertyType: 'Apartment',
          },
          { 
            id: 3, 
            property: 'Commercial Space in Hawally', 
            type: 'Sale', 
            status: 'Completed', 
            client: 'Kuwait Bank',
            amount: 350000,
            date: '2025-03-10',
            agent: 'Mohammed Hassan',
            propertyType: 'Commercial',
          },
          { 
            id: 4, 
            property: 'Penthouse in Sharq', 
            type: 'Sale', 
            status: 'Pending', 
            client: 'Investment Co.',
            amount: 550000,
            date: '2025-03-25',
            agent: 'Fatima Al-Ali',
            propertyType: 'Apartment',
          },
          { 
            id: 5, 
            property: 'Office Space in Kuwait City', 
            type: 'Rent', 
            status: 'Completed', 
            client: 'Development Co.',
            amount: 2500,
            date: '2025-03-05',
            agent: 'Ahmed Ali',
            propertyType: 'Commercial',
          },
        ];
        
        const mockMojTransactions = [
          { 
            id: 1, 
            propertyAddress: 'Block 5, Street 10, House 15, Salmiya', 
            area: 'Salmiya', 
            transactionType: 'Sale', 
            price: 450000,
            date: '2025-03-15',
            propertyType: 'Villa',
            size: 500,
          },
          { 
            id: 2, 
            propertyAddress: 'Block 3, Street 5, Building 8, Kuwait City', 
            area: 'Kuwait City', 
            transactionType: 'Sale', 
            price: 320000,
            date: '2025-03-12',
            propertyType: 'Apartment',
            size: 180,
          },
          { 
            id: 3, 
            propertyAddress: 'Block 7, Street 12, Building 3, Hawally', 
            area: 'Hawally', 
            transactionType: 'Sale', 
            price: 380000,
            date: '2025-03-10',
            propertyType: 'Commercial',
            size: 350,
          },
          { 
            id: 4, 
            propertyAddress: 'Block 2, Street 8, Building 5, Sharq', 
            area: 'Sharq', 
            transactionType: 'Sale', 
            price: 520000,
            date: '2025-03-08',
            propertyType: 'Apartment',
            size: 220,
          },
          { 
            id: 5, 
            propertyAddress: 'Block 9, Street 15, Plot 7, Jahra', 
            area: 'Jahra', 
            transactionType: 'Sale', 
            price: 280000,
            date: '2025-03-05',
            propertyType: 'Land',
            size: 800,
          },
        ];
        
        setTransactions(mockTransactions);
        setMojTransactions(mockMojTransactions);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to transactions
  const filteredTransactions = transactions.filter((transaction: any) => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.status && transaction.status !== filters.status) return false;
    if (filters.propertyType && transaction.propertyType !== filters.propertyType) return false;
    
    // Date range filtering
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      
      if (transactionDate < startDate || transactionDate > endDate) return false;
    }
    
    return true;
  });

  // Apply filters to MOJ transactions
  const filteredMojTransactions = mojTransactions.filter((transaction: any) => {
    if (filters.type && transaction.transactionType !== filters.type) return false;
    if (filters.propertyType && transaction.propertyType !== filters.propertyType) return false;
    
    // Date range filtering
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      
      if (transactionDate < startDate || transactionDate > endDate) return false;
    }
    
    return true;
  });

  // Define columns for the transactions data table
  const transactionColumns = [
    { 
      field: 'id', 
      headerName: language === 'ar' ? 'المعرف' : 'ID',
      width: 70 
    },
    { 
      field: 'property', 
      headerName: language === 'ar' ? 'العقار' : 'Property',
      width: 200 
    },
    { 
      field: 'type', 
      headerName: language === 'ar' ? 'النوع' : 'Type',
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {language === 'ar' 
            ? (params.value === 'Sale' ? 'بيع' : 
               params.value === 'Rent' ? 'إيجار' : params.value)
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
      field: 'client', 
      headerName: language === 'ar' ? 'العميل' : 'Client',
      width: 150 
    },
    { 
      field: 'amount', 
      headerName: language === 'ar' ? 'المبلغ' : 'Amount',
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {params.row.type === 'Sale' 
            ? `KWD ${params.value.toLocaleString()}`
            : `KWD ${params.value.toLocaleString()}/month`
          }
        </Typography>
      )
    },
    { 
      field: 'date', 
      headerName: language === 'ar' ? 'التاريخ' : 'Date',
      width: 120 
    },
    { 
      field: 'agent', 
      headerName: language === 'ar' ? 'الوكيل' : 'Agent',
      width: 150 
    },
    { 
      field: 'propertyType', 
      headerName: language === 'ar' ? 'نوع العقار' : 'Property Type',
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
      field: 'actions',
      headerName: language === 'ar' ? 'الإجراءات' : 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary"
            onClick={() => console.log('View transaction', params.row.id)}
          >
            {language === 'ar' ? 'عرض' : 'View'}
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => console.log('Edit transaction', params.row.id)}
          >
            {language === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
        </Box>
      )
    }
  ];

  // Define columns for the MOJ transactions data table
  const mojTransactionColumns = [
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
      field: 'area', 
      headerName: language === 'ar' ? 'المنطقة' : 'Area',
      width: 120 
    },
    { 
      field: 'transactionType', 
      headerName: language === 'ar' ? 'نوع المعاملة' : 'Transaction Type',
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {language === 'ar' 
            ? (params.value === 'Sale' ? 'بيع' : params.value)
            : params.value
          }
        </Typography>
      )
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
      field: 'date', 
      headerName: language === 'ar' ? 'التاريخ' : 'Date',
      width: 120 
    },
    { 
      field: 'propertyType', 
      headerName: language === 'ar' ? 'نوع العقار' : 'Property Type',
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
      field: 'size', 
      headerName: language === 'ar' ? 'المساحة' : 'Size',
      width: 100,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {`${params.value} m²`}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: language === 'ar' ? 'الإجراءات' : 'Actions',
      width: 100,
      renderCell: (params: any) => (
        <Button 
          size="small" 
          variant="outlined" 
          color="primary"
          onClick={() => console.log('View MOJ transaction', params.row.id)}
        >
          {language === 'ar' ? 'عرض' : 'View'}
        </Button>
      )
    }
  ];

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminLayout title={language === 'ar' ? 'إدارة المعاملات' : 'Transaction Management'}>
      <Container maxWidth="lg">
        <Section 
          title={language === 'ar' ? 'المعاملات' : 'Transactions'}
          description={language === 'ar' 
            ? 'إدارة معاملات البيع والإيجار وعرض بيانات معاملات وزارة العدل' 
            : 'Manage sales and rental transactions and view Ministry of Justice transaction data'
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
                  label: language === 'ar' ? 'نوع المعاملة' : 'Transaction Type',
                  value: filters.type,
                  onChange: (value) => handleFilterChange('type', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Sale', label: language === 'ar' ? 'بيع' : 'Sale' },
                    { value: 'Rent', label: language === 'ar' ? 'إيجار' : 'Rent' },
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
                    { value: 'Pending', label: language === 'ar' ? 'معلق' : 'Pending' },
                    { value: 'In Progress', label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress' },
                    { value: 'Completed', label: language === 'ar' ? 'مكتمل' : 'Completed' },
                  ]
                },
                {
                  type: 'select',
                  name: 'propertyType',
                  label: language === 'ar' ? 'نوع العقار' : 'Property Type',
                  value: filters.propertyType,
                  onChange: (value) => handleFilterChange('propertyType', value),
                  options: [
                    { value: '', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'Villa', label: language === 'ar' ? 'فيلا' : 'Villa' },
                    { value: 'Apartment', label: language === 'ar' ? 'شقة' : 'Apartment' },
                    { value: 'Commercial', label: language === 'ar' ? 'تجاري' : 'Commercial' },
                    { value: 'Land', label: language === 'ar' ? 'أرض' : 'Land' },
                  ]
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
                type: '',
                status: '',
                dateRange: [null, null],
                propertyType: '',
              })}
            />
            
            {loading ? (
              <LoadingIndicator message={language === 'ar' ? 'جاري تحميل المعاملات...' : 'Loading transactions...'} />
            ) : (
              <TabsContainer
                tabs={[
                  {
                    label: language === 'ar' ? 'معاملات الدليجان' : 'Aldilaijan Transactions',
                    content: (
                      <DataTable 
                        rows={filteredTransactions}
                        columns={transactionColumns}
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
                            label: language === 'ar' ? 'إضافة معاملة' : 'Add Transaction',
                            onClick: () => {
                              // Handle add transaction
                              console.log('Add transaction clicked');
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
                    )
                  },
                  {
                    label: language === 'ar' ? 'معاملات وزارة العدل' : 'MOJ Transactions',
                    content: (
                      <DataTable 
                        rows={filteredMojTransactions}
                        columns={mojTransactionColumns}
                        loading={loading}
                        pageSize={10}
                        checkboxSelection={false}
                        disableSelectionOnClick
                        onRowClick={(params) => {
                          // Handle row click
                          console.log('MOJ row clicked:', params.row);
                        }}
                        actions={[
                          {
                            label: language === 'ar' ? 'تحديث البيانات' : 'Refresh Data',
                            onClick: () => {
                              // Handle refresh MOJ data
                              console.log('Refresh MOJ data clicked');
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
                    )
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

export default TransactionsPage;
