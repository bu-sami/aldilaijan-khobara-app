import React from 'react';
import { Box, Container, Typography, Grid, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

const ClientLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2, 0),
  color: theme.palette.primary.contrastText,
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  padding: theme.spacing(4, 0),
  color: theme.palette.secondary.contrastText,
  marginTop: 'auto',
}));

const Main = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  flexGrow: 1,
}));

interface ClientLayoutProps {
  children: React.ReactNode;
  businessType: 'aldilaijan' | 'khobara';
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, businessType }) => {
  const theme = useTheme();
  const { language } = React.useContext(ThemeContext);
  
  const businessInfo = {
    aldilaijan: {
      name: language === 'ar' ? 'الدليجان العقاري' : 'Aldilaijan Real Estate',
      slogan: language === 'ar' ? 'شريكك العقاري منذ ١٩٩٢' : 'Your Real Estate Partner Since 1992',
      address: language === 'ar' ? 'الكويت، شارع فهد السالم، مبنى الدليجان' : 'Kuwait, Fahd Al-Salem Street, Aldilaijan Building',
      phone: '+965 2240 0000',
      email: 'info@aldilaijan.com',
    },
    khobara: {
      name: language === 'ar' ? 'خبراء للتقييم العقاري' : 'Khobara Valuation',
      slogan: language === 'ar' ? 'مقيم عقاري معتمد من وزارة التجارة والصناعة' : 'Licensed Real Estate Appraiser by the Ministry of Commerce & Industry',
      address: language === 'ar' ? 'الكويت، شارع فهد السالم، مبنى الدليجان' : 'Kuwait, Fahd Al-Salem Street, Aldilaijan Building',
      phone: '+965 2240 0001',
      email: 'info@khobara.com',
    }
  };

  const info = businessInfo[businessType];

  return (
    <ClientLayoutRoot>
      <Header>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h1">{info.name}</Typography>
              <Typography variant="subtitle1">{info.slogan}</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2">{info.phone}</Typography>
              <Typography variant="body2">{info.email}</Typography>
            </Grid>
          </Grid>
        </Container>
      </Header>
      
      <Main>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Main>
      
      <Footer>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                {info.name}
              </Typography>
              <Typography variant="body2">{info.slogan}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Typography>
              <Typography variant="body2">{info.address}</Typography>
              <Typography variant="body2">{info.phone}</Typography>
              <Typography variant="body2">{info.email}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
              </Typography>
              <Typography variant="body2">
                {language === 'ar' ? 'الأحد - الخميس: 8:00 صباحاً - 4:00 مساءً' : 'Sunday - Thursday: 8:00 AM - 4:00 PM'}
              </Typography>
              <Typography variant="body2">
                {language === 'ar' ? 'الجمعة - السبت: مغلق' : 'Friday - Saturday: Closed'}
              </Typography>
            </Grid>
          </Grid>
          <Box mt={4} textAlign="center">
            <Typography variant="body2">
              © {new Date().getFullYear()} {info.name}. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </Typography>
          </Box>
        </Container>
      </Footer>
    </ClientLayoutRoot>
  );
};

export default ClientLayout;
