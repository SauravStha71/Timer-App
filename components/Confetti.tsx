import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';

interface ConfettiProps {
  visible: boolean;
}

const ConfettiPiece: React.FC<{ index: number; color: string; delay: number }> = ({
  index,
  color,
  delay,
}) => {
  const { width, height } = useWindowDimensions();
  const translateY = useSharedValue(-50);
  const initialX = (index % 10) * (width / 10) + Math.random() * 50;
  const translateX = useSharedValue(initialX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const randomOffset = (Math.random() - 0.5) * 150;
    const duration = 2500 + Math.random() * 1000;
    
    translateY.value = withTiming(
      height + 150,
      {
        duration,
        easing: Easing.out(Easing.quad),
      }
    );
    
    translateX.value = withTiming(
      initialX + randomOffset,
      {
        duration,
        easing: Easing.inOut(Easing.sin),
      }
    );
    
    rotate.value = withRepeat(
      withTiming(360, { duration: 800 + Math.random() * 400, easing: Easing.linear }),
      -1,
      false
    );
    
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(1, { duration: duration - 600 }),
      withTiming(0, { duration: 300 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          backgroundColor: color,
          left: (index % 10) * (width / 10),
        },
        animatedStyle,
      ]}
    />
  );
};

export const Confetti: React.FC<ConfettiProps> = ({ visible }) => {
  if (!visible) return null;

  const colors = ['#FBB13C', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    delay: i * 20,
  }));

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          index={piece.id}
          color={piece.color}
          delay={piece.delay}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    elevation: 9999,
  },
  piece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

