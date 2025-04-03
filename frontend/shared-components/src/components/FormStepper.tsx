import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';
import { PrimaryButton, OutlinedPrimaryButton } from './buttons';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
}));

interface FormStepperProps {
  steps: string[];
  activeStep: number;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
  isNextDisabled?: boolean;
}

const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  activeStep,
  children,
  onNext,
  onBack,
  onFinish,
  isNextDisabled = false,
}) => {
  const { language } = React.useContext(ThemeContext);
  
  return (
    <StyledPaper>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mb: 4 }}>
        {children}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={onBack}
          variant="text"
        >
          {language === 'ar' ? 'السابق' : 'Back'}
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <PrimaryButton onClick={onFinish} disabled={isNextDisabled}>
            {language === 'ar' ? 'إنهاء' : 'Finish'}
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={onNext} disabled={isNextDisabled}>
            {language === 'ar' ? 'التالي' : 'Next'}
          </PrimaryButton>
        )}
      </Box>
    </StyledPaper>
  );
};

export default FormStepper;
