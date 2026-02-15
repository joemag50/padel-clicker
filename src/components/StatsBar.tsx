import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { formatNumber } from '../utils/format';

interface StatsBarProps {
  points: number;
  pointsPerClick: number;
  autoClickPower: number;
  multiplier: number;
}

export function StatsBar({ points, pointsPerClick, autoClickPower, multiplier }: StatsBarProps) {
  return (
    <View style={styles.container}>
      {/* Main points display */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsLabel}>PUNTOS</Text>
        <Text style={styles.pointsValue}>{formatNumber(points)}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🏓</Text>
          <Text style={styles.statValue}>{formatNumber(pointsPerClick)}/golpe</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>{formatNumber(autoClickPower * multiplier)}/s</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>✨</Text>
          <Text style={styles.statValue}>x{multiplier}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 3,
  },
  pointsValue: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.text,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statIcon: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});
