"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "../../lib/i18n/locale";
import { loadDestinations } from "../../lib/data/load";
import { tName } from "../../lib/i18n/strings";
import { useAppStore } from "../../store/useAppStore";

type Props = {
  locale: Locale;
};

export default function SavedInterestsPanel({ locale }: Props) {
  const [mounted, setMounted] = useState(false);
  const savedInterests = useAppStore((state) => state.savedInterests);
  const destinations = useMemo(() => loadDestinations(), []);
  const byId = useMemo(
    () => new Map(destinations.map((destination) => [destination.id, destination])),
    [destinations],
  );

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Saved interests</h2>
        <p className="text-sm text-zinc-500">Loading saved items…</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Saved interests</h2>
      {savedInterests.length === 0 ? (
        <p className="text-sm text-zinc-500">No saved destinations yet.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-zinc-700">
          {savedInterests.map((id) => {
            const destination = byId.get(id);
            const label = destination ? tName(destination, locale) : id;
            return (
              <li key={id} className="rounded-md bg-zinc-50 px-2 py-1">
                <Link href={`/${locale}/destinations/${id}`}>{label}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
