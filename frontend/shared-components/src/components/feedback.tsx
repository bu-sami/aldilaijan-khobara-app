import React from 'react';
import { Box, Typography, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ type, title, message }) => {
  return (
    <StyledAlert severity={type}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </StyledAlert>
  );
};

interface LoadingIndicatorProps {
  size?: number;
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 40, 
  message = 'Loading...' 
}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
      <CircularProgress size={size} sx={{ mb: 2 }} />
      <Typography variant="body1" color="textSecondary">{message}</Typography>
    </Box>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  action 
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={4}
      textAlign="center"
    >
      {icon && <Box mb={2}>{icon}</Box>}
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="textSecondary" paragraph>{message}</Typography>
      {action && <Box mt={2}>{action}</Box>}
    </Box>
  );
};
