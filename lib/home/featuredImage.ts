import path from "node:path";
import fs from "node:fs";
import type { Destination } from "../../types/destination";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
const FALLBACK_IMAGE = "/globe.svg";

function imagePathForId(id: string) {
  return path.join(
    process.cwd(),
    "public",
    "images",
    "destinations",
    id,
  );
}

function resolveImageForId(id: string): string | null {
  const basePath = imagePathForId(id);
  for (const ext of IMAGE_EXTENSIONS) {
    const filePath = `${basePath}${ext}`;
    if (fs.existsSync(filePath)) {
      return `/images/destinations/${id}${ext}`;
    }
  }
  return null;
}

function resolveImageForName(
  nameEn: string,
  destinations: Destination[],
): string | null {
  for (const destination of destinations) {
    if (destination.name.en !== nameEn) {
      continue;
    }
    const image = resolveImageForId(destination.id);
    if (image) {
      return image;
    }
  }
  return null;
}

export function resolveFeaturedImage(
  destination: Destination,
  allDestinations: Destination[],
): string {
  return (
    resolveImageForId(destination.id) ||
    resolveImageForName(destination.name.en, allDestinations) ||
    FALLBACK_IMAGE
  );
}
