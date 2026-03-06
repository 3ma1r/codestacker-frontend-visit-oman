type Props = {
  lat: number;
  lng: number;
};

export default function MapPreview({ lat, lng }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
      <div className="mb-2 font-medium text-zinc-800">Map preview</div>
      <div>Lat: {lat.toFixed(5)}</div>
      <div>Lng: {lng.toFixed(5)}</div>
    </div>
  );
}
