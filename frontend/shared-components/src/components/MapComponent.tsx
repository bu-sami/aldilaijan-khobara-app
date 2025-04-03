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

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string | number;
  width?: string | number;
  markerTitle?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  zoom = 15,
  height = 400,
  width = '100%',
  markerTitle = 'Location',
}) => {
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;
  
  return (
    <Box
      component="iframe"
      src={mapUrl}
      width={width}
      height={height}
      frameBorder="0"
      style={{ border: 0, borderRadius: 8 }}
      allowFullScreen
      aria-hidden="false"
      tabIndex={0}
      title={markerTitle}
    />
  );
};

export default MapComponent;
