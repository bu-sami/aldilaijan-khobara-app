import React from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  height?: number | string;
  children: React.ReactNode;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  height: '100%',
}));

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  height = 300,
  children,
}) => {
  return (
    <StyledPaper>
      <Box mb={2}>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ height }}>
        {children}
      </Box>
    </StyledPaper>
  );
};

export default ChartContainer;
