# GlitchED | Link

A React Native (Expo) app that connects **educators and students**: educators upload learning content, students access resources and play **educational games** that turn practical knowledge into points, levels and badges.

> Hackathon project - **Top 5 finish**

## Features

**For educators**
- Upload learning content: title, subject, notes and an attached file (PDF, image, document)
- Build quizzes in-app (4-option questions with a marked correct answer)
- Add key terms (`term = definition`) that power the matching game
- Manage (delete) their own content

**For students**
- Search and filter resources by subject
- Open attachments, read notes and key terms
- Play gamified modules built from the educator's own content:
  - **Quick Quiz** - timed questions, faster answers earn bonus points
  - **Memory Match** - match terms to definitions in as few moves as possible
- Earn points, level up, unlock badges, see a leaderboard

**Gamification loop:** play -> points -> levels (every 100 pts) -> badges (First Steps, Perfect Score, Memory Master, Scholar, Contributor) -> leaderboard.

## Tech stack

- React Native with Expo
- React Navigation (native stack + bottom tabs, role-based tabs)
- Context API for state, AsyncStorage for on-device persistence
- `expo-document-picker` for uploads, `expo-sharing` to open attachments

## Project structure

```
App.js / index.js         app entry
src/
  context/AppContext.js   global state, persistence, points and badges
  navigation/             stack + role-based tab navigator
  screens/                Home, Resources, ResourceDetail, Upload,
                          Games, QuizGame, MemoryGame, Profile, RoleSelect
  components/UI.js        Button, Card, Chip, ProgressBar
  data/seed.js            starter content + demo leaderboard
  utils/helpers.js        shuffle, parsing, level maths
```

## Run it (VS Code)

Requires Node.js 18+ and the **Expo Go** app on your phone (or an Android emulator / iOS simulator).

```bash
npm install
npx expo install --fix     # aligns package versions with the installed Expo SDK
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). Press `a` for an Android emulator or `w` for web.

## Try it

1. Choose **Educator**, enter a name, then use the **Upload** tab to publish a resource with key terms and quiz questions.
2. Switch user (Profile tab -> Switch user), choose **Student**, open **Games**, pick your resource and play.
3. Check **Profile** for points, badges and the leaderboard.

## Current limitations and roadmap

- Data is stored on-device only; the leaderboard uses demo players
- Next: backend (Firebase / Supabase or Node + MongoDB) for auth, shared content, cloud file storage and a real leaderboard
- More game types (drag-and-drop sequencing, true/false blitz), class groups, progress analytics for educators

## License

MIT
