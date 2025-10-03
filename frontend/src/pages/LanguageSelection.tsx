import React from 'react';
import { Container, Box, Typography, Button, Paper, Link } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';

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

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={10}
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {/* Logo/Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              }}
            >
              <TranslateIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>

            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              Magyul
            </Typography>

            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Learn Hungarian Vocabulary & Conjugation
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{
                fontStyle: 'italic',
                mb: 3,
                px: 2,
              }}
            >
              Válassz nyelvet / Wähle deine Sprache
            </Typography>

            {/* Language Selection Buttons */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 1 }}>
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
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          py: 3,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
          Made by{' '}
          <Link
            href="https://severin.io"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              textDecoration: 'underline',
              fontWeight: 700,
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            Severin Lindenmann
          </Link>
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Free to use
        </Typography>
      </Box>
    </Box>
  );
};

export default LanguageSelection;
