"use client";

import { useState, useCallback } from "react";
import { InterferometerDiagram } from "@/components/interferometer-diagram";
import { StatisticsPanel } from "@/components/statistics-panel";
import { SimulationControls } from "@/components/simulation-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ExperimentResult {
  id: number;
  live: boolean;
  exploded: boolean;
  safe: boolean;
  path: "A" | "B";
  timestamp: Date;
}

interface PhotonPath {
  id: number;
  path: "A" | "B";
  exploded: boolean;
  safe: boolean;
}

interface Statistics {
  totalExperiments: number;
  liveBombs: number;
  dummyBombs: number;
  safelyIdentified: number;
  exploded: number;
  detectorD2: number;
}

export default function SimulationPage() {
  const [experiments, setExperiments] = useState<ExperimentResult[]>([]);
  const [currentPath, setCurrentPath] = useState<PhotonPath | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [batchCount, setBatchCount] = useState(100);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [stats, setStats] = useState<Statistics>({
    totalExperiments: 0,
    liveBombs: 0,
    dummyBombs: 0,
    safelyIdentified: 0,
    exploded: 0,
    detectorD2: 0,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"; //needs to be moved
  const runExperiment = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/run`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setConnectionError(null);

      const result: ExperimentResult = {
        id: experiments.length + 1,
        live: data.live,
        exploded: data.exploded,
        safe: data.safe > 0,
        path: data.path,
        timestamp: new Date(),
      };

      return result;
    } catch {
      setConnectionError(
        "Unable to connect to Spring Boot backend. Make sure it is running."
      );
      return null;
    }
  }, [experiments.length]);

  const updateStats = useCallback((result: ExperimentResult) => {
    setStats((prev) => ({
      totalExperiments: prev.totalExperiments + 1,
      liveBombs: prev.liveBombs + (result.live ? 1 : 0),
      dummyBombs: prev.dummyBombs + (result.live ? 0 : 1),
      safelyIdentified: prev.safelyIdentified + (result.safe ? 1 : 0),
      exploded: prev.exploded + (result.exploded ? 1 : 0),
      detectorD2:
        prev.detectorD2 + (!result.safe && !result.exploded ? 1 : 0),
    }));
  }, []);

  const handleRunSingle = useCallback(async () => {
    setIsRunning(true);

    const result = await runExperiment();
    if (result) {
      setCurrentPath({
        id: result.id,
        path: result.path,
        exploded: result.exploded,
        safe: result.safe,
      });

      // Wait for animation to complete
      setTimeout(() => {
        setExperiments((prev) => [...prev, result]);
        updateStats(result);
        setIsRunning(false);
      }, 1600);
    } else {
      setIsRunning(false);
    }
  }, [runExperiment, updateStats]);

  const handleRunBatch = useCallback(
    async (count: number) => {
      setIsRunning(true);
      setCurrentPath(null);

      const newExperiments: ExperimentResult[] = [];

      for (let i = 0; i < count; i++) {
        const result = await runExperiment();
        if (result) {
          result.id = experiments.length + newExperiments.length + 1;
          newExperiments.push(result);
          updateStats(result);
        } else {
          break;
        }

        // Small delay between requests to not overwhelm the backend
        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      setExperiments((prev) => [...prev, ...newExperiments]);
      setIsRunning(false);
    },
    [runExperiment, experiments.length, updateStats]
  );

  const handleReset = useCallback(() => {
    setExperiments([]);
    setCurrentPath(null);
    setStats({
      totalExperiments: 0,
      liveBombs: 0,
      dummyBombs: 0,
      safelyIdentified: 0,
      exploded: 0,
      detectorD2: 0,
    });
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
            Elitzur-Vaidman Bomb Tester
          </h1>
          <p className="text-muted-foreground text-pretty max-w-3xl">
            A quantum mechanics thought experiment demonstrating interaction-free
            measurement. This interferometer can detect whether a bomb is live
            without detonating it.
          </p>
        </header>

        {/* Connection Error Alert */}
        {connectionError && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Diagram */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Interferometer Diagram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InterferometerDiagram
                  currentPath={currentPath}
                  isRunning={isRunning}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Controls and Statistics */}
          <div className="space-y-6">
            <SimulationControls
              onRunSingle={handleRunSingle}
              onRunBatch={handleRunBatch}
              onReset={handleReset}
              isRunning={isRunning}
              batchCount={batchCount}
              onBatchCountChange={setBatchCount}
            />

            <StatisticsPanel stats={stats} />
          </div>
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              The Elitzur-Vaidman bomb tester uses quantum superposition to detect
              bombs without triggering them. A photon enters the interferometer and
              encounters a beam splitter (BS1), creating a superposition of two
              paths.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                <h4 className="font-medium text-accent mb-1">
                  Safe Detection (D1)
                </h4>
                <p className="text-xs">
                  If detector D1 clicks, we know the bomb is live without it
                  exploding. This is the &quot;interaction-free measurement.&quot;
                </p>
              </div>
              <div className="p-3 bg-chart-1/10 rounded-lg border border-chart-1/30">
                <h4 className="font-medium text-chart-1 mb-1">
                  Inconclusive (D2)
                </h4>
                <p className="text-xs">
                  Detector D2 clicking does not tell us whether the bomb is live or
                  a dud. We need to test again.
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                <h4 className="font-medium text-destructive mb-1">
                  Explosion
                </h4>
                <p className="text-xs">
                  If the photon takes Path B and the bomb is live, it explodes. We
                  lose the bomb but confirm it was live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
