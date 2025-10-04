<div align="center">

# 🇭🇺 Magyul – Hungarian Language Learning App

A modern, interactive Progressive Web App for learning Hungarian (Magyar). Built with React + TypeScript + MUI, featuring vocabulary drills, verb conjugation practice, grammar explanations, and offline support.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://magyul.app)
[![Firebase](https://img.shields.io/badge/Hosting-Firebase-orange)](https://firebase.google.com/)
[![Tech React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-7-blue)](https://mui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)

</div>

---

## � Table of Contents

1. [Features](#-features)
2. [Live Demo](#-live-demo)
3. [Tech Stack](#-tech-stack)
4. [Getting Started](#-getting-started)
5. [Scripts](#-scripts)
6. [Project Structure](#-project-structure)
7. [Architecture & Data Flow](#-architecture--data-flow)
8. [Offline & PWA Capabilities](#-offline--pwa-capabilities)
9. [Data Formats](#-data-formats)
10. [Roadmap](#-roadmap)
11. [Contributing](#-contributing)
12. [License](#-license)
13. [Author](#-about-the-author)
14. [Support](#-support)

---

## 🌟 Features

### Core Learning Modules
- **📚 Vocabulary Practice** – Category-based flashcards with example sentences (Hungarian / English / German)
- **🔤 Verb Conjugation Trainer** – Present (and extensible to past/future), pronoun-aware inputs (én, te, ő, mi, ti, ők)
- **📖 Grammar Guide** – Collapsible sections for progressive disclosure of complex rules
- **🎯 Mini Games** – Word matching / recognition exercises (extensible framework)

### Platform Features
- **🌐 Multilingual Interface** (HU / EN / DE)
- **💾 Offline First** via IndexedDB (Dexie) + service worker precaching
- **⚡ Fast Data Access** using React Query caching strategies
- **� Installable** as a PWA on desktop & mobile
- **♻️ Incremental Vocabulary Loading** (split JSON chunks 1–20 for faster initial load)
- **🔍 Extensible Data Model** for new categories / verb tenses

---

## 🚀 Live Demo

Visit: **https://magyul.app**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, MUI 7, Emotion |
| State / Data | TanStack React Query 5, local component state |
| Persistence | IndexedDB (Dexie) |
| Networking | Axios (fetching static JSON assets) |
| Tooling | Create React App (rewired), TypeScript 4.9 |
| Build Customization | `react-app-rewired` + `customize-cra` |
| Hosting | Firebase Hosting |

---

## 📦 Getting Started

### Prerequisites
- Node.js >= 16
- npm (or yarn / pnpm – adjust commands accordingly)

### Clone & Install
```bash
git clone https://github.com/severinlindenmann/magyul.git
cd magyul/frontend
npm install
```

### Run Dev Server
```bash
npm start
```
App opens at: http://localhost:3000

### Build Production Bundle
```bash
npm run build
```
Outputs to `frontend/build`.

### Deploy (Firebase Hosting)
```bash
cd frontend
npm run build
cd ..
firebase deploy
```

---

## 🧾 Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Start development server (CRA with overrides) |
| `npm run build` | Production build with service worker generation |
| `npm test` | Run test suite (Jest + Testing Library) |
| `npm run eject` | Eject CRA configuration (irreversible) |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── data/
│       ├── verbs.json              # Verb base + conjugations
│       ├── numbers.json            # Number practice data
│       └── vocabulary/             # Split vocabulary chunks (1–20)
│           ├── 1.json              # 1–50 (example range)
│           ├── ...
│           └── 20.json
├── src/
│   ├── components/                 # Reusable UI pieces (Navigation, Footer, etc.)
│   ├── pages/                      # Feature pages (VocabularyPractice, VerbConjugation, etc.)
│   ├── db/                         # Dexie schema + seeding
│   ├── services/                   # Data loaders / helpers
│   ├── service-worker.ts           # Custom service worker logic
│   ├── serviceWorkerRegistration.ts
│   └── App.tsx
└── config-overrides.js             # CRA overrides (MUI / SW / TS tweaks)
```

---

## � Architecture & Data Flow

1. Static JSON assets (vocabulary chunks, verbs, numbers) are fetched on-demand.
2. Data is normalized & cached in React Query.
3. Frequently accessed datasets are persisted to IndexedDB for offline reuse.
4. UI components request data through lightweight service helpers in `services/api.ts`.
5. Service Worker precaches core shell + selected data files; runtime caching strategies (Workbox) handle others.

### Interaction Diagram (Conceptual)
```
[User] → [React Components] → (React Query) ↔ [services/api] → fetch(/public/data/*.json)
                                  ↓                               ↑
                              IndexedDB (Dexie) ← Service Worker Cache
```

---

## � Offline & PWA Capabilities
- Installable manifest & icons
- Precache app shell + critical assets
- Runtime caching for vocabulary chunks
- IndexedDB enables reopening without network
- Graceful fallback for missing assets

Potential future enhancements:
- Background sync for newly added datasets
- Versioned data migrations

---

## 📊 Data Formats

### Vocabulary Item
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

### Verb Entry
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

---

## 🤝 Contributing
Contributions are very welcome! Feel free to open an issue for discussion before larger changes.

### Workflow
1. Fork
2. Create a branch: `feat/my-enhancement`
3. Commit with conventional style (e.g. `feat: add spaced repetition engine`)
4. Push & open a Pull Request

### Good First Issues
- Add new vocabulary category JSON file(s)
- Extend verb dataset
- Improve accessibility (ARIA roles, keyboard navigation)
- Add tests for data loaders / caching
- Refine grammar explanations with sources

---

## 📝 License
Released under the MIT License – see [`LICENSE`](LICENSE).

---

## 👨‍💻 About the Author
**Severin Lindenmann**  
GitHub: [@severinlindenmann](https://github.com/severinlindenmann)  
LinkedIn: [@severin-lindenmann](https://www.linkedin.com/in/severin-lindenmann)  
Email: [hello@severin.io](mailto:hello@severin.io)

---

## 💡 Support
If this project helps you learn Hungarian, please ⭐ the repo and share it.

---

**Jó tanulást!** (Happy learning!) 🎓