import React, { useState } from 'react';
import {
  Container,
  Typography,
  Stack,
  Box,
  Chip
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  BarChart as ChartIcon,
  Handshake as HandshakeIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ServiceCard from './ServiceCard';
import BookingModal from './BookingModal';

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6)
}));

const SectionBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(2),
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));

const ServicesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: theme.spacing(4),
  marginTop: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(3)
  }
}));

const HighlightText = styled('span')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}));

const ServicesSection: React.FC = () => {
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    service: string;
    serviceName: string;
  }>({
    open: false,
    service: '',
    serviceName: ''
  });

  const services = [
    {
      id: 'meta-ads',
      title: 'Meta Ads Management',
      description: 'Strategic Facebook & Instagram advertising with proven ROI optimization',
      icon: <FacebookIcon />,
      metrics: [
        { number: '250%', label: 'Avg ROI Increase' },
        { number: '48hrs', label: 'Setup Time' }
      ],
      features: [
        'Advanced audience targeting',
        'A/B testing & optimization',
        'Real-time analytics'
      ]
    },
    {
      id: 'seo',
      title: 'SEO Optimization',
      description: 'Dominate search results with our comprehensive SEO strategies',
      icon: <SearchIcon />,
      metrics: [
        { number: 'Top 3', label: 'Rankings' },
        { number: '90 days', label: 'Results' }
      ],
      features: [
        'Keyword research & strategy',
        'Technical SEO optimization',
        'Content optimization'
      ]
    },
    {
      id: 'funnels',
      title: 'Sales Funnel Optimization',
      description: 'Convert more visitors with tested funnel strategies',
      icon: <TrendingIcon />,
      metrics: [
        { number: '300%', label: 'Conversion Boost' },
        { number: '14 days', label: 'Implementation' }
      ],
      features: [
        'Conversion optimization',
        'Customer journey mapping',
        'Performance tracking'
      ]
    },
    {
      id: 'consulting',
      title: 'Sales Consulting',
      description: 'Expert guidance to close more deals and increase revenue',
      icon: <ChartIcon />,
      metrics: [
        { number: '40%', label: 'Close Rate Boost' },
        { number: '1-on-1', label: 'Coaching' }
      ],
      features: [
        'Sales process optimization',
        'Lead qualification training',
        'Negotiation strategies'
      ]
    },
    {
      id: 'consulting-plus',
      title: 'Sales Consulting & Deal Closing',
      description: 'Expert consulting to optimize your sales process and close more deals',
      icon: <HandshakeIcon />,
      metrics: [
        { number: '40%', label: 'Close Rate Boost' },
        { number: '1-on-1', label: 'Coaching' }
      ],
      features: [
        'Sales process optimization',
        'Objection handling & negotiation',
        'Closing frameworks and scripts'
      ],
      featured: true
    }
  ];

  const serviceNames = {
    'meta-ads': 'Meta Ads Management',
    'seo': 'SEO Optimization',
    'funnels': 'Sales Funnel Optimization',
    'consulting': 'Sales Consulting',
    'consulting-plus': 'Sales Consulting & Deal Closing'
  };

  const handleBookNow = (serviceId: string) => {
    setBookingModal({
      open: true,
      service: serviceId,
      serviceName: serviceNames[serviceId as keyof typeof serviceNames] || serviceId
    });
  };

  const handleCloseModal = () => {
    setBookingModal({
      open: false,
      service: '',
      serviceName: ''
    });
  };

  return (
    <SectionContainer id="services">
      <Container maxWidth="lg">
        <SectionHeader>
          <SectionBadge
            icon={<StarIcon />}
            label="Our Services"
          />
          <Typography variant="h2" component="h2" gutterBottom fontWeight={700}>
            Transform Your Business with{' '}
            <HighlightText>Proven Digital Solutions</HighlightText>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            We deliver measurable results through data-driven strategies that convert visitors into customers and grow your revenue
          </Typography>
        </SectionHeader>

        <ServicesGrid>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              metrics={service.metrics}
              features={service.features}
              serviceId={service.id}
              featured={service.featured}
              onBookNow={handleBookNow}
            />
          ))}
        </ServicesGrid>
      </Container>

      <BookingModal
        open={bookingModal.open}
        onClose={handleCloseModal}
        service={bookingModal.service}
        serviceName={bookingModal.serviceName}
      />
    </SectionContainer>
  );
};

export default ServicesSection;