import type { RegionAllocation } from "../../types/planner";

type Props = {
  allocation: RegionAllocation[];
};

export default function RegionAllocationSummary({ allocation }: Props) {
  if (allocation.length === 0) {
    return <p className="text-sm text-zinc-500">No region allocation.</p>;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
      <span className="font-medium text-zinc-900">Region allocation:</span>{" "}
      {allocation
        .map((item) => `${item.region} ×${item.days} day${item.days > 1 ? "s" : ""}`)
        .join(", ")}
    </div>
  );
}
