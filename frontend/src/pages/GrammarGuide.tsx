import React, { useState } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
  language: 'en' | 'de';
  onBack: () => void;
}

const GrammarGuide: React.FC<Props> = ({ language, onBack }) => {
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const translations = {
    en: {
      title: 'Hungarian Verb Conjugation Guide',
      subtitle: 'Understanding verb endings and conjugation patterns',
      back: 'Back',
      present: 'Present Tense',
      past: 'Past Tense',
      future: 'Future Tense',
      regularVerbs: 'Regular Verbs',
      irregularVerbs: 'Irregular Verbs',
      tips: 'Learning Tips',
      presentDesc: 'Present tense endings vary based on verb type and harmony',
      pastDesc: 'Past tense is formed by adding specific endings to the verb stem',
      futureDesc: 'Future tense uses the auxiliary verb "fog" + infinitive',
      
      // Present tense section
      presentIntro: 'Hungarian verbs in present tense follow patterns based on vowel harmony:',
      backVowels: 'Back Vowels (a, á, o, ó, u, ú)',
      frontVowels: 'Front Vowels (e, é, i, í, ö, ő, ü, ű)',
      
      presentEndingsBack: 'Present Tense Endings (Back Vowels)',
      presentEndingsFront: 'Present Tense Endings (Front Vowels)',
      
      person1sg: 'I (én)',
      person2sg: 'You (te)',
      person3sg: 'He/She/It (ő)',
      person1pl: 'We (mi)',
      person2pl: 'You (ti)',
      person3pl: 'They (ők)',
      
      exampleVerb: 'Example',
      
      // Past tense section
      pastIntro: 'Past tense is formed by adding -t or -tt to the verb stem, followed by personal endings:',
      pastEndings: 'Past Tense Endings',
      
      // Future tense section
      futureIntro: 'Future tense uses "fog" (will) conjugated + infinitive verb:',
      futurePattern: 'Pattern: [conjugated fog] + [infinitive]',
      
      // Tips section
      tip1Title: '1. Vowel Harmony',
      tip1: 'Hungarian follows vowel harmony - back vowels (a, o, u) and front vowels (e, i, ö, ü) don\'t usually mix in suffixes.',
      
      tip2Title: '2. Verb Stems',
      tip2: 'Learn to identify the verb stem (remove infinitive -ni ending). This is your base for all conjugations.',
      
      tip3Title: '3. Common Patterns',
      tip3: 'Most verbs follow regular patterns. Master the regular conjugations first, then learn exceptions.',
      
      tip4Title: '4. Practice with Context',
      tip4: 'Use complete sentences when practicing. This helps you remember conjugations naturally.',
      
      tip5Title: '5. Learn Irregular Verbs',
      tip5: 'Common irregular verbs like "lenni" (to be), "menni" (to go), "jönni" (to come) must be memorized.',
      
      regularExample: 'Regular Verb Example: "tanulni" (to learn/study)',
      irregularExample: 'Irregular Verb Example: "lenni" (to be)',
    },
    de: {
      title: 'Ungarische Verb-Konjugation Leitfaden',
      subtitle: 'Verstehen von Verb-Endungen und Konjugationsmustern',
      back: 'Zurück',
      present: 'Präsens',
      past: 'Vergangenheit',
      future: 'Zukunft',
      regularVerbs: 'Regelmäßige Verben',
      irregularVerbs: 'Unregelmäßige Verben',
      tips: 'Lerntipps',
      presentDesc: 'Präsensendungen variieren je nach Verbtyp und Harmonie',
      pastDesc: 'Vergangenheit wird durch Hinzufügen spezifischer Endungen zum Verbstamm gebildet',
      futureDesc: 'Zukunft verwendet das Hilfsverb "fog" + Infinitiv',
      
      // Present tense section
      presentIntro: 'Ungarische Verben im Präsens folgen Mustern basierend auf Vokalharmonie:',
      backVowels: 'Hintere Vokale (a, á, o, ó, u, ú)',
      frontVowels: 'Vordere Vokale (e, é, i, í, ö, ő, ü, ű)',
      
      presentEndingsBack: 'Präsensendungen (Hintere Vokale)',
      presentEndingsFront: 'Präsensendungen (Vordere Vokale)',
      
      person1sg: 'ich (én)',
      person2sg: 'du (te)',
      person3sg: 'er/sie/es (ő)',
      person1pl: 'wir (mi)',
      person2pl: 'ihr (ti)',
      person3pl: 'sie (ők)',
      
      exampleVerb: 'Beispiel',
      
      // Past tense section
      pastIntro: 'Vergangenheit wird durch Hinzufügen von -t oder -tt zum Verbstamm gebildet, gefolgt von Personalendungen:',
      pastEndings: 'Vergangenheitsendungen',
      
      // Future tense section
      futureIntro: 'Zukunft verwendet "fog" (werden) konjugiert + Infinitiv:',
      futurePattern: 'Muster: [konjugiertes fog] + [Infinitiv]',
      
      // Tips section
      tip1Title: '1. Vokalharmonie',
      tip1: 'Ungarisch folgt der Vokalharmonie - hintere Vokale (a, o, u) und vordere Vokale (e, i, ö, ü) mischen sich normalerweise nicht in Suffixen.',
      
      tip2Title: '2. Verbstämme',
      tip2: 'Lerne den Verbstamm zu identifizieren (entferne die Infinitivendung -ni). Dies ist deine Basis für alle Konjugationen.',
      
      tip3Title: '3. Häufige Muster',
      tip3: 'Die meisten Verben folgen regelmäßigen Mustern. Meistere zuerst die regelmäßigen Konjugationen, dann lerne Ausnahmen.',
      
      tip4Title: '4. Üben mit Kontext',
      tip4: 'Verwende vollständige Sätze beim Üben. Das hilft dir, Konjugationen natürlich zu merken.',
      
      tip5Title: '5. Lerne unregelmäßige Verben',
      tip5: 'Häufige unregelmäßige Verben wie "lenni" (sein), "menni" (gehen), "jönni" (kommen) müssen auswendig gelernt werden.',
      
      regularExample: 'Regelmäßiges Verb Beispiel: "tanulni" (lernen)',
      irregularExample: 'Unregelmäßiges Verb Beispiel: "lenni" (sein)',
    }
  };

  const t = translations[language];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Button variant="outlined" onClick={onBack} startIcon={<ArrowBackIcon />}>
          {t.back}
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Typography variant="h3" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
          {t.title}
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          {t.subtitle}
        </Typography>
      </Paper>

      {/* Present Tense */}
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t.present}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.presentIntro}</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Chip label={t.backVowels} color="primary" sx={{ mr: 1, mb: 1 }} />
            <Chip label={t.frontVowels} color="secondary" sx={{ mb: 1 }} />
          </Box>

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">{t.presentEndingsBack}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 1, mb: 2 }}>
                <Typography><strong>{t.person1sg}:</strong></Typography>
                <Typography>-ok, -ak</Typography>
                <Typography><strong>{t.person2sg}:</strong></Typography>
                <Typography>-sz, -asz, -esz</Typography>
                <Typography><strong>{t.person3sg}:</strong></Typography>
                <Typography>(stem only)</Typography>
                <Typography><strong>{t.person1pl}:</strong></Typography>
                <Typography>-unk, -ünk</Typography>
                <Typography><strong>{t.person2pl}:</strong></Typography>
                <Typography>-tok, -tek, -tök</Typography>
                <Typography><strong>{t.person3pl}:</strong></Typography>
                <Typography>-nak, -nek</Typography>
              </Box>
              
              <Typography variant="subtitle2" color="primary" gutterBottom>{t.regularExample}: "tanulni" (to learn)</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography>tanulok</Typography>
                <Typography>tanulunk</Typography>
                <Typography>tanulsz</Typography>
                <Typography>tanultok</Typography>
                <Typography>tanul</Typography>
                <Typography>tanulnak</Typography>
              </Box>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Past Tense */}
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t.past}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.pastIntro}</Typography>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">{t.pastEndings}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 1, mb: 2 }}>
                <Typography><strong>{t.person1sg}:</strong></Typography>
                <Typography>-tam, -tem</Typography>
                <Typography><strong>{t.person2sg}:</strong></Typography>
                <Typography>-tál, -tél</Typography>
                <Typography><strong>{t.person3sg}:</strong></Typography>
                <Typography>-t, -tt</Typography>
                <Typography><strong>{t.person1pl}:</strong></Typography>
                <Typography>-tunk, -tünk</Typography>
                <Typography><strong>{t.person2pl}:</strong></Typography>
                <Typography>-tatok, -tetek</Typography>
                <Typography><strong>{t.person3pl}:</strong></Typography>
                <Typography>-tak, -tek</Typography>
              </Box>
              
              <Typography variant="subtitle2" color="primary" gutterBottom>{t.regularExample}: "tanulni" → "tanult-"</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography>tanultam</Typography>
                <Typography>tanultunk</Typography>
                <Typography>tanultál</Typography>
                <Typography>tanultatok</Typography>
                <Typography>tanult</Typography>
                <Typography>tanultak</Typography>
              </Box>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Future Tense */}
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t.future}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.futureIntro}</Typography>
          <Typography variant="subtitle1" color="primary" gutterBottom>{t.futurePattern}</Typography>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                {t.exampleVerb}: "tanulni" (to learn)
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography>fogok tanulni</Typography>
                <Typography>fogunk tanulni</Typography>
                <Typography>fogsz tanulni</Typography>
                <Typography>fogtok tanulni</Typography>
                <Typography>fog tanulni</Typography>
                <Typography>fognak tanulni</Typography>
              </Box>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Irregular Verbs */}
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t.irregularVerbs}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                {t.irregularExample}: "lenni" (to be)
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>{t.present}:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography>vagyok</Typography>
                <Typography>vagyunk</Typography>
                <Typography>vagy</Typography>
                <Typography>vagytok</Typography>
                <Typography>van</Typography>
                <Typography>vannak</Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>{t.past}:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography>voltam</Typography>
                <Typography>voltunk</Typography>
                <Typography>voltál</Typography>
                <Typography>voltatok</Typography>
                <Typography>volt</Typography>
                <Typography>voltak</Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>{t.future}:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography>leszek</Typography>
                <Typography>leszünk</Typography>
                <Typography>leszel</Typography>
                <Typography>lesztek</Typography>
                <Typography>lesz</Typography>
                <Typography>lesznek</Typography>
              </Box>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Learning Tips */}
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} sx={{ mb: 4 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t.tips}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2, bgcolor: 'primary.light' }}>
              <Typography variant="h6" gutterBottom color="primary.dark">{t.tip1Title}</Typography>
              <Typography>{t.tip1}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: 'secondary.light' }}>
              <Typography variant="h6" gutterBottom color="secondary.dark">{t.tip2Title}</Typography>
              <Typography>{t.tip2}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
              <Typography variant="h6" gutterBottom color="success.dark">{t.tip3Title}</Typography>
              <Typography>{t.tip3}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
              <Typography variant="h6" gutterBottom color="info.dark">{t.tip4Title}</Typography>
              <Typography>{t.tip4}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
              <Typography variant="h6" gutterBottom color="warning.dark">{t.tip5Title}</Typography>
              <Typography>{t.tip5}</Typography>
            </Paper>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default GrammarGuide;
