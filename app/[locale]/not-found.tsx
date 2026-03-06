import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link href="/en" className="text-sm font-medium underline">
        Back to home
      </Link>
    </div>
  );
}
