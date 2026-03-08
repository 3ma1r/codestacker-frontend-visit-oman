"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function SavedCounter() {
  const [mounted, setMounted] = useState(false);
  const count = useAppStore((state) => state.savedInterests.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="text-sm text-zinc-500">—</span>;
  }

  return <span className="text-sm text-zinc-500">{count}</span>;
}
