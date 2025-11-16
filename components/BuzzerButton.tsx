import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
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

const { width } = Dimensions.get('window');

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

  const buttonSize = Math.min(width * 0.4, 180);

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
        <View
          style={[
            styles.innerRing,
            {
              width: buttonSize - 8,
              height: buttonSize - 8,
              borderRadius: (buttonSize - 8) / 2,
            },
          ]}
        />
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
    shadowColor: '#FBB13C',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 16,
    elevation: 10,
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: '#FBB13C',
    opacity: 0.5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FBB13C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 8,
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FBB13C',
    opacity: 0.3,
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

