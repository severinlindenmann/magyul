import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import SchoolIcon from '@mui/icons-material/School';
import NumbersIcon from '@mui/icons-material/Numbers';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LanguageSelection from './pages/LanguageSelection';
import VocabularyPractice from './pages/VocabularyPractice';
import VerbConjugation from './pages/VerbConjugation';
import GrammarGuide from './pages/GrammarGuide';
import NumbersPractice from './pages/NumbersPractice';
import MinigameWordMatch from './pages/MinigameWordMatch';
import Footer from './components/Footer';

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

type Page = 'language' | 'menu' | 'vocabulary' | 'verbs' | 'grammar' | 'numbers' | 'minigame';
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
      chooseMode: 'Choose your practice mode',
      vocabulary: 'Practice Vocabulary',
      verbs: 'Practice Verb Conjugation',
      numbers: 'Practice Numbers',
      grammar: 'Grammar Guide',
      minigame: 'Word Match Minigame'
    },
    de: {
      title: 'Magyul',
      chooseMode: 'Wähle deinen Übungsmodus',
      vocabulary: 'Vokabeln üben',
      verbs: 'Verbkonjugation üben',
      numbers: 'Zahlen üben',
      grammar: 'Grammatik Leitfaden',
      minigame: 'Wort-Zuordnungs-Minispiel'
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
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4,
          }}
        >
          <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
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
                  {t.title}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                  {t.chooseMode}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 }, width: '100%', mt: { xs: 1, sm: 2 } }}>
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
                    onClick={() => setCurrentPage('numbers')}
                    startIcon={<NumbersIcon />}
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
                    {t.numbers}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => setCurrentPage('minigame')}
                    startIcon={<SportsEsportsIcon />}
                    sx={{
                      py: 2.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e080e8 0%, #e04858 100%)',
                        boxShadow: '0 6px 20px rgba(245, 87, 108, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {t.minigame}
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
          <Footer variant="light" />
        </Box>
      )}

      {currentPage === 'vocabulary' && (
        <VocabularyPractice language={selectedLanguage} onBack={handleBackToMenu} />
      )}

      {currentPage === 'verbs' && (
        <VerbConjugation language={selectedLanguage} onBack={handleBackToMenu} />
      )}

      {currentPage === 'numbers' && (
        <NumbersPractice language={selectedLanguage} onBack={handleBackToMenu} />
      )}

      {currentPage === 'minigame' && (
        <MinigameWordMatch language={selectedLanguage} onBack={handleBackToMenu} />
      )}

      {currentPage === 'grammar' && (
        <GrammarGuide language={selectedLanguage} onBack={handleBackToMenu} />
      )}
    </ThemeProvider>
  );
}

export default App;
