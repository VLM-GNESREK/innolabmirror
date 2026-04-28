"use client";

import { useEffect, useRef, useState } from "react";

import type { ExperimentKey } from "@/components/experiment-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StaticExperimentDiagramProps {
  experiment: Exclude<ExperimentKey, "bomb-tester">;
  currentPath?: { id: number; path: "A" | "B" } | null;
  isRunning: boolean;
}

export function StaticExperimentDiagram({
  experiment,
  currentPath,
  isRunning,
}: StaticExperimentDiagramProps) {
  const [photonPosition, setPhotonPosition] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!currentPath || !isRunning) return;

    setPhotonPosition(0);
    const startTime = performance.now();
    const duration = 1500;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setPhotonPosition(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPath, isRunning]);

  const photonCoords =
    experiment === "mach-zehnder"
      ? getMachZehnderCoordinates(currentPath, photonPosition)
      : getMichelsonMorleyCoordinates(currentPath, photonPosition);
  const isPathA = currentPath?.path === "A";
  const isPathB = currentPath?.path === "B";

  if (experiment === "mach-zehnder") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Interferometer Diagram
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card">
            <svg viewBox="0 0 450 300" className="h-full w-full aspect-[4/3]">
              <defs>
                <pattern id="grid-mz" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-mz)" opacity="0.3" />

              <text x="50" y="232" textAnchor="middle" className="fill-muted-foreground text-xs">Source</text>
              <text x="150" y="232" textAnchor="middle" className="fill-muted-foreground text-xs">BS1</text>
              <text x="150" y="80" textAnchor="middle" className="fill-muted-foreground text-xs">M1</text>
              <text x="300" y="232" textAnchor="middle" className="fill-muted-foreground text-xs">M2</text>
              <text x="300" y="80" textAnchor="middle" className="fill-muted-foreground text-xs">BS2</text>
              <text x="380" y="126" textAnchor="middle" className="fill-muted-foreground text-xs">A</text>
              <text x="300" y="26" textAnchor="middle" className="fill-muted-foreground text-xs">B</text>

              <circle cx="50" cy="200" r="15" className="fill-primary" />
              <text x="50" y="204" textAnchor="middle" className="fill-primary-foreground text-xs font-medium">
                hv
              </text>

              <path
                d="M 65 200 L 150 200 L 150 100 L 300 100"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-chart-1 ${isPathA ? "opacity-100" : "opacity-30"}`}
                strokeDasharray="5,5"
              />
              <path
                d="M 65 200 L 300 200 L 300 100"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-chart-2 ${isPathB ? "opacity-100" : "opacity-30"}`}
              />

              <rect x="140" y="190" width="20" height="20" className="fill-secondary stroke-foreground" strokeWidth="1" transform="rotate(45 150 200)" />
              <rect x="140" y="90" width="20" height="10" className="fill-muted stroke-foreground" strokeWidth="1" />
              <rect x="290" y="190" width="20" height="10" className="fill-muted stroke-foreground" strokeWidth="1" />
              <rect x="290" y="90" width="20" height="20" className="fill-secondary stroke-foreground" strokeWidth="1" transform="rotate(45 300 100)" />

              <circle cx="380" cy="100" r="14" className={isPathA ? "fill-accent" : "fill-muted"} />
              <circle cx="300" cy="50" r="14" className={isPathB ? "fill-chart-1" : "fill-muted"} />

              {photonCoords && (
                <circle cx={photonCoords.x} cy={photonCoords.y} r="7" className="fill-primary" />
              )}
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Interferometer Diagram
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card">
          <svg viewBox="0 0 450 300" className="h-full w-full aspect-[4/3]">
            <defs>
              <pattern id="grid-mm" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-mm)" opacity="0.3" />

            <text x="50" y="178" textAnchor="middle" className="fill-muted-foreground text-xs">Source</text>
            <text x="160" y="184" textAnchor="middle" className="fill-muted-foreground text-xs">BS</text>
            <text x="160" y="50" textAnchor="middle" className="fill-muted-foreground text-xs">Mirror</text>
            <text x="325" y="182" textAnchor="middle" className="fill-muted-foreground text-xs">Mirror</text>
            <text x="250" y="26" textAnchor="middle" className="fill-muted-foreground text-xs">Detector</text>
            <text x="245" y="220" textAnchor="middle" className="fill-muted-foreground text-xs">Arm length difference</text>

            <circle cx="50" cy="150" r="15" className="fill-primary" />
            <text x="50" y="154" textAnchor="middle" className="fill-primary-foreground text-xs font-medium">
              hv
            </text>

            <path
              d="M 65 150 L 160 150 L 160 70 L 160 150 L 250 150"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-chart-1 ${isPathA ? "opacity-100" : "opacity-30"}`}
              strokeDasharray="5,5"
            />
            <path
              d="M 160 150 L 330 150 L 250 150 L 250 60"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-chart-2 ${isPathB ? "opacity-100" : "opacity-30"}`}
            />

            <rect x="150" y="140" width="20" height="20" className="fill-secondary stroke-foreground" strokeWidth="1" transform="rotate(45 160 150)" />
            <rect x="150" y="60" width="20" height="10" className="fill-muted stroke-foreground" strokeWidth="1" />
            <rect x="320" y="145" width="10" height="20" className="fill-muted stroke-foreground" strokeWidth="1" />

            <circle cx="250" cy="50" r="14" className={isPathA ? "fill-accent" : "fill-muted"} />

            <path d="M 160 194 Q 245 229 330 194" fill="none" stroke="currentColor" strokeWidth="2" className="text-chart-3" strokeDasharray="4,4" />
            {photonCoords && (
              <circle cx={photonCoords.x} cy={photonCoords.y} r="7" className="fill-primary" />
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

function getMachZehnderCoordinates(
  currentPath: { id: number; path: "A" | "B" } | null | undefined,
  photonPosition: number
) {
  if (!currentPath || photonPosition === 0) return null;

  const progress = photonPosition;

  if (progress < 0.2) {
    const t = progress / 0.2;
    return { x: 50 + t * 100, y: 200 };
  }

  if (progress < 0.5) {
    const t = (progress - 0.2) / 0.3;
    return currentPath.path === "A"
      ? { x: 150, y: 200 - t * 100 }
      : { x: 150 + t * 150, y: 200 };
  }

  if (progress < 0.8) {
    const t = (progress - 0.5) / 0.3;
    return currentPath.path === "A"
      ? { x: 150 + t * 150, y: 100 }
      : { x: 300, y: 200 - t * 100 };
  }

  const t = (progress - 0.8) / 0.2;
  return currentPath.path === "A"
    ? { x: 300 + t * 80, y: 100 }
    : { x: 300, y: 100 - t * 50 };
}

function getMichelsonMorleyCoordinates(
  currentPath: { id: number; path: "A" | "B" } | null | undefined,
  photonPosition: number
) {
  if (!currentPath || photonPosition === 0) return null;

  const progress = photonPosition;

  if (progress < 0.25) {
    const t = progress / 0.25;
    return { x: 50 + t * 110, y: 150 };
  }

  if (progress < 0.55) {
    const t = (progress - 0.25) / 0.3;
    return currentPath.path === "A"
      ? { x: 160, y: 150 - t * 80 }
      : { x: 160 + t * 170, y: 150 };
  }

  if (progress < 0.8) {
    const t = (progress - 0.55) / 0.25;
    return currentPath.path === "A"
      ? { x: 160, y: 70 + t * 80 }
      : { x: 330 - t * 80, y: 150 };
  }

  const t = (progress - 0.8) / 0.2;
  return { x: 250, y: 150 - t * 100 };
}
