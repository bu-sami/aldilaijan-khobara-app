import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button, Chip, TextField, MenuItem, Tabs, Tab } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import ClientLayout from '../components/layouts/ClientLayout';
import { Section } from '../components/layout-elements';
import { ValuationCard } from '../components/cards';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { FormStepper } from '../components/FormStepper';

const ValuationRequestPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    // Client Information
    clientType: 'individual',
    name: '',
    email: '',
    phone: '',
    companyName: '',
    
    // Property Information
    propertyType: '',
    propertyLocation: '',
    propertyArea: '',
    propertyDescription: '',
    
    // Valuation Information
    valuationPurpose: '',
    valuationUrgency: 'normal',
    additionalNotes: '',
    
    // Documents
    documents: [],
  });

  const steps = [
    {
      label: language === 'ar' ? 'معلومات العميل' : 'Client Information',
      description: language === 'ar' ? 'أدخل معلومات العميل الأساسية' : 'Enter basic client information',
    },
    {
      label: language === 'ar' ? 'معلومات العقار' : 'Property Information',
      description: language === 'ar' ? 'أدخل تفاصيل العقار المراد تقييمه' : 'Enter details of the property to be valued',
    },
    {
      label: language === 'ar' ? 'معلومات التقييم' : 'Valuation Information',
      description: language === 'ar' ? 'حدد الغرض من التقييم ومتطلبات أخرى' : 'Specify the purpose of valuation and other requirements',
    },
    {
      label: language === 'ar' ? 'المستندات' : 'Documents',
      description: language === 'ar' ? 'قم بتحميل المستندات المطلوبة' : 'Upload required documents',
    },
    {
      label: language === 'ar' ? 'المراجعة والتأكيد' : 'Review & Confirm',
      description: language === 'ar' ? 'راجع المعلومات وأكد طلب التقييم' : 'Review information and confirm valuation request',
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      console.log('Form submitted:', formData);
      
      // Move to success step
      setActiveStep(steps.length);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit valuation request');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ClientLayout 
      title={language === 'ar' ? 'طلب تقييم عقاري' : 'Request Property Valuation'}
      businessType="khobara"
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {language === 'ar' ? 'طلب تقييم عقاري' : 'Request Property Valuation'}
        </Typography>
        
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          {language === 'ar' 
            ? 'املأ النموذج التالي لطلب تقييم عقاري احترافي من خبراء للتقييم العقاري'
            : 'Fill out the form below to request a professional property valuation from Khobara Valuation'
          }
        </Typography>
        
        {error && (
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={error} 
          />
        )}
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <FormStepper
            steps={steps}
            activeStep={activeStep}
            language={language}
          />
          
          {/* Step 1: Client Information */}
          {activeStep === 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'معلومات العميل' : 'Client Information'}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'نوع العميل' : 'Client Type'}
                </Typography>
                <Tabs
                  value={formData.clientType}
                  onChange={(e, newValue) => handleFormChange('clientType', newValue)}
                  sx={{ mb: 2 }}
                >
                  <Tab 
                    value="individual" 
                    label={language === 'ar' ? 'فرد' : 'Individual'} 
                  />
                  <Tab 
                    value="corporate" 
                    label={language === 'ar' ? 'شركة' : 'Corporate'} 
                  />
                </Tabs>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    required
                  />
                </Grid>
                
                {formData.clientType === 'corporate' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                      value={formData.companyName}
                      onChange={(e) => handleFormChange('companyName', e.target.value)}
                      required
                    />
                  </Grid>
                )}
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    backgroundColor: '#4A4A4A', 
                    '&:hover': { backgroundColor: '#333333' }
                  }}
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Step 2: Property Information */}
          {activeStep === 1 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'معلومات العقار' : 'Property Information'}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label={language === 'ar' ? 'نوع العقار' : 'Property Type'}
                    value={formData.propertyType}
                    onChange={(e) => handleFormChange('propertyType', e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      {language === 'ar' ? 'اختر نوع العقار' : 'Select property type'}
                    </MenuItem>
                    <MenuItem value="residential">
                      {language === 'ar' ? 'سكني' : 'Residential'}
                    </MenuItem>
                    <MenuItem value="commercial">
                      {language === 'ar' ? 'تجاري' : 'Commercial'}
                    </MenuItem>
                    <MenuItem value="industrial">
                      {language === 'ar' ? 'صناعي' : 'Industrial'}
                    </MenuItem>
                    <MenuItem value="land">
                      {language === 'ar' ? 'أرض' : 'Land'}
                    </MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'موقع العقار' : 'Property Location'}
                    value={formData.propertyLocation}
                    onChange={(e) => handleFormChange('propertyLocation', e.target.value)}
                    required
                    placeholder={language === 'ar' ? 'المنطقة، المدينة' : 'Area, City'}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'مساحة العقار (متر مربع)' : 'Property Area (sqm)'}
                    type="number"
                    value={formData.propertyArea}
                    onChange={(e) => handleFormChange('propertyArea', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'وصف العقار' : 'Property Description'}
                    multiline
                    rows={4}
                    value={formData.propertyDescription}
                    onChange={(e) => handleFormChange('propertyDescription', e.target.value)}
                    placeholder={language === 'ar' 
                      ? 'يرجى تقديم وصف مفصل للعقار، بما في ذلك عدد الغرف، والمرافق، والحالة، إلخ.'
                      : 'Please provide a detailed description of the property, including number of rooms, amenities, condition, etc.'
                    }
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={handleBack}
                >
                  {language === 'ar' ? 'السابق' : 'Back'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    backgroundColor: '#4A4A4A', 
                    '&:hover': { backgroundColor: '#333333' }
                  }}
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Step 3: Valuation Information */}
          {activeStep === 2 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'معلومات التقييم' : 'Valuation Information'}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label={language === 'ar' ? 'الغرض من التقييم' : 'Purpose of Valuation'}
                    value={formData.valuationPurpose}
                    onChange={(e) => handleFormChange('valuationPurpose', e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      {language === 'ar' ? 'اختر الغرض من التقييم' : 'Select purpose of valuation'}
                    </MenuItem>
                    <MenuItem value="mortgage">
                      {language === 'ar' ? 'رهن عقاري' : 'Mortgage'}
                    </MenuItem>
                    <MenuItem value="sale">
                      {language === 'ar' ? 'بيع' : 'Sale'}
                    </MenuItem>
                    <MenuItem value="insurance">
                      {language === 'ar' ? 'تأمين' : 'Insurance'}
                    </MenuItem>
                    <MenuItem value="investment">
                      {language === 'ar' ? 'استثمار' : 'Investment'}
                    </MenuItem>
                    <MenuItem value="legal">
                      {language === 'ar' ? 'قانوني' : 'Legal'}
                    </MenuItem>
                    <MenuItem value="other">
                      {language === 'ar' ? 'أخرى' : 'Other'}
                    </MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {language === 'ar' ? 'مدى الإلحاح' : 'Urgency'}
                  </Typography>
                  <Tabs
                    value={formData.valuationUrgency}
                    onChange={(e, newValue) => handleFormChange('valuationUrgency', newValue)}
                    sx={{ mb: 2 }}
                  >
                    <Tab 
                      value="normal" 
                      label={language === 'ar' ? 'عادي (7-10 أيام)' : 'Normal (7-10 days)'} 
                    />
                    <Tab 
                      value="urgent" 
                      label={language === 'ar' ? 'عاجل (3-5 أيام)' : 'Urgent (3-5 days)'} 
                    />
                    <Tab 
                      value="express" 
                      label={language === 'ar' ? 'فوري (1-2 يوم)' : 'Express (1-2 days)'} 
                    />
                  </Tabs>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                    multiline
                    rows={4}
                    value={formData.additionalNotes}
                    onChange={(e) => handleFormChange('additionalNotes', e.target.value)}
                    placeholder={language === 'ar' 
                      ? 'أي معلومات إضافية ترغب في تقديمها للمقيم'
                      : 'Any additional information you would like to provide to the appraiser'
                    }
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={handleBack}
                >
                  {language === 'ar' ? 'السابق' : 'Back'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    backgroundColor: '#4A4A4A', 
                    '&:hover': { backgroundColor: '#333333' }
                  }}
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Step 4: Documents */}
          {activeStep === 3 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'المستندات' : 'Documents'}
              </Typography>
              
              <Typography variant="body2" paragraph>
                {language === 'ar' 
                  ? 'يرجى تحميل المستندات التالية (إن وجدت):'
                  : 'Please upload the following documents (if available):'
                }
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'سند الملكية' : 'Title Deed'}
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ py: 2, border: '1px dashed grey' }}
                >
                  {language === 'ar' ? 'اختر ملف أو اسحب وأفلت هنا' : 'Choose file or drag and drop here'}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      // Handle file upload
                      console.log('File selected:', e.target.files);
                    }}
                  />
                </Button>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'مخطط العقار' : 'Property Plan'}
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ py: 2, border: '1px dashed grey' }}
                >
                  {language === 'ar' ? 'اختر ملف أو اسحب وأفلت هنا' : 'Choose file or drag and drop here'}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      // Handle file upload
                      console.log('File selected:', e.target.files);
                    }}
                  />
                </Button>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'صور العقار' : 'Property Photos'}
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ py: 2, border: '1px dashed grey' }}
                >
                  {language === 'ar' ? 'اختر ملفات أو اسحب وأفلت هنا' : 'Choose files or drag and drop here'}
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => {
                      // Handle file upload
                      console.log('Files selected:', e.target.files);
                    }}
                  />
                </Button>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {language === 'ar' ? 'مستندات أخرى' : 'Other Documents'}
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ py: 2, border: '1px dashed grey' }}
                >
                  {language === 'ar' ? 'اختر ملفات أو اسحب وأفلت هنا' : 'Choose files or drag and drop here'}
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => {
                      // Handle file upload
                      console.log('Files selected:', e.target.files);
                    }}
                  />
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={handleBack}
                >
                  {language === 'ar' ? 'السابق' : 'Back'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    backgroundColor: '#4A4A4A', 
                    '&:hover': { backgroundColor: '#333333' }
                  }}
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Step 5: Review & Confirm */}
          {activeStep === 4 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'مراجعة وتأكيد' : 'Review & Confirm'}
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {language === 'ar' ? 'معلومات العميل' : 'Client Information'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'نوع العميل' : 'Client Type'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.clientType === 'individual' 
                        ? (language === 'ar' ? 'فرد' : 'Individual')
                        : (language === 'ar' ? 'شركة' : 'Corporate')
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'الاسم' : 'Name'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.name || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.email || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.phone || '-'}
                    </Typography>
                  </Grid>
                  {formData.clientType === 'corporate' && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        {language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                      </Typography>
                      <Typography variant="body1">
                        {formData.companyName || '-'}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {language === 'ar' ? 'معلومات العقار' : 'Property Information'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'نوع العقار' : 'Property Type'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.propertyType 
                        ? (language === 'ar' 
                            ? (formData.propertyType === 'residential' ? 'سكني' 
                               : formData.propertyType === 'commercial' ? 'تجاري'
                               : formData.propertyType === 'industrial' ? 'صناعي'
                               : 'أرض')
                            : formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1))
                        : '-'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'موقع العقار' : 'Property Location'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.propertyLocation || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'مساحة العقار' : 'Property Area'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.propertyArea ? `${formData.propertyArea} m²` : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'وصف العقار' : 'Property Description'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.propertyDescription || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {language === 'ar' ? 'معلومات التقييم' : 'Valuation Information'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'الغرض من التقييم' : 'Purpose of Valuation'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.valuationPurpose 
                        ? (language === 'ar' 
                            ? (formData.valuationPurpose === 'mortgage' ? 'رهن عقاري' 
                               : formData.valuationPurpose === 'sale' ? 'بيع'
                               : formData.valuationPurpose === 'insurance' ? 'تأمين'
                               : formData.valuationPurpose === 'investment' ? 'استثمار'
                               : formData.valuationPurpose === 'legal' ? 'قانوني'
                               : 'أخرى')
                            : formData.valuationPurpose.charAt(0).toUpperCase() + formData.valuationPurpose.slice(1))
                        : '-'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'مدى الإلحاح' : 'Urgency'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.valuationUrgency === 'normal' 
                        ? (language === 'ar' ? 'عادي (7-10 أيام)' : 'Normal (7-10 days)')
                        : formData.valuationUrgency === 'urgent'
                          ? (language === 'ar' ? 'عاجل (3-5 أيام)' : 'Urgent (3-5 days)')
                          : (language === 'ar' ? 'فوري (1-2 يوم)' : 'Express (1-2 days)')
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                    </Typography>
                    <Typography variant="body1">
                      {formData.additionalNotes || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={handleBack}
                >
                  {language === 'ar' ? 'السابق' : 'Back'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ 
                    backgroundColor: '#4A4A4A', 
                    '&:hover': { backgroundColor: '#333333' }
                  }}
                >
                  {loading 
                    ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                    : (language === 'ar' ? 'تأكيد وإرسال' : 'Confirm & Submit')
                  }
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Success Step */}
          {activeStep === steps.length && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                backgroundColor: 'success.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3
              }}>
                <Typography variant="h4">✓</Typography>
              </Box>
              
              <Typography variant="h5" gutterBottom>
                {language === 'ar' ? 'تم إرسال طلب التقييم بنجاح!' : 'Valuation Request Submitted Successfully!'}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? 'شكراً لك على طلب خدمة التقييم العقاري من خبراء. سيقوم فريقنا بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.'
                  : 'Thank you for requesting a property valuation service from Khobara. Our team will review your request and contact you as soon as possible.'
                }
              </Typography>
              
              <Typography variant="body1" paragraph>
                {language === 'ar' 
                  ? `رقم الطلب: KV-${Math.floor(100000 + Math.random() * 900000)}`
                  : `Request Number: KV-${Math.floor(100000 + Math.random() * 900000)}`
                }
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  href="/client-portal/dashboard"
                  sx={{ 
                    backgroundColor: '#4A4A4A', 
                    '&:hover': { backgroundColor: '#333333' },
                    mr: 2
                  }}
                >
                  {language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                </Button>
                
                <Button
                  variant="outlined"
                  href="/client-portal/khobara"
                >
                  {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </ClientLayout>
  );
};

export default ValuationRequestPage;
