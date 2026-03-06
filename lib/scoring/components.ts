import { clamp01 } from "./normalize";

export function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) {
    return 0;
  }
  let intersectionSize = 0;
  for (const value of setA) {
    if (setB.has(value)) {
      intersectionSize += 1;
    }
  }
  return intersectionSize / union.size;
}

export function seasonFit(month: number, recommended: number[]): number {
  if (recommended.includes(month)) {
    return 1;
  }

  const previous = month === 1 ? 12 : month - 1;
  const next = month === 12 ? 1 : month + 1;
  if (recommended.includes(previous) || recommended.includes(next)) {
    return 0.5;
  }

  return 0;
}

export function diversityGain(
  candidateCats: string[],
  selectedCats: Set<string>,
): number {
  let newCats = 0;
  for (const category of candidateCats) {
    if (!selectedCats.has(category)) {
      newCats += 1;
    }
  }
  return newCats / Math.max(1, candidateCats.length);
}

export function detourPenalty(detourKmValue: number): number {
  return clamp01(detourKmValue / 50);
}
