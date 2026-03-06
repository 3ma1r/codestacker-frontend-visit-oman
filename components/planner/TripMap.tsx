"use client";

import { useEffect } from "react";
import type { Locale } from "../../lib/i18n/locale";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type Stop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type Props = {
  locale: Locale;
  stops: Stop[];
  activeStopIndex: number;
  onActiveStopChange: (index: number) => void;
};

const MAP_HEIGHT = 420;

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

export default function TripMap({
  locale,
  stops,
  activeStopIndex,
  onActiveStopChange,
}: Props) {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  if (stops.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500">
        No stops to show.
      </div>
    );
  }

  const center = averageCenter(stops);
  const positions = stops.map((stop) => [stop.lat, stop.lng] as [number, number]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-2">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: MAP_HEIGHT }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={positions} pathOptions={{ color: "#0f172a" }} />
        {stops.map((stop, index) => {
          const isActive = index === activeStopIndex;
          return (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
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
    </div>
  );
}
