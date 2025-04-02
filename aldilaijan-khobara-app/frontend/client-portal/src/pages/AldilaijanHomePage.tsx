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

const AldilaijanHomePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [featuredProperties, setFeaturedProperties] = React.useState([]);
  const [recentProperties, setRecentProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch properties data
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockFeaturedProperties = [
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
        ];
        
        const mockRecentProperties = [
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
        ];
        
        setFeaturedProperties(mockFeaturedProperties);
        setRecentProperties(mockRecentProperties);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading || authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ClientLayout 
      title={language === 'ar' ? 'الدليجان العقاري' : 'Aldilaijan Real Estate'}
      businessType="aldilaijan"
    >
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mb: 6,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              {language === 'ar' ? 'الدليجان العقاري' : 'Aldilaijan Real Estate'}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {language === 'ar' ? 'منذ عام ١٩٩٢' : 'Since 1992'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              {language === 'ar' 
                ? 'شريكك الموثوق في سوق العقارات الكويتي'
                : 'Your trusted partner in the Kuwaiti real estate market'
              }
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: '#C6A052', 
                '&:hover': { backgroundColor: '#A88534' },
                mr: 2
              }}
            >
              {language === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: '#C6A052', backgroundColor: 'rgba(198, 160, 82, 0.1)' }
              }}
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={error} 
          />
        )}
        
        {/* Featured Properties Section */}
        <Section 
          title={language === 'ar' ? 'العقارات المميزة' : 'Featured Properties'}
          description={language === 'ar' 
            ? 'اكتشف أفضل العقارات المتاحة في السوق الكويتي'
            : 'Discover the best properties available in the Kuwaiti market'
          }
        >
          <Grid container spacing={4}>
            {featuredProperties.map((property: any) => (
              <Grid item xs={12} md={4} key={property.id}>
                <PropertyCard 
                  property={property}
                  language={language}
                  onClick={() => console.log('Property clicked:', property.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Section>
        
        {/* Services Section */}
        <Section 
          title={language === 'ar' ? 'خدماتنا' : 'Our Services'}
          description={language === 'ar' 
            ? 'نقدم مجموعة واسعة من الخدمات العقارية لتلبية احتياجاتك'
            : 'We offer a wide range of real estate services to meet your needs'
          }
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <img 
                    src="https://img.icons8.com/fluency/96/000000/sell-property.png" 
                    alt={language === 'ar' ? 'بيع وشراء' : 'Buy and Sell'} 
                    width="64"
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'بيع وشراء العقارات' : 'Property Sales'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' 
                    ? 'نساعدك في بيع أو شراء العقارات بأفضل الأسعار وأفضل الشروط'
                    : 'We help you buy or sell properties at the best prices and terms'
                  }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <img 
                    src="https://img.icons8.com/fluency/96/000000/lease.png" 
                    alt={language === 'ar' ? 'تأجير' : 'Rental'} 
                    width="64"
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'خدمات التأجير' : 'Rental Services'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' 
                    ? 'نوفر خدمات تأجير العقارات السكنية والتجارية بعقود مضمونة'
                    : 'We provide residential and commercial property rental services with guaranteed contracts'
                  }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <img 
                    src="https://img.icons8.com/fluency/96/000000/property.png" 
                    alt={language === 'ar' ? 'إدارة العقارات' : 'Property Management'} 
                    width="64"
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'إدارة العقارات' : 'Property Management'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' 
                    ? 'نقدم خدمات إدارة العقارات الشاملة للملاك والمستثمرين'
                    : 'We offer comprehensive property management services for owners and investors'
                  }
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Section>
        
        {/* Recent Properties Section */}
        <Section 
          title={language === 'ar' ? 'أحدث العقارات' : 'Recent Properties'}
          description={language === 'ar' 
            ? 'أحدث العقارات المضافة إلى قائمتنا'
            : 'The latest properties added to our listings'
          }
        >
          <Grid container spacing={4}>
            {recentProperties.map((property: any) => (
              <Grid item xs={12} sm={6} md={3} key={property.id}>
                <PropertyCard 
                  property={property}
                  language={language}
                  onClick={() => console.log('Property clicked:', property.id)}
                  compact
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: '#C6A052', 
                '&:hover': { backgroundColor: '#A88534' }
              }}
            >
              {language === 'ar' ? 'عرض المزيد من العقارات' : 'View More Properties'}
            </Button>
          </Box>
        </Section>
        
        {/* About Us Section */}
        <Section 
          title={language === 'ar' ? 'عن الدليجان العقاري' : 'About Aldilaijan Real Estate'}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? 'تأسست شركة الدليجان العقاري في عام 1992، وأصبحت منذ ذلك الحين واحدة من الشركات الرائدة في سوق العقارات الكويتي. نحن نفتخر بتقديم خدمات عقارية متميزة لعملائنا، سواء كانوا أفراداً أو شركات.'
                  : 'Established in 1992, Aldilaijan Real Estate has since become one of the leading companies in the Kuwaiti real estate market. We pride ourselves on providing exceptional real estate services to our clients, whether they are individuals or corporations.'
                }
              </Typography>
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? 'مع فريق من المحترفين ذوي الخبرة، نحن ملتزمون بتقديم أفضل الحلول العقارية التي تلبي احتياجات عملائنا. سواء كنت تبحث عن منزل جديد، أو استثمار عقاري، أو مساحة تجارية، فإن فريقنا جاهز لمساعدتك في كل خطوة من الطريق.'
                  : 'With a team of experienced professionals, we are committed to providing the best real estate solutions that meet our clients\' needs. Whether you are looking for a new home, a real estate investment, or commercial space, our team is ready to assist you every step of the way.'
                }
              </Typography>
              <Typography variant="body1">
                {language === 'ar' 
                  ? 'نحن نؤمن بأن العقارات ليست مجرد مباني، بل هي أماكن يعيش فيها الناس ويعملون ويبنون ذكرياتهم. لذلك، نحن نسعى جاهدين لفهم احتياجات عملائنا وتطلعاتهم، وتقديم حلول مخصصة تناسب أسلوب حياتهم وأهدافهم.'
                  : 'We believe that real estate is not just about buildings, but about places where people live, work, and build memories. That\'s why we strive to understand our clients\' needs and aspirations, and provide tailored solutions that suit their lifestyle and goals.'
                }
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt={language === 'ar' ? 'الدليجان العقاري' : 'Aldilaijan Real Estate'}
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Section>
      </Container>
    </ClientLayout>
  );
};

export default AldilaijanHomePage;
