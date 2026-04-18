"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Zap } from "lucide-react";

interface SimulationControlsProps {
  onRunSingle: () => void;
  onRunBatch: (count: number) => void;
  onReset: () => void;
  isRunning: boolean;
  batchCount: number;
  onBatchCountChange: (count: number) => void;
}

export function SimulationControls({
  onRunSingle,
  onRunBatch,
  onReset,
  isRunning,
  batchCount,
  onBatchCountChange,
}: SimulationControlsProps) {
  return (
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
            <Play className="w-4 h-4 mr-2" />
            Run Single
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch-count" className="text-sm">
            Batch Size
          </Label>
          <div className="flex gap-2">
            <Input
              id="batch-count"
              type="number"
              min={1}
              max={1000}
              value={batchCount}
              onChange={(e) => onBatchCountChange(parseInt(e.target.value) || 1)}
              className="flex-1"
            />
            <Button
              onClick={() => onRunBatch(batchCount)}
              disabled={isRunning}
              variant="secondary"
            >
              <Zap className="w-4 h-4 mr-2" />
              Run Batch
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Single mode shows photon animation. Batch mode runs experiments quickly for statistical analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
