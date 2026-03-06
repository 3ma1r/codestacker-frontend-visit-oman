import type { Destination } from "../../types/destination";

type Props = {
  level: Destination["crowd_level"];
};

export default function CrowdViz({ level }: Props) {
  return (
    <div className="flex items-center gap-1" aria-label={`Crowd level ${level}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const isActive = index < level;
        return (
          <span
            key={index}
            className={[
              "h-2.5 w-2.5 rounded-full border",
              isActive ? "bg-zinc-900 border-zinc-900" : "border-zinc-300",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
