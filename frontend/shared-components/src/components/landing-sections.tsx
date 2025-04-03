import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

const StyledHeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
}));

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
  imageSrc?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  onCtaClick,
  imageSrc,
}) => {
  return (
    <StyledHeroSection>
      <Box maxWidth="lg" mx="auto" px={3}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" paragraph>
              {subtitle}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={onCtaClick}
              sx={{ mt: 2 }}
            >
              {ctaText}
            </Button>
          </Grid>
          {imageSrc && (
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={imageSrc}
                alt="Hero"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </StyledHeroSection>
  );
};

interface ContactSectionProps {
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  mapUrl?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  description,
  address,
  phone,
  email,
  mapUrl,
}) => {
  const { language } = React.useContext(ThemeContext);

  return (
    <Box py={8}>
      <Box maxWidth="lg" mx="auto" px={3}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          {title}
        </Typography>
        <Typography variant="body1" paragraph align="center" mb={6}>
          {description}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom>
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </Typography>
              <Box mt={3}>
                <Typography variant="body1" gutterBottom>
                  <strong>{language === 'ar' ? 'العنوان:' : 'Address:'}</strong> {address}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> {phone}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong> {email}
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            {mapUrl ? (
              <Box
                component="iframe"
                src={mapUrl}
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0, borderRadius: 8 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              />
            ) : (
              <StyledPaper sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  {language === 'ar' ? 'الخريطة غير متوفرة' : 'Map not available'}
                </Typography>
              </StyledPaper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default { HeroSection, ContactSection };
