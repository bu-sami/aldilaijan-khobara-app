import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button, Chip, TextField, MenuItem, Tabs, Tab } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import ClientLayout from '../components/layouts/ClientLayout';
import { Section } from '../components/layout-elements';
import { PropertyDetails } from '../components/PropertyDetails';
import { ImageGallery } from '../components/ImageGallery';
import { MapComponent } from '../components/MapComponent';
import { ContactForm } from '../components/ContactForm';

const PropertyDetailsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [property, setProperty] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState(0);

  // Fetch property data
  React.useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProperty = { 
          id: 1, 
          title: 'Luxury Villa in Salmiya', 
          type: 'Villa', 
          status: 'For Sale', 
          location: 'Salmiya', 
          price: 450000,
          bedrooms: 5,
          bathrooms: 6,
          area: 500,
          description: 'This luxurious villa is located in the heart of Salmiya, offering a perfect blend of comfort and elegance. The property features 5 spacious bedrooms, 6 bathrooms, a large swimming pool, a beautiful garden, and modern amenities throughout. The villa has been recently renovated with high-quality materials and finishes. The ground floor includes a grand entrance hall, a large living room, a dining area, a modern kitchen, and a guest bedroom. The first floor houses the master bedroom with an en-suite bathroom and walk-in closet, as well as three additional bedrooms with their own bathrooms. The basement level includes a home theater, a gym, and a maid\'s room. The outdoor area features a swimming pool, a BBQ area, and a landscaped garden. The property also includes covered parking for 4 cars.',
          features: [
            'Swimming Pool',
            'Garden',
            'Central Air Conditioning',
            'Modern Kitchen',
            'Home Theater',
            'Gym',
            'Maid\'s Room',
            'Covered Parking',
            'Security System',
            'High-Speed Internet',
          ],
          images: [
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          ],
          agent: {
            name: 'Ahmed Al-Sabah',
            phone: '+965 1234 5678',
            email: 'ahmed@aldilaijan.com',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          },
          location: {
            latitude: 29.3399,
            longitude: 47.9337,
            address: 'Block 10, Street 5, Building 20, Salmiya, Kuwait',
          },
          featured: true,
          createdAt: '2023-09-15T10:30:00Z',
          updatedAt: '2023-09-20T14:45:00Z',
        };
        
        setProperty(mockProperty);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading || authLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <ClientLayout 
        title={language === 'ar' ? 'خطأ' : 'Error'}
        businessType="aldilaijan"
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={error} 
          />
        </Container>
      </ClientLayout>
    );
  }

  if (!property) {
    return (
      <ClientLayout 
        title={language === 'ar' ? 'العقار غير موجود' : 'Property Not Found'}
        businessType="aldilaijan"
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'العقار غير موجود' : 'Property Not Found'} 
            message={language === 'ar' 
              ? 'لم يتم العثور على العقار المطلوب. قد يكون قد تم حذفه أو نقله.'
              : 'The requested property could not be found. It may have been deleted or moved.'
            } 
          />
        </Container>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout 
      title={property.title}
      businessType="aldilaijan"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {property.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
              {property.location}
            </Typography>
            <Chip 
              label={property.status} 
              size="small" 
              color={property.status === 'For Sale' ? 'primary' : 'secondary'} 
              sx={{ mr: 1 }}
            />
            <Chip 
              label={property.type} 
              size="small" 
              variant="outlined" 
            />
          </Box>
          
          <Typography variant="h5" color="primary" gutterBottom>
            {property.status === 'For Sale' 
              ? `KWD ${property.price.toLocaleString()}`
              : `KWD ${property.price.toLocaleString()} / month`
            }
          </Typography>
        </Box>
        
        {/* Property Images Gallery */}
        <Box sx={{ mb: 4 }}>
          <ImageGallery images={property.images} />
        </Box>
        
        <Grid container spacing={4}>
          {/* Property Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{ mb: 3 }}
              >
                <Tab label={language === 'ar' ? 'نظرة عامة' : 'Overview'} />
                <Tab label={language === 'ar' ? 'المميزات' : 'Features'} />
                <Tab label={language === 'ar' ? 'الموقع' : 'Location'} />
              </Tabs>
              
              {/* Overview Tab */}
              {activeTab === 0 && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                        </Typography>
                        <Typography variant="h6">
                          {property.bedrooms}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                        </Typography>
                        <Typography variant="h6">
                          {property.bathrooms}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'المساحة' : 'Area'}
                        </Typography>
                        <Typography variant="h6">
                          {property.area} m²
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'النوع' : 'Type'}
                        </Typography>
                        <Typography variant="h6">
                          {property.type}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {property.description}
                  </Typography>
                </Box>
              )}
              
              {/* Features Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'مميزات العقار' : 'Property Features'}
                  </Typography>
                  <Grid container spacing={2}>
                    {property.features.map((feature: string, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            width: 24, 
                            height: 24, 
                            borderRadius: '50%', 
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                            fontSize: '0.75rem'
                          }}>
                            ✓
                          </Box>
                          <Typography variant="body1">
                            {feature}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* Location Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'موقع العقار' : 'Property Location'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {property.location.address}
                  </Typography>
                  <Box sx={{ height: 400, mb: 2 }}>
                    <MapComponent 
                      latitude={property.location.latitude} 
                      longitude={property.location.longitude} 
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Agent Information and Contact Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'وكيل العقار' : 'Property Agent'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  component="img"
                  src={property.agent.photo}
                  alt={property.agent.name}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    mr: 2
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {property.agent.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'ar' ? 'وكيل عقاري' : 'Real Estate Agent'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </Typography>
                <Typography variant="body1">
                  {property.agent.phone}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Typography>
                <Typography variant="body1">
                  {property.agent.email}
                </Typography>
              </Box>
              <Button 
                fullWidth
                variant="contained" 
                sx={{ 
                  backgroundColor: '#C6A052', 
                  '&:hover': { backgroundColor: '#A88534' },
                  mb: 2
                }}
              >
                {language === 'ar' ? 'اتصل بالوكيل' : 'Contact Agent'}
              </Button>
              <Button 
                fullWidth
                variant="outlined" 
              >
                {language === 'ar' ? 'جدولة معاينة' : 'Schedule Viewing'}
              </Button>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'مهتم بهذا العقار؟' : 'Interested in this property?'}
              </Typography>
              <Typography variant="body2" paragraph>
                {language === 'ar' 
                  ? 'املأ النموذج أدناه وسيتواصل معك وكيلنا في أقرب وقت ممكن.'
                  : 'Fill out the form below and our agent will contact you as soon as possible.'
                }
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    type="email"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'الرسالة' : 'Message'}
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    defaultValue={language === 'ar' 
                      ? `أنا مهتم بـ ${property.title} المعروض بسعر ${property.price.toLocaleString()} دينار كويتي. أرجو التواصل معي لمزيد من المعلومات.`
                      : `I am interested in ${property.title} listed for KWD ${property.price.toLocaleString()}. Please contact me with more information.`
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    fullWidth
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#C6A052', 
                      '&:hover': { backgroundColor: '#A88534' }
                    }}
                  >
                    {language === 'ar' ? 'إرسال' : 'Send'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Similar Properties */}
        <Section 
          title={language === 'ar' ? 'عقارات مشابهة' : 'Similar Properties'}
          description={language === 'ar' 
            ? 'عقارات أخرى قد تهمك'
            : 'Other properties you might be interested in'
          }
        >
          <Typography variant="body1" paragraph align="center">
            {language === 'ar' 
              ? 'سيتم عرض عقارات مشابهة هنا بناءً على الموقع والنوع والسعر.'
              : 'Similar properties based on location, type, and price would be displayed here.'
            }
          </Typography>
        </Section>
      </Container>
    </ClientLayout>
  );
};

export default PropertyDetailsPage;
