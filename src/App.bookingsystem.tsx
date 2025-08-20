import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import theme from './theme/theme';
import ServicesSection from './components/ServicesSection';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          {/* Header */}
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h3" component="h1" gutterBottom>
                JYS Media - Digital Marketing Services
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Book your consultation with our expert team
              </Typography>
            </Box>
          </Container>

          {/* Services Section with Booking */}
          <ServicesSection />

          {/* Footer */}
          <Box sx={{ py: 4, textAlign: 'center', borderTop: 1, borderColor: 'divider', mt: 8 }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary">
                © 2024 JYS Media. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;