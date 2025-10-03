import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import SchoolIcon from '@mui/icons-material/School';
import LanguageSelection from './pages/LanguageSelection';
import VocabularyPractice from './pages/VocabularyPractice';
import VerbConjugation from './pages/VerbConjugation';
import GrammarGuide from './pages/GrammarGuide';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

type Page = 'language' | 'menu' | 'vocabulary' | 'verbs' | 'grammar';
type Language = 'en' | 'de';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setCurrentPage('menu');
  };

  const handleBackToMenu = () => {
    setCurrentPage('menu');
  };

  const translations = {
    en: {
      title: 'Magyul',
      vocabulary: 'Practice Vocabulary',
      verbs: 'Practice Verb Conjugation',
      grammar: 'Grammar Guide'
    },
    de: {
      title: 'Magyul',
      vocabulary: 'Vokabeln üben',
      verbs: 'Verbkonjugation üben',
      grammar: 'Grammatik Leitfaden'
    }
  };

  const t = translations[selectedLanguage];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {currentPage === 'language' && (
        <LanguageSelection onSelectLanguage={handleLanguageSelect} />
      )}

      {currentPage === 'menu' && (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={10}
              sx={{
                p: 5,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
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
                  {t.title}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                  Choose your practice mode
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', mt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => setCurrentPage('vocabulary')}
                    startIcon={<MenuBookIcon />}
                    sx={{
                      py: 2.5,
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
                    {t.vocabulary}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => setCurrentPage('verbs')}
                    startIcon={<SpellcheckIcon />}
                    sx={{
                      py: 2.5,
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
                    {t.verbs}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => setCurrentPage('grammar')}
                    startIcon={<SchoolIcon />}
                    sx={{
                      py: 2.5,
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
                    {t.grammar}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      )}

      {currentPage === 'vocabulary' && (
        <VocabularyPractice language={selectedLanguage} onBack={handleBackToMenu} />
      )}

      {currentPage === 'verbs' && (
        <VerbConjugation language={selectedLanguage} onBack={handleBackToMenu} />
      )}

      {currentPage === 'grammar' && (
        <GrammarGuide language={selectedLanguage} onBack={handleBackToMenu} />
      )}
    </ThemeProvider>
  );
}

export default App;
