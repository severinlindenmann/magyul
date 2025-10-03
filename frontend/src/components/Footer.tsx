import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Props {
  variant?: 'light' | 'dark';
}

const Footer: React.FC<Props> = ({ variant = 'dark' }) => {
  const isDark = variant === 'dark';
  
  return (
    <Box
      sx={{
        py: 2,
        px: 2,
        textAlign: 'center',
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        mt: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
          Made with
        </Typography>
        <FavoriteIcon sx={{ fontSize: '1rem', color: '#ff6b6b' }} />
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
          by{' '}
          <Link
            href="https://severin.io"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#ffd93d',
              textDecoration: 'none',
              fontWeight: 700,
              borderBottom: '2px solid #ffd93d',
              paddingBottom: '1px',
              '&:hover': {
                color: '#ffed4e',
                borderBottomColor: '#ffed4e',
              },
            }}
          >
            Severin Lindenmann
          </Link>
        </Typography>
        <IconButton
          href="https://github.com/severinlindenmann/magyul"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
            ml: 1,
            '&:hover': {
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <GitHubIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
        Free & Open Source • Thanks to AI
      </Typography>
    </Box>
  );
};

export default Footer;
