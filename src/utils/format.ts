export function formatNumber(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  return (num / 1_000_000_000_000).toFixed(1) + 'T';
}

export function getUpgradeCost(baseCost: number, costMultiplier: number, level: number): number {
  return Math.floor(baseCost * Math.pow(costMultiplier, level));
}
