import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button, Chip, TextField, MenuItem } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import ClientLayout from '../components/layouts/ClientLayout';
import { Section } from '../components/layout-elements';
import { PropertyCard } from '../components/cards';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';

const PropertyListingPage: React.FC = () => {
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
    bedrooms: '',
    bathrooms: '',
  });
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

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
            status: 'For Sale', 
            location: 'Salmiya', 
            price: 450000,
            bedrooms: 5,
            bathrooms: 6,
            area: 500,
            description: 'Luxurious villa with swimming pool, garden, and modern amenities.',
            imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
          { 
            id: 2, 
            title: 'Modern Apartment in Kuwait City', 
            type: 'Apartment', 
            status: 'For Sale', 
            location: 'Kuwait City', 
            price: 120000,
            bedrooms: 2,
            bathrooms: 2,
            area: 120,
            description: 'Modern apartment with sea view in the heart of Kuwait City.',
            imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
          { 
            id: 3, 
            title: 'Commercial Space in Hawally', 
            type: 'Commercial', 
            status: 'For Sale', 
            location: 'Hawally', 
            price: 350000,
            bedrooms: 0,
            bathrooms: 2,
            area: 300,
            description: 'Prime commercial space in a busy area of Hawally.',
            imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
          { 
            id: 4, 
            title: 'Penthouse in Sharq', 
            type: 'Apartment', 
            status: 'For Rent', 
            location: 'Sharq', 
            price: 1500,
            bedrooms: 4,
            bathrooms: 4,
            area: 350,
            description: 'Luxurious penthouse with panoramic views of the city.',
            imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: false,
          },
          { 
            id: 5, 
            title: 'Land in Jahra', 
            type: 'Land', 
            status: 'For Sale', 
            location: 'Jahra', 
            price: 800000,
            bedrooms: 0,
            bathrooms: 0,
            area: 1000,
            description: 'Large plot of land suitable for development.',
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: false,
          },
          { 
            id: 6, 
            title: 'Family Home in Salwa', 
            type: 'Villa', 
            status: 'For Sale', 
            location: 'Salwa', 
            price: 380000,
            bedrooms: 4,
            bathrooms: 3,
            area: 400,
            description: 'Spacious family home in a quiet neighborhood.',
            imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: false,
          },
          { 
            id: 7, 
            title: 'Office Space in Kuwait City', 
            type: 'Commercial', 
            status: 'For Rent', 
            location: 'Kuwait City', 
            price: 2500,
            bedrooms: 0,
            bathrooms: 2,
            area: 200,
            description: 'Modern office space in a prime business district.',
            imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: false,
          },
          { 
            id: 8, 
            title: 'Apartment in Salmiya', 
            type: 'Apartment', 
            status: 'For Rent', 
            location: 'Salmiya', 
            price: 800,
            bedrooms: 2,
            bathrooms: 2,
            area: 110,
            description: 'Cozy apartment in a convenient location.',
            imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: false,
          },
          { 
            id: 9, 
            title: 'Retail Space in Hawally', 
            type: 'Commercial', 
            status: 'For Rent', 
            location: 'Hawally', 
            price: 1800,
            bedrooms: 0,
            bathrooms: 1,
            area: 150,
            description: 'Retail space in a high-traffic shopping area.',
            imageUrl: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            featured: false,
          },
        ];
        
        setProperties(mockProperties);
        setTotalPages(3); // Mock total pages
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page]);

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
    if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) return false;
    if (filters.bathrooms && property.bathrooms < parseInt(filters.bathrooms)) return false;
    return true;
  });

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading || authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ClientLayout 
      title={language === 'ar' ? 'عقارات الدليجان' : 'Aldilaijan Properties'}
      businessType="aldilaijan"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={error} 
          />
        )}
        
        <Typography variant="h4" component="h1" gutterBottom>
          {language === 'ar' ? 'عقارات للبيع والإيجار' : 'Properties for Sale and Rent'}
        </Typography>
        
        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'تصفية النتائج' : 'Filter Results'}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'نوع العقار' : 'Property Type'}
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="">
                    {language === 'ar' ? 'الكل' : 'All'}
                  </MenuItem>
                  <MenuItem value="Villa">
                    {language === 'ar' ? 'فيلا' : 'Villa'}
                  </MenuItem>
                  <MenuItem value="Apartment">
                    {language === 'ar' ? 'شقة' : 'Apartment'}
                  </MenuItem>
                  <MenuItem value="Commercial">
                    {language === 'ar' ? 'تجاري' : 'Commercial'}
                  </MenuItem>
                  <MenuItem value="Land">
                    {language === 'ar' ? 'أرض' : 'Land'}
                  </MenuItem>
                </TextField>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">
                    {language === 'ar' ? 'الكل' : 'All'}
                  </MenuItem>
                  <MenuItem value="For Sale">
                    {language === 'ar' ? 'للبيع' : 'For Sale'}
                  </MenuItem>
                  <MenuItem value="For Rent">
                    {language === 'ar' ? 'للإيجار' : 'For Rent'}
                  </MenuItem>
                </TextField>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'الموقع' : 'Location'}
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <MenuItem value="">
                    {language === 'ar' ? 'الكل' : 'All'}
                  </MenuItem>
                  <MenuItem value="Kuwait City">
                    {language === 'ar' ? 'مدينة الكويت' : 'Kuwait City'}
                  </MenuItem>
                  <MenuItem value="Salmiya">
                    {language === 'ar' ? 'السالمية' : 'Salmiya'}
                  </MenuItem>
                  <MenuItem value="Hawally">
                    {language === 'ar' ? 'حولي' : 'Hawally'}
                  </MenuItem>
                  <MenuItem value="Sharq">
                    {language === 'ar' ? 'الشرق' : 'Sharq'}
                  </MenuItem>
                  <MenuItem value="Jahra">
                    {language === 'ar' ? 'الجهراء' : 'Jahra'}
                  </MenuItem>
                  <MenuItem value="Salwa">
                    {language === 'ar' ? 'سلوى' : 'Salwa'}
                  </MenuItem>
                </TextField>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'نطاق السعر' : 'Price Range'}
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {`KWD ${filters.priceRange[0].toLocaleString()} - KWD ${filters.priceRange[1].toLocaleString()}`}
                  </Typography>
                </Box>
                {/* Note: In a real implementation, this would be a proper range slider component */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    label={language === 'ar' ? 'الحد الأدنى' : 'Min'}
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    sx={{ width: '48%' }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    label={language === 'ar' ? 'الحد الأقصى' : 'Max'}
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000000])}
                    sx={{ width: '48%' }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                >
                  <MenuItem value="">
                    {language === 'ar' ? 'الكل' : 'All'}
                  </MenuItem>
                  <MenuItem value="1">1+</MenuItem>
                  <MenuItem value="2">2+</MenuItem>
                  <MenuItem value="3">3+</MenuItem>
                  <MenuItem value="4">4+</MenuItem>
                  <MenuItem value="5">5+</MenuItem>
                </TextField>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                >
                  <MenuItem value="">
                    {language === 'ar' ? 'الكل' : 'All'}
                  </MenuItem>
                  <MenuItem value="1">1+</MenuItem>
                  <MenuItem value="2">2+</MenuItem>
                  <MenuItem value="3">3+</MenuItem>
                  <MenuItem value="4">4+</MenuItem>
                  <MenuItem value="5">5+</MenuItem>
                </TextField>
              </Box>
              
              <Button 
                fullWidth
                variant="contained" 
                sx={{ 
                  backgroundColor: '#C6A052', 
                  '&:hover': { backgroundColor: '#A88534' },
                  mb: 1
                }}
                onClick={() => {
                  // Apply filters
                  console.log('Applying filters:', filters);
                }}
              >
                {language === 'ar' ? 'تطبيق الفلتر' : 'Apply Filter'}
              </Button>
              
              <Button 
                fullWidth
                variant="outlined" 
                onClick={() => {
                  // Reset filters
                  setFilters({
                    type: '',
                    status: '',
                    location: '',
                    priceRange: [0, 1000000],
                    bedrooms: '',
                    bathrooms: '',
                  });
                }}
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>
            </Paper>
          </Grid>
          
          {/* Property Listings */}
          <Grid item xs={12} md={9}>
            {filteredProperties.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'لا توجد عقارات متطابقة مع معايير البحث' : 'No properties match your search criteria'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {language === 'ar' ? 'يرجى تعديل معايير البحث وحاول مرة أخرى' : 'Please adjust your search criteria and try again'}
                </Typography>
              </Paper>
            ) : (
              <>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {language === 'ar' 
                      ? `${filteredProperties.length} عقار`
                      : `${filteredProperties.length} properties found`
                    }
                  </Typography>
                  <TextField
                    select
                    size="small"
                    label={language === 'ar' ? 'ترتيب حسب' : 'Sort by'}
                    sx={{ width: 200 }}
                    defaultValue="newest"
                  >
                    <MenuItem value="newest">
                      {language === 'ar' ? 'الأحدث' : 'Newest'}
                    </MenuItem>
                    <MenuItem value="price_low">
                      {language === 'ar' ? 'السعر: من الأقل إلى الأعلى' : 'Price: Low to High'}
                    </MenuItem>
                    <MenuItem value="price_high">
                      {language === 'ar' ? 'السعر: من الأعلى إلى الأقل' : 'Price: High to Low'}
                    </MenuItem>
                  </TextField>
                </Box>
                
                <Grid container spacing={3}>
                  {filteredProperties.map((property: any) => (
                    <Grid item xs={12} sm={6} md={4} key={property.id}>
                      <PropertyCard 
                        property={property}
                        language={language}
                        onClick={() => console.log('Property clicked:', property.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    language={language}
                  />
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </ClientLayout>
  );
};

export default PropertyListingPage;
