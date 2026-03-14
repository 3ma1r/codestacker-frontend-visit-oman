"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "../../lib/i18n/locale";
import type { Destination } from "../../types/destination";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";


const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"] as const;

type Stop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type Props = {
  locale: Locale;
  stops: Stop[];
  allDestinations: Destination[];
  activeStopIndex: number;
  onActiveStopChange: (index: number) => void;
};

function averageCenter(stops: Stop[]) {
  const total = stops.reduce(
    (acc, stop) => {
      acc.lat += stop.lat;
      acc.lng += stop.lng;
      return acc;
    },
    { lat: 0, lng: 0 },
  );
  return {
    lat: total.lat / stops.length,
    lng: total.lng / stops.length,
  };
}

function MapAutoFit({ positions }: { positions: Array<[number, number]> }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) {
      return;
    }
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const fit = () => {
      try {
        if (positions.length === 1) {
          map.setView(positions[0], 9, { animate: true });
          return;
        }
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [40, 40], animate: true });
      } catch {
        // Map may not be fully ready; ignore to avoid _leaflet_pos crash
      }
    };

    map.whenReady(() => {
      map.invalidateSize();
      timeoutId = setTimeout(fit, 50);
    });

    return () => {
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [map, positions]);

  return null;
}

export default function TripMap({
  locale,
  stops,
  allDestinations,
  activeStopIndex,
  onActiveStopChange,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);
  if (stops.length === 0) {
    return (
      <div className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
        <div className="mb-3 text-sm font-semibold text-zinc-900">
          {locale === "ar" ? "خريطة الرحلة" : "Trip map"}
        </div>
        <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-white/60 bg-white/60 text-sm text-zinc-500">
          {locale === "ar" ? "لا توجد محطات للعرض." : "No stops to show."}
        </div>
      </div>
    );
  }

  const center = averageCenter(stops);
  const positions = stops.map((stop) => [stop.lat, stop.lng] as [number, number]);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  const imageCandidates = useMemo(() => {
    return stops.map((stop) => {
      const destination = allDestinations.find((item) => item.id === stop.id);
      const nameEn = destination?.name.en;
      const sameNameIds = nameEn
        ? allDestinations
            .filter((item) => item.name.en === nameEn)
            .map((item) => item.id)
        : [];
      const uniqueIds = Array.from(new Set([stop.id, ...sameNameIds]));
      return {
        id: stop.id,
        urls: uniqueIds.flatMap((id) =>
          IMAGE_EXTS.map((ext) => `/images/destinations/${id}${ext}`),
        ),
      };
    });
  }, [stops, allDestinations]);

  useEffect(() => {
    let cancelled = false;

    const resolveImage = async (urls: string[]) => {
      for (const url of urls) {
        const loaded = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
        if (loaded) {
          return url;
        }
      }
      return "/globe.svg";
    };

    const run = async () => {
      const entries = await Promise.all(
        imageCandidates.map(async (candidate) => [
          candidate.id,
          await resolveImage(candidate.urls),
        ]),
      );
      if (!cancelled) {
        setImageMap(Object.fromEntries(entries));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [imageCandidates]);

  return (
    <div className="h-full">
      {mounted ? (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: "100%", minHeight: 280 }}
          className="h-full rounded-3xl"
        >
          <MapAutoFit positions={positions} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={positions} pathOptions={{ color: "#0f172a" }} />
          {stops.map((stop, index) => {
            const isActive = index === activeStopIndex;
            const imageSrc = imageMap[stop.id] ?? "/globe.svg";
            const markerIconInstance = L.divIcon({
              className: "trip-marker",
              html: `
                <div style="
                  width: 42px;
                  height: 42px;
                  border-radius: 14px;
                  overflow: hidden;
                  border: 2px solid ${isActive ? "#f97316" : "#ffffff"};
                  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);
                  background: #fff;
                ">
                  <img src="${imageSrc}" style="width:100%;height:100%;object-fit:cover;" />
                </div>
              `,
              iconSize: [42, 42],
              iconAnchor: [21, 42],
              popupAnchor: [0, -38],
            });
            return (
              <Marker
                key={stop.id}
                position={[stop.lat, stop.lng]}
                icon={markerIconInstance}
                eventHandlers={{
                  click: () => onActiveStopChange(index),
                }}
              >
                <Popup>
                  <div className="text-sm font-semibold text-zinc-900">
                    {isActive ? "★ " : ""}
                    {stop.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {locale === "ar" ? "التوقف" : "Stop"} {index + 1}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <div className="h-full rounded-3xl bg-white/60" />
      )}
    </div>
  );
}
