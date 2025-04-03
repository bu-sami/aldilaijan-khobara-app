import React from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PrimaryButton, OutlinedPrimaryButton } from './buttons';
import { ThemeContext } from '../themes/theme';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.background.default,
}));

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
  fullWidth?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  actions,
  fullWidth = true,
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="modal-title"
    >
      <StyledDialogTitle id="modal-title">
        <Typography variant="h6">{title}</Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions>
          {actions}
        </DialogActions>
      )}
    </StyledDialog>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  loading = false,
}) => {
  const { language } = React.useContext(ThemeContext);
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      actions={
        <>
          <OutlinedPrimaryButton onClick={onClose} disabled={loading}>
            {cancelText || (language === 'ar' ? 'إلغاء' : 'Cancel')}
          </OutlinedPrimaryButton>
          <PrimaryButton onClick={onConfirm} disabled={loading}>
            {confirmText || (language === 'ar' ? 'تأكيد' : 'Confirm')}
          </PrimaryButton>
        </>
      }
    >
      <Typography variant="body1">{message}</Typography>
    </Modal>
  );
};

export default Modal;
