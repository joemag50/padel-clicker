export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  costMultiplier: number;
  level: number;
  maxLevel: number;
  effect: 'clickPower' | 'autoClick' | 'multiplier';
  effectValue: number;
}

export interface GameState {
  points: number;
  totalPoints: number;
  clickPower: number;
  autoClickPower: number;
  multiplier: number;
  upgrades: Upgrade[];
  totalClicks: number;
}

export interface FloatingNumber {
  id: string;
  value: number;
  x: number;
  y: number;
}
