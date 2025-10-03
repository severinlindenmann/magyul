import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, Alert, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import LanguageIcon from '@mui/icons-material/Language';

interface Props {
  language: 'en' | 'de';
  onBack: () => void;
}

type DataType = 'verbs' | 'numbers' | 'vocabulary' | null;

interface WordPair {
  id: number;
  hungarian: string;
  translation: string;
  category: string;
}

interface CardState {
  id: string;
  text: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
  isHungarian: boolean;
}

const MinigameWordMatch: React.FC<Props> = ({ language, onBack }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>(language);
  const [selectedDataType, setSelectedDataType] = useState<DataType>(null);
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [vocabulary, setVocabulary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: 'Word Match Minigame',
      instructions: 'Match Hungarian words with their translations!',
      selectDataType: 'Choose what to practice:',
      verbs: 'Verbs',
      numbers: 'Numbers',
      vocabulary: 'Vocabulary',
      moves: 'Moves',
      time: 'Time',
      matched: 'Matched',
      pairs: 'pairs',
      startGame: 'Start Game',
      newGame: 'New Game',
      changeCategory: 'Change Category',
      back: 'Back',
      congratulations: 'Congratulations! 🎉',
      gameComplete: 'You completed the game!',
      yourScore: 'Your Score'
    },
    de: {
      title: 'Wort-Zuordnungs-Minispiel',
      instructions: 'Ordne ungarische Wörter ihren Übersetzungen zu!',
      selectDataType: 'Wähle was du üben möchtest:',
      verbs: 'Verben',
      numbers: 'Zahlen',
      vocabulary: 'Vokabeln',
      moves: 'Züge',
      time: 'Zeit',
      matched: 'Gefunden',
      pairs: 'Paare',
      startGame: 'Spiel starten',
      newGame: 'Neues Spiel',
      changeCategory: 'Kategorie wechseln',
      back: 'Zurück',
      congratulations: 'Glückwunsch! 🎉',
      gameComplete: 'Du hast das Spiel abgeschlossen!',
      yourScore: 'Deine Punktzahl'
    }
  };

  const t = translations[currentLanguage];

  // Load vocabulary data based on selected type
  const loadData = useCallback(async (dataType: DataType) => {
    if (!dataType) return;
    
    setLoading(true);
    try {
      if (dataType === 'verbs') {
        const response = await fetch('/data/verbs.json');
        const data = await response.json();
        setVocabulary(data);
      } else if (dataType === 'numbers') {
        const response = await fetch('/data/numbers.json');
        const data = await response.json();
        setVocabulary(data);
      } else if (dataType === 'vocabulary') {
        const allWords: any[] = [];
        for (let i = 1; i <= 10; i++) {
          const response = await fetch(`/data/vocabulary/${i}.json`);
          const data = await response.json();
          allWords.push(...data);
        }
        setVocabulary(allWords);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }, []);

  // Load data when data type is selected
  useEffect(() => {
    if (selectedDataType) {
      loadData(selectedDataType);
    }
  }, [selectedDataType, loadData]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameWon]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    if (vocabulary.length === 0 || !selectedDataType) return;

    // Extract hungarian and translation based on data type
    const getWordData = (word: any) => {
      if (selectedDataType === 'verbs') {
        return {
          hungarian: word.infinitive,
          translation: currentLanguage === 'en' ? word.meaning_en : word.meaning_de,
          category: word.category
        };
      } else if (selectedDataType === 'numbers') {
        return {
          hungarian: word.word_hu,
          translation: currentLanguage === 'en' ? word.word_en : word.word_de,
          category: 'numbers'
        };
      } else { // vocabulary
        return {
          hungarian: word.word_hu,
          translation: currentLanguage === 'en' ? word.word_en : word.word_de,
          category: word.category
        };
      }
    };

    // Filter words that have translations for the current language
    const validWords = vocabulary.filter(word => {
      const data = getWordData(word);
      return data.translation && data.translation.trim() !== '';
    });

    if (validWords.length < 6) {
      console.error('Not enough words with translations available');
      return;
    }

    // Select 6 random word pairs
    const shuffled = [...validWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 6);

    const wordPairs: WordPair[] = selectedWords.map((word, index) => {
      const data = getWordData(word);
      return {
        id: index,
        hungarian: data.hungarian,
        translation: data.translation,
        category: data.category
      };
    });

    // Create cards (each pair gets 2 cards)
    const gameCards: CardState[] = [];
    wordPairs.forEach((pair) => {
      gameCards.push({
        id: `${pair.id}-hu`,
        text: pair.hungarian,
        pairId: pair.id,
        isFlipped: false,
        isMatched: false,
        isHungarian: true
      });
      gameCards.push({
        id: `${pair.id}-trans`,
        text: pair.translation,
        pairId: pair.id,
        isFlipped: false,
        isMatched: false,
        isHungarian: false
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);
    setTimer(0);
    setIsRunning(true);
  }, [vocabulary, currentLanguage, selectedDataType]);

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        setTimeout(() => {
          setCards(cards.map(c => 
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setMatchedPairs(matchedPairs + 1);
          setFlippedCards([]);

          // Check if game is won
          if (matchedPairs + 1 === 6) {
            setGameWon(true);
            setIsRunning(false);
          }
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(cards.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Calculate score (lower is better)
  const calculateScore = (): number => {
    const baseScore = 1000;
    const movePenalty = moves * 10;
    const timePenalty = timer * 2;
    return Math.max(0, baseScore - movePenalty - timePenalty);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Typography variant="h5" sx={{ color: 'white' }}>Loading...</Typography>
      </Box>
    );
  }

  // Data type selection screen
  if (!selectedDataType) {
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
              onChange={(e, newLang) => {
                if (newLang) {
                  setCurrentLanguage(newLang);
                }
              }}
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

          {/* Selection Card */}
          <Card sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 1, textAlign: 'center' }}>
                {t.title}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
                {t.selectDataType}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setSelectedDataType('verbs')}
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
                  📝 {t.verbs}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setSelectedDataType('numbers')}
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
                  🔢 {t.numbers}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setSelectedDataType('vocabulary')}
                  sx={{
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b9be5 0%, #00d9e5 100%)',
                      boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  📚 {t.vocabulary}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
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
            onChange={(e, newLang) => {
              if (newLang) {
                setCurrentLanguage(newLang);
                if (isRunning) {
                  initializeGame();
                }
              }
            }}
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

        {/* Title and Instructions */}
        <Card sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 1, textAlign: 'center' }}>
              {t.title}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              {t.instructions}
            </Typography>
          </CardContent>
        </Card>

        {/* Game Stats */}
        {isRunning && (
          <Box sx={{ 
            mb: 2, 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Chip
              icon={<TimerIcon />}
              label={`${t.time}: ${formatTime(timer)}`}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2
              }}
            />
            <Chip
              label={`${t.moves}: ${moves}`}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2
              }}
            />
            <Chip
              label={`${t.matched}: ${matchedPairs}/6 ${t.pairs}`}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2
              }}
            />
          </Box>
        )}

        {/* Game Won Alert */}
        {gameWon && (
          <Alert 
            icon={<EmojiEventsIcon fontSize="large" />}
            severity="success" 
            sx={{ 
              mb: 3,
              fontSize: '1.1rem',
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {t.congratulations}
            </Typography>
            <Typography variant="body1">
              {t.gameComplete}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {t.yourScore}: {calculateScore()} | {t.moves}: {moves} | {t.time}: {formatTime(timer)}
            </Typography>
          </Alert>
        )}

        {/* Game Board */}
        {cards.length > 0 ? (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 2,
              mb: 3
            }}
          >
            {cards.map((card) => (
              <Card
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                sx={{
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: card.isMatched ? 'default' : 'pointer',
                  backgroundColor: card.isMatched 
                    ? 'rgba(76, 175, 80, 0.3)' 
                    : card.isFlipped 
                      ? '#ffffff' 
                      : '#667eea',
                  transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(0deg)',
                  transition: 'all 0.3s ease',
                  border: card.isMatched ? '3px solid #4caf50' : 'none',
                  '&:hover': {
                    transform: card.isMatched ? 'scale(1)' : 'scale(1.05)',
                    boxShadow: card.isMatched ? 'none' : '0 8px 16px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 1 }}>
                  {card.isFlipped || card.isMatched ? (
                    <>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: card.isMatched ? '#4caf50' : '#667eea',
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                          wordWrap: 'break-word'
                        }}
                      >
                        {card.text}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.75rem'
                        }}
                      >
                        {card.isHungarian ? '🇭🇺' : currentLanguage === 'en' ? '🇬🇧' : '🇩🇪'}
                      </Typography>
                    </>
                  ) : (
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 700
                      }}
                    >
                      ?
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={initializeGame}
              sx={{
                backgroundColor: '#ffd93d',
                color: '#000000',
                fontWeight: 700,
                fontSize: '1.2rem',
                py: 2,
                px: 4,
                '&:hover': {
                  backgroundColor: '#ffcc00',
                }
              }}
            >
              {t.startGame}
            </Button>
          </Box>
        )}

        {/* New Game Button */}
        {cards.length > 0 && (
          <Box sx={{ textAlign: 'center', mb: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={initializeGame}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#ffffff',
                }
              }}
            >
              {t.newGame}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedDataType(null);
                setCards([]);
                setVocabulary([]);
                setIsRunning(false);
                setGameWon(false);
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                borderColor: '#667eea',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#ffffff',
                  borderColor: '#5568d3',
                }
              }}
            >
              {t.changeCategory}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MinigameWordMatch;
