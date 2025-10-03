import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Alert, LinearProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { getConjugationExercise } from '../services/api';

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

const VerbConjugation: React.FC<Props> = ({ language, onBack }) => {
  const [exercise, setExercise] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '', '']);
  const [validation, setValidation] = useState<boolean[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>(language);

  const translations = {
    en: {
      title: 'Verb Conjugation',
      conjugate: 'Conjugate the verb in present tense:',
      check: 'Check',
      next: 'Next',
      persons: ['I', 'You (singular)', 'He/She/It', 'We', 'You (plural)', 'They'],
      back: 'Back',
      allCorrect: 'All correct! Well done!',
      someWrong: 'Some forms are incorrect. Please correct the red ones.'
    },
    de: {
      title: 'Verb Konjugation',
      conjugate: 'Konjugiere das Verb im Präsens:',
      check: 'Prüfen',
      next: 'Weiter',
      persons: ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie'],
      back: 'Zurück',
      allCorrect: 'Alles richtig! Gut gemacht!',
      someWrong: 'Einige Formen sind falsch. Bitte korrigiere die roten.'
    }
  };

  const t = translations[currentLanguage];

  useEffect(() => {
    loadExercise();
  }, []);

  const loadExercise = async () => {
    setLoading(true);
    try {
      const ex = await getConjugationExercise();
      setExercise(ex);
      setAnswers(['', '', '', '', '', '']);
      setValidation([]);
      setShowValidation(false);
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    if (!exercise) return;
    
    // Hungarian person keys: en, te, o, mi, ti, ok
    const personKeys = ['en', 'te', 'o', 'mi', 'ti', 'ok'];
    const correctForms = personKeys.map(key => exercise.verb.conjugations.present[key]);

    const results = answers.map((answer, index) => {
      const correctForm = correctForms[index];
      if (!correctForm) return false;
      // Normalize both answers to allow for missing accents and case insensitivity
      return normalizeHungarian(answer) === normalizeHungarian(correctForm);
    });

    setValidation(results);
    setShowValidation(true);
  };

  const handleNext = () => {
    const allCorrect = validation.every(v => v === true);
    if (allCorrect) {
      loadExercise();
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const allCorrect = showValidation && validation.every(v => v === true);
  const someWrong = showValidation && validation.some(v => v === false);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outlined" onClick={onBack}>
          ← {t.back}
        </Button>
        
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
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t.title}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t.conjugate}
            </Typography>
            <Typography variant="h4" sx={{ my: 2 }}>
              {exercise.verb.infinitive}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ({exercise.verb.meaning_de})
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {t.persons.map((person, index) => (
              <Box key={index}>
                <TextField
                  fullWidth
                  label={person}
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={showValidation}
                  error={showValidation && !validation[index]}
                  helperText={
                    showValidation && !validation[index]
                      ? `Correct: ${
                          exercise.verb.conjugations.present[
                            ['en', 'te', 'o', 'mi', 'ti', 'ok'][index]
                          ]
                        }`
                      : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-error': {
                        '& fieldset': {
                          borderColor: 'error.main',
                        },
                      },
                    },
                    ...(showValidation && validation[index] && {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                        },
                      },
                    }),
                  }}
                />
              </Box>
            ))}
          </Box>

          {allCorrect && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="h6">{t.allCorrect}</Typography>
            </Alert>
          )}

          {someWrong && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body1">{t.someWrong}</Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!showValidation ? (
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheck}
                disabled={answers.some(a => !a.trim())}
              >
                {t.check}
              </Button>
            ) : allCorrect ? (
              <Button variant="contained" fullWidth onClick={handleNext}>
                {t.next}
              </Button>
            ) : (
              <Button variant="outlined" fullWidth onClick={() => setShowValidation(false)}>
                Try Again
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VerbConjugation;
