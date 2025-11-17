import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts as usePoppins, Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black } from '@expo-google-fonts/poppins';
import { useFonts as usePlayfair, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useTimer } from './hooks/useTimer';
import { BuzzerButton } from './components/BuzzerButton';
import { ResultModal } from './components/ResultModal';

interface AppState {
  gameState: 'idle' | 'running' | 'stopped';
  result: 'win' | 'lose' | null;
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const [poppinsLoaded] = usePoppins({
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });
  const [playfairLoaded] = usePlayfair({
    PlayfairDisplay_700Bold,
  });
  const fontsLoaded = poppinsLoaded && playfairLoaded;
  const [gameState, setGameState] = useState<AppState['gameState']>('idle');
  const [result, setResult] = useState<AppState['result']>(null);
  const { time, isRunning, start, stop, reset } = useTimer();

  // Calculate responsive values
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  const scaleFactor = isTablet ? 1.2 : isSmallScreen ? 0.9 : 1;

  const handleButtonPress = () => {
    if (gameState === 'idle') {
      reset();
      start();
      setGameState('running');
      setResult(null);
    } else if (gameState === 'running') {
      stop();
      setGameState('stopped');
      evaluateResult();
    }
  };

  const evaluateResult = () => {
    const targetTime = 10000; // 10.000 seconds in milliseconds

    if (time === targetTime) {
      setResult('win');
    } else {
      setResult('lose');
    }
  };

  const handlePlayAgain = () => {
    reset();
    setGameState('idle');
    setResult(null);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const getButtonLabel = (): string => {
    if (gameState === 'idle') return 'Start';
    if (gameState === 'running') return 'Stop';
    return 'Start';
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#D62828', '#B01E1E', '#8B1A1A']}
        style={styles.gradient}
      >
        <View style={[styles.content, { paddingHorizontal: width * 0.05 }]}>
          {/* Header */}
          <View style={[styles.header, { marginTop: height * 0.02 }]}>
            <Text style={[styles.title, { fontSize: Math.min(width * 0.08 * scaleFactor, isTablet ? 48 : 32) }]}>
              Syanko Katti Roll
            </Text>
            <Text style={[styles.subtitle, { fontSize: Math.min(width * 0.05 * scaleFactor, isTablet ? 28 : 20) }]}>
              Timer Challenge
            </Text>
          </View>

          {/* Timer Display */}
          <View style={[styles.timerContainer, { marginVertical: height * 0.02 }]}>
            <Text style={[styles.timerLabel, { fontSize: Math.min(width * 0.05 * scaleFactor, 24) }]}>
              Time
            </Text>
            <View style={[
              styles.timerBox,
              {
                minWidth: width * 0.7,
                maxWidth: isTablet ? 600 : width * 0.9,
                paddingVertical: height * 0.04,
                paddingHorizontal: width * 0.1,
              }
            ]}>
              <Text style={[
                styles.timerText,
                { fontSize: Math.min(width * 0.18 * scaleFactor, isTablet ? 96 : 64) }
              ]}>
                {formatTime(time)}
              </Text>
            </View>
            <Text style={[
              styles.instruction,
              {
                fontSize: Math.min(width * 0.04 * scaleFactor, isTablet ? 20 : 16),
                paddingHorizontal: width * 0.05,
                marginTop: height * 0.02,
              }
            ]}>
              {gameState === 'idle'
                ? 'Tap Start to begin'
                : gameState === 'running'
                ? 'Tap Stop at exactly 10 seconds'
                : 'Tap Play Again to try again'}
            </Text>
          </View>

          {/* Buzzer Button */}
          <View style={[styles.buttonContainer, { marginVertical: height * 0.02 }]}>
            <BuzzerButton
              onPress={handleButtonPress}
              disabled={false}
              label={getButtonLabel()}
            />
          </View>

          {/* Target Indicator */}
          <View style={[
            styles.targetContainer,
            {
              padding: width * 0.04,
              marginTop: height * 0.01,
            }
          ]}>
            <Text style={[
              styles.targetLabel,
              { fontSize: Math.min(width * 0.045 * scaleFactor, isTablet ? 24 : 18) }
            ]}>
              Target: 10 seconds
            </Text>
          </View>
        </View>

        {/* Result Modal */}
        <ResultModal
          visible={result !== null}
          isWin={result === 'win'}
          time={time}
          onPlayAgain={handlePlayAgain}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D62828',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    color: '#FBB13C',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  subtitle: {
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.5,
    fontFamily: 'Poppins_700Bold',
  },
  timerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  timerLabel: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
    opacity: 0.9,
    letterSpacing: 1,
    fontFamily: 'Poppins_700Bold',
  },
  timerBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FBB13C',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FBB13C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  timerText: {
    fontWeight: '900',
    color: '#FBB13C',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instruction: {
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
    fontFamily: 'Poppins_700Bold',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  targetLabel: {
    fontWeight: '700',
    color: '#FBB13C',
    marginBottom: 5,
    fontFamily: 'Poppins_800ExtraBold',
  },
  targetRange: {
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
});

