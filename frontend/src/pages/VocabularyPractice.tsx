import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Chip, Alert, LinearProgress, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LanguageIcon from '@mui/icons-material/Language';
import { getVocabularyExercise } from '../services/api';

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

  useEffect(() => {
    loadExercise();
  }, []);

  const loadExercise = async () => {
    setLoading(true);
    const ex = await getVocabularyExercise();
    setExercise(ex);
    setAnswer('');
    setShowResult(false);
    setLoading(false);
  };

  const handleCheck = () => {
    if (!exercise || !answer.trim()) return;
    
    // Normalize both the user's answer and the correct answer
    const normalizedAnswer = normalizeHungarian(answer);
    
    // In reverse mode: show English/German word, user writes Hungarian
    // In normal mode: show Hungarian word, user writes English/German
    let correctWord: string;
    if (reverseMode) {
      correctWord = exercise.word.word_hu;
    } else {
      correctWord = currentLanguage === 'en' ? exercise.word.word_en : exercise.word.word_de;
    }
    
    const normalizedCorrect = normalizeHungarian(correctWord);
    
    const result = normalizedAnswer === normalizedCorrect;
    setIsCorrect(result);
    setShowResult(true);
    
    if (result) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    loadExercise();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!showResult) {
        handleCheck();
      } else {
        handleNext();
      }
    }
    // Allow Tab to go to next word after correct answer
    if (e.key === 'Tab' && showResult && isCorrect) {
      e.preventDefault();
      handleNext();
    }
  };

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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          ← {t.back}
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Language Switcher */}
          <ToggleButtonGroup
            value={currentLanguage}
            exclusive
            onChange={(e, newLang) => newLang && setCurrentLanguage(newLang)}
            size="small"
          >
            <ToggleButton value="en">
              <LanguageIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
              EN
            </ToggleButton>
            <ToggleButton value="de">
              <LanguageIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
              DE
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Reverse Mode Toggle */}
          <IconButton
            onClick={() => {
              setReverseMode(!reverseMode);
              setAnswer('');
              setShowResult(false);
            }}
            color={reverseMode ? 'primary' : 'default'}
            sx={{
              border: '1px solid',
              borderColor: reverseMode ? 'primary.main' : 'divider',
              '&:hover': {
                backgroundColor: reverseMode ? 'primary.light' : 'action.hover',
              }
            }}
          >
            <SwapHorizIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
        <Typography variant="h6" color="primary.contrastText">
          {t.score}: {t.right} {correctCount} | {t.wrongLabel} {wrongCount}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t.title}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {reverseMode ? t.translateReverse : t.translate}
            </Typography>
            <Typography variant="h4" sx={{ my: 2 }}>
              {reverseMode 
                ? (currentLanguage === 'en' ? exercise.word.word_en : exercise.word.word_de)
                : exercise.word.word_hu
              }
            </Typography>
            {exercise.word.category && (
              <Chip label={exercise.word.category} size="small" />
            )}
          </Box>

          <TextField
            fullWidth
            label={t.yourAnswer}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
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
              >
                {t.check}
              </Button>
            ) : (
              <Button variant="contained" fullWidth onClick={handleNext}>
                {t.next}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VocabularyPractice;
