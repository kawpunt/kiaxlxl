import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(1),
    maxWidth: '500px',
    width: '100%'
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(1),
  '& .MuiTypography-root': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 600,
    fontSize: '1.25rem'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem'
}));

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  service: string;
  serviceName: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  service,
  serviceName
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof BookingFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Check authentication first
      const authCheck = await fetch('http://localhost:4000/api/check', {
        method: 'GET',
        credentials: 'include'
      });
      const authData = await authCheck.json();
      
      if (!authCheck.ok || !authData.loggedIn) {
        setError('Please login first to book a consultation');
        setLoading(false);
        return;
      }

      // Submit booking
      const response = await fetch('http://localhost:4000/api/contacts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message || null,
          service: service
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ name: '', email: '', phone: '', message: '' });
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography>
          <CalendarIcon />
          Book a Consultation
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ borderRadius: '12px' }}>
              Thank you for booking! Our team will contact you shortly.
            </Alert>
          )}

          <StyledTextField
            label="Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            required
            fullWidth
            disabled={loading || success}
            placeholder="Your full name"
          />

          <StyledTextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            fullWidth
            disabled={loading || success}
            placeholder="your.email@example.com"
          />

          <StyledTextField
            label="Phone (optional)"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            fullWidth
            disabled={loading || success}
            placeholder="Your phone number"
          />

          <StyledTextField
            label="Message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleInputChange('message')}
            fullWidth
            disabled={loading || success}
            placeholder="Tell us about your project and goals..."
          />

          <StyledTextField
            label="Service"
            value={serviceName}
            disabled
            fullWidth
            sx={{ 
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                opacity: 1
              }
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{ 
              borderRadius: '12px',
              flex: 1,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <StyledButton
            onClick={handleSubmit}
            disabled={loading || success}
            variant="contained"
            sx={{ flex: 2 }}
            startIcon={loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )}
          >
            {loading ? 'Submitting...' : success ? 'Submitted!' : 'Book Now'}
          </StyledButton>
        </Stack>
      </DialogActions>
    </StyledDialog>
  );
};

export default BookingModal;