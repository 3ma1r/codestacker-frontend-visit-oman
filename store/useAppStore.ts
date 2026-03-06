"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlannerInputs, PlannerResult } from "../types/planner";

type AppState = {
  version: 1;
  locale: "en" | "ar";
  savedInterests: string[];
  plannerInputs: PlannerInputs | null;
  plannerResult: PlannerResult | null;
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearSaved: () => void;
  setPlannerInputs: (inputs: PlannerInputs) => void;
  setPlannerResult: (result: PlannerResult) => void;
  clearPlanner: () => void;
};

const initialState = {
  version: 1 as const,
  locale: "en" as const,
  savedInterests: [] as string[],
  plannerInputs: null,
  plannerResult: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleSave: (id) =>
        set((state) => {
          const exists = state.savedInterests.includes(id);
          return {
            savedInterests: exists
              ? state.savedInterests.filter((savedId) => savedId !== id)
              : [...state.savedInterests, id],
          };
        }),
      isSaved: (id) => get().savedInterests.includes(id),
      clearSaved: () => set({ savedInterests: [] }),
      setPlannerInputs: (inputs) => set({ plannerInputs: inputs }),
      setPlannerResult: (result) => set({ plannerResult: result }),
      clearPlanner: () => set({ plannerInputs: null, plannerResult: null }),
    }),
    {
      name: "visitoman:v1",
      version: 1,
      partialize: (state) => ({
        version: state.version,
        locale: state.locale,
        savedInterests: state.savedInterests,
        plannerInputs: state.plannerInputs,
        plannerResult: state.plannerResult,
      }),
    },
  ),
);
