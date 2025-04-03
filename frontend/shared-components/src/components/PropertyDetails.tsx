import React from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

interface PropertyDetailsProps {
  property: {
    title: string;
    description: string;
    price: string;
    location: string;
    area: string;
    bedrooms?: number;
    bathrooms?: number;
    features?: string[];
    agent?: {
      name: string;
      phone: string;
      email: string;
      photo?: string;
    };
  };
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
}));

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const { language } = React.useContext(ThemeContext);
  
  return (
    <Box>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>{property.title}</Typography>
        <Typography variant="h5" color="primary.main" gutterBottom>{property.price}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>{property.location}</Typography>
        
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={4} sm={3}>
              <Typography variant="body2" color="text.secondary">
                {language === 'ar' ? 'المساحة' : 'Area'}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {property.area}
              </Typography>
            </Grid>
            
            {property.bedrooms !== undefined && (
              <Grid item xs={4} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {property.bedrooms}
                </Typography>
              </Grid>
            )}
            
            {property.bathrooms !== undefined && (
              <Grid item xs={4} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {property.bathrooms}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </StyledPaper>
      
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          {language === 'ar' ? 'الوصف' : 'Description'}
        </Typography>
        <Typography variant="body1" paragraph>
          {property.description}
        </Typography>
      </StyledPaper>
      
      {property.features && property.features.length > 0 && (
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {language === 'ar' ? 'المميزات' : 'Features'}
          </Typography>
          <Grid container spacing={2}>
            {property.features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body1">{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}
      
      {property.agent && (
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {language === 'ar' ? 'وكيل العقار' : 'Property Agent'}
          </Typography>
          <Box display="flex" alignItems="center">
            {property.agent.photo && (
              <Box
                component="img"
                src={property.agent.photo}
                alt={property.agent.name}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  mr: 2,
                }}
              />
            )}
            <Box>
              <Typography variant="h6">{property.agent.name}</Typography>
              <Typography variant="body2" paragraph>{property.agent.phone}</Typography>
              <Typography variant="body2">{property.agent.email}</Typography>
            </Box>
          </Box>
        </StyledPaper>
      )}
    </Box>
  );
};

export default PropertyDetails;
