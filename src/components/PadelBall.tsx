import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  GestureResponderEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';

interface PadelBallProps {
  onPress: () => void;
  onPressLocation?: (x: number, y: number) => void;
  pointsPerClick: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  angle: number;
}

function ImpactParticle({ x, y, angle, onDone }: { x: number; y: number; angle: number; onDone: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 400 + Math.random() * 200,
      useNativeDriver: true,
    }).start(() => onDone());
  }, []);

  const distance = 30 + Math.random() * 40;
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.cos(angle) * distance],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.sin(angle) * distance],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 0.8, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0.5, 1.2, 0],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x - 4,
          top: y - 4,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
}

export function PadelBall({ onPress, onPressLocation }: PadelBallProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const racketSwing = useRef(new Animated.Value(0)).current;
  const shadowScale = useRef(new Animated.Value(1)).current;
  const ballY = useRef(new Animated.Value(0)).current;

  // Idle floating animation
  const idleAnim = useRef(new Animated.Value(0)).current;
  const idleRotate = useRef(new Animated.Value(0)).current;

  const [particles, setParticles] = useState<Particle[]>([]);

  // Continuous idle floating
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(idleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    // Slow continuous rotation
    const rotateLoop = Animated.loop(
      Animated.timing(idleRotate, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );
    rotateLoop.start();

    return () => {
      floatLoop.stop();
      rotateLoop.stop();
    };
  }, []);

  const idleTranslateY = idleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });
  const idleRotation = idleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Spawn impact particles
    const newParticles: Particle[] = [];
    const numParticles = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numParticles; i++) {
      newParticles.push({
        id: Date.now().toString() + Math.random().toString(36) + i,
        x: locationX,
        y: locationY,
        angle: (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.5,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);

    // Ball squish + bounce
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.78,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.08,
        friction: 2,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Ball jump up
    Animated.sequence([
      Animated.timing(ballY, {
        toValue: -20,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(ballY, {
        toValue: 0,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    // Hit rotation
    const rotateDirection = Math.random() > 0.5 ? 1 : -1;
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: rotateDirection,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: 0,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow flash
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Racket swing
    Animated.sequence([
      Animated.timing(racketSwing, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(racketSwing, {
        toValue: 0,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Shadow shrinks when ball goes up
    Animated.sequence([
      Animated.timing(shadowScale, {
        toValue: 0.6,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(shadowScale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
    onPressLocation?.(locationX, locationY);
  };

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  const hitRotation = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  const racketRotation = racketSwing.interpolate({
    inputRange: [0, 1],
    outputRange: ['35deg', '-15deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  return (
    <View style={styles.outerContainer}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { translateY: Animated.add(ballY, idleTranslateY) },
                { scale: scaleAnim },
                { rotate: hitRotation },
              ],
            },
          ]}
        >
          {/* Dynamic shadow */}
          <Animated.View
            style={[
              styles.shadow,
              { transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }] },
            ]}
          />

          {/* Glow ring */}
          <Animated.View style={[styles.glowRing, { opacity: glowOpacity }]} />

          {/* Main ball */}
          <View style={styles.ball}>
            <Animated.View style={[styles.ballInner, { transform: [{ rotate: idleRotation }] }]}>
              {/* Tennis ball curved seam */}
              <View style={styles.seamCurve1} />
              <View style={styles.seamCurve2} />

              {/* Felt texture dots */}
              <View style={[styles.feltDot, { top: '20%', left: '30%' }]} />
              <View style={[styles.feltDot, { top: '60%', left: '65%' }]} />
              <View style={[styles.feltDot, { top: '75%', left: '25%' }]} />
              <View style={[styles.feltDot, { top: '35%', left: '70%' }]} />

              {/* Shine highlight */}
              <View style={styles.shine} />
              <View style={styles.shineSmall} />
            </Animated.View>
          </View>

          {/* Impact particles */}
          {particles.map((p) => (
            <ImpactParticle
              key={p.id}
              x={p.x + 35}
              y={p.y + 35}
              angle={p.angle}
              onDone={() => removeParticle(p.id)}
            />
          ))}
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Racket - animated separately */}
      <Animated.View
        style={[
          styles.racketContainer,
          { transform: [{ rotate: racketRotation }] },
        ]}
      >
        <View style={styles.racketHead}>
          <View style={styles.racketGrid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={[styles.racketStringH, { top: `${16 + i * 17}%` }]}
              />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={[styles.racketStringV, { left: `${20 + i * 20}%` }]}
              />
            ))}
          </View>
        </View>
        <View style={styles.racketNeck} />
        <View style={styles.racketHandle}>
          <View style={styles.racketGrip} />
          <View style={styles.racketGrip2} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 15,
    width: 100,
    height: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 50,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: COLORS.ballYellow,
    shadowColor: COLORS.ballYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
  },
  ball: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.ballYellow,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: COLORS.ballYellow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    zIndex: 2,
  },
  ballInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.ballYellow,
    overflow: 'hidden',
    position: 'relative',
  },
  seamCurve1: {
    position: 'absolute',
    top: '15%',
    left: '5%',
    right: '5%',
    height: 3,
    backgroundColor: 'rgba(180, 150, 30, 0.5)',
    borderRadius: 40,
    transform: [{ rotate: '-10deg' }],
  },
  seamCurve2: {
    position: 'absolute',
    bottom: '15%',
    left: '5%',
    right: '5%',
    height: 3,
    backgroundColor: 'rgba(180, 150, 30, 0.5)',
    borderRadius: 40,
    transform: [{ rotate: '10deg' }],
  },
  feltDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(220, 200, 60, 0.3)',
  },
  shine: {
    position: 'absolute',
    top: 14,
    left: 18,
    width: 32,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    transform: [{ rotate: '-35deg' }],
  },
  shineSmall: {
    position: 'absolute',
    top: 28,
    left: 38,
    width: 10,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 6,
    transform: [{ rotate: '-35deg' }],
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ballYellow,
    shadowColor: COLORS.ballYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    zIndex: 10,
  },

  // Racket
  racketContainer: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  racketHead: {
    width: 62,
    height: 76,
    borderRadius: 31,
    borderWidth: 3.5,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(79, 195, 247, 0.06)',
    overflow: 'hidden',
  },
  racketGrid: {
    flex: 1,
    position: 'relative',
  },
  racketStringH: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 1,
    backgroundColor: 'rgba(79, 195, 247, 0.35)',
  },
  racketStringV: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: 1,
    backgroundColor: 'rgba(79, 195, 247, 0.35)',
  },
  racketNeck: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.primaryDark,
  },
  racketHandle: {
    width: 14,
    height: 32,
    backgroundColor: COLORS.primaryDark,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
  },
  racketGrip: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: [{ rotate: '45deg' }],
  },
  racketGrip2: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: [{ rotate: '45deg' }],
  },
});
