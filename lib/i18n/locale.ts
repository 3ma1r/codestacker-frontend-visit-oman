import type { Locale } from "../../types/destination";

export type { Locale } from "../../types/destination";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "ar";
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
