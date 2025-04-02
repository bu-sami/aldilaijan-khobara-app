import React from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';
import { PrimaryButton } from './buttons';
import { StyledTextField } from './inputs';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
}));

interface ValuationRequestFormProps {
  onSubmit: (data: any) => void;
  propertyTypes: { id: number; name: string }[];
  locations: { id: number; name: string }[];
  loading?: boolean;
}

export const ValuationRequestForm: React.FC<ValuationRequestFormProps> = ({
  onSubmit,
  propertyTypes,
  locations,
  loading = false,
}) => {
  const { language } = React.useContext(ThemeContext);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyTypeId: '',
    locationId: '',
    area: '',
    purpose: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        {language === 'ar' ? 'طلب تقييم عقاري' : 'Property Valuation Request'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'الاسم الأول' : 'First Name'}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'اسم العائلة' : 'Last Name'}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{language === 'ar' ? 'نوع العقار' : 'Property Type'}</InputLabel>
              <Select
                name="propertyTypeId"
                value={formData.propertyTypeId}
                label={language === 'ar' ? 'نوع العقار' : 'Property Type'}
                onChange={handleChange}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{language === 'ar' ? 'الموقع' : 'Location'}</InputLabel>
              <Select
                name="locationId"
                value={formData.locationId}
                label={language === 'ar' ? 'الموقع' : 'Location'}
                onChange={handleChange}
              >
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'المساحة (متر مربع)' : 'Area (sqm)'}
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label={language === 'ar' ? 'الغرض من التقييم' : 'Purpose of Valuation'}
              name="purpose"
              multiline
              rows={4}
              value={formData.purpose}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <PrimaryButton
              type="submit"
              fullWidth
              disabled={loading}
            >
              {language === 'ar' ? 'تقديم الطلب' : 'Submit Request'}
            </PrimaryButton>
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  );
};

interface PropertySearchFormProps {
  onSubmit: (data: any) => void;
  propertyTypes: { id: number; name: string }[];
  locations: { id: number; name: string }[];
  loading?: boolean;
}

export const PropertySearchForm: React.FC<PropertySearchFormProps> = ({
  onSubmit,
  propertyTypes,
  locations,
  loading = false,
}) => {
  const { language } = React.useContext(ThemeContext);
  const [formData, setFormData] = React.useState({
    propertyTypeId: '',
    locationId: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <StyledPaper>
      <Typography variant="h5" gutterBottom>
        {language === 'ar' ? 'بحث عن عقار' : 'Property Search'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{language === 'ar' ? 'نوع العقار' : 'Property Type'}</InputLabel>
              <Select
                name="propertyTypeId"
                value={formData.propertyTypeId}
                label={language === 'ar' ? 'نوع العقار' : 'Property Type'}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>{language === 'ar' ? 'الكل' : 'All'}</em>
                </MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{language === 'ar' ? 'الموقع' : 'Location'}</InputLabel>
              <Select
                name="locationId"
                value={formData.locationId}
                label={language === 'ar' ? 'الموقع' : 'Location'}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>{language === 'ar' ? 'الكل' : 'All'}</em>
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label={language === 'ar' ? 'السعر الأدنى' : 'Min Price'}
              name="minPrice"
              type="number"
              value={formData.minPrice}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label={language === 'ar' ? 'السعر الأقصى' : 'Max Price'}
              name="maxPrice"
              type="number"
              value={formData.maxPrice}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label={language === 'ar' ? 'المساحة الأدنى' : 'Min Area'}
              name="minArea"
              type="number"
              value={formData.minArea}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label={language === 'ar' ? 'المساحة الأقصى' : 'Max Area'}
              name="maxArea"
              type="number"
              value={formData.maxArea}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{language === 'ar' ? 'عدد الغرف' : 'Bedrooms'}</InputLabel>
              <Select
                name="bedrooms"
                value={formData.bedrooms}
                label={language === 'ar' ? 'عدد الغرف' : 'Bedrooms'}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>{language === 'ar' ? 'الكل' : 'All'}</em>
                </MenuItem>
                {[1, 2, 3, 4, 5, '5+'].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <PrimaryButton
              type="submit"
              fullWidth
              disabled={loading}
            >
              {language === 'ar' ? 'بحث' : 'Search'}
            </PrimaryButton>
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  );
};

export default { ValuationRequestForm, PropertySearchForm };
