import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Alert, LinearProgress, ToggleButton, ToggleButtonGroup, Chip, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import InfoIcon from '@mui/icons-material/Info';
import { getConjugationExercise, markWordResult } from '../services/api';


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
  const [selectedTense, setSelectedTense] = useState<'present' | 'past' | 'future'>('present');

  const translations = {
    en: {
      title: 'Verb Conjugation',
      conjugatePresent: 'Conjugate the verb in present tense:',
      conjugatePast: 'Conjugate the verb in past tense:',
      conjugateFuture: 'Conjugate the verb in future tense:',
      check: 'Check',
      next: 'Next',
      tryAgain: 'Try Again',
      persons: ['I', 'You (singular)', 'He/She/It', 'We', 'You (plural)', 'They'],
      back: 'Back',
      allCorrect: 'All correct! Well done!',
      someWrong: 'Some forms are incorrect. Check the corrections below.',
      present: 'Present',
      past: 'Past',
      future: 'Future',
      regular: 'Regular Verb',
      irregular: 'Irregular Verb',
      regularInfo: 'Regular verbs follow predictable conjugation patterns.',
      irregularInfo: 'Irregular verbs have unique conjugation forms that must be memorized.'
    },
    de: {
      title: 'Verb Konjugation',
      conjugatePresent: 'Konjugiere das Verb im Präsens:',
      conjugatePast: 'Konjugiere das Verb im Präteritum:',
      conjugateFuture: 'Konjugiere das Verb im Futur:',
      check: 'Prüfen',
      next: 'Weiter',
      tryAgain: 'Nochmal versuchen',
      persons: ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie'],
      back: 'Zurück',
      allCorrect: 'Alles richtig! Gut gemacht!',
      someWrong: 'Einige Formen sind falsch. Siehe Korrekturen unten.',
      present: 'Präsens',
      past: 'Präteritum',
      future: 'Futur',
      regular: 'Regelmäßiges Verb',
      irregular: 'Unregelmäßiges Verb',
      regularInfo: 'Regelmäßige Verben folgen vorhersehbaren Konjugationsmustern.',
      irregularInfo: 'Unregelmäßige Verben haben einzigartige Konjugationsformen, die auswendig gelernt werden müssen.'
    }
  };

  const t = translations[currentLanguage];

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

  const handleCheck = useCallback(() => {
    if (!exercise) return;
    
    // Hungarian person keys with proper accents: én, te, ő, mi, ti, ők
    const personKeys = ['én', 'te', 'ő', 'mi', 'ti', 'ők'];
    const correctForms = personKeys.map(key => exercise.verb.conjugations[selectedTense][key]);

    const results = answers.map((answer, index) => {
      const correctForm = correctForms[index];
      if (!correctForm) return false;
      // Normalize both answers to allow for missing accents and case insensitivity
      return normalizeHungarian(answer) === normalizeHungarian(correctForm);
    });

    setValidation(results);
    setShowValidation(true);
    
    // Mark the word result for smart cycling - consider it correct if all forms are correct
    const allCorrect = results.every(v => v === true);
    if (exercise?.verb?.id) {
      markWordResult(exercise.verb.id, allCorrect, 'verb');
    }
  }, [exercise, answers, selectedTense]);

  const handleNext = useCallback(() => {
    const allCorrect = validation.every(v => v === true);
    if (allCorrect) {
      loadExercise();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  useEffect(() => {
    loadExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global keyboard handler for Enter key
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const allFilled = answers.every(a => a.trim());
        if (!showValidation && allFilled) {
          handleCheck();
        } else if (showValidation) {
          const allCorrect = validation.every(v => v === true);
          if (allCorrect) {
            handleNext();
          } else {
            setShowValidation(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [showValidation, answers, validation, handleCheck, handleNext]);

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 2,
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
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

      {/* Tense Selector */}
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={selectedTense}
          exclusive
          onChange={(e, newTense) => {
            if (newTense) {
              setSelectedTense(newTense);
              setAnswers(['', '', '', '', '', '']);
              setValidation([]);
              setShowValidation(false);
            }
          }}
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 1,
            '& .MuiToggleButton-root': {
              color: '#667eea',
              borderColor: 'rgba(102, 126, 234, 0.3)',
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
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
          <ToggleButton value="present">
            {t.present}
          </ToggleButton>
          <ToggleButton value="past">
            {t.past}
          </ToggleButton>
          <ToggleButton value="future">
            {t.future}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Card sx={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Verb Header - More Compact */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 800,
              color: '#667eea',
              mb: 1
            }}>
              {exercise.verb.infinitive}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontStyle: 'italic',
              mb: 1.5
            }}>
              ({currentLanguage === 'en' ? exercise.verb.meaning_en : exercise.verb.meaning_de})
            </Typography>
            
            {/* Verb Type Indicator */}
            <Tooltip 
              title={exercise.verb.category === 'irregular' ? t.irregularInfo : t.regularInfo}
              arrow
              placement="bottom"
            >
              <Chip
                icon={<InfoIcon />}
                label={exercise.verb.category === 'irregular' ? t.irregular : t.regular}
                size="small"
                sx={{
                  backgroundColor: exercise.verb.category === 'irregular' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                  color: exercise.verb.category === 'irregular' ? '#f57c00' : '#388e3c',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 1,
                  '& .MuiChip-icon': {
                    color: exercise.verb.category === 'irregular' ? '#f57c00' : '#388e3c',
                  },
                  '&:hover': {
                    backgroundColor: exercise.verb.category === 'irregular' ? 'rgba(255, 152, 0, 0.25)' : 'rgba(76, 175, 80, 0.25)',
                  }
                }}
              />
            </Tooltip>
          </Box>

          <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1.5, sm: 2 } }}>
            {t.persons.map((person, index) => (
              <Box key={index}>
                <TextField
                  fullWidth
                  label={person}
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={showValidation}
                  error={showValidation && !validation[index]}
                  size="small"
                  helperText={
                    showValidation && !validation[index]
                      ? `✓ ${
                          exercise.verb.conjugations[selectedTense][
                            ['én', 'te', 'ő', 'mi', 'ti', 'ők'][index]
                          ]
                        }`
                      : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: showValidation && validation[index] ? 'rgba(76, 175, 80, 0.08)' : 'white',
                      '&.Mui-error': {
                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                        '& fieldset': {
                          borderColor: 'error.main',
                          borderWidth: 2,
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
                      '& .MuiInputLabel-root': {
                        color: 'success.main',
                        fontWeight: 600,
                      }
                    }),
                  }}
                />
              </Box>
            ))}
          </Box>

          {allCorrect && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>🎉 {t.allCorrect}</Typography>
            </Alert>
          )}

          {someWrong && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(255, 152, 0, 0.15)',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>💡 {t.someWrong}</Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!showValidation ? (
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheck}
                disabled={answers.some(a => !a.trim())}
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
            ) : allCorrect ? (
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
            ) : (
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => setShowValidation(false)}
                sx={{
                  backgroundColor: '#667eea',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#5568d3',
                  }
                }}
              >
                🔄 {t.tryAgain}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};

export default VerbConjugation;
