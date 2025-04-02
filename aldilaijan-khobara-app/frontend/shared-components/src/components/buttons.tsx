import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Primary button with gold/bronze color
const PrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  fontWeight: 500,
  padding: '10px 24px',
  borderRadius: theme.shape.borderRadius,
}));

// Secondary button with dark gray/slate color
const SecondaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  fontWeight: 500,
  padding: '10px 24px',
  borderRadius: theme.shape.borderRadius,
}));

// Outlined primary button
const OutlinedPrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    backgroundColor: 'rgba(198, 160, 82, 0.04)',
  },
  fontWeight: 500,
  padding: '10px 24px',
  borderRadius: theme.shape.borderRadius,
}));

// Text button with primary color
const TextPrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'rgba(198, 160, 82, 0.04)',
  },
  fontWeight: 500,
  padding: '8px 16px',
}));

export { PrimaryButton, SecondaryButton, OutlinedPrimaryButton, TextPrimaryButton };
