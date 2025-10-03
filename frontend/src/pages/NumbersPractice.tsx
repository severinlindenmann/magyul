import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Alert, LinearProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LanguageIcon from '@mui/icons-material/Language';

interface Props {
  language: 'en' | 'de';
  onBack: () => void;
}

interface NumberData {
  id: number;
  number: number;
  word_hu: string;
  word_en: string;
  word_de: string;
}

// Helper function to normalize Hungarian text (remove accents and convert to lowercase)
const normalizeHungarian = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/ő/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/ű/g, 'u')
    .trim();
};

// Helper function to normalize German text (accept Swiss German spelling)
const normalizeGerman = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .trim();
};

const NumbersPractice: React.FC<Props> = ({ language, onBack }) => {
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [currentNumber, setCurrentNumber] = useState<NumberData | null>(null);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>(language);
  const [reverseMode, setReverseMode] = useState(false);

  const translations = {
    en: {
      title: 'Numbers Practice',
      translate: 'Write this number in Hungarian:',
      translateReverse: 'Translate to English:',
      yourAnswer: 'Your answer',
      check: 'Check',
      next: 'Next',
      correct: 'Correct!',
      wrong: 'Wrong!',
      correctAnswer: 'Correct answer:',
      score: 'Score',
      right: 'Right',
      wrongLabel: 'Wrong',
      back: 'Back',
      reverseMode: 'Reverse Mode',
      normalMode: 'Normal Mode'
    },
    de: {
      title: 'Zahlen Übung',
      translate: 'Schreibe diese Zahl auf Ungarisch:',
      translateReverse: 'Übersetze auf Deutsch:',
      yourAnswer: 'Deine Antwort',
      check: 'Prüfen',
      next: 'Weiter',
      correct: 'Richtig!',
      wrong: 'Falsch!',
      correctAnswer: 'Richtige Antwort:',
      score: 'Punktzahl',
      right: 'Richtig',
      wrongLabel: 'Falsch',
      back: 'Zurück',
      reverseMode: 'Umgekehrter Modus',
      normalMode: 'Normal Modus'
    }
  };

  const t = translations[currentLanguage];

  const loadNumbers = async () => {
    try {
      const response = await fetch('/data/numbers.json');
      const data = await response.json();
      setNumbers(data);
      return data;
    } catch (error) {
      console.error('Error loading numbers:', error);
      return [];
    }
  };

  const getRandomNumber = (numbersData: NumberData[]) => {
    const randomIndex = Math.floor(Math.random() * numbersData.length);
    return numbersData[randomIndex];
  };

  const loadExercise = async () => {
    setLoading(true);
    let numbersData = numbers;
    if (numbersData.length === 0) {
      numbersData = await loadNumbers();
    }
    const randomNumber = getRandomNumber(numbersData);
    setCurrentNumber(randomNumber);
    setAnswer('');
    setShowResult(false);
    setLoading(false);
  };

  const handleCheck = useCallback(() => {
    if (!currentNumber || !answer.trim()) return;
    
    let correctWord: string;
    let normalizedAnswer: string;
    let normalizedCorrect: string;
    
    if (reverseMode) {
      // Reverse mode: Hungarian -> EN/DE
      correctWord = currentLanguage === 'en' ? currentNumber.word_en : currentNumber.word_de;
      if (currentLanguage === 'de') {
        normalizedAnswer = normalizeGerman(answer);
        normalizedCorrect = normalizeGerman(correctWord);
      } else {
        normalizedAnswer = answer.toLowerCase().trim();
        normalizedCorrect = correctWord.toLowerCase().trim();
      }
    } else {
      // Normal mode: Number -> Hungarian
      correctWord = currentNumber.word_hu;
      normalizedAnswer = normalizeHungarian(answer);
      normalizedCorrect = normalizeHungarian(correctWord);
    }
    
    const result = normalizedAnswer === normalizedCorrect;
    setIsCorrect(result);
    setShowResult(true);
    
    if (result) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
  }, [currentNumber, answer, reverseMode, currentLanguage]);

  const handleNext = useCallback(() => {
    loadExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global keyboard handler for Enter and Tab keys
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!showResult && answer.trim()) {
          handleCheck();
        } else if (showResult) {
          handleNext();
        }
      }
      if (e.key === 'Tab' && showResult && isCorrect) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [showResult, isCorrect, answer, handleCheck, handleNext]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!currentNumber) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 2,
      }}
    >
    <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 3 } }}>
      <Box sx={{ mt: { xs: 2, sm: 4 }, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="contained" 
          onClick={onBack} 
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#667eea',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#ffffff',
            }
          }}
        >
          ← {t.back}
        </Button>

        {/* Language Switcher */}
        <ToggleButtonGroup
          value={currentLanguage}
          exclusive
          onChange={(e, newLang) => newLang && setCurrentLanguage(newLang)}
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 1,
            '& .MuiToggleButton-root': {
              color: '#667eea',
              borderColor: 'rgba(102, 126, 234, 0.3)',
              '&.Mui-selected': {
                backgroundColor: '#667eea',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#5568d3',
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
              }
            }
          }}
        >
          <ToggleButton value="en" sx={{ px: { xs: 1, sm: 2 } }}>
            <LanguageIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            EN
          </ToggleButton>
          <ToggleButton value="de" sx={{ px: { xs: 1, sm: 2 } }}>
            <LanguageIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            DE
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ 
        mb: { xs: 2, sm: 3 }, 
        p: { xs: 1.5, sm: 2 }, 
        bgcolor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h6" sx={{ 
          fontSize: { xs: '1rem', sm: '1.25rem' },
          color: '#667eea',
          fontWeight: 700
        }}>
          {t.score}: {t.right} {correctCount} | {t.wrongLabel} {wrongCount}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {t.title}
          </Typography>

          <Box sx={{ my: { xs: 2, sm: 3 } }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {reverseMode ? t.translateReverse : t.translate}
            </Typography>
            <Typography variant="h2" sx={{ 
              my: 2, 
              fontSize: { xs: '3rem', sm: '4rem' },
              fontWeight: 800,
              color: '#667eea',
              textAlign: 'center'
            }}>
              {reverseMode 
                ? currentNumber.word_hu
                : currentNumber.number
              }
            </Typography>
            {reverseMode && (
              <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
                ({currentNumber.number})
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            label={t.yourAnswer}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={showResult}
            autoFocus
            sx={{ mb: 2 }}
          />

          {showResult && (
            <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mb: 2 }}>
              <Typography variant="h6">{isCorrect ? t.correct : t.wrong}</Typography>
              {!isCorrect && (
                <Typography variant="body2">
                  {t.correctAnswer} <strong>
                    {reverseMode 
                      ? (currentLanguage === 'en' ? currentNumber.word_en : currentNumber.word_de)
                      : currentNumber.word_hu
                    }
                  </strong>
                </Typography>
              )}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!showResult ? (
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheck}
                disabled={!answer.trim()}
                sx={{
                  backgroundColor: '#ffd93d',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#ffcc00',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 217, 61, 0.3)',
                    color: 'rgba(0, 0, 0, 0.3)',
                  }
                }}
              >
                {t.check}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleNext}
                sx={{
                  backgroundColor: '#ffd93d',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#ffcc00',
                  }
                }}
              >
                {t.next}
              </Button>
            )}
          </Box>

          {/* Reverse Mode Toggle */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              onClick={() => {
                setReverseMode(!reverseMode);
                setAnswer('');
                setShowResult(false);
              }}
              startIcon={<SwapHorizIcon />}
              variant={reverseMode ? 'contained' : 'outlined'}
              fullWidth
              size="small"
              sx={{
                backgroundColor: reverseMode ? '#667eea' : 'transparent',
                color: reverseMode ? '#ffffff' : '#667eea',
                borderColor: '#667eea',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: reverseMode ? '#5568d3' : 'rgba(102, 126, 234, 0.1)',
                  borderColor: '#5568d3',
                }
              }}
            >
              {reverseMode ? t.reverseMode : t.normalMode}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};

export default NumbersPractice;
