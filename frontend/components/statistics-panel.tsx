"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Statistics {
  totalExperiments: number;
  liveBombs: number;
  dummyBombs: number;
  safelyIdentified: number;
  exploded: number;
  detectorD2: number;
}

interface StatisticsPanelProps {
  stats: Statistics;
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  const safeDetectionRate =
    stats.liveBombs > 0
      ? ((stats.safelyIdentified / stats.liveBombs) * 100).toFixed(1)
      : "0.0";

  const explosionRate =
    stats.liveBombs > 0
      ? ((stats.exploded / stats.liveBombs) * 100).toFixed(1)
      : "0.0";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground">Total Experiments</p>
            <p className="text-xl font-bold">{stats.totalExperiments}</p>
          </div>

          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground">Live Bombs</p>
            <p className="text-xl font-bold text-chart-3">{stats.liveBombs}</p>
          </div>

          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground">Dummy Bombs</p>
            <p className="text-xl font-bold text-muted-foreground">
              {stats.dummyBombs}
            </p>
          </div>

          <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
            <p className="text-xs text-accent">Safely Identified (D1)</p>
            <p className="text-xl font-bold text-accent">
              {stats.safelyIdentified}
            </p>
            <p className="text-xs text-muted-foreground">
              {safeDetectionRate}% of live
            </p>
          </div>

          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
            <p className="text-xs text-destructive">Exploded</p>
            <p className="text-xl font-bold text-destructive">
              {stats.exploded}
            </p>
            <p className="text-xs text-muted-foreground">
              {explosionRate}% of live
            </p>
          </div>

          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground">Detector D2</p>
            <p className="text-xl font-bold text-chart-1">{stats.detectorD2}</p>
            <p className="text-xs text-muted-foreground">Inconclusive</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
