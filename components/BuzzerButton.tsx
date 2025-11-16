import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_900Black } from '@expo-google-fonts/poppins';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  withRepeat,
} from 'react-native-reanimated';

interface BuzzerButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const BuzzerButton: React.FC<BuzzerButtonProps> = ({
  onPress,
  disabled = false,
  label,
}) => {
  const { width, height } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    Poppins_900Black,
  });
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  React.useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.6]),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(glow.value, [0, 1], [0.5, 1]),
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Responsive button size - scales with screen but has min/max limits
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  const baseSize = Math.min(width * 0.35, height * 0.2);
  const buttonSize = Math.max(
    Math.min(baseSize, isTablet ? 220 : 180),
    isSmallScreen ? 120 : 140
  );

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, animatedStyle]}
    >
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: buttonSize + 20,
            height: buttonSize + 20,
            borderRadius: (buttonSize + 20) / 2,
            aspectRatio: 1,
          },
          glowStyle,
        ]}
      />
      <LinearGradient
        colors={['#D62828', '#B01E1E']}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
        ]}
      >
        <Text style={[styles.label, { fontSize: buttonSize * 0.15 }]}>
          {label}
        </Text>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: '#FBB13C',
    opacity: 0.5,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Poppins_900Black',
  },
});

