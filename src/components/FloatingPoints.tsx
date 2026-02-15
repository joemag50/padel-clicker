import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';

interface FloatingPointsProps {
  value: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export function FloatingPoints({ value, x, y, onComplete }: FloatingPointsProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => onComplete());
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - 30,
          top: y - 20,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>+{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    pointerEvents: 'none',
  },
  text: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.gold,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
