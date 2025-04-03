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

interface ContactFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const { language } = React.useContext(ThemeContext);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
        {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'الاسم' : 'Name'}
              name="name"
              value={formData.name}
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
              fullWidth
              label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'الموضوع' : 'Subject'}
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              required
              fullWidth
              label={language === 'ar' ? 'الرسالة' : 'Message'}
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <PrimaryButton
              type="submit"
              fullWidth
              disabled={loading}
            >
              {language === 'ar' ? 'إرسال' : 'Send'}
            </PrimaryButton>
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  );
};

export default ContactForm;
