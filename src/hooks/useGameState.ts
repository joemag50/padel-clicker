import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Upgrade } from '../types/game';
import { INITIAL_UPGRADES } from '../constants/upgrades';
import { getUpgradeCost } from '../utils/format';

const STORAGE_KEY = 'padel_clicker_save';
const SAVE_INTERVAL = 5000;

const getInitialState = (): GameState => ({
  points: 0,
  totalPoints: 0,
  clickPower: 1,
  autoClickPower: 0,
  multiplier: 1,
  upgrades: INITIAL_UPGRADES.map((u) => ({ ...u })),
  totalClicks: 0,
});

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [isLoaded, setIsLoaded] = useState(false);
  const lastSaveRef = useRef<number>(Date.now());

  // Load saved state
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as GameState;
          // Merge with initial upgrades in case new ones were added
          const mergedUpgrades = INITIAL_UPGRADES.map((initial) => {
            const saved = parsed.upgrades.find((u) => u.id === initial.id);
            return saved ? { ...initial, level: saved.level } : { ...initial };
          });
          setGameState({
            ...parsed,
            upgrades: mergedUpgrades,
          });
        }
      } catch (e) {
        console.warn('Failed to load save:', e);
      }
      setIsLoaded(true);
    };
    loadState();
  }, []);

  // Auto-save periodically
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        lastSaveRef.current = Date.now();
      } catch (e) {
        console.warn('Failed to save:', e);
      }
    }, SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [gameState, isLoaded]);

  // Auto-click (passive income)
  useEffect(() => {
    if (!isLoaded || gameState.autoClickPower === 0) return;
    const interval = setInterval(() => {
      setGameState((prev) => {
        const earned = prev.autoClickPower * prev.multiplier;
        return {
          ...prev,
          points: prev.points + earned,
          totalPoints: prev.totalPoints + earned,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoaded, gameState.autoClickPower, gameState.multiplier]);

  const handleClick = useCallback(() => {
    setGameState((prev) => {
      const earned = prev.clickPower * prev.multiplier;
      return {
        ...prev,
        points: prev.points + earned,
        totalPoints: prev.totalPoints + earned,
        totalClicks: prev.totalClicks + 1,
      };
    });
  }, []);

  const recalculateStats = (upgrades: Upgrade[]): Partial<GameState> => {
    let clickPower = 1;
    let autoClickPower = 0;
    let multiplier = 1;

    upgrades.forEach((upgrade) => {
      if (upgrade.effect === 'clickPower') {
        clickPower += upgrade.effectValue * upgrade.level;
      } else if (upgrade.effect === 'autoClick') {
        autoClickPower += upgrade.effectValue * upgrade.level;
      } else if (upgrade.effect === 'multiplier') {
        multiplier += upgrade.effectValue * upgrade.level;
      }
    });

    return { clickPower, autoClickPower, multiplier };
  };

  const buyUpgrade = useCallback((upgradeId: string) => {
    setGameState((prev) => {
      const upgradeIndex = prev.upgrades.findIndex((u) => u.id === upgradeId);
      if (upgradeIndex === -1) return prev;

      const upgrade = prev.upgrades[upgradeIndex];
      const cost = getUpgradeCost(upgrade.baseCost, upgrade.costMultiplier, upgrade.level);

      if (prev.points < cost || upgrade.level >= upgrade.maxLevel) return prev;

      const newUpgrades = prev.upgrades.map((u, i) =>
        i === upgradeIndex ? { ...u, level: u.level + 1 } : u
      );

      const stats = recalculateStats(newUpgrades);

      return {
        ...prev,
        points: prev.points - cost,
        upgrades: newUpgrades,
        ...stats,
      };
    });
  }, []);

  const getPointsPerClick = () => gameState.clickPower * gameState.multiplier;

  return {
    gameState,
    isLoaded,
    handleClick,
    buyUpgrade,
    getPointsPerClick,
  };
}
