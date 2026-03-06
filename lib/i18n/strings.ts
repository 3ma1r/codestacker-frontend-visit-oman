import type { Destination, Locale } from "../../types/destination";

export function tName(destination: Destination, locale: Locale): string {
  return locale === "ar" ? destination.name.ar : destination.name.en;
}

export function tRegion(destination: Destination, locale: Locale): string {
  return locale === "ar" ? destination.region.ar : destination.region.en;
}

export function tCompany(destination: Destination, locale: Locale): string {
  return locale === "ar" ? destination.company.ar : destination.company.en;
}
