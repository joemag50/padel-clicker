import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Text,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { useGameState } from '../hooks/useGameState';
import { PadelBall } from './PadelBall';
import { PadelCourt } from './PadelCourt';
import { FloatingPoints } from './FloatingPoints';
import { StatsBar } from './StatsBar';
import { UpgradeShop } from './UpgradeShop';
import { FloatingNumber } from '../types/game';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function GameScreen() {
  const { gameState, isLoaded, handleClick, buyUpgrade, getPointsPerClick } = useGameState();
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  const onBallPress = useCallback(() => {
    handleClick();
  }, [handleClick]);

  const onBallPressLocation = useCallback(
    (x: number, y: number) => {
      const id = Date.now().toString() + Math.random().toString(36);
      const ballCenterX = SCREEN_WIDTH / 2 - 100;
      setFloatingNumbers((prev) => [
        ...prev,
        {
          id,
          value: getPointsPerClick(),
          x: ballCenterX + x,
          y: y,
        },
      ]);
    },
    [getPointsPerClick]
  );

  const removeFloatingNumber = useCallback((id: string) => {
    setFloatingNumbers((prev) => prev.filter((n) => n.id !== id));
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🏓</Text>
        <Text style={styles.loadingSubtext}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Stats */}
        <StatsBar
          points={gameState.points}
          pointsPerClick={getPointsPerClick()}
          autoClickPower={gameState.autoClickPower}
          multiplier={gameState.multiplier}
        />

        {/* Play area - cancha de padel */}
        <View style={styles.playArea}>
          {/* Court background */}
          <PadelCourt />

          {/* Floating numbers */}
          {floatingNumbers.map((fn) => (
            <FloatingPoints
              key={fn.id}
              value={fn.value}
              x={fn.x}
              y={fn.y}
              onComplete={() => removeFloatingNumber(fn.id)}
            />
          ))}

          {/* Ball */}
          <View style={styles.ballWrapper}>
            <PadelBall
              onPress={onBallPress}
              onPressLocation={onBallPressLocation}
              pointsPerClick={getPointsPerClick()}
            />
          </View>

          {/* Total clicks counter */}
          <Text style={styles.totalClicks}>
            Golpes: {gameState.totalClicks.toLocaleString()}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Tienda - siempre visible abajo */}
        <View style={styles.shopArea}>
          <UpgradeShop
            upgrades={gameState.upgrades}
            points={gameState.points}
            onBuy={buyUpgrade}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 60,
  },
  loadingSubtext: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  playArea: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  ballWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalClicks: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
    opacity: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
    marginVertical: 4,
  },
  shopArea: {
    flex: 1,
    minHeight: 200,
  },
});
