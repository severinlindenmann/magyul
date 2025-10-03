# 🇭🇺 Magyul - Hungarian Language Learning App

A modern, interactive web application for learning Hungarian (Magyar) language. Built with React, TypeScript, and Material-UI, this app provides an engaging platform for practicing Hungarian vocabulary, verb conjugations, and grammar.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://magyul.app)
[![Firebase](https://img.shields.io/badge/Deployed%20on-Firebase-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Features

- **📚 Vocabulary Practice**: Learn Hungarian words with translations in English and German
  - Multiple categories: Family, Food, Colors, Numbers, Time, Animals, Places, Adjectives, and more
  - Example sentences in Hungarian, English, and German
  - Interactive flashcard-style learning

- **🔤 Verb Conjugation**: Master Hungarian verb forms
  - Present, past, and future tenses
  - Regular and irregular verbs
  - Personal pronouns (én, te, ő, mi, ti, ők)
  - 25+ common Hungarian verbs

- **📖 Grammar Guide**: Comprehensive grammar reference
  - Hungarian language rules and explanations
  - Easy-to-understand examples

- **🌐 Multi-language Support**: 
  - Interface and translations in Hungarian, English, and German
  - Perfect for German and English speakers learning Hungarian

- **💾 Offline Support**: 
  - IndexedDB storage for offline access
  - Progressive Web App capabilities

## 🚀 Live Demo

Visit the live application: **[magyul.app](https://magyul.app)**

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0 with TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: TanStack React Query v5
- **Database**: IndexedDB (Dexie.js)
- **HTTP Client**: Axios
- **Styling**: Emotion CSS-in-JS
- **Hosting**: Firebase Hosting
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/severinlindenmann/magyul.git
cd magyul
```

### Install Dependencies

```bash
cd frontend
npm install
```

### Run Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Build for Production

```bash
cd frontend
npm run build
```

The production-ready files will be in the `frontend/build` directory.

## 🚀 Deployment

This project is configured for Firebase Hosting.

### Deploy to Firebase

```bash
# Build the app
cd frontend
npm run build

# Deploy to Firebase
cd ..
firebase deploy
```

### Custom Domain Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to Hosting section
3. Click "Add custom domain"
4. Follow the DNS configuration instructions

## 📁 Project Structure

```
magyul/
├── frontend/
│   ├── public/
│   │   ├── data/
│   │   │   ├── verbs.json          # Hungarian verb conjugations
│   │   │   └── vocabulary.json     # Vocabulary database
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.tsx      # App navigation
│   │   ├── db/
│   │   │   └── database.ts         # IndexedDB configuration
│   │   ├── pages/
│   │   │   ├── LanguageSelection.tsx
│   │   │   ├── VocabularyPractice.tsx
│   │   │   ├── VerbConjugation.tsx
│   │   │   └── GrammarGuide.tsx
│   │   ├── services/
│   │   │   └── api.ts              # API and data services
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── firebase.json                    # Firebase configuration
├── .firebaserc                      # Firebase project settings
└── README.md
```

## 🤝 Contributing

**This is an open-source project!** Contributions, issues, and feature requests are welcome.

### How to Contribute

1. **Fork the repository**
2. **Create your feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Contribution Ideas

- Add more vocabulary words and categories
- Add more verb conjugations
- Implement quiz/test features
- Add pronunciation guides
- Improve grammar explanations
- Add mobile app support
- Implement user progress tracking
- Add gamification elements
- Translations to other languages

## 📝 License

This project is **open source** and available under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code for your own projects.

## 👨‍💻 About the Author

**Severin Lindenmann**

- 🐙 GitHub: [@severinlindenmann](https://github.com/severinlindenmann)
- 💼 LinkedIn: [@severin-lindenmann](https://www.linkedin.com/in/severin-lindenmann)
- 📧 Email: [hello@severin.io](mailto:hello@severin.io)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by the need for accessible Hungarian language learning resources
- Built with love for language learners worldwide

## 📊 Data Structure

### Vocabulary Format

```json
{
  "id": 1,
  "word_hu": "ház",
  "word_en": "house",
  "word_de": "Haus",
  "category": "family",
  "example_sentence_hu": "Ez egy nagy ház.",
  "example_sentence_en": "This is a big house.",
  "example_sentence_de": "Das ist ein großes Haus."
}
```

### Verb Format

```json
{
  "id": 1,
  "infinitive": "lenni",
  "meaning_de": "sein",
  "category": "irregular",
  "conjugations": {
    "present": {
      "en": "vagyok",
      "te": "vagy",
      "o": "van",
      "mi": "vagyunk",
      "ti": "vagytok",
      "ok": "vannak"
    }
  }
}
```

## 💡 Support

If you find this project helpful, please give it a ⭐️ on GitHub!

---

**Jó tanulást!** (Happy learning!) 🎓
