export type Locale = "en" | "ar";
export type RegionKey =
  | "muscat"
  | "dakhiliya"
  | "sharqiya"
  | "dhofar"
  | "batinah"
  | "dhahira";
export type Category =
  | "mountain"
  | "beach"
  | "culture"
  | "desert"
  | "nature"
  | "food";
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Destination = {
  id: string;
  name: { en: string; ar: string };
  lat: number;
  lng: number;
  region: { en: string; ar: string };
  regionKey: RegionKey;
  categories: Category[];
  company: { en: string; ar: string };
  avg_visit_duration_minutes: number;
  ticket_cost_omr: number;
  recommended_months: Month[];
  crowd_level: 1 | 2 | 3 | 4 | 5;
};
