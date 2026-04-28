"use client";

import { Play, RotateCcw, Zap } from "lucide-react";

import type { ExperimentKey } from "@/components/experiment-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StaticMetric {
  label: string;
  value: string | number;
  note?: string;
  tone?: "default" | "accent" | "destructive";
}

interface StaticExperimentPanelSharedProps {
  onRunSingle: () => void;
  onRunBatch: (count: number) => void;
  onReset: () => void;
  isRunning: boolean;
  batchCount: number;
  onBatchCountChange: (count: number) => void;
  metrics: StaticMetric[];
}

type StaticExperimentPanelProps =
  | (StaticExperimentPanelSharedProps & {
      experiment: "mach-zehnder";
      phaseShift: number;
      onPhaseShiftChange: (value: number) => void;
    })
  | (StaticExperimentPanelSharedProps & {
      experiment: "michelson-morley";
      armLengthDifference: number;
      onArmLengthDifferenceChange: (value: number) => void;
    });

export function StaticExperimentPanel(props: StaticExperimentPanelProps) {
  const {
    experiment,
    onRunSingle,
    onRunBatch,
    onReset,
    isRunning,
    batchCount,
    onBatchCountChange,
    metrics,
  } = props;
  const isMichelson = experiment === "michelson-morley";
  const isMachZehnder = experiment === "mach-zehnder";

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={onRunSingle}
              disabled={isRunning}
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Single
            </Button>
            <Button onClick={onReset} variant="outline" disabled={isRunning}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {isMachZehnder && (
            <div className="space-y-2">
              <Label htmlFor="phase-shift" className="text-sm">
                Phase Shift
              </Label>
              <Input
                id="phase-shift"
                type="number"
                step="0.1"
                value={props.phaseShift}
                onChange={(e) =>
                  props.onPhaseShiftChange(parseFloat(e.target.value) || 0)
                }
                disabled={isRunning}
              />
            </div>
          )}

          {isMichelson && (
            <div className="space-y-2">
              <Label htmlFor="arm-length-difference" className="text-sm">
                Arm Length Difference
              </Label>
              <Input
                id="arm-length-difference"
                type="number"
                step="0.1"
                value={props.armLengthDifference}
                onChange={(e) =>
                  props.onArmLengthDifferenceChange(parseFloat(e.target.value) || 0)
                }
                disabled={isRunning}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`${experiment}-batch-count`} className="text-sm">
              Batch Size
            </Label>
            <div className="flex gap-2">
              <Input
                id={`${experiment}-batch-count`}
                type="number"
                min={1}
                max={1000}
                value={batchCount}
                onChange={(e) => onBatchCountChange(parseInt(e.target.value) || 1)}
                className="flex-1"
                disabled={isRunning}
              />
              <Button
                onClick={() => onRunBatch(batchCount)}
                disabled={isRunning}
                variant="secondary"
              >
                <Zap className="mr-2 h-4 w-4" />
                Run Batch
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={
                  metric.tone === "accent"
                    ? "rounded-lg border border-accent/30 bg-accent/10 p-3"
                    : metric.tone === "destructive"
                      ? "rounded-lg border border-destructive/30 bg-destructive/10 p-3"
                      : "rounded-lg bg-secondary p-3"
                }
              >
                <p
                  className={
                    metric.tone === "accent"
                      ? "text-xs text-accent"
                      : metric.tone === "destructive"
                        ? "text-xs text-destructive"
                        : "text-xs text-muted-foreground"
                  }
                >
                  {metric.label}
                </p>
                <p
                  className={
                    metric.tone === "accent"
                      ? "text-xl font-bold text-accent"
                      : metric.tone === "destructive"
                        ? "text-xl font-bold text-destructive"
                        : "text-xl font-bold"
                  }
                >
                  {metric.value}
                </p>
                {metric.note && (
                  <p className="text-xs text-muted-foreground">{metric.note}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
