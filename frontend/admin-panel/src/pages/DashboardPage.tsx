import React from 'react';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import AdminLayout from '../components/layouts/AdminLayout';
import { Section } from '../components/layout-elements';
import { PrimaryButton } from '../components/buttons';
import { ChartContainer } from '../components/ChartContainer';

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch dashboard data
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = {
          aldilaijan: {
            propertyCount: 156,
            activeListings: 87,
            pendingTransactions: 12,
            completedTransactions: 45,
            totalRevenue: 'KWD 1,245,000',
            recentProperties: [
              { id: 1, title: 'Luxury Villa in Salmiya', price: 'KWD 450,000', status: 'Active', type: 'Villa' },
              { id: 2, title: 'Apartment in Kuwait City', price: 'KWD 120,000', status: 'Pending', type: 'Apartment' },
              { id: 3, title: 'Commercial Space in Hawally', price: 'KWD 350,000', status: 'Active', type: 'Commercial' },
            ],
            monthlySales: [
              { month: 'Jan', amount: 120000 },
              { month: 'Feb', amount: 150000 },
              { month: 'Mar', amount: 180000 },
              { month: 'Apr', amount: 220000 },
              { month: 'May', amount: 190000 },
              { month: 'Jun', amount: 250000 },
            ],
            propertyTypeDistribution: [
              { type: 'Villa', count: 45 },
              { type: 'Apartment', count: 78 },
              { type: 'Commercial', count: 23 },
              { type: 'Land', count: 10 },
            ],
          },
          khobara: {
            valuationCount: 98,
            pendingRequests: 15,
            completedValuations: 83,
            totalRevenue: 'KWD 87,500',
            recentValuations: [
              { id: 1, property: 'Commercial Building in Sharq', client: 'Kuwait Bank', amount: 'KWD 2,500,000', date: '2025-03-28' },
              { id: 2, property: 'Residential Complex in Jabriya', client: 'Investment Co.', amount: 'KWD 1,800,000', date: '2025-03-25' },
              { id: 3, property: 'Industrial Facility in Shuwaikh', client: 'Industrial Group', amount: 'KWD 3,200,000', date: '2025-03-20' },
            ],
            monthlyValuations: [
              { month: 'Jan', count: 12 },
              { month: 'Feb', count: 15 },
              { month: 'Mar', count: 18 },
              { month: 'Apr', count: 22 },
              { month: 'May', count: 19 },
              { month: 'Jun', count: 25 },
            ],
            valuationTypeDistribution: [
              { type: 'Residential', count: 42 },
              { type: 'Commercial', count: 35 },
              { type: 'Industrial', count: 15 },
              { type: 'Land', count: 6 },
            ],
          }
        };
        
        setDashboardData(mockData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (authLoading || loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <AdminLayout title={language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}>
        <Container maxWidth="lg">
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={error} 
          />
        </Container>
      </AdminLayout>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <AdminLayout title={language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}>
      <Container maxWidth="lg">
        <Section title={language === 'ar' ? 'الدليجان العقاري' : 'Aldilaijan Real Estate'}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'العقارات' : 'Properties'}
                </Typography>
                <Typography variant="h3" color="primary.main">
                  {dashboardData.aldilaijan.propertyCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'إجمالي العقارات' : 'Total properties'}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'القوائم النشطة' : 'Active Listings'}
                </Typography>
                <Typography variant="h3" color="success.main">
                  {dashboardData.aldilaijan.activeListings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'عقارات معروضة للبيع/الإيجار' : 'Properties for sale/rent'}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'المعاملات المعلقة' : 'Pending Transactions'}
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {dashboardData.aldilaijan.pendingTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'معاملات قيد التنفيذ' : 'Transactions in progress'}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'الإيرادات' : 'Revenue'}
                </Typography>
                <Typography variant="h3" color="info.main">
                  {dashboardData.aldilaijan.totalRevenue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'إجمالي الإيرادات' : 'Total revenue'}
                </Typography>
              </Paper>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'المبيعات الشهرية' : 'Monthly Sales'}
                </Typography>
                <ChartContainer 
                  type="bar"
                  data={{
                    labels: dashboardData.aldilaijan.monthlySales.map((item: any) => item.month),
                    datasets: [
                      {
                        label: language === 'ar' ? 'المبيعات (د.ك)' : 'Sales (KWD)',
                        data: dashboardData.aldilaijan.monthlySales.map((item: any) => item.amount),
                        backgroundColor: '#C6A052',
                      }
                    ]
                  }}
                  height={300}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'توزيع أنواع العقارات' : 'Property Type Distribution'}
                </Typography>
                <ChartContainer 
                  type="pie"
                  data={{
                    labels: dashboardData.aldilaijan.propertyTypeDistribution.map((item: any) => 
                      language === 'ar' 
                        ? (item.type === 'Villa' ? 'فيلا' : 
                           item.type === 'Apartment' ? 'شقة' : 
                           item.type === 'Commercial' ? 'تجاري' : 
                           item.type === 'Land' ? 'أرض' : item.type)
                        : item.type
                    ),
                    datasets: [
                      {
                        data: dashboardData.aldilaijan.propertyTypeDistribution.map((item: any) => item.count),
                        backgroundColor: ['#C6A052', '#4A4A4A', '#6E6E6E', '#A88534'],
                      }
                    ]
                  }}
                  height={300}
                />
              </Paper>
            </Grid>
          </Grid>
        </Section>
        
        <Section title={language === 'ar' ? 'خبراء للتقييم العقاري' : 'Khobara Valuation'}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'التقييمات' : 'Valuations'}
                </Typography>
                <Typography variant="h3" color="primary.main">
                  {dashboardData.khobara.valuationCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'إجمالي التقييمات' : 'Total valuations'}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'الطلبات المعلقة' : 'Pending Requests'}
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {dashboardData.khobara.pendingRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'طلبات قيد المعالجة' : 'Requests in progress'}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'التقييمات المكتملة' : 'Completed Valuations'}
                </Typography>
                <Typography variant="h3" color="success.main">
                  {dashboardData.khobara.completedValuations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'تقييمات مكتملة' : 'Completed valuations'}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'الإيرادات' : 'Revenue'}
                </Typography>
                <Typography variant="h3" color="info.main">
                  {dashboardData.khobara.totalRevenue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'إجمالي الإيرادات' : 'Total revenue'}
                </Typography>
              </Paper>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'التقييمات الشهرية' : 'Monthly Valuations'}
                </Typography>
                <ChartContainer 
                  type="line"
                  data={{
                    labels: dashboardData.khobara.monthlyValuations.map((item: any) => item.month),
                    datasets: [
                      {
                        label: language === 'ar' ? 'عدد التقييمات' : 'Valuation Count',
                        data: dashboardData.khobara.monthlyValuations.map((item: any) => item.count),
                        borderColor: '#4A4A4A',
                        backgroundColor: 'rgba(74, 74, 74, 0.1)',
                        tension: 0.4,
                        fill: true,
                      }
                    ]
                  }}
                  height={300}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'توزيع أنواع التقييم' : 'Valuation Type Distribution'}
                </Typography>
                <ChartContainer 
                  type="doughnut"
                  data={{
                    labels: dashboardData.khobara.valuationTypeDistribution.map((item: any) => 
                      language === 'ar' 
                        ? (item.type === 'Residential' ? 'سكني' : 
                           item.type === 'Commercial' ? 'تجاري' : 
                           item.type === 'Industrial' ? 'صناعي' : 
                           item.type === 'Land' ? 'أرض' : item.type)
                        : item.type
                    ),
                    datasets: [
                      {
                        data: dashboardData.khobara.valuationTypeDistribution.map((item: any) => item.count),
                        backgroundColor: ['#4A4A4A', '#C6A052', '#6E6E6E', '#A88534'],
                      }
                    ]
                  }}
                  height={300}
                />
              </Paper>
            </Grid>
          </Grid>
        </Section>
      </Container>
    </AdminLayout>
  );
};

export default DashboardPage;
