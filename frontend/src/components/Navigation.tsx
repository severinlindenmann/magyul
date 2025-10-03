import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  MenuBook as VocabularyIcon,
  RecordVoiceOver as VerbIcon,
  TrendingUp as ProgressIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const navigationItems = [
  { label: 'Home', value: '/', icon: <HomeIcon /> },
  { label: 'Vocabulary', value: '/vocabulary', icon: <VocabularyIcon /> },
  { label: 'Verbs', value: '/verbs', icon: <VerbIcon /> },
  { label: 'Progress', value: '/progress', icon: <ProgressIcon /> },
  { label: 'Settings', value: '/settings', icon: <SettingsIcon /> },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <Paper elevation={8}>
        <BottomNavigation
          value={location.pathname}
          onChange={handleChange}
          showLabels
          sx={{
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0 8px',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              marginTop: '4px',
            },
          }}
        >
          {navigationItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Navigation;