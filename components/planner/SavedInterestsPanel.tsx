"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function SavedInterestsPanel() {
  const [mounted, setMounted] = useState(false);
  const savedInterests = useAppStore((state) => state.savedInterests);

  useEffect(() => {
    setMounted(true);
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
          {savedInterests.map((id) => (
            <li key={id} className="rounded-md bg-zinc-50 px-2 py-1">
              {id}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
