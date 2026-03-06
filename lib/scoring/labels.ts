import type { ScoreComponent } from "../../types/scoring";
import type { Locale } from "../i18n/locale";

const LABELS: Record<Locale, Record<ScoreComponent, string>> = {
  en: {
    interest: "Matches your interests",
    seasonFit: "Good for this month",
    diversity: "Adds variety",
    detour: "Low detour",
    cost: "Affordable",
    crowd: "Less crowded",
  },
  ar: {
    interest: "يناسب اهتماماتك",
    seasonFit: "مناسب لهذا الشهر",
    diversity: "يضيف تنوعًا",
    detour: "منعطفات أقل",
    cost: "تكلفة مناسبة",
    crowd: "أقل ازدحامًا",
  },
};

export function componentLabel(c: ScoreComponent, locale: Locale): string {
  return LABELS[locale][c];
}
