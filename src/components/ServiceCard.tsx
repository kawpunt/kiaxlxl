import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  border: '1px solid',
  borderColor: theme.palette.divider,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main
  },
  '&.featured': {
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    position: 'relative',
    '&::before': {
      content: '"Most Popular"',
      position: 'absolute',
      top: -12,
      left: 24,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: '4px 16px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 600
    }
  }
}));

const ServiceIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '16px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.contrastText,
  fontSize: '2rem',
  marginBottom: theme.spacing(2)
}));

const MetricsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  margin: theme.spacing(2, 0)
}));

const MetricBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  backgroundColor: theme.palette.grey[50],
  border: '1px solid',
  borderColor: theme.palette.grey[200]
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  marginTop: 'auto'
}));

const FeatureList = styled(List)(({ theme }) => ({
  padding: 0,
  '& .MuiListItem-root': {
    padding: theme.spacing(0.5, 0),
    '& .MuiListItemIcon-root': {
      minWidth: 32,
      color: theme.palette.success.main
    }
  }
}));

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  metrics: Array<{
    number: string;
    label: string;
  }>;
  features: string[];
  serviceId: string;
  featured?: boolean;
  onBookNow: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  metrics,
  features,
  serviceId,
  featured = false,
  onBookNow
}) => {
  return (
    <StyledCard className={featured ? 'featured' : ''}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <ServiceIcon>
            {icon}
          </ServiceIcon>

          <Typography variant="h5" component="h3" fontWeight={600}>
            {title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
            {description}
          </Typography>

          <MetricsContainer>
            {metrics.map((metric, index) => (
              <MetricBox key={index}>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {metric.number}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metric.label}
                </Typography>
              </MetricBox>
            ))}
          </MetricsContainer>

          <FeatureList>
            {features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={feature}
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
          </FeatureList>

          <StyledButton
            variant={featured ? 'contained' : 'outlined'}
            onClick={() => onBookNow(serviceId)}
            endIcon={<ArrowIcon />}
            size="large"
          >
            {featured ? 'Get Started' : 'Book Now'}
          </StyledButton>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default ServiceCard;