"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

type Props = {
  destinationId: string;
};

export default function SaveInterestButton({ destinationId }: Props) {
  const [mounted, setMounted] = useState(false);
  const isSaved = useAppStore((state) => state.isSaved(destinationId));
  const toggleSave = useAppStore((state) => state.toggleSave);

  useEffect(() => {
    setMounted(true);
  }, []);

  const label = mounted && isSaved ? "Saved" : "Save";

  return (
    <button
      type="button"
      onClick={() => toggleSave(destinationId)}
      className={[
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition",
        mounted && isSaved
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 text-zinc-600",
      ].join(" ")}
      aria-pressed={mounted ? isSaved : undefined}
    >
      <span
        className={[
          "inline-block h-2 w-2 rounded-full",
          mounted && isSaved ? "bg-emerald-500" : "bg-zinc-300",
        ].join(" ")}
      />
      {label}
    </button>
  );
}
