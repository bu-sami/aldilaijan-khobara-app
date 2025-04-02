import React from 'react';
import { Card, CardContent, CardHeader, CardProps, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Base styled card with shadow and border radius
const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
}));

interface DashboardCardProps extends CardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

// Dashboard card with title, subtitle, and icon
const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  ...props 
}) => {
  return (
    <StyledCard {...props}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            {icon && <Box mr={1}>{icon}</Box>}
            <Typography variant="h6">{title}</Typography>
          </Box>
        }
        subheader={subtitle && <Typography variant="body2" color="textSecondary">{subtitle}</Typography>}
      />
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
};

interface PropertyCardProps extends CardProps {
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  imageUrl: string;
  onClick?: () => void;
}

// Property card for real estate listings
const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  location,
  price,
  area,
  bedrooms,
  bathrooms,
  imageUrl,
  onClick,
  ...props
}) => {
  return (
    <StyledCard {...props} onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img 
          src={imageUrl} 
          alt={title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        />
      </Box>
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>{title}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>{location}</Typography>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="subtitle1" fontWeight="bold">{price}</Typography>
          <Typography variant="body2">{area}</Typography>
        </Box>
        {(bedrooms || bathrooms) && (
          <Box display="flex" mt={1}>
            {bedrooms && (
              <Box display="flex" alignItems="center" mr={2}>
                <Typography variant="body2">{bedrooms} غرف</Typography>
              </Box>
            )}
            {bathrooms && (
              <Box display="flex" alignItems="center">
                <Typography variant="body2">{bathrooms} حمامات</Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

interface ValuationCardProps extends CardProps {
  requestNumber: string;
  clientName: string;
  propertyType: string;
  location: string;
  status: string;
  statusColor: string;
  date: string;
  onClick?: () => void;
}

// Valuation card for Khobara valuation requests
const ValuationCard: React.FC<ValuationCardProps> = ({
  requestNumber,
  clientName,
  propertyType,
  location,
  status,
  statusColor,
  date,
  onClick,
  ...props
}) => {
  return (
    <StyledCard {...props} onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">{requestNumber}</Typography>
          <Box 
            sx={{ 
              backgroundColor: statusColor,
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            {status}
          </Box>
        </Box>
        <Typography variant="body1" fontWeight="medium" gutterBottom>{clientName}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>{propertyType}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>{location}</Typography>
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Typography variant="caption" color="textSecondary">{date}</Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export { StyledCard, DashboardCard, PropertyCard, ValuationCard };
