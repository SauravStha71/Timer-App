# Syanko Katti Roll Timer Challenge Game

A responsive mobile timer challenge game built with React Native (Expo) and TypeScript. Test your precision by stopping the timer at exactly 10.000 seconds!

## 🎮 Game Rules

1. Tap the **Start** button to begin the timer
2. The timer starts from 0.000 seconds
3. Tap **Stop** when you think it's exactly 10.000 seconds
4. **Win Condition**: Stop between 9.990 - 10.010 seconds (±10ms tolerance)
5. Get a win message and play again!

## 🎨 Design Features

- **Color Scheme**: 
  - Primary Red: `#D62828`
  - Yellow/Gold: `#FBB13C`
- **Typography**: Poppins (Bold, ExtraBold, Black) from Google Fonts
- **Animations**: Smooth animations using React Native Reanimated
- **Responsive**: Works on phones and tablets

## 📱 Features

- ⏱ Frame-perfect timer accuracy using `requestAnimationFrame`
- 🎯 Millisecond precision (00.000 format)
- 🎨 Beautiful gradient backgrounds and glowing button effects
- ✨ Smooth fade-in animations for results
- 📱 Fully responsive design
- 🎮 Intuitive game flow with clear feedback

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

3. **Run on your device:**
   - Scan the QR code with Expo Go (iOS) or the Expo app (Android)
   - Or press `i` for iOS simulator, `a` for Android emulator, or `w` for web

### Alternative: Using Yarn

```bash
yarn install
yarn start
```

## 📁 Project Structure

```
Timer-App/
├── App.tsx                 # Main app component
├── hooks/
│   └── useTimer.ts        # Custom timer hook with millisecond precision
├── components/
│   ├── BuzzerButton.tsx   # Animated circular button component
│   └── ResultModal.tsx    # Modal for displaying game results
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
└── babel.config.js       # Babel configuration
```

## 🛠 Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Native Reanimated** - Smooth animations
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Google Fonts** - Poppins font family

## 🎯 Game Logic

- Timer uses `performance.now()` for high-precision timing
- Updates via `requestAnimationFrame` for smooth 60fps updates
- Win condition: ±10ms tolerance around 10.000 seconds
- Button disabled during timer run to prevent multiple taps

## 📝 Code Features

- **TypeScript**: Full type safety throughout
- **Custom Hooks**: Reusable `useTimer` hook
- **Component Architecture**: Modular, reusable components
- **Animations**: React Native Reanimated for performant animations
- **Responsive Design**: Adapts to different screen sizes

## 🐛 Troubleshooting

### Fonts not loading
If fonts fail to load, the app will fall back to system fonts automatically.

### Timer accuracy issues
The timer uses `performance.now()` which provides microsecond precision. If you experience issues, ensure you're running on a physical device or a recent simulator.

### Build errors
Make sure you have the latest version of Node.js and clear your cache:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## 📄 License

This project is created for the Syanko Katti Roll campaign.

## 👨‍💻 Development

To modify the game:
- **Timer tolerance**: Edit `tolerance` in `App.tsx` (line 49)
- **Target time**: Edit `targetTime` in `App.tsx` (line 48)
- **Colors**: Update color values in component StyleSheets
- **Fonts**: Change font families in component styles

---

Enjoy the game! 🎉

