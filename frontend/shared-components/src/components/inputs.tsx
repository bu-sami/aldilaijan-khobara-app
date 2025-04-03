import React from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Styled text field with custom border color and focus styles
const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

// Password field with show/hide toggle
const PasswordField: React.FC<TextFieldProps> = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledTextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export { StyledTextField, PasswordField };
