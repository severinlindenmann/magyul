import React, { useState, useRef, useEffect } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip, Paper, Table, TableHead, TableBody, TableRow, TableCell, Switch, FormControlLabel, TextField, Divider, List, ListItemButton, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


interface Props {
  language: 'en' | 'de';
  onBack: () => void;
}

const GrammarGuide: React.FC<Props> = ({ language, onBack }) => {
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const [selectedNoun, setSelectedNoun] = useState<string>('ház');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [nounFilter, setNounFilter] = useState<string>('');

  // Refs for scroll focusing from side nav
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setPanelRef = (id: string) => (el: HTMLDivElement | null) => {
    panelRefs.current[id] = el;
  };

  const scrollToPanel = (panelId: string) => {
    setExpanded(panelId);
    // allow accordion to expand before scrolling
    requestAnimationFrame(() => {
      const el = panelRefs.current[panelId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  // Keep currently expanded panel in view on small screens if user toggles
  useEffect(() => {
    if (expanded) {
      const el = panelRefs.current[expanded];
      if (el && window.innerWidth < 900) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [expanded]);

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
      verbStems: 'Finding the Verb Stem',
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
  // Overview additions
  overviewTitle: 'Essential Grammar Overview',
  overviewIntro: 'Beginners should focus on core sentence structure, the most frequent cases, and basic verb conjugations before diving into all 18 cases.',
  overviewSentenceStructure: 'Flexible SVO with topic-focus ordering. Emphasis or new info appears before the verb.',
  overviewCoreCases: 'Start with nominative (subject), accusative (direct object), dative (indirect object).',
  overviewPossession: 'Possession marked with suffixes on the noun (házam = my house).',
  overviewDefIndef: 'Verb conjugation distinguishes definite vs. indefinite objects (olvasok vs. olvasom).',
  overviewAdjectives: 'Adjectives precede nouns; agree in number/case only when inflected by case.',
  overviewNegation: 'Use "nem" before the verb for negation (nem tudom = I don\'t know).',
  overviewQuestions: 'Yes/No questions rely on intonation; open questions use interrogatives (Mi? Ki? Hol?).',
  overviewPostpositions: 'Hungarian uses postpositions/case suffixes rather than prepositions (házban = in the house).',
  overviewIrregularFocus: 'Prioritize irregular verbs: lenni, menni, jönni, enni, inni.',
  overviewTableVerbsTitle: 'Sample Verb Forms',
  overviewTableCasesTitle: 'Key Noun Cases',
  overviewVerbHeaderVerb: 'Verb',
  overviewVerbHeaderMeaning: 'Meaning',
  overviewVerbHeaderIndef: 'Present (Indef.)',
  overviewVerbHeaderDef: 'Present (Def.)',
  overviewVerbHeaderPast: 'Past',
  overviewVerbHeaderFuture: 'Future',
  overviewCaseHeaderCase: 'Case',
  overviewCaseHeaderSuffix: 'Suffix',
  overviewCaseHeaderFunction: 'Function',
  overviewCaseHeaderExample: 'Example',
  caseNominative: 'Nominative',
  caseAccusative: 'Accusative',
  caseDative: 'Dative',
  caseInstrumental: 'Instrumental',
  overviewNoteVerbDef: 'Definite forms require a specific object (olvasom a könyvet = I read the book).',
  overviewNoteInstrumental: 'Instrumental expresses means: tollal írok (I write with a pen).',
      
      regularExample: 'Regular Verb Example: "tanulni" (to learn/study)',
      irregularExample: 'Irregular Verb Example: "lenni" (to be)',
      
      verbStemsIntro: 'The verb stem is the base form you use for all conjugations. To find it:',
      verbStemsStep1: 'Remove the infinitive ending -ni',
      verbStemsStep2: 'What remains is usually your verb stem',
      verbStemsExamples: 'Examples:',
      verbStemsExample1: 'tanulni → tanul-',
      verbStemsExample2: 'dolgozni → dolgoz-',
      verbStemsExample3: 'olvasni → olvas-',
      verbStemsExample4: 'írni → ír-',
      verbStemsNote: 'Note: Some verbs undergo stem changes in certain forms (e.g., linking vowels)',
      
      moreVerbExamples: 'More Verb Examples',
      verbEszik: '"enni" (to eat) - Irregular',
      verbIszik: '"inni" (to drink) - Irregular',
      verbMegy: '"menni" (to go) - Irregular',
      verbJon: '"jönni" (to come) - Irregular',
  nounHarmonyTitle: 'Noun Suffix Vowel Harmony',
  nounHarmonyIntro: 'Hungarian nouns take different suffix variants depending on vowel harmony (back vs front, rounded vs unrounded). Below are the most common alternations.',
  nounBackVowels: 'Back vowel words (a, á, o, ó, u, ú)',
  nounFrontVowelsUnrounded: 'Front unrounded (e, é, i, í)',
  nounFrontVowelsRounded: 'Front rounded (ö, ő, ü, ű)',
  suffixHeader: 'Suffix',
  patternHeader: 'Variants & Examples',
  suffixInessive: 'In-essive (in) -ban/-ben',
  suffixAllative: 'Allative (to) -hoz/-hez/-höz',
  suffixIllative: 'Illative (into) -ba/-be',
  suffixSuperessive: 'Superessive (on) -on/-en/-ön/-n',
  suffixSublative: 'Sublative (onto) -ra/-re',
  suffixDative: 'Dative (to/for) -nak/-nek',
  suffixInstrumental: 'Instrumental -val/-vel (assimilation)',
  suffixAccusative: 'Accusative -(o)t / -(e)t',
  noteInstrumental: 'If the noun starts with a consonant, -val/-vel assimilates: kéz + -vel → kézzel, ház + -val → házzal.',
  noteSuperessive: 'Choice among -on/-en/-ön/-n depends on final vowel & phonotactics (e.g. könyvön, házon, kézen, földön).',
  examplesTitle: 'Examples',
  examplesList: 'házban (in the house), könyvben (in the book), asztalra (onto the table), kézzel (by hand), kulcshoz (to the key), kertben (in the garden)',
  quickRuleTitle: 'Quick Rules',
  quickRule1: 'Back vowel words take the back form (e.g. házban, kutyának, autóhoz).',
  quickRule2: 'Front unrounded words take the simple front form (e.g. kertben, székhez).',
  quickRule3: 'Front rounded words trigger rounded front variants (e.g. könyvhöz, tükörben).',
  quickRule4: 'Accusative: usually -t, but a linking vowel appears if needed: házat, földet, könyvet.',
  quickRule5: 'Instrumental -val/-vel assimilates the initial consonant: k + -val → -kkal; h often stays: hóval.',
  morePractice: 'Practice by grouping nouns by vowel class before adding suffixes.',
  nounsInteractiveTitle: 'Interactive Noun Table',
  nounsInteractiveIntro: 'Click a noun to see its plural and common suffix variants adapted by vowel harmony.',
  nounColumnWord: 'Word',
  nounColumnMeaning: 'Meaning',
  nounColumnClass: 'Class',
  nounColumnPlural: 'Plural',
  selectedNounTitle: 'Selected Noun',
  dynamicSuffixesTitle: 'Suffix Variants',
  dynamicPlural: 'Plural',
  dynamicInessive: 'In (inessive)',
  dynamicIllative: 'Into (illative)',
  dynamicAllative: 'To (allative)',
  dynamicSuperessive: 'On (superessive)',
  dynamicSublative: 'Onto (sublative)',
  dynamicDative: 'To/for (dative)',
  dynamicInstrumental: 'With (instrumental)',
  dynamicAccusative: 'Accusative',
  exceptionsTitle: 'Common Exceptions & Stem Changes',
  exceptionsIntro: 'Some nouns change stem or insert linking elements in plural / suffix forms.',
  possessiveTitle: 'Possessive Suffixes',
  possessiveIntro: 'Possession is marked on the noun. Endings depend on person and vowel harmony. Below: singular possessed forms.',
  possTableHeaderPerson: 'Person',
  possTableHeaderBack: 'Back',
  possTableHeaderFront: 'Front (unrounded)',
  possTableHeaderFrontRounded: 'Front (rounded)',
  possExamplesTitle: 'Examples',
  possExampleHouse: 'my house = házam, our house = házunk',
  possExampleHand: 'my hand = kezem, his hand = keze, their hands = kezeik (rare) / kezeik',
  possExampleBook: 'your (sg) book = könyved, their book = könyvük',
  possNoteLinkJ: 'If noun ends in a consonant and 3rd person suffix would begin with a vowel, often a linking -j- appears: ház + -a → háza (no j), but kulcs + -a → kulcsa; after certain stems -ja/-je used (e.g. tükör → tükre).',
  possNotePluralPossessed: 'Plural possessed adds -i- before personal endings: házaim = my houses.',
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
      verbStems: 'Den Verbstamm finden',
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
  // Overview additions
  overviewTitle: 'Wesentliche Grammatik Übersicht',
  overviewIntro: 'Anfänger fokussieren zuerst Satzstruktur, häufigste Fälle und grundlegende Verbkonjugation bevor sie alle 18 Fälle lernen.',
  overviewSentenceStructure: 'Flexibles SVO mit Thema-Fokus Ordnung. Betonung / neue Information steht vor dem Verb.',
  overviewCoreCases: 'Beginne mit Nominativ (Subjekt), Akkusativ (Objekt), Dativ (indirektes Objekt).',
  overviewPossession: 'Besitz mit Suffixen am Nomen markiert (házam = mein Haus).',
  overviewDefIndef: 'Verben unterscheiden bestimmt vs. unbestimmt (olvasok vs. olvasom).',
  overviewAdjectives: 'Adjektive stehen vor dem Nomen; Kongruenz in Zahl/Fall wenn dekliniert.',
  overviewNegation: '"nem" vor dem Verb für Negation (nem tudom = ich weiß nicht).',
  overviewQuestions: 'Ja/Nein-Fragen durch Intonation; offene Fragen mit Fragewörtern (Mi? Ki? Hol?).',
  overviewPostpositions: 'Ungarisch nutzt Postpositionen/Fallendungen statt Präpositionen (házban = im Haus).',
  overviewIrregularFocus: 'Priorisiere unregelmäßige Verben: lenni, menni, jönni, enni, inni.',
  overviewTableVerbsTitle: 'Beispiel Verbformen',
  overviewTableCasesTitle: 'Wichtige Fälle',
  overviewVerbHeaderVerb: 'Verb',
  overviewVerbHeaderMeaning: 'Bedeutung',
  overviewVerbHeaderIndef: 'Präsens (unbest.)',
  overviewVerbHeaderDef: 'Präsens (best.)',
  overviewVerbHeaderPast: 'Vergangenheit',
  overviewVerbHeaderFuture: 'Zukunft',
  overviewCaseHeaderCase: 'Fall',
  overviewCaseHeaderSuffix: 'Suffix',
  overviewCaseHeaderFunction: 'Funktion',
  overviewCaseHeaderExample: 'Beispiel',
  caseNominative: 'Nominativ',
  caseAccusative: 'Akkusativ',
  caseDative: 'Dativ',
  caseInstrumental: 'Instrumental',
  overviewNoteVerbDef: 'Bestimmte Formen verlangen ein konkretes Objekt (olvasom a könyvet = ich lese das Buch).',
  overviewNoteInstrumental: 'Instrumental drückt das Mittel aus: tollal írok (ich schreibe mit einem Stift).',
      
      regularExample: 'Regelmäßiges Verb Beispiel: "tanulni" (lernen)',
      irregularExample: 'Unregelmäßiges Verb Beispiel: "lenni" (sein)',
      
      verbStemsIntro: 'Der Verbstamm ist die Grundform, die du für alle Konjugationen verwendest. So findest du ihn:',
      verbStemsStep1: 'Entferne die Infinitivendung -ni',
      verbStemsStep2: 'Was übrig bleibt ist normalerweise dein Verbstamm',
      verbStemsExamples: 'Beispiele:',
      verbStemsExample1: 'tanulni → tanul-',
      verbStemsExample2: 'dolgozni → dolgoz-',
      verbStemsExample3: 'olvasni → olvas-',
      verbStemsExample4: 'írni → ír-',
      verbStemsNote: 'Hinweis: Einige Verben durchlaufen Stammänderungen in bestimmten Formen (z.B. Bindevokal)',
      
      moreVerbExamples: 'Weitere Verb-Beispiele',
      verbEszik: '"enni" (essen) - Unregelmäßig',
      verbIszik: '"inni" (trinken) - Unregelmäßig',
      verbMegy: '"menni" (gehen) - Unregelmäßig',
      verbJon: '"jönni" (kommen) - Unregelmäßig',
  nounHarmonyTitle: 'Vokalharmonie bei Nominal-Suffixen',
  nounHarmonyIntro: 'Ungarische Nomen nehmen unterschiedliche Suffixvarianten je nach Vokalharmonie (hintere vs. vordere, gerundet vs. ungerundet). Unten die häufigsten Alternationen.',
  nounBackVowels: 'Hintere Wörter (a, á, o, ó, u, ú)',
  nounFrontVowelsUnrounded: 'Vordere ungerundete (e, é, i, í)',
  nounFrontVowelsRounded: 'Vordere gerundete (ö, ő, ü, ű)',
  suffixHeader: 'Suffix',
  patternHeader: 'Varianten & Beispiele',
  suffixInessive: 'Inessiv (in) -ban/-ben',
  suffixAllative: 'Allativ (zu) -hoz/-hez/-höz',
  suffixIllative: 'Illativ (hinein) -ba/-be',
  suffixSuperessive: 'Superessiv (auf) -on/-en/-ön/-n',
  suffixSublative: 'Sublativ (auf ... hin) -ra/-re',
  suffixDative: 'Dativ (für/zu) -nak/-nek',
  suffixInstrumental: 'Instrumental -val/-vel (Assimilation)',
  suffixAccusative: 'Akkusativ -(o)t / -(e)t',
  noteInstrumental: 'Beginnt das Wort mit Konsonant, assimiliert -val/-vel: kéz + -vel → kézzel, ház + -val → házzal.',
  noteSuperessive: 'Wahl zwischen -on/-en/-ön/-n folgt Lautumgebung (z.B. könyvön, házon, kézen, földön).',
  examplesTitle: 'Beispiele',
  examplesList: 'házban (im Haus), könyvben (im Buch), asztalra (auf den Tisch), kézzel (mit der Hand), kulcshoz (zum Schlüssel), kertben (im Garten)',
  quickRuleTitle: 'Schnellregeln',
  quickRule1: 'Hintere Wörter → hintere Variante (házban, kutyának, autóhoz).',
  quickRule2: 'Vordere ungerundete → einfache vordere Variante (kertben, székhez).',
  quickRule3: 'Vordere gerundete → gerundete Variante (könyvhöz, tükörben).',
  quickRule4: 'Akkusativ: meist -t, mit Bindevokal falls nötig: házat, földet, könyvet.',
  quickRule5: 'Instrumental -val/-vel Konsonantenassimilation: k + -val → -kkal; h oft unverändert: hóval.',
  morePractice: 'Übe, indem du Nomen erst nach Vokalklasse gruppierst, dann Suffixe anfügst.',
  nounsInteractiveTitle: 'Interaktive Nomen-Tabelle',
  nounsInteractiveIntro: 'Klicke ein Nomen, um Plural und häufige Suffixvarianten (Vokalharmonie) zu sehen.',
  nounColumnWord: 'Wort',
  nounColumnMeaning: 'Bedeutung',
  nounColumnClass: 'Klasse',
  nounColumnPlural: 'Plural',
  selectedNounTitle: 'Ausgewähltes Nomen',
  dynamicSuffixesTitle: 'Suffixvarianten',
  dynamicPlural: 'Plural',
  dynamicInessive: 'In (Inessiv)',
  dynamicIllative: 'Hinein (Illativ)',
  dynamicAllative: 'Zu (Allativ)',
  dynamicSuperessive: 'Auf (Superessiv)',
  dynamicSublative: 'Auf ... hin (Sublativ)',
  dynamicDative: 'Für/ZU (Dativ)',
  dynamicInstrumental: 'Mit (Instrumental)',
  dynamicAccusative: 'Akkusativ',
  exceptionsTitle: 'Ausnahmen & Stammänderungen',
  exceptionsIntro: 'Einige Nomen ändern den Stamm oder fügen Bindeelemente ein.',
  possessiveTitle: 'Possessiv-Suffixe',
  possessiveIntro: 'Besitz wird am Nomen markiert. Endungen hängen von Person und Vokalharmonie ab. Unten: Singular besessen.',
  possTableHeaderPerson: 'Person',
  possTableHeaderBack: 'Hinter (Vokal)',
  possTableHeaderFront: 'Vorder (unger.)',
  possTableHeaderFrontRounded: 'Vorder (ger.)',
  possExamplesTitle: 'Beispiele',
  possExampleHouse: 'mein Haus = házam, unser Haus = házunk',
  possExampleHand: 'meine Hand = kezem, seine Hand = keze, ihre Hände = kezeik (selten)',
  possExampleBook: 'dein Buch = könyved, ihr Buch = könyvük',
  possNoteLinkJ: 'Wenn das Nomen auf Konsonant endet und die 3. Person-Suffix mit Vokal beginnt, erscheint oft -j-: (kulcs → kulcsa). Einige wie tükör verlieren Vokal: tükör → tükre.',
  possNotePluralPossessed: 'Plural des Besitzes fügt -i- vor den Personalendungen ein: házaim = meine Häuser.',
    }
  };

  const t = translations[language];

  // Noun dataset with basic vowel class tagging
  interface NounEntry {
    word: string;
    meaning: string;
    cls: 'back' | 'front' | 'front-rounded';
    plural: string; // regular plural form
  }
  const nouns: NounEntry[] = [
    { word: 'ház', meaning: language === 'en' ? 'house' : 'Haus', cls: 'back', plural: 'házak' },
    { word: 'kert', meaning: language === 'en' ? 'garden' : 'Garten', cls: 'front', plural: 'kertek' },
    { word: 'könyv', meaning: language === 'en' ? 'book' : 'Buch', cls: 'front-rounded', plural: 'könyvek' },
    { word: 'kulcs', meaning: language === 'en' ? 'key' : 'Schlüssel', cls: 'back', plural: 'kulcsok' },
    { word: 'kéz', meaning: language === 'en' ? 'hand' : 'Hand', cls: 'front', plural: 'kezek' },
    { word: 'tükör', meaning: language === 'en' ? 'mirror' : 'Spiegel', cls: 'front-rounded', plural: 'tükrök' },
    { word: 'barát', meaning: language === 'en' ? 'friend' : 'Freund', cls: 'back', plural: 'barátok' },
    { word: 'ember', meaning: language === 'en' ? 'person' : 'Mensch', cls: 'front', plural: 'emberek' },
    { word: 'ló', meaning: language === 'en' ? 'horse' : 'Pferd', cls: 'back', plural: 'lovak' },
    { word: 'fül', meaning: language === 'en' ? 'ear' : 'Ohr', cls: 'front-rounded', plural: 'fülek' }
  ];

  const filteredNouns = nouns.filter(n => n.word.toLowerCase().includes(nounFilter.toLowerCase()) || n.meaning.toLowerCase().includes(nounFilter.toLowerCase()));

  const noun = nouns.find(n => n.word === selectedNoun) || nouns[0];

  // Build suffix forms dynamically
  function buildForms(n: NounEntry) {
    const base = n.word;
    const cls = n.cls;
    const lastVowel = base.match(/[aáeéiíoóöőuúüű]/g)?.pop() || 'a';
    const endsConsonant = /[^aáeéiíoóöőuúüű]$/.test(base);

    const inessive = cls === 'back' ? base + 'ban' : base + 'ben';
    const illative = cls === 'back' ? base + 'ba' : base + 'be';
    const dative = cls === 'back' ? base + 'nak' : base + 'nek';
    const allative = cls === 'back' ? base + 'hoz' : (cls === 'front' ? base + 'hez' : base + 'höz');
    const sublative = cls === 'back' ? base + 'ra' : base + 're';

    // Superessive logic simplified
    let superessive: string;
    if (/[aáoóuú]$/.test(lastVowel)) superessive = base + 'on';
    else if (/[eéií]$/.test(lastVowel)) superessive = base + 'en';
    else superessive = base + 'ön';

    // Instrumental with assimilation
    let instrumental: string;
    if (endsConsonant) {
      const last = base.slice(-1);
      if (/([bcdfgjkptvzs]|sz|zs|cs)$/.test(last)) instrumental = base + last + 'al';
      else if (last === 'z') instrumental = base + 'zal';
      else instrumental = base + 'val';
    } else {
      instrumental = base + 'val';
    }

    // Accusative: linking vowel if ends in consonant and no long final vowel
    let accusative: string;
    if (endsConsonant) {
      const link = cls === 'back' ? 'o' : 'e';
      // Some known stems use stem change (ló → lovat, ember → embert already direct), quick overrides
      if (base === 'ló') accusative = 'lovat';
      else if (base === 'ember') accusative = 'embert';
      else if (base === 'tükör') accusative = 'tükröt';
      else if (base === 'kéz') accusative = 'kezet';
      else if (base === 'kulcs') accusative = 'kulcsot';
      else accusative = base + link + 't';
    } else {
      accusative = base + 't';
    }

    // Plural overrides for irregular already stored
    const plural = n.plural;

    return {
      plural,
      inessive,
      illative,
      allative,
      superessive,
      sublative,
      dative,
      instrumental,
      accusative
    };
  }

  const forms = buildForms(noun);

  const nounClassColor = (cls: NounEntry['cls']) => {
    switch (cls) {
      case 'back': return 'warning';
      case 'front': return 'info';
      case 'front-rounded': return 'secondary';
      default: return 'default';
    }
  };

  interface ExceptionEntry { base: string; plural: string; note: string; }
  const exceptions: ExceptionEntry[] = [
    { base: 'ember', plural: 'emberek', note: language === 'en' ? 'vowel insertion -e-' : 'Vokaleinschub -e-' },
    { base: 'ló', plural: 'lovak', note: language === 'en' ? 'stem change ló→lov-' : 'Stammwechsel ló→lov-' },
    { base: 'tükör', plural: 'tükrök', note: language === 'en' ? 'vowel drop tükör→tükr-' : 'Vokalverlust tükör→tükr-' },
    { base: 'kéz', plural: 'kezek', note: language === 'en' ? 'irregular accusative kezet' : 'irreg. Akkusativ kezet' },
    { base: 'barát', plural: 'barátok', note: language === 'en' ? 'regular but compound forms barátnő' : 'regelmäßig; Komposita barátnő' }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Side Navigation */}
      <Box sx={{ width: 240, display: { xs: 'none', md: 'block' }, borderRight: 1, borderColor: 'divider', p: 2, position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>{language === 'en' ? 'Contents' : 'Inhalt'}</Typography>
        <List dense>
          {[
            { id: 'panel0', label: language === 'en' ? 'Overview' : 'Übersicht' },
            { id: 'panel1', label: language === 'en' ? 'Present' : 'Präsens' },
            { id: 'panel2', label: language === 'en' ? 'Past' : 'Vergangenheit' },
            { id: 'panel3', label: language === 'en' ? 'Future' : 'Zukunft' },
            { id: 'panel4', label: language === 'en' ? 'Verb Stems' : 'Verbstämme' },
            { id: 'panel5', label: language === 'en' ? 'Irregular Verbs' : 'Unregelmäßige Verben' },
            { id: 'panel7', label: language === 'en' ? 'Noun Harmony' : 'Nomen Harmonie' },
            ...(showAdvanced ? [
              { id: 'panel8', label: language === 'en' ? 'Interactive Nouns' : 'Interaktive Nomen' },
              { id: 'panel9', label: language === 'en' ? 'Exceptions' : 'Ausnahmen' },
              { id: 'panel10', label: language === 'en' ? 'Possessives' : 'Possessiva' },
            ] : []),
            { id: 'panel6', label: language === 'en' ? 'Tips' : 'Tipps' },
          ].map(item => (
            <ListItemButton key={item.id} selected={expanded === item.id} onClick={() => scrollToPanel(item.id)} sx={{ borderRadius: 1 }}>
              <ListItemText primaryTypographyProps={{ fontSize: 14 }} primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <FormControlLabel control={<Switch checked={showAdvanced} onChange={(e) => setShowAdvanced(e.target.checked)} />} label={language === 'en' ? 'Advanced' : 'Erweitert'} />
      </Box>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 }, py: 2 }}>
        <Box sx={{ mt: { xs: 2, sm: 4 }, mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={onBack} 
          startIcon={<ArrowBackIcon />} 
          size="small"
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          {t.back}
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'common.white' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '3rem' } }}>
          {t.title}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {t.subtitle}
        </Typography>
        <Box sx={{ mt: 2, display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between' }}>
          <FormControlLabel sx={{ ml: 0 }} control={<Switch size="small" checked={showAdvanced} onChange={(e) => setShowAdvanced(e.target.checked)} />} label={language === 'en' ? 'Advanced' : 'Erweitert'} />
        </Box>
      </Paper>

      {/* Overview */}
      <Box ref={setPanelRef('panel0')}>
      <Accordion expanded={expanded === 'panel0'} onChange={handleChange('panel0')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{t.overviewTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.overviewIntro}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Typography variant="body2">• {t.overviewSentenceStructure}</Typography>
            <Typography variant="body2">• {t.overviewCoreCases}</Typography>
            <Typography variant="body2">• {t.overviewDefIndef}</Typography>
            <Typography variant="body2">• {t.overviewPossession}</Typography>
            <Typography variant="body2">• {t.overviewAdjectives}</Typography>
            <Typography variant="body2">• {t.overviewNegation}</Typography>
            <Typography variant="body2">• {t.overviewQuestions}</Typography>
            <Typography variant="body2">• {t.overviewPostpositions}</Typography>
            <Typography variant="body2">• {t.overviewIrregularFocus}</Typography>
          </Box>
          <Typography variant="h6" gutterBottom>{t.overviewTableVerbsTitle}</Typography>
          <Table size="small" sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t.overviewVerbHeaderVerb}</TableCell>
                <TableCell>{t.overviewVerbHeaderMeaning}</TableCell>
                <TableCell>{t.overviewVerbHeaderIndef}</TableCell>
                <TableCell>{t.overviewVerbHeaderDef}</TableCell>
                <TableCell>{t.overviewVerbHeaderPast}</TableCell>
                <TableCell>{t.overviewVerbHeaderFuture}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>olvas</TableCell>
                <TableCell>{language === 'en' ? 'read' : 'lesen'}</TableCell>
                <TableCell>olvasok</TableCell>
                <TableCell>olvasom</TableCell>
                <TableCell>olvastam</TableCell>
                <TableCell>fogok olvasni</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>lenni</TableCell>
                <TableCell>{language === 'en' ? 'to be' : 'sein'}</TableCell>
                <TableCell>vagyok</TableCell>
                <TableCell>-</TableCell>
                <TableCell>voltam</TableCell>
                <TableCell>leszek</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>menni</TableCell>
                <TableCell>{language === 'en' ? 'to go' : 'gehen'}</TableCell>
                <TableCell>megyek</TableCell>
                <TableCell>-</TableCell>
                <TableCell>mentem</TableCell>
                <TableCell>fogok menni</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>enni</TableCell>
                <TableCell>{language === 'en' ? 'to eat' : 'essen'}</TableCell>
                <TableCell>eszem</TableCell>
                <TableCell>eszem</TableCell>
                <TableCell>ettem</TableCell>
                <TableCell>fogok enni</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>inni</TableCell>
                <TableCell>{language === 'en' ? 'to drink' : 'trinken'}</TableCell>
                <TableCell>iszom</TableCell>
                <TableCell>iszom</TableCell>
                <TableCell>ittam</TableCell>
                <TableCell>fogok inni</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography variant="caption" display="block" sx={{ mb: 3, fontStyle: 'italic' }}>{t.overviewNoteVerbDef}</Typography>
          <Typography variant="h6" gutterBottom>{t.overviewTableCasesTitle}</Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t.overviewCaseHeaderCase}</TableCell>
                <TableCell>{t.overviewCaseHeaderSuffix}</TableCell>
                <TableCell>{t.overviewCaseHeaderFunction}</TableCell>
                <TableCell>{t.overviewCaseHeaderExample}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{t.caseNominative}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{language === 'en' ? 'subject' : 'Subjekt'}</TableCell>
                <TableCell>a fiú (the boy)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t.caseAccusative}</TableCell>
                <TableCell>-t / -(o/e) t</TableCell>
                <TableCell>{language === 'en' ? 'direct object' : 'direktes Objekt'}</TableCell>
                <TableCell>a fiút (the boy)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t.caseDative}</TableCell>
                <TableCell>-nak/-nek</TableCell>
                <TableCell>{language === 'en' ? 'indirect object' : 'indirektes Objekt'}</TableCell>
                <TableCell>a fiúnak (to the boy)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t.caseInstrumental}</TableCell>
                <TableCell>-val/-vel</TableCell>
                <TableCell>{language === 'en' ? 'means / with' : 'Mittel / mit'}</TableCell>
                <TableCell>házzal (with a house)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography variant="caption" display="block" sx={{ fontStyle: 'italic' }}>{t.overviewNoteInstrumental}</Typography>
        </AccordionDetails>
      </Accordion>
      </Box>

      {/* Present Tense */}
  <Box ref={setPanelRef('panel1')}>
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
  </Box>

      {/* Past Tense */}
  <Box ref={setPanelRef('panel2')}>
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
  </Box>

      {/* Future Tense */}
  <Box ref={setPanelRef('panel3')}>
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
  </Box>

      {/* Verb Stems */}
  <Box ref={setPanelRef('panel4')}>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t.verbStems}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.verbStemsIntro}</Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>1.</strong> {t.verbStemsStep1}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>2.</strong> {t.verbStemsStep2}
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">{t.verbStemsExamples}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography>• {t.verbStemsExample1}</Typography>
                <Typography>• {t.verbStemsExample2}</Typography>
                <Typography>• {t.verbStemsExample3}</Typography>
                <Typography>• {t.verbStemsExample4}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                {t.verbStemsNote}
              </Typography>
            </CardContent>
          </Card>
        </AccordionDetails>
  </Accordion>
  </Box>

      {/* Irregular Verbs */}
  <Box ref={setPanelRef('panel5')}>
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} sx={{ mb: 2 }}>
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
  </Box>

      {/* Noun Vowel Harmony */}
  <Box ref={setPanelRef('panel7')}>
      <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t.nounHarmonyTitle}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.nounHarmonyIntro}</Typography>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>{t.quickRuleTitle}</Typography>
              <ul style={{ marginTop: 0 }}>
                <li><Typography variant="body2">{t.quickRule1}</Typography></li>
                <li><Typography variant="body2">{t.quickRule2}</Typography></li>
                <li><Typography variant="body2">{t.quickRule3}</Typography></li>
                <li><Typography variant="body2">{t.quickRule4}</Typography></li>
                <li><Typography variant="body2">{t.quickRule5}</Typography></li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t.suffixHeader}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 1 }}>
                <Typography variant="subtitle2">{t.suffixInessive}</Typography>
                <Typography>házban / kertben</Typography>
                <Typography variant="subtitle2">{t.suffixIllative}</Typography>
                <Typography>házba / kertbe</Typography>
                <Typography variant="subtitle2">{t.suffixAllative}</Typography>
                <Typography>házhoz / székhez / könyvhöz</Typography>
                <Typography variant="subtitle2">{t.suffixSuperessive}</Typography>
                <Typography>házon, kézen, könyvön, földön</Typography>
                <Typography variant="subtitle2">{t.suffixSublative}</Typography>
                <Typography>asztalra / székre</Typography>
                <Typography variant="subtitle2">{t.suffixDative}</Typography>
                <Typography>fiúnak / szemnek</Typography>
                <Typography variant="subtitle2">{t.suffixInstrumental}</Typography>
                <Typography>kézzel, házzal, kulccsal</Typography>
                <Typography variant="subtitle2">{t.suffixAccusative}</Typography>
                <Typography>házat, földet, könyvet</Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>{t.noteInstrumental}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{t.noteSuperessive}</Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>{t.examplesTitle}</Typography>
              <Typography>{t.examplesList}</Typography>
              <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>{t.morePractice}</Typography>
            </CardContent>
          </Card>
        </AccordionDetails>
  </Accordion>
  </Box>

      {/* Interactive Noun Table */}
      {showAdvanced && (
  <Box ref={setPanelRef('panel8')}>
      <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{t.nounsInteractiveTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.nounsInteractiveIntro}</Typography>
          <TextField size="small" value={nounFilter} onChange={(e) => setNounFilter(e.target.value)} label={language === 'en' ? 'Filter nouns' : 'Nomen filtern'} fullWidth sx={{ mb: 2 }} />
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t.nounColumnWord}</TableCell>
                    <TableCell>{t.nounColumnMeaning}</TableCell>
                    <TableCell>{t.nounColumnClass}</TableCell>
                    <TableCell>{t.nounColumnPlural}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNouns.map(n => (
                    <TableRow key={n.word} hover selected={n.word === selectedNoun} onClick={() => setSelectedNoun(n.word)} style={{ cursor: 'pointer' }}>
                      <TableCell>{n.word}</TableCell>
                      <TableCell>{n.meaning}</TableCell>
                      <TableCell><Chip size="small" color={nounClassColor(n.cls) as any} label={n.cls} /></TableCell>
                      <TableCell>{n.plural}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>{t.selectedNounTitle}: {noun.word}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Typography variant="subtitle2">{t.dynamicPlural}</Typography><Typography>{forms.plural}</Typography>
                <Typography variant="subtitle2">{t.dynamicInessive}</Typography><Typography>{forms.inessive}</Typography>
                <Typography variant="subtitle2">{t.dynamicIllative}</Typography><Typography>{forms.illative}</Typography>
                <Typography variant="subtitle2">{t.dynamicAllative}</Typography><Typography>{forms.allative}</Typography>
                <Typography variant="subtitle2">{t.dynamicSuperessive}</Typography><Typography>{forms.superessive}</Typography>
                <Typography variant="subtitle2">{t.dynamicSublative}</Typography><Typography>{forms.sublative}</Typography>
                <Typography variant="subtitle2">{t.dynamicDative}</Typography><Typography>{forms.dative}</Typography>
                <Typography variant="subtitle2">{t.dynamicInstrumental}</Typography><Typography>{forms.instrumental}</Typography>
                <Typography variant="subtitle2">{t.dynamicAccusative}</Typography><Typography>{forms.accusative}</Typography>
              </Box>
            </CardContent>
          </Card>
        </AccordionDetails>
  </Accordion>
  </Box>
  )}

      {/* Exceptions */}
      {showAdvanced && (
  <Box ref={setPanelRef('panel9')}>
      <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{t.exceptionsTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.exceptionsIntro}</Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Base</TableCell>
                <TableCell>{t.nounColumnPlural}</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exceptions.map(ex => (
                <TableRow key={ex.base}>
                  <TableCell>{ex.base}</TableCell>
                  <TableCell>{ex.plural}</TableCell>
                  <TableCell>{ex.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
  </Accordion>
  </Box>
  )}

      {/* Possessive Suffixes */}
      {showAdvanced && (
  <Box ref={setPanelRef('panel10')}>
      <Accordion expanded={expanded === 'panel10'} onChange={handleChange('panel10')} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{t.possessiveTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>{t.possessiveIntro}</Typography>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t.possTableHeaderPerson}</TableCell>
                    <TableCell>{t.possTableHeaderBack}</TableCell>
                    <TableCell>{t.possTableHeaderFront}</TableCell>
                    <TableCell>{t.possTableHeaderFrontRounded}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>1sg</TableCell><TableCell>-om</TableCell><TableCell>-em</TableCell><TableCell>-öm</TableCell></TableRow>
                  <TableRow><TableCell>2sg</TableCell><TableCell>-od</TableCell><TableCell>-ed</TableCell><TableCell>-öd</TableCell></TableRow>
                  <TableRow><TableCell>3sg</TableCell><TableCell>-a / -ja</TableCell><TableCell>-e / -je</TableCell><TableCell>-e / -je</TableCell></TableRow>
                  <TableRow><TableCell>1pl</TableCell><TableCell>-unk</TableCell><TableCell>-ünk</TableCell><TableCell>-ünk</TableCell></TableRow>
                  <TableRow><TableCell>2pl</TableCell><TableCell>-otok</TableCell><TableCell>-etek</TableCell><TableCell>-ötök</TableCell></TableRow>
                  <TableRow><TableCell>3pl</TableCell><TableCell>-uk / -juk</TableCell><TableCell>-ük / -jük</TableCell><TableCell>-ük / -jük</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t.possExamplesTitle}</Typography>
              <Typography>{t.possExampleHouse}</Typography>
              <Typography>{t.possExampleHand}</Typography>
              <Typography>{t.possExampleBook}</Typography>
            </CardContent>
          </Card>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{t.possNoteLinkJ}</Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>{t.possNotePluralPossessed}</Typography>
        </AccordionDetails>
  </Accordion>
  </Box>
  )}

      {/* Learning Tips */}
  <Box ref={setPanelRef('panel6')}>
      <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')} sx={{ mb: 4 }}>
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
  </Box>
      </Container>
    </Box>
  );
};

export default GrammarGuide;
