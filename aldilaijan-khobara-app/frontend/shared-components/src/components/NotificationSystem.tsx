import React from 'react';
import { Alert, Snackbar, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification, Notification } from '../contexts/notification-context';

const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const handleClose = (id: string) => {
    removeNotification(id);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {notifications.map((notification: Notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={notification.type}
            variant="filled"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => handleClose(notification.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default NotificationSystem;
