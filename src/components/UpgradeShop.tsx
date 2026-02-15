import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';
import { Upgrade } from '../types/game';
import { formatNumber, getUpgradeCost } from '../utils/format';

interface UpgradeShopProps {
  upgrades: Upgrade[];
  points: number;
  onBuy: (id: string) => void;
}

function UpgradeCard({
  upgrade,
  points,
  onBuy,
}: {
  upgrade: Upgrade;
  points: number;
  onBuy: (id: string) => void;
}) {
  const cost = getUpgradeCost(upgrade.baseCost, upgrade.costMultiplier, upgrade.level);
  const canAfford = points >= cost && upgrade.level < upgrade.maxLevel;
  const isMaxed = upgrade.level >= upgrade.maxLevel;

  const handleBuy = () => {
    if (canAfford) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onBuy(upgrade.id);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        canAfford && styles.cardAffordable,
        isMaxed && styles.cardMaxed,
      ]}
      onPress={handleBuy}
      activeOpacity={canAfford ? 0.7 : 0.9}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{upgrade.icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{upgrade.name}</Text>
          <Text style={styles.cardDesc}>{upgrade.description}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.cardLevel}>
          Nv.{upgrade.level}/{upgrade.maxLevel}
        </Text>
        {isMaxed ? (
          <View style={styles.maxBadge}>
            <Text style={styles.maxText}>MAX</Text>
          </View>
        ) : (
          <View style={[styles.costBadge, canAfford && styles.costBadgeAffordable]}>
            <Text style={[styles.costText, canAfford && styles.costTextAffordable]}>
              {formatNumber(cost)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function UpgradeShop({ upgrades, points, onBuy }: UpgradeShopProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Mejoras</Text>
      </View>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {upgrades.map((upgrade) => (
          <UpgradeCard
            key={upgrade.id}
            upgrade={upgrade}
            points={points}
            onBuy={onBuy}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardAffordable: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
  },
  cardMaxed: {
    opacity: 0.6,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardLevel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  costBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  costBadgeAffordable: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  costText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  costTextAffordable: {
    color: '#000',
  },
  maxBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  maxText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
});
