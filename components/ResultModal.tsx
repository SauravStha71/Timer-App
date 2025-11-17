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
import {
  useFonts,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface ResultModalProps {
  visible: boolean;
  time: number;
  onPlayAgain: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  visible,
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
    return `${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(3, '0')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <View style={styles.darkOverlay} />
        <Animated.View
          style={[
            styles.modalContainer,
            { width: modalWidth, padding: modalPadding },
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={['#D62828', '#C62828', '#B01E1E']} // single theme
            style={styles.gradient}
          >
            <Text
              style={[
                styles.title,
                {
                  fontSize: Math.min(
                    width * 0.05 * scaleFactor,
                    isTablet ? 26 : 22
                  ),
                },
              ]}
            >
              Your Time
            </Text>

            <View
              style={[
                styles.timeContainer,
                {
                  padding: width * 0.04,
                  marginBottom: height * 0.02,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                  borderRadius: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.timeValue,
                  {
                    fontSize: Math.min(
                      width * 0.08 * scaleFactor,
                      isTablet ? 50 : 34
                    ),
                  },
                ]}
              >
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
                  },
                ]}
              >
                <Text
                  style={[
                    styles.playAgainText,
                    {
                      fontSize: Math.min(
                        width * 0.05 * scaleFactor,
                        isTablet ? 24 : 20
                      ),
                    },
                  ]}
                >
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
    elevation: 20,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Poppins_900Black',
  },
  timeContainer: {
    alignItems: 'center',
    width: '100%',
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
    marginTop: 25,
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
