import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, Alert, LinearProgress, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';

interface Props {
  language: 'en' | 'de';
  onBack: () => void;
}

type VowelType = 'back' | 'front' | 'mixed';
type WordSource = 'vocabulary' | 'verb';

const VowelHarmonyPractice: React.FC<Props> = ({ language, onBack }) => {
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [wordSource, setWordSource] = useState<WordSource>('vocabulary');
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<VowelType | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>(language);
  const [allVocabulary, setAllVocabulary] = useState<any[]>([]);
  const [allVerbs, setAllVerbs] = useState<any[]>([]);

  const translations = {
    en: {
      title: 'Vowel Harmony Practice',
      subtitle: 'Learn to identify vowel types and their endings',
      question: 'What type of vowels does this word have?',
      backVowels: 'Back Vowels',
      frontVowels: 'Front Vowels',
      mixedVowels: 'Mixed Vowels',
      backDescription: 'a, á, o, ó, u, ú',
      frontDescription: 'e, é, i, í, ö, ő, ü, ű',
      mixedDescription: 'Contains both types',
      correct: 'Correct!',
      wrong: 'Wrong!',
      correctAnswer: 'This word has',
      backEndings: 'Uses endings like: -nak, -ban, -hoz, -val',
      frontEndings: 'Uses endings like: -nek, -ben, -höz, -vel',
      mixedEndings: 'Usually follows back vowel rules',
      next: 'Next Word',
      back: 'Back',
      score: 'Score',
      right: 'Right',
      wrongLabel: 'Wrong',
      vocabulary: 'Vocabulary',
      verbs: 'Verbs',
      sourceToggle: 'Word Source',
      meaning: 'Meaning',
      check: 'Check'
    },
    de: {
      title: 'Vokalharmonie Übung',
      subtitle: 'Lerne Vokaltypen und ihre Endungen zu erkennen',
      question: 'Welche Art von Vokalen hat dieses Wort?',
      backVowels: 'Hintere Vokale',
      frontVowels: 'Vordere Vokale',
      mixedVowels: 'Gemischte Vokale',
      backDescription: 'a, á, o, ó, u, ú',
      frontDescription: 'e, é, i, í, ö, ő, ü, ű',
      mixedDescription: 'Enthält beide Typen',
      correct: 'Richtig!',
      wrong: 'Falsch!',
      correctAnswer: 'Dieses Wort hat',
      backEndings: 'Verwendet Endungen wie: -nak, -ban, -hoz, -val',
      frontEndings: 'Verwendet Endungen wie: -nek, -ben, -höz, -vel',
      mixedEndings: 'Folgt meist den Regeln hinterer Vokale',
      next: 'Nächstes Wort',
      back: 'Zurück',
      score: 'Punktzahl',
      right: 'Richtig',
      wrongLabel: 'Falsch',
      vocabulary: 'Vokabular',
      verbs: 'Verben',
      sourceToggle: 'Wortquelle',
      meaning: 'Bedeutung',
      check: 'Prüfen'
    }
  };

  const t = translations[currentLanguage];

  // Helper function to determine vowel harmony
  const determineVowelHarmony = (hungarianWord: string): VowelType => {
    // Safety check
    if (!hungarianWord || typeof hungarianWord !== 'string') {
      return 'back'; // Default fallback
    }
    
    const backVowels = ['a', 'á', 'o', 'ó', 'u', 'ú'];
    const frontVowels = ['e', 'é', 'i', 'í', 'ö', 'ő', 'ü', 'ű'];
    
    const vowelsInWord = hungarianWord.toLowerCase().split('').filter(char => 
      backVowels.includes(char) || frontVowels.includes(char)
    );
    
    const hasBackVowels = vowelsInWord.some(v => backVowels.includes(v));
    const hasFrontVowels = vowelsInWord.some(v => frontVowels.includes(v));
    
    if (hasBackVowels && hasFrontVowels) {
      return 'mixed';
    } else if (hasBackVowels) {
      return 'back';
    } else {
      return 'front';
    }
  };

  // Load vocabulary and verbs
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all vocabulary files
        const vocabPromises = [];
        for (let i = 1; i <= 20; i++) {
          vocabPromises.push(
            fetch(`/data/vocabulary/${i}.json`)
              .then(res => res.json())
              .catch(() => [])
          );
        }
        const vocabArrays = await Promise.all(vocabPromises);
        const allVocab = vocabArrays.flat();
        setAllVocabulary(allVocab);

        // Load verbs
        const verbsResponse = await fetch('/data/verbs.json');
        const verbsData = await verbsResponse.json();
        setAllVerbs(verbsData);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Load a new exercise
  const loadExercise = useCallback(() => {
    const sourceData = wordSource === 'vocabulary' ? allVocabulary : allVerbs;
    
    if (sourceData.length === 0) return;

    const randomIndex = Math.floor(Math.random() * sourceData.length);
    const word = sourceData[randomIndex];
    
    setCurrentWord(word);
    setShowResult(false);
    setSelectedAnswer(null);
  }, [wordSource, allVocabulary, allVerbs]);

  useEffect(() => {
    if (!loading && (allVocabulary.length > 0 || allVerbs.length > 0)) {
      loadExercise();
    }
  }, [loading, wordSource, allVocabulary, allVerbs, loadExercise]);

  const handleAnswerSelect = (answer: VowelType) => {
    setSelectedAnswer(answer);
  };

  const handleCheck = () => {
    if (!currentWord || !selectedAnswer) return;

    const hungarianWord = wordSource === 'vocabulary' 
      ? currentWord.word_hu 
      : currentWord.infinitive;
    
    const correctType = determineVowelHarmony(hungarianWord);
    const isCorrect = selectedAnswer === correctType;

    setShowResult(true);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    loadExercise();
  };

  // Keyboard handler for Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!showResult && selectedAnswer) {
          handleCheck();
        } else if (showResult) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, selectedAnswer]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!currentWord) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const hungarianWord = wordSource === 'vocabulary' 
    ? currentWord.word_hu 
    : currentWord.infinitive;
  
  const meaning = wordSource === 'vocabulary'
    ? (currentLanguage === 'en' ? currentWord.word_en : currentWord.word_de)
    : (currentLanguage === 'en' ? currentWord.meaning_en : currentWord.meaning_de);

  // Safety check: if hungarianWord is undefined, return loading state
  if (!hungarianWord) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  const correctType = determineVowelHarmony(hungarianWord);
  const isCorrect = selectedAnswer === correctType;

  const getVowelTypeLabel = (type: VowelType) => {
    switch (type) {
      case 'back':
        return t.backVowels;
      case 'front':
        return t.frontVowels;
      case 'mixed':
        return t.mixedVowels;
    }
  };

  const getVowelTypeDescription = (type: VowelType) => {
    switch (type) {
      case 'back':
        return t.backDescription;
      case 'front':
        return t.frontDescription;
      case 'mixed':
        return t.mixedDescription;
    }
  };

  const getEndingInfo = (type: VowelType) => {
    switch (type) {
      case 'back':
        return t.backEndings;
      case 'front':
        return t.frontEndings;
      case 'mixed':
        return t.mixedEndings;
    }
  };

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
        {/* Header */}
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

        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
          <Typography variant="h3" sx={{ 
            color: 'white', 
            fontWeight: 800,
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            mb: 1
          }}>
            {t.title}
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            {t.subtitle}
          </Typography>
        </Box>

        {/* Score Display */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: { xs: 2, sm: 3 } }}>
          <Chip
            icon={<CheckCircleIcon />}
            label={`${t.right}: ${correctCount}`}
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '1rem' }
            }}
          />
          <Chip
            icon={<CancelIcon />}
            label={`${t.wrongLabel}: ${wrongCount}`}
            sx={{
              backgroundColor: 'rgba(244, 67, 54, 0.9)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '1rem' }
            }}
          />
        </Box>

        {/* Word Source Toggle */}
        <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={wordSource}
            exclusive
            onChange={(e, newSource) => {
              if (newSource) {
                setWordSource(newSource);
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
            <ToggleButton value="vocabulary">
              {t.vocabulary}
            </ToggleButton>
            <ToggleButton value="verb">
              {t.verbs}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Main Card */}
        <Card sx={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            {/* Word Display */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 800,
                color: '#667eea',
                mb: 1,
                fontSize: { xs: '2rem', sm: '3rem' }
              }}>
                {hungarianWord}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'text.secondary',
                fontStyle: 'italic',
                fontSize: { xs: '1rem', sm: '1.2rem' }
              }}>
                ({meaning})
              </Typography>
            </Box>

            {/* Question */}
            <Typography variant="h6" sx={{ 
              textAlign: 'center', 
              mb: 3,
              fontWeight: 600,
              color: '#333'
            }}>
              {t.question}
            </Typography>

            {/* Answer Options */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              mb: 3
            }}>
              {(['back', 'front', 'mixed'] as VowelType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedAnswer === type ? 'contained' : 'outlined'}
                  onClick={() => !showResult && handleAnswerSelect(type)}
                  disabled={showResult}
                  sx={{
                    py: 2,
                    px: 3,
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    borderWidth: 2,
                    borderColor: showResult && type === correctType 
                      ? '#4caf50' 
                      : showResult && type === selectedAnswer && !isCorrect
                      ? '#f44336'
                      : '#667eea',
                    backgroundColor: selectedAnswer === type && !showResult
                      ? '#667eea'
                      : showResult && type === correctType
                      ? 'rgba(76, 175, 80, 0.1)'
                      : showResult && type === selectedAnswer && !isCorrect
                      ? 'rgba(244, 67, 54, 0.1)'
                      : 'transparent',
                    color: selectedAnswer === type && !showResult
                      ? 'white'
                      : showResult && type === correctType
                      ? '#4caf50'
                      : showResult && type === selectedAnswer && !isCorrect
                      ? '#f44336'
                      : '#667eea',
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: !showResult
                        ? selectedAnswer === type 
                          ? '#5568d3' 
                          : 'rgba(102, 126, 234, 0.08)'
                        : undefined
                    },
                    '&.Mui-disabled': {
                      borderWidth: 2,
                      borderColor: type === correctType 
                        ? '#4caf50' 
                        : type === selectedAnswer && !isCorrect
                        ? '#f44336'
                        : '#667eea',
                    }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {getVowelTypeLabel(type)}
                      </Typography>
                      {showResult && type === correctType && (
                        <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      )}
                      {showResult && type === selectedAnswer && !isCorrect && (
                        <CancelIcon sx={{ color: '#f44336' }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ 
                      opacity: 0.8,
                      fontStyle: 'italic',
                      fontSize: '0.9rem'
                    }}>
                      {getVowelTypeDescription(type)}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Result Message */}
            {showResult && (
              <Alert 
                severity={isCorrect ? 'success' : 'error'}
                icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                sx={{ mb: 3 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  {isCorrect ? t.correct : t.wrong}
                </Typography>
                {!isCorrect && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t.correctAnswer}: <strong>{getVowelTypeLabel(correctType)}</strong>
                  </Typography>
                )}
                <Typography variant="body2" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 0.5,
                  fontStyle: 'italic'
                }}>
                  <InfoIcon sx={{ fontSize: '1rem' }} />
                  {getEndingInfo(correctType)}
                </Typography>
              </Alert>
            )}

            {/* Action Button */}
            {!showResult ? (
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheck}
                disabled={!selectedAnswer}
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
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default VowelHarmonyPractice;
