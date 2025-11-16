import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black } from '@expo-google-fonts/poppins';
import { useTimer } from './hooks/useTimer';
import { BuzzerButton } from './components/BuzzerButton';
import { ResultModal } from './components/ResultModal';

const { width, height } = Dimensions.get('window');

interface AppState {
  gameState: 'idle' | 'running' | 'stopped';
  result: 'win' | 'lose' | null;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });
  const [gameState, setGameState] = useState<AppState['gameState']>('idle');
  const [result, setResult] = useState<AppState['result']>(null);
  const { time, isRunning, start, stop, reset } = useTimer();

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
    const tolerance = 10; // ±10ms tolerance
    const difference = Math.abs(time - targetTime);

    if (difference <= tolerance) {
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
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Syanko Katti Roll</Text>
            <Text style={styles.subtitle}>Timer Challenge</Text>
          </View>

          {/* Timer Display */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerText}>{formatTime(time)}</Text>
            </View>
            <Text style={styles.instruction}>
              {gameState === 'idle'
                ? 'Tap Start to begin'
                : gameState === 'running'
                ? 'Tap Stop at exactly 10.000 seconds'
                : 'Tap Play Again to try again'}
            </Text>
          </View>

          {/* Buzzer Button */}
          <View style={styles.buttonContainer}>
            <BuzzerButton
              onPress={handleButtonPress}
              disabled={false}
              label={getButtonLabel()}
            />
          </View>

          {/* Target Indicator */}
          <View style={styles.targetContainer}>
            <Text style={styles.targetLabel}>Target: 10.000</Text>
            <Text style={styles.targetRange}>Win Range: 9.990 - 10.010</Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: '900',
    color: '#FBB13C',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
    fontFamily: 'Poppins_900Black',
  },
  subtitle: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.5,
    fontFamily: 'Poppins_700Bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  timerLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
    opacity: 0.9,
    letterSpacing: 1,
    fontFamily: 'Poppins_700Bold',
  },
  timerBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FBB13C',
    marginBottom: 20,
    minWidth: width * 0.6,
    alignItems: 'center',
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
    fontSize: width * 0.12,
    fontWeight: '900',
    color: '#FBB13C',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 20,
    lineHeight: 22,
    fontFamily: 'Poppins_700Bold',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  targetContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  targetLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FBB13C',
    marginBottom: 5,
    fontFamily: 'Poppins_800ExtraBold',
  },
  targetRange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    fontFamily: 'Poppins_700Bold',
  },
});

