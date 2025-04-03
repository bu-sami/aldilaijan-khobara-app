import React from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

interface ValuationReportProps {
  report: {
    title: string;
    propertyAddress: string;
    clientName: string;
    valuationDate: string;
    valuationAmount: string;
    valuationApproach: string;
    propertyType: string;
    propertyArea: string;
    summary: string;
    appraiser?: {
      name: string;
      license: string;
      signature?: string;
    };
  };
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
}));

const ValuationReport: React.FC<ValuationReportProps> = ({ report }) => {
  const { language } = React.useContext(ThemeContext);
  
  return (
    <Box>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>{report.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {language === 'ar' ? 'تاريخ التقييم:' : 'Valuation Date:'} {report.valuationDate}
        </Typography>
        
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {language === 'ar' ? 'العميل' : 'Client'}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {report.clientName}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {language === 'ar' ? 'عنوان العقار' : 'Property Address'}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {report.propertyAddress}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
      
      <StyledPaper>
        <Typography variant="h5" gutterBottom>
          {language === 'ar' ? 'ملخص التقييم' : 'Valuation Summary'}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {language === 'ar' ? 'قيمة العقار' : 'Property Value'}
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {report.valuationAmount}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {language === 'ar' ? 'منهجية التقييم' : 'Valuation Approach'}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {report.valuationApproach}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {language === 'ar' ? 'نوع العقار' : 'Property Type'}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {report.propertyType}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {language === 'ar' ? 'مساحة العقار' : 'Property Area'}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {report.propertyArea}
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
      
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          {language === 'ar' ? 'ملخص' : 'Summary'}
        </Typography>
        <Typography variant="body1" paragraph>
          {report.summary}
        </Typography>
      </StyledPaper>
      
      {report.appraiser && (
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {language === 'ar' ? 'المقيم العقاري' : 'Appraiser'}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body1" fontWeight="medium">{report.appraiser.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {language === 'ar' ? 'رقم الترخيص:' : 'License No:'} {report.appraiser.license}
              </Typography>
            </Box>
            
            {report.appraiser.signature && (
              <Box
                component="img"
                src={report.appraiser.signature}
                alt="Signature"
                sx={{
                  maxWidth: 150,
                  maxHeight: 80,
                }}
              />
            )}
          </Box>
        </StyledPaper>
      )}
    </Box>
  );
};

export default ValuationReport;
