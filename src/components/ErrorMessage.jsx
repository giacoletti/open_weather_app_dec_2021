import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const ErrorMessage = ({ message }) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
};

export default ErrorMessage;
