export type ScoreComponent =
  | "interest"
  | "seasonFit"
  | "crowd"
  | "cost"
  | "detour"
  | "diversity";

export type ScoreBreakdown = {
  total: number;
  components: Record<ScoreComponent, number>;
  top2: [ScoreComponent, ScoreComponent];
};

export type Weights = Record<ScoreComponent, number>;
