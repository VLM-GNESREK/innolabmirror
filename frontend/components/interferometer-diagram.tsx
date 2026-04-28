"use client";

import { useEffect, useRef, useState } from "react";

interface PhotonPath {
  id: number;
  path: "A" | "B";
  exploded?: boolean;
  safe?: boolean;
}

interface InterferometerDiagramProps {
  currentPath?: PhotonPath | null;
  isRunning: boolean;
}

export function InterferometerDiagram({
  currentPath,
  isRunning,
}: InterferometerDiagramProps) {
  const [photonPosition, setPhotonPosition] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentPath && isRunning) {
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
    }
  }, [currentPath, isRunning]);

  const getPhotonCoordinates = () => {
    if (!currentPath || photonPosition === 0) return null;

    const progress = photonPosition;

    // Path segments for the interferometer
    if (progress < 0.2) {
      // Source to first beam splitter
      const t = progress / 0.2;
      return { x: 50 + t * 100, y: 200 };
    } else if (progress < 0.5) {
      const t = (progress - 0.2) / 0.3;
      if (currentPath.path === "A") {
        // Upper path (reflected) - goes to upper mirror
        return { x: 150, y: 200 - t * 100 };
      } else {
        // Lower path (transmitted) - goes toward bomb
        return { x: 150 + t * 150, y: 200 };
      }
    } else if (progress < 0.8) {
      const t = (progress - 0.5) / 0.3;
      if (currentPath.path === "A") {
        // Upper path - from mirror to second beam splitter
        return { x: 150 + t * 150, y: 100 };
      } else {
        // Lower path - from bomb area to second beam splitter
        if (currentPath.exploded) {
          return null; // Bomb exploded, photon absorbed
        }
        return { x: 300, y: 200 - t * 100 };
      }
    } else {
      const t = (progress - 0.8) / 0.2;
      // To detector
      if (currentPath.safe) {
        return { x: 300 + t * 80, y: 100 };
      } else {
        return { x: 300, y: 100 - t * 50 };
      }
    }
  };

  const photonCoords = getPhotonCoordinates();

  return (
    <div className="relative w-full aspect-[4/3] bg-card rounded-lg border border-border overflow-hidden">
      <svg viewBox="0 0 450 300" className="w-full h-full">
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

        {/* Labels */}
        <text x="50" y="232" textAnchor="middle" className="fill-muted-foreground text-xs">
          Source
        </text>
        <text x="150" y="232" textAnchor="middle" className="fill-muted-foreground text-xs">
          BS1
        </text>
        <text x="150" y="80" textAnchor="middle" className="fill-muted-foreground text-xs">
          M1
        </text>
        <text x="300" y="232" textAnchor="middle" className="fill-muted-foreground text-xs">
          Bomb
        </text>
        <text x="300" y="80" textAnchor="middle" className="fill-muted-foreground text-xs">
          BS2
        </text>
        <text x="380" y="126" textAnchor="middle" className="fill-muted-foreground text-xs">
          D1
        </text>
        <text x="300" y="26" textAnchor="middle" className="fill-muted-foreground text-xs">
          D2
        </text>

        {/* Photon source */}
        <circle cx="50" cy="200" r="15" className="fill-primary" />
        <text
          x="50"
          y="204"
          textAnchor="middle"
          className="fill-primary-foreground text-xs font-medium"
        >
          hv
        </text>

        {/* Path A (Upper) - Reflected path */}
        <path
          d="M 65 200 L 150 200"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-chart-1 ${
            currentPath?.path === "A" && photonPosition > 0.2
              ? "opacity-100"
              : "opacity-30"
          }`}
          strokeDasharray="5,5"
        />
        <path
          d="M 150 200 L 150 100"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-chart-1 ${
            currentPath?.path === "A" && photonPosition > 0.2
              ? "opacity-100"
              : "opacity-30"
          }`}
          strokeDasharray="5,5"
        />
        <path
          d="M 150 100 L 300 100"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-chart-1 ${
            currentPath?.path === "A" && photonPosition > 0.5
              ? "opacity-100"
              : "opacity-30"
          }`}
          strokeDasharray="5,5"
        />

        {/* Path B (Lower) - Transmitted path */}
        <path
          d="M 65 200 L 300 200"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-chart-2 ${
            currentPath?.path === "B" && photonPosition > 0.2
              ? "opacity-100"
              : "opacity-30"
          }`}
        />
        <path
          d="M 300 200 L 300 100"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-chart-2 ${
            currentPath?.path === "B" && photonPosition > 0.5 && !currentPath.exploded
              ? "opacity-100"
              : "opacity-30"
          }`}
        />

        {/* First beam splitter (BS1) */}
        <rect
          x="140"
          y="190"
          width="20"
          height="20"
          className="fill-secondary stroke-foreground"
          strokeWidth="1"
          transform="rotate(45 150 200)"
        />

        {/* Upper mirror (M1) */}
        <rect
          x="140"
          y="90"
          width="20"
          height="10"
          className="fill-muted stroke-foreground"
          strokeWidth="1"
        />

        {/* Bomb position */}
        <g transform="translate(300, 200)">
          <circle
            r="18"
            className={`${
              currentPath?.exploded
                ? "fill-destructive animate-pulse"
                : "fill-chart-4"
            }`}
          />
          <text
            y="5"
            textAnchor="middle"
            className="fill-foreground text-xs font-bold"
          >
            {currentPath?.exploded ? "!" : "B"}
          </text>
          {currentPath?.exploded && (
            <>
              <circle r="25" className="fill-destructive opacity-30" />
              <circle r="35" className="fill-destructive opacity-10" />
            </>
          )}
        </g>

        {/* Second beam splitter (BS2) */}
        <rect
          x="290"
          y="90"
          width="20"
          height="20"
          className="fill-secondary stroke-foreground"
          strokeWidth="1"
          transform="rotate(45 300 100)"
        />

        {/* Detector D1 (interaction-free detection) */}
        <rect
          x="360"
          y="85"
          width="30"
          height="30"
          rx="4"
          className={`${
            currentPath?.safe ? "fill-accent" : "fill-muted"
          } stroke-foreground`}
          strokeWidth="1"
        />
        <text
          x="375"
          y="105"
          textAnchor="middle"
          className="fill-accent-foreground text-xs font-medium"
        >
          D1
        </text>

        {/* Detector D2 */}
        <rect
          x="285"
          y="30"
          width="30"
          height="30"
          rx="4"
          className={`${
            currentPath && !currentPath.safe && !currentPath.exploded
              ? "fill-chart-1"
              : "fill-muted"
          } stroke-foreground`}
          strokeWidth="1"
        />
        <text
          x="300"
          y="50"
          textAnchor="middle"
          className="fill-foreground text-xs font-medium"
        >
          D2
        </text>

        {/* Animated photon */}
        {photonCoords && (
          <g>
            <circle
              cx={photonCoords.x}
              cy={photonCoords.y}
              r="8"
              className="fill-chart-4"
            />
            <circle
              cx={photonCoords.x}
              cy={photonCoords.y}
              r="12"
              className="fill-chart-4 opacity-30"
            />
          </g>
        )}

        {/* Path labels in diagram */}
        <text x="100" y="145" className="fill-chart-1 text-xs font-medium">
          Path A
        </text>
        <text x="220" y="220" className="fill-chart-2 text-xs font-medium">
          Path B
        </text>
      </svg>
    </div>
  );
}
