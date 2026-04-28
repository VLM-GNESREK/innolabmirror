"use client";

import { cn } from "@/lib/utils";

export type ExperimentKey = "bomb-tester" | "mach-zehnder" | "michelson-morley";

interface ExperimentSidebarProps {
  activeExperiment: ExperimentKey;
  onSelect: (experiment: ExperimentKey) => void;
}

const experiments: Array<{
  id: ExperimentKey;
  title: string;
  summary: string;
}> = [
  {
    id: "bomb-tester",
    title: "Bomb Tester",
    summary: "Interaction-free measurement with a live or dud bomb.",
  },
  {
    id: "mach-zehnder",
    title: "Mach-Zehnder",
    summary: "Beam splitters and interference in a two-path setup.",
  },
  {
    id: "michelson-morley",
    title: "Michelson-Morley",
    summary: "Interference shifts from different arm lengths.",
  },
];

export function ExperimentSidebar({
  activeExperiment,
  onSelect,
}: ExperimentSidebarProps) {
  return (
    <aside className="rounded-2xl border border-sidebar-border bg-sidebar p-3">
      <div className="mb-4 px-3 pt-2">
        <p className="text-sm font-semibold text-sidebar-foreground">
          Quantum Experiments
        </p>
      </div>

      <nav className="space-y-2">
        {experiments.map((experiment) => {
          const isActive = experiment.id === activeExperiment;

          return (
            <button
              key={experiment.id}
              type="button"
              onClick={() => onSelect(experiment.id)}
              className={cn(
                "w-full rounded-xl border px-3 py-3 text-left transition-colors",
                isActive
                  ? "border-sidebar-primary bg-sidebar-primary/10"
                  : "border-transparent bg-transparent hover:border-sidebar-border hover:bg-sidebar-accent"
              )}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {experiment.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {experiment.summary}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
