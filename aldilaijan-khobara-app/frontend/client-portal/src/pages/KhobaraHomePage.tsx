import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button, Chip, TextField, MenuItem } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import ClientLayout from '../components/layouts/ClientLayout';
import { Section } from '../components/layout-elements';
import { ValuationCard } from '../components/cards';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';

const KhobaraHomePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [services, setServices] = React.useState([]);
  const [testimonials, setTestimonials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockServices = [
          { 
            id: 1, 
            title: language === 'ar' ? 'تقييم العقارات السكنية' : 'Residential Property Valuation',
            description: language === 'ar' 
              ? 'تقييم شامل للمنازل والشقق والفلل وغيرها من العقارات السكنية'
              : 'Comprehensive valuation of houses, apartments, villas, and other residential properties',
            icon: 'https://img.icons8.com/fluency/96/000000/home.png',
          },
          { 
            id: 2, 
            title: language === 'ar' ? 'تقييم العقارات التجارية' : 'Commercial Property Valuation',
            description: language === 'ar' 
              ? 'تقييم المكاتب والمحلات التجارية والمستودعات والمباني الصناعية'
              : 'Valuation of offices, retail spaces, warehouses, and industrial buildings',
            icon: 'https://img.icons8.com/fluency/96/000000/commercial.png',
          },
          { 
            id: 3, 
            title: language === 'ar' ? 'تقييم الأراضي' : 'Land Valuation',
            description: language === 'ar' 
              ? 'تقييم قطع الأراضي للتطوير السكني أو التجاري أو الصناعي'
              : 'Valuation of land plots for residential, commercial, or industrial development',
            icon: 'https://img.icons8.com/fluency/96/000000/land-sales.png',
          },
          { 
            id: 4, 
            title: language === 'ar' ? 'تقييم المحافظ العقارية' : 'Real Estate Portfolio Valuation',
            description: language === 'ar' 
              ? 'تقييم شامل للمحافظ العقارية للشركات والمستثمرين'
              : 'Comprehensive valuation of real estate portfolios for companies and investors',
            icon: 'https://img.icons8.com/fluency/96/000000/investment-portfolio.png',
          },
          { 
            id: 5, 
            title: language === 'ar' ? 'تقييم لأغراض التمويل' : 'Valuation for Financing Purposes',
            description: language === 'ar' 
              ? 'تقييم العقارات لأغراض الرهن العقاري والتمويل المصرفي'
              : 'Property valuation for mortgage and bank financing purposes',
            icon: 'https://img.icons8.com/fluency/96/000000/bank-building.png',
          },
          { 
            id: 6, 
            title: language === 'ar' ? 'تقييم لأغراض التأمين' : 'Valuation for Insurance Purposes',
            description: language === 'ar' 
              ? 'تقييم العقارات لتحديد قيمة التأمين المناسبة'
              : 'Property valuation to determine appropriate insurance value',
            icon: 'https://img.icons8.com/fluency/96/000000/insurance.png',
          },
        ];
        
        const mockTestimonials = [
          { 
            id: 1, 
            name: language === 'ar' ? 'بنك الكويت الوطني' : 'National Bank of Kuwait',
            role: language === 'ar' ? 'عميل مؤسسي' : 'Corporate Client',
            content: language === 'ar' 
              ? 'نحن نعمل مع خبراء للتقييم العقاري منذ سنوات عديدة، وقد قدموا لنا دائمًا تقييمات دقيقة وموثوقة. فريقهم من المقيمين المحترفين يتمتع بمعرفة عميقة بسوق العقارات الكويتي.'
              : 'We have been working with Khobara Valuation for many years, and they have always provided us with accurate and reliable valuations. Their team of professional appraisers has deep knowledge of the Kuwaiti real estate market.',
          },
          { 
            id: 2, 
            name: language === 'ar' ? 'شركة الاستثمار العقاري' : 'Real Estate Investment Company',
            role: language === 'ar' ? 'عميل مؤسسي' : 'Corporate Client',
            content: language === 'ar' 
              ? 'خدمات التقييم التي تقدمها خبراء ممتازة وشاملة. لقد ساعدونا في تقييم محفظتنا العقارية بدقة، مما مكننا من اتخاذ قرارات استثمارية مستنيرة.'
              : 'The valuation services provided by Khobara are excellent and comprehensive. They helped us accurately value our real estate portfolio, enabling us to make informed investment decisions.',
          },
          { 
            id: 3, 
            name: language === 'ar' ? 'أحمد الصباح' : 'Ahmed Al-Sabah',
            role: language === 'ar' ? 'عميل فردي' : 'Individual Client',
            content: language === 'ar' 
              ? 'كنت بحاجة إلى تقييم لمنزلي لأغراض التمويل، وقدمت خبراء خدمة ممتازة. كان المقيم محترفًا للغاية وقدم تقريرًا مفصلاً في الوقت المحدد.'
              : 'I needed a valuation for my home for financing purposes, and Khobara provided excellent service. The appraiser was very professional and delivered a detailed report on time.',
          },
        ];
        
        setServices(mockServices);
        setTestimonials(mockTestimonials);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  if (loading || authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ClientLayout 
      title={language === 'ar' ? 'خبراء للتقييم العقاري' : 'Khobara Valuation'}
      businessType="khobara"
    >
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80)',
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
              {language === 'ar' ? 'خبراء للتقييم العقاري' : 'Khobara Valuation'}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {language === 'ar' ? 'مقيم عقاري معتمد من وزارة التجارة والصناعة' : 'Licensed Real Estate Appraiser by the Ministry of Commerce & Industry'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              {language === 'ar' 
                ? 'تقييم عقاري احترافي ودقيق لجميع أنواع العقارات'
                : 'Professional and accurate property valuation for all types of real estate'
              }
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: '#4A4A4A', 
                '&:hover': { backgroundColor: '#333333' },
                mr: 2
              }}
            >
              {language === 'ar' ? 'طلب تقييم' : 'Request Valuation'}
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: '#4A4A4A', backgroundColor: 'rgba(74, 74, 74, 0.1)' }
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
        
        {/* Services Section */}
        <Section 
          title={language === 'ar' ? 'خدماتنا' : 'Our Services'}
          description={language === 'ar' 
            ? 'نقدم مجموعة شاملة من خدمات التقييم العقاري'
            : 'We provide a comprehensive range of property valuation services'
          }
        >
          <Grid container spacing={3}>
            {services.map((service: any) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={service.icon} 
                      alt={service.title} 
                      width="64"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Section>
        
        {/* Why Choose Us Section */}
        <Section 
          title={language === 'ar' ? 'لماذا تختار خبراء للتقييم العقاري' : 'Why Choose Khobara Valuation'}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt={language === 'ar' ? 'خبراء للتقييم العقاري' : 'Khobara Valuation'}
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'خبرة واسعة' : 'Extensive Experience'}
              </Typography>
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? 'فريقنا من المقيمين المعتمدين يتمتع بسنوات من الخبرة في سوق العقارات الكويتي.'
                  : 'Our team of certified appraisers has years of experience in the Kuwaiti real estate market.'
                }
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'دقة وموثوقية' : 'Accuracy and Reliability'}
              </Typography>
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? 'نستخدم منهجيات تقييم متطورة ومعايير دولية لضمان دقة وموثوقية تقاريرنا.'
                  : 'We use advanced valuation methodologies and international standards to ensure the accuracy and reliability of our reports.'
                }
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'اعتماد رسمي' : 'Official Accreditation'}
              </Typography>
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? 'نحن مقيمون عقاريون معتمدون من وزارة التجارة والصناعة في الكويت.'
                  : 'We are licensed real estate appraisers by the Ministry of Commerce and Industry in Kuwait.'
                }
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'خدمة شاملة' : 'Comprehensive Service'}
              </Typography>
              <Typography variant="body1">
                {language === 'ar' 
                  ? 'نقدم خدمات تقييم شاملة لجميع أنواع العقارات ولمختلف الأغراض.'
                  : 'We provide comprehensive valuation services for all types of properties and for various purposes.'
                }
              </Typography>
            </Grid>
          </Grid>
        </Section>
        
        {/* Valuation Process Section */}
        <Section 
          title={language === 'ar' ? 'عملية التقييم' : 'Valuation Process'}
          description={language === 'ar' 
            ? 'عملية تقييم بسيطة وفعالة'
            : 'A simple and efficient valuation process'
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ 
                  mb: 2, 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  backgroundColor: '#4A4A4A', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <Typography variant="h5">1</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'تقديم الطلب' : 'Submit Request'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' 
                    ? 'قم بتقديم طلب التقييم عبر موقعنا الإلكتروني أو بالاتصال بنا مباشرة'
                    : 'Submit your valuation request through our website or by contacting us directly'
                  }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ 
                  mb: 2, 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  backgroundColor: '#4A4A4A', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <Typography variant="h5">2</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'معاينة العقار' : 'Property Inspection'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' 
                    ? 'يقوم مقيم معتمد بزيارة العقار وإجراء معاينة شاملة'
                    : 'A certified appraiser visits the property and conducts a comprehensive inspection'
                  }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ 
                  mb: 2, 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  backgroundColor: '#4A4A4A', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <Typography variant="h5">3</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'تحليل البيانات' : 'Data Analysis'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' 
                    ? 'نقوم بتحليل بيانات العقار ومقارنتها بالسوق باستخدام منهجيات تقييم متطورة'
                    : 'We analyze property data and compare it with the market using advanced valuation methodologies'
                  }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ 
                  mb: 2, 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  backgroundColor: '#4A4A4A', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <Typography variant="h5">4</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'تقرير التقييم' : 'Valuation Report'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' 
                    ? 'نقدم تقرير تقييم شامل ومفصل يوضح قيمة العقار ومنهجية التقييم'
                    : 'We provide a comprehensive and detailed valuation report that explains the property value and valuation methodology'
                  }
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: '#4A4A4A', 
                '&:hover': { backgroundColor: '#333333' }
              }}
            >
              {language === 'ar' ? 'طلب تقييم الآن' : 'Request Valuation Now'}
            </Button>
          </Box>
        </Section>
        
        {/* Testimonials Section */}
        <Section 
          title={language === 'ar' ? 'آراء عملائنا' : 'Client Testimonials'}
          description={language === 'ar' 
            ? 'ما يقوله عملاؤنا عن خدماتنا'
            : 'What our clients say about our services'
          }
        >
          <Grid container spacing={4}>
            {testimonials.map((testimonial: any) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <Paper sx={{ p: 4, height: '100%', position: 'relative' }}>
                  <Box sx={{ 
                    position: 'absolute',
                    top: 20,
                    left: language === 'ar' ? 'auto' : 20,
                    right: language === 'ar' ? 20 : 'auto',
                    fontSize: '4rem',
                    color: 'rgba(74, 74, 74, 0.1)',
                    lineHeight: 1
                  }}>
                    "
                  </Box>
                  <Typography variant="body1" paragraph sx={{ position: 'relative', zIndex: 1 }}>
                    {testimonial.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        backgroundColor: '#4A4A4A', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography variant="h6">{testimonial.name.charAt(0)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Section>
        
        {/* Contact Section */}
        <Section 
          title={language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          description={language === 'ar' 
            ? 'نحن هنا للإجابة على استفساراتك'
            : 'We are here to answer your inquiries'
          }
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? 'إذا كان لديك أي استفسارات حول خدمات التقييم العقاري التي نقدمها، أو ترغب في طلب تقييم، فلا تتردد في التواصل معنا. فريقنا جاهز للرد على استفساراتك وتقديم المساعدة التي تحتاجها.'
                  : 'If you have any inquiries about the property valuation services we provide, or would like to request a valuation, please do not hesitate to contact us. Our team is ready to answer your questions and provide the assistance you need.'
                }
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'العنوان' : 'Address'}
                </Typography>
                <Typography variant="body1">
                  {language === 'ar' 
                    ? 'الكويت، مدينة الكويت، شارع فهد السالم، برج الخليج، الطابق 15'
                    : 'Kuwait, Kuwait City, Fahd Al-Salem Street, Gulf Tower, 15th Floor'
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Typography>
                <Typography variant="body1">
                  info@khobara-valuation.com
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </Typography>
                <Typography variant="body1">
                  +965 2222 3333
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {language === 'ar' ? 'نموذج الاتصال' : 'Contact Form'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={language === 'ar' ? 'الاسم' : 'Name'}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={language === 'ar' ? 'الموضوع' : 'Subject'}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={language === 'ar' ? 'الرسالة' : 'Message'}
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      size="large"
                      sx={{ 
                        backgroundColor: '#4A4A4A', 
                        '&:hover': { backgroundColor: '#333333' }
                      }}
                    >
                      {language === 'ar' ? 'إرسال' : 'Send'}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Section>
      </Container>
    </ClientLayout>
  );
};

export default KhobaraHomePage;
