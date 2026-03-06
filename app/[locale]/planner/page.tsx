import SavedInterestsPanel from "../../../components/planner/SavedInterestsPanel";

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Planner (CSR placeholder)</h1>
        <p className="text-sm text-zinc-500">
          Planner logic will be added later. Saved interests are listed below.
        </p>
      </header>

      <SavedInterestsPanel />
    </div>
  );
}
