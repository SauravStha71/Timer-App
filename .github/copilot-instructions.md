# Copilot Instructions for Timer-App

## Architecture Overview

This is a **React Native (Expo) game** built with TypeScript. The app implements a precision timer challenge where users must stop a timer at exactly 10.000 seconds.

### Core Flow
1. **App.tsx** (main component) manages game state (`idle` → `running` → `stopped`) and result evaluation
2. **useTimer hook** (`hooks/useTimer.ts`) handles high-precision timing using `requestAnimationFrame` and `performance.now()`
3. **Components** (in `components/`) handle UI rendering: button interactions, result display, and confetti animations

### Critical Timing Mechanism
- The `useTimer` hook is **the brain of the app**—it uses `requestAnimationFrame` for frame-perfect accuracy instead of `setInterval` to avoid drift
- Time is tracked in **milliseconds** with refs: `accumulatedTimeRef` (persistent total) and `startTimeRef` (for elapsed calculation)
- Win condition: timer **exactly equals** 10000ms (no tolerance despite README mentioning ±10ms)

## Key Patterns & Conventions

### State Management
- Game state is held in `App.tsx` with boolean/enum patterns (`gameState: 'idle' | 'running' | 'stopped'`)
- Result state tracks win/loss for modal display
- Custom hook (`useTimer`) encapsulates all timer logic—**do not add useState calls to App.tsx for timer management**

### Responsive Design
- All components calculate `isTablet` (width ≥ 768px) and `isSmallScreen` (width < 375px) locally using `useWindowDimensions()`
- Scaling formula: `scaleFactor = isTablet ? 1.2 : isSmallScreen ? 0.9 : 1`
- Button sizes use `Math.min()` and `Math.max()` to constrain between device limits—see `BuzzerButton.tsx` for the pattern

### Animation Framework
- Uses **react-native-reanimated** (v4.1.1) exclusively—**never use Animated from react-native directly**
- Shared values + `useAnimatedStyle()` for performance; common patterns:
  - `withSpring()` for button press feedback
  - `withTiming()` + `withRepeat()` for continuous effects
  - `withSequence()` for multi-phase animations (e.g., confetti fade-in/out)
- Animated components must be wrapped with `Animated.createAnimatedComponent()`

### Styling & Colors
- Primary colors: Red `#D62828`, Yellow/Gold `#FBB13C`
- Use `LinearGradient` from `expo-linear-gradient` for background effects
- All fonts load via `useFonts()` hook from `@expo-google-fonts/poppins`: Bold (700), ExtraBold (800), Black (900)
- **Always check `fontsLoaded` before rendering text**—avoid flash of fallback fonts

## Component Responsibilities

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `BuzzerButton` | Large interactive button with glow animation | `onPress`, `label`, `disabled` |
| `ResultModal` | Displays win/loss result with confetti trigger | `visible`, `isWin`, `time`, `onPlayAgain` |
| `Confetti` | Particle animation layer on win | `visible` |

## Development Workflow

### Running the App
```bash
npm install  # Install dependencies
npm start    # Start Expo development server
# Scan QR code in Expo Go app on phone, or press `a`/`i` for Android/iOS simulator
```

### Testing Changes
- Hot reload works with Expo—most changes update instantly
- If timer behavior changes, **test with actual device** (simulators can have timing drift)
- Build to APK/IPA with `eas build` (Expo Application Services)—check `app.json` for build config

### Debugging
- Use React DevTools: press `j` in Expo terminal to open debugger
- Timer accuracy: `console.log()` the `time` value in `useTimer` to verify millisecond precision
- Animation issues: check `react-native-reanimated` worklet rules—all interpolation logic must be "workletized"

## When Adding Features

1. **New Game Modes**: Extend `AppState` interface and game state logic in `App.tsx`, reuse `useTimer` hook
2. **New Animations**: Keep `react-native-reanimated` as single source—don't mix with Animated API
3. **Responsive Elements**: Always compute dimensions in component using `useWindowDimensions()`, not in stylesheet
4. **Fonts**: Load in `useFonts()` at component level, check `fontsLoaded` before first render
5. **Styling**: Use `StyleSheet.create()` for static styles; compute responsive values in component render logic

## Critical Files to Know

- `.github/app.json` — Expo configuration (permissions, splash screen, bundle IDs)
- `package.json` — Dependency versions are tightly coupled to Expo SDK 54; avoid bumping major versions
- `babel.config.js` — Required for `react-native-reanimated` babel plugin setup
- `tsconfig.json` — Target is ES2020 with React Native module resolution
