export type DatasetStats = { minCost: number; maxCost: number };

export function computeStats(
  destinations: { ticket_cost_omr: number }[],
): DatasetStats {
  if (destinations.length === 0) {
    return { minCost: 0, maxCost: 0 };
  }

  let minCost = destinations[0].ticket_cost_omr;
  let maxCost = destinations[0].ticket_cost_omr;

  for (const destination of destinations) {
    if (destination.ticket_cost_omr < minCost) {
      minCost = destination.ticket_cost_omr;
    }
    if (destination.ticket_cost_omr > maxCost) {
      maxCost = destination.ticket_cost_omr;
    }
  }

  return { minCost, maxCost };
}

export function normalizeCrowd(level: 1 | 2 | 3 | 4 | 5): number {
  return (level - 1) / 4;
}

export function normalizeCost(cost: number, stats: DatasetStats): number {
  if (stats.maxCost === stats.minCost) {
    return 0;
  }
  return clamp01((cost - stats.minCost) / (stats.maxCost - stats.minCost));
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
