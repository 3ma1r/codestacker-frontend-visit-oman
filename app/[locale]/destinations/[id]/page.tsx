export default function DestinationDetailsPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return (
    <div className="text-2xl font-semibold">
      Destination Details for {params.id} (pre-render placeholder)
    </div>
  );
}
