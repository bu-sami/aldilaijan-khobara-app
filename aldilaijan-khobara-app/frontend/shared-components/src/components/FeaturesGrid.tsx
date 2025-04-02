import React from 'react';
import { Box, Typography, Grid, Paper, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <StyledPaper>
      <StyledAvatar>{icon}</StyledAvatar>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="textSecondary">{description}</Typography>
    </StyledPaper>
  );
};

interface FeaturesGridProps {
  features: FeatureCardProps[];
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ features }) => {
  return (
    <Grid container spacing={3}>
      {features.map((feature, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <FeatureCard
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturesGrid;
