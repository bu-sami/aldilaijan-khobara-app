import React from 'react';
import { Box, Grid, Typography, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <StyledDivider />
      <Box mt={2}>
        {children}
      </Box>
    </Box>
  );
};

interface DashboardStatsProps {
  stats: {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
  }[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StyledPaper sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            borderTop: stat.color ? `4px solid ${stat.color}` : undefined
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                <Typography variant="body2" color="textSecondary">{stat.title}</Typography>
              </Box>
              {stat.icon && (
                <Box sx={{ 
                  color: stat.color || 'primary.main',
                  opacity: 0.8
                }}>
                  {stat.icon}
                </Box>
              )}
            </Box>
          </StyledPaper>
        </Grid>
      ))}
    </Grid>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>{title}</Typography>
        {subtitle && (
          <Typography variant="body1" color="textSecondary">{subtitle}</Typography>
        )}
      </Box>
      {action && (
        <Box>
          {action}
        </Box>
      )}
    </Box>
  );
};
