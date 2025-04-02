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

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = 'image/*,.pdf,.doc,.docx',
  maxFileSizeMB = 5,
  label,
  helperText,
  error = false,
  errorMessage,
}) => {
  const { language } = React.useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const defaultLabel = language === 'ar' ? 'اختر ملفًا' : 'Choose a file';
  const defaultHelperText = language === 'ar' 
    ? `الملفات المقبولة: ${acceptedFileTypes} (الحد الأقصى: ${maxFileSizeMB} ميجابايت)`
    : `Accepted file types: ${acceptedFileTypes} (Max: ${maxFileSizeMB}MB)`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      setFileError(null);
      return;
    }

    const file = files[0];
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB > maxFileSizeMB) {
      setFileError(
        language === 'ar'
          ? `حجم الملف كبير جدًا. الحد الأقصى هو ${maxFileSizeMB} ميجابايت.`
          : `File size too large. Maximum is ${maxFileSizeMB}MB.`
      );
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFileError(null);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box>
      <input
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      
      <Box mb={1}>
        <Typography variant="body2" color={error || fileError ? 'error' : 'textSecondary'}>
          {label || defaultLabel}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center">
        <Button
          variant="outlined"
          onClick={handleButtonClick}
          sx={{ mr: 2 }}
        >
          {language === 'ar' ? 'استعراض...' : 'Browse...'}
        </Button>
        <Typography variant="body2" color={selectedFile ? 'textPrimary' : 'textSecondary'}>
          {selectedFile ? selectedFile.name : (language === 'ar' ? 'لم يتم اختيار ملف' : 'No file selected')}
        </Typography>
      </Box>
      
      <Box mt={1}>
        <Typography variant="caption" color={error || fileError ? 'error' : 'textSecondary'}>
          {fileError || (error ? errorMessage : helperText || defaultHelperText)}
        </Typography>
      </Box>
    </Box>
  );
};

export default FileUpload;
