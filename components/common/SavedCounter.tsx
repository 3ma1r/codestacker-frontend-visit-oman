"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

type Props = {
  className?: string;
};

export default function SavedCounter({ className }: Props) {
  const [mounted, setMounted] = useState(false);
  const count = useAppStore((state) => state.savedInterests.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={["text-sm", className].filter(Boolean).join(" ")}>—</span>;
  }

  return (
    <span className={["text-sm", className].filter(Boolean).join(" ")}>
      {count}
    </span>
  );
}
