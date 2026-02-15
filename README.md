# 🏓 Padel Clicker

A mobile clicker game with a padel/tennis theme built with React Native and Expo. Tap the ball, earn points, buy upgrades, and become the ultimate padel champion.

## Screenshots

> Coming soon — run the app locally to see it in action.

## Features

- **Tap to Score** — Hit the padel ball to earn points. Each tap triggers satisfying animations, haptic feedback, and impact particles.
- **Upgrades Shop** — Spend points on 7 different upgrades: better rackets, ball machines, training partners, and more.
- **Passive Income** — Some upgrades generate points automatically every second, even while you're browsing the shop.
- **Multipliers** — Stack multipliers to boost both tap and passive income.
- **Padel Court Environment** — The play area features a full padel court background with glass walls, net, court lines, and metal framing.
- **Rich Animations** — Idle floating, ball squish on impact, racket swing, glow ring, flying particles, and floating point numbers.
- **Auto-Save** — Progress is saved automatically every 5 seconds using AsyncStorage.
- **Cross-Platform** — Runs on iOS, Android, and Web from a single codebase.

## Upgrades

| Upgrade | Effect | Description |
|---|---|---|
| 🏓 Mejor Raqueta | +1 per tap | Upgrade your racket |
| ⚙️ Lanzapelotas | +1/s passive | Automatic ball machine |
| 🤚 Grip Pro | +3 per tap | Professional grip |
| 🧑‍🤝‍🧑 Compañero | +5/s passive | Training partner |
| ✨ Pelota Dorada | x2 multiplier | Golden ball bonus |
| 🎓 Entrenador Pro | +10 per tap | Professional coach |
| 🏟️ Tu Cancha | +25/s passive | Your own padel court |

Each upgrade has multiple levels with increasing costs.

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **AsyncStorage** for local persistence
- **Expo Haptics** for tactile feedback on mobile
- **React Native Animated API** for all animations (no external animation libraries)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo Go](https://expo.dev/go) app on your phone (for mobile testing)
- An [Expo account](https://expo.dev) (free, required for EAS builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/padel-clicker.git
cd padel-clicker

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npx expo start

# Run on specific platform
npx expo start --web       # Browser
npx expo start --ios       # iOS Simulator
npx expo start --android   # Android Emulator
```

To test on your physical device, scan the QR code shown in the terminal with the **Expo Go** app.

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build for Android (APK or AAB)
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## Project Structure

```
padel-clicker/
├── App.tsx                        # Entry point
├── app.json                       # Expo configuration
├── src/
│   ├── components/
│   │   ├── GameScreen.tsx         # Main screen layout
│   │   ├── PadelBall.tsx          # Interactive ball with animations
│   │   ├── PadelCourt.tsx         # Court background (lines, net, walls)
│   │   ├── FloatingPoints.tsx     # Animated floating +N numbers
│   │   ├── StatsBar.tsx           # Points display and stats
│   │   └── UpgradeShop.tsx        # Scrollable upgrades list
│   ├── hooks/
│   │   └── useGameState.ts        # Core game logic and state management
│   ├── types/
│   │   └── game.ts                # TypeScript interfaces
│   ├── constants/
│   │   ├── upgrades.ts            # Upgrade definitions and balancing
│   │   └── theme.ts               # Color palette
│   └── utils/
│       └── format.ts              # Number formatting (1K, 1M, 1B...)
```

## Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-upgrade`)
3. Commit your changes (`git commit -m 'Add new upgrade'`)
4. Push to the branch (`git push origin feature/new-upgrade`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
