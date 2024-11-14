import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

// Define valid alert variants based on Bootstrap options
type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface AutoDismissAlertProps {
  message: string;
  variant?: AlertVariant;
  duration?: number; 
  onClose?: () => void;
}

const AutoDismissAlert: React.FC<AutoDismissAlertProps> = ({
  message,
  variant = 'danger',
  duration = 5000,
  onClose,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration, onClose]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  return (
    <Alert
      show={show}
      variant={variant}
      onClose={handleClose}
      dismissible
      transition={true} 
    >
      {message}
    </Alert>
  );
};

export default AutoDismissAlert;
