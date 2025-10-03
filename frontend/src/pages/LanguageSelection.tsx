import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import Footer from '../components/Footer';


interface Props {
  onSelectLanguage: (lang: 'en' | 'de') => void;
}

const LanguageSelection: React.FC<Props> = ({ onSelectLanguage }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={10}
          sx={{
            width: '100%',
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
            {/* Logo/Icon */}
            <Box
              sx={{
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              }}
            >
              <TranslateIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'white' }} />
            </Box>

            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '3rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              Magyul
            </Typography>

            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Learn Hungarian Vocabulary & Conjugation
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{
                fontStyle: 'italic',
                mb: { xs: 2, sm: 3 },
                px: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Válassz nyelvet / Wähle deine Sprache
            </Typography>

            {/* Language Selection Buttons */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => onSelectLanguage('en')}
                startIcon={<LanguageIcon />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6639a3 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                English
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => onSelectLanguage('de')}
                startIcon={<LanguageIcon />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6639a3 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Deutsch
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Footer with credits */}
      <Footer variant="light" />
    </Box>
  );
};

export default LanguageSelection;
