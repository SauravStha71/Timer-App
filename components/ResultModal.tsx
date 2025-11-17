import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black } from '@expo-google-fonts/poppins';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface ResultModalProps {
  visible: boolean;
  isWin: boolean;
  time: number;
  onPlayAgain: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  isWin,
  time,
  onPlayAgain,
}) => {
  const { width, height } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // Responsive calculations
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  const scaleFactor = isTablet ? 1.2 : isSmallScreen ? 0.9 : 1;
  const modalWidth = Math.min(width * 0.85, isTablet ? 500 : 400);
  const modalPadding = width * 0.06;

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.darkOverlay} pointerEvents="none" />
        <Animated.View style={[
          styles.modalContainer,
          {
            width: modalWidth,
            padding: modalPadding,
          },
          animatedStyle
        ]} pointerEvents="box-none">
          <LinearGradient
            colors={isWin ? ['#FBB13C', '#FFD700'] : ['#D62828', '#C62828', '#B01E1E']}
            style={styles.gradient}
          >
            <Text style={[
              styles.title,
              { fontSize: Math.min(width * 0.05 * scaleFactor, isTablet ? 24 : 20) }
            ]}>
              {isWin ? '👏 Congratulations! 👏' : '😢 Bad Luck! 😢'}
            </Text>
            <Text style={[
              styles.subtitle,
              { fontSize: Math.min(width * 0.05 * scaleFactor, isTablet ? 24 : 20) }
            ]}>
              {isWin ? 'You Won!' : 'Try Again!'}
            </Text>
            <View style={[
              styles.timeContainer,
              {
                padding: width * 0.04,
                marginBottom: height * 0.02,
                backgroundColor: isWin ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2,
                borderColor: '#FFFFFF',
                borderRadius: 12,
              }
            ]}>
              <Text style={[
                styles.timeLabel,
                { fontSize: Math.min(width * 0.04 * scaleFactor, isTablet ? 20 : 16) }
              ]}>
                Your Time:
              </Text>
              <Text style={[
                styles.timeValue,
                { fontSize: Math.min(width * 0.08 * scaleFactor, isTablet ? 48 : 32) }
              ]}>
                {formatTime(time)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onPlayAgain}
              style={styles.playAgainButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FBB13C', '#FFA500']}
                style={[
                  styles.buttonGradient,
                  {
                    paddingVertical: height * 0.02,
                    paddingHorizontal: width * 0.08,
                  }
                ]}
              >
                <Text style={[
                  styles.playAgainText,
                  { fontSize: Math.min(width * 0.05 * scaleFactor, isTablet ? 24 : 20) }
                ]}>
                  Play Again
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FBB13C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 1000,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Poppins_900Black',
  },
  subtitle: {
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Poppins_800ExtraBold',
  },
  timeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timeLabel: {
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.9,
    fontFamily: 'Poppins_700Bold',
  },
  timeValue: {
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  playAgainButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playAgainText: {
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Poppins_900Black',
  },
});

