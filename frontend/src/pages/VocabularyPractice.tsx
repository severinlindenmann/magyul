import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Chip, Alert, LinearProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LanguageIcon from '@mui/icons-material/Language';
import { getVocabularyExercise, markWordResult } from '../services/api';


interface Props {
  language: 'en' | 'de';
  onBack: () => void;
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
    .replace(/ß/g, 'ss')  // Replace ß with ss for Swiss German compatibility
    .trim();
};

const VocabularyPractice: React.FC<Props> = ({ language, onBack }) => {
  const [exercise, setExercise] = useState<any>(null);
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
      title: 'Vocabulary Practice',
      translate: 'Translate this word:',
      translateReverse: 'Write in Hungarian:',
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
      title: 'Vokabel Übung',
      translate: 'Übersetze dieses Wort:',
      translateReverse: 'Schreibe auf Ungarisch:',
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

  const loadExercise = async () => {
    setLoading(true);
    const ex = await getVocabularyExercise();
    setExercise(ex);
    setAnswer('');
    setShowResult(false);
    setLoading(false);
  };

  const handleCheck = useCallback(() => {
    if (!exercise || !answer.trim()) return;
    
    // In reverse mode: show English/German word, user writes Hungarian
    // In normal mode: show Hungarian word, user writes English/German
    let correctWord: string;
    let normalizedAnswer: string;
    
    if (reverseMode) {
      correctWord = exercise.word.word_hu;
      normalizedAnswer = normalizeHungarian(answer);
    } else {
      correctWord = currentLanguage === 'en' ? exercise.word.word_en : exercise.word.word_de;
      // For German, use Swiss German normalization; for English and Hungarian, use Hungarian normalization
      if (currentLanguage === 'de') {
        normalizedAnswer = normalizeGerman(answer);
      } else {
        normalizedAnswer = normalizeHungarian(answer);
      }
    }
    
    // Handle comma-separated alternatives (e.g., "als, wie" - accept either "als" OR "wie")
    const correctAlternatives = correctWord.split(',').map(alt => alt.trim());
    let result = false;
    
    // Check if the user's answer matches any of the alternatives
    for (const alternative of correctAlternatives) {
      let normalizedCorrect: string;
      if (reverseMode) {
        normalizedCorrect = normalizeHungarian(alternative);
      } else {
        if (currentLanguage === 'de') {
          normalizedCorrect = normalizeGerman(alternative);
        } else {
          normalizedCorrect = normalizeHungarian(alternative);
        }
      }
      
      if (normalizedAnswer === normalizedCorrect) {
        result = true;
        break;
      }
    }
    
    setIsCorrect(result);
    setShowResult(true);
    
    // Mark the word result for smart cycling
    if (exercise?.word?.id) {
      markWordResult(exercise.word.id, result, 'vocabulary');
    }
    
    if (result) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
  }, [exercise, answer, reverseMode, currentLanguage]);

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
      // Allow Tab to go to next word after correct answer
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

  if (!exercise) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
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
      <Box sx={{ mt: { xs: 2, sm: 4 }, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
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
            },
          }}
        >
          ← {t.back}
        </Button>
        
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center' }}>
          {/* Language Switcher */}
          <ToggleButtonGroup
            value={currentLanguage}
            exclusive
            onChange={(e, newLang) => newLang && setCurrentLanguage(newLang)}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              '& .MuiToggleButton-root': {
                color: '#667eea',
                fontWeight: 600,
                borderColor: 'rgba(102, 126, 234, 0.3)',
                '&.Mui-selected': {
                  backgroundColor: '#667eea',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#5568d3',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                },
              },
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
            <Typography variant="h4" sx={{ my: 2, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
              {reverseMode 
                ? (currentLanguage === 'en' ? exercise.word.word_en : exercise.word.word_de)
                : exercise.word.word_hu
              }
            </Typography>
            {exercise.word.category && (
              <Chip 
                label={currentLanguage === 'en' ? exercise.word.category_en : exercise.word.category_de} 
                size="small" 
              />
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
                      ? exercise.word.word_hu 
                      : (currentLanguage === 'en' ? exercise.word.word_en : exercise.word.word_de)
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

export default VocabularyPractice;
