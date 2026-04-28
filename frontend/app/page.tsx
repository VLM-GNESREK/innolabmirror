"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";

import {
  ExperimentSidebar,
  type ExperimentKey,
} from "@/components/experiment-sidebar";
import { InterferometerDiagram } from "@/components/interferometer-diagram";
import { StaticExperimentDiagram } from "@/components/static-experiment-diagram";
import { StaticExperimentPanel } from "@/components/static-experiment-panel";
import { StatisticsPanel } from "@/components/statistics-panel";
import { SimulationControls } from "@/components/simulation-controls";
import { useBombTester } from "@/hooks/use-bomb-tester";
import { useMachZehnder } from "@/hooks/use-mach-zehnder";
import { useMichelsonMorley } from "@/hooks/use-michelson-morley";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experimentContent: Record<
  ExperimentKey,
  {
    title: string;
    description: string;
  }
> = {
  "bomb-tester": {
    title: "Elitzur-Vaidman Bomb Tester",
    description:
      "A quantum mechanics thought experiment demonstrating interaction-free measurement. This interferometer can detect whether a bomb is live without detonating it.",
  },
  "mach-zehnder": {
    title: "Mach-Zehnder Interferometer",
    description:
      "A simple two-path interferometer that shows how beam splitters and mirrors recombine light into interference patterns.",
  },
  "michelson-morley": {
    title: "Michelson-Morley Interferometer",
    description:
      "A two-arm setup used to compare path lengths and observe how phase differences change the interference result at the detector.",
  },
};

export default function SimulationPage() {
  const [activeExperiment, setActiveExperiment] =
    useState<ExperimentKey>("bomb-tester");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const bombTester = useBombTester(API_BASE_URL);
  const machZehnder = useMachZehnder(API_BASE_URL);
  const michelsonMorley = useMichelsonMorley(API_BASE_URL);

  const activeContent = useMemo(
    () => experimentContent[activeExperiment],
    [activeExperiment]
  );

  const isBombTester = activeExperiment === "bomb-tester";
  const activeAnimatedPath = isBombTester
    ? bombTester.currentPath
    : activeExperiment === "mach-zehnder"
      ? machZehnder.currentPath
      : michelsonMorley.currentPath;
  const activeIsRunning = isBombTester
    ? bombTester.isRunning
    : activeExperiment === "mach-zehnder"
      ? machZehnder.isRunning
      : michelsonMorley.isRunning;
  const activeConnectionError = isBombTester
    ? bombTester.connectionError
    : activeExperiment === "mach-zehnder"
      ? machZehnder.connectionError
      : michelsonMorley.connectionError;

  const machMetrics = useMemo(
    () => [
      { label: "Total Photons", value: machZehnder.stats.totalExperiments },
      { label: "Bright Port (A)", value: machZehnder.stats.detectorA, tone: "accent" as const },
      { label: "Dark Port (B)", value: machZehnder.stats.detectorB },
      { label: "Phase Shift", value: machZehnder.phaseShift.toFixed(2) },
      {
        label: "Preferred Output",
        value:
          machZehnder.stats.detectorA === machZehnder.stats.detectorB
            ? "-"
            : machZehnder.stats.detectorA > machZehnder.stats.detectorB
              ? "A"
              : "B",
      },
      { label: "Last Detection", value: machZehnder.stats.lastPath ?? "-" },
    ],
    [machZehnder.phaseShift, machZehnder.stats]
  );

  const michelsonMetrics = useMemo(() => {
    const visibility =
      michelsonMorley.stats.totalExperiments > 0
        ? Math.abs(
            (michelsonMorley.stats.constructive - michelsonMorley.stats.destructive) /
              michelsonMorley.stats.totalExperiments
          ).toFixed(2)
        : "0.00";

    return [
      { label: "Total Photons", value: michelsonMorley.stats.totalExperiments },
      {
        label: "Bright Detector",
        value: michelsonMorley.stats.constructive,
        tone: "accent" as const,
      },
      {
        label: "Dark Output",
        value: michelsonMorley.stats.destructive,
        tone: "destructive" as const,
      },
      {
        label: "Arm Length Difference",
        value: michelsonMorley.armLengthDifference,
        note: "nm",
      },
      { label: "Interference Visibility", value: visibility },
      { label: "Last Detection", value: michelsonMorley.stats.lastPath ?? "-" },
    ];
  }, [michelsonMorley.armLengthDifference, michelsonMorley.stats]);

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ExperimentSidebar
          activeExperiment={activeExperiment}
          onSelect={setActiveExperiment}
        />

        <div className="space-y-6">
          <header className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {activeContent.title}
            </h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              {activeContent.description}
            </p>
          </header>

          {activeConnectionError && (
            <Alert variant="destructive">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>{activeConnectionError}</AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              {isBombTester ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Interferometer Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InterferometerDiagram
                      currentPath={bombTester.currentPath}
                      isRunning={bombTester.isRunning}
                    />
                  </CardContent>
                </Card>
              ) : (
                <StaticExperimentDiagram
                  experiment={activeExperiment}
                  currentPath={activeAnimatedPath}
                  isRunning={activeIsRunning}
                />
              )}
            </div>

            <div className="space-y-6">
              {isBombTester ? (
                <>
                  <SimulationControls
                    onRunSingle={bombTester.runSingle}
                    onRunBatch={bombTester.runBatch}
                    onReset={bombTester.reset}
                    isRunning={bombTester.isRunning}
                    batchCount={bombTester.batchCount}
                    onBatchCountChange={bombTester.setBatchCount}
                  />
                  <StatisticsPanel stats={bombTester.stats} />
                </>
              ) : (
                activeExperiment === "mach-zehnder" ? (
                  <StaticExperimentPanel
                    experiment="mach-zehnder"
                    onRunSingle={machZehnder.runSingle}
                    onRunBatch={machZehnder.runBatch}
                    onReset={machZehnder.reset}
                    isRunning={machZehnder.isRunning}
                    batchCount={machZehnder.batchCount}
                    onBatchCountChange={machZehnder.setBatchCount}
                    phaseShift={machZehnder.phaseShift}
                    onPhaseShiftChange={machZehnder.setPhaseShift}
                    metrics={machMetrics}
                  />
                ) : (
                  <StaticExperimentPanel
                    experiment="michelson-morley"
                    onRunSingle={michelsonMorley.runSingle}
                    onRunBatch={michelsonMorley.runBatch}
                    onReset={michelsonMorley.reset}
                    isRunning={michelsonMorley.isRunning}
                    batchCount={michelsonMorley.batchCount}
                    onBatchCountChange={michelsonMorley.setBatchCount}
                    armLengthDifference={michelsonMorley.armLengthDifference}
                    onArmLengthDifferenceChange={
                      michelsonMorley.setArmLengthDifference
                    }
                    metrics={michelsonMetrics}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
