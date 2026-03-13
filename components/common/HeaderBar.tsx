"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SavedCounter from "./SavedCounter";

type Props = {
  locale: string;
  rtl: boolean;
  switchPath: string;
  labels: {
    discover: string;
    destinations: string;
    planner: string;
    language: string;
  };
};

export default function HeaderBar({
  locale,
  rtl,
  switchPath,
  labels,
}: Props) {
  const pathname = usePathname() ?? "";
  const isDetailsPage = /\/destinations\/[^/]+$/.test(pathname);
  const isSavedPage = /\/saved$/.test(pathname);
  const useDarkNav = isDetailsPage || isSavedPage;
  const headerTextClass = useDarkNav ? "!text-zinc-900" : "text-white";
  const headerLinkClass = useDarkNav
    ? "transition hover:text-zinc-700 hover:underline"
    : "transition hover:text-white/90 hover:underline";
  const counterTextClass = useDarkNav ? "text-zinc-900" : "text-white";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full"
      style={{ position: "fixed", top: 0, left: 0, right: 0 }}
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div
          className={`flex items-center justify-between rounded-full border border-white/30 bg-white/20 px-6 py-3 shadow-2xl backdrop-blur-xl ${
            rtl ? "flex-row-reverse" : ""
          }`}
        >
          <nav className={`flex items-center gap-6 text-base font-semibold ${headerTextClass}`}>
            <Link
              className={[headerLinkClass, headerTextClass].join(" ")}
              href={`/${locale}`}
            >
              {labels.discover}
            </Link>
            <Link
              className={[headerLinkClass, headerTextClass].join(" ")}
              href={`/${locale}/destinations`}
            >
              {labels.destinations}
            </Link>
            <Link
              className={[headerLinkClass, headerTextClass].join(" ")}
              href={`/${locale}/planner`}
            >
              {labels.planner}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/saved`}
              className={[
                "flex items-center gap-2 rounded-full border border-transparent bg-white/10 px-3 py-1 text-sm font-medium transition hover:bg-white/20",
                headerTextClass,
              ].join(" ")}
            >
              <span className={["text-sm", headerTextClass].join(" ")}>❤</span>
              <SavedCounter className={[counterTextClass, headerTextClass].join(" ")} />
            </Link>
            <Link
              href={switchPath}
              className={[
                "rounded-full border border-transparent bg-white/10 px-3 py-1 text-sm font-medium transition hover:bg-white/20",
                headerTextClass,
              ].join(" ")}
            >
              {labels.language}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
