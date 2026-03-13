type Props = {
  lat: number;
  lng: number;
};

export default function MapPreview({ lat, lng }: Props) {
  const center = `${lat},${lng}`;
  const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&z=12&output=embed`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-600">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-medium text-zinc-800">Map preview</div>
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-zinc-600 underline"
        >
          Open map
        </a>
      </div>
      <div className="h-64 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <iframe
          src={embedSrc}
          className="h-64 w-full rounded-xl border"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-2 text-xs text-zinc-500">
        Coordinates: {lat.toFixed(5)} · {lng.toFixed(5)}
      </div>
    </div>
  );
}
