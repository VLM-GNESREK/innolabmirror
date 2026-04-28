"use client";

import { useCallback, useState } from "react";

interface PhotonPath {
  id: number;
  path: "A" | "B";
  exploded?: boolean;
  safe?: boolean;
}

interface BombStatistics {
  totalExperiments: number;
  liveBombs: number;
  dummyBombs: number;
  safelyIdentified: number;
  exploded: number;
  detectorD2: number;
}

interface BombExperimentResponse {
  live: boolean;
  exploded: boolean;
  safe: boolean;
  path: "A" | "B";
}

const INITIAL_STATS: BombStatistics = {
  totalExperiments: 0,
  liveBombs: 0,
  dummyBombs: 0,
  safelyIdentified: 0,
  exploded: 0,
  detectorD2: 0,
};

const ANIMATION_DURATION_MS = 1600;
const BATCH_DELAY_MS = 50;
const CONNECTION_ERROR =
  "Unable to connect to Spring Boot backend. Make sure it is running.";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyResult(stats: BombStatistics, result: BombExperimentResponse) {
  return {
    totalExperiments: stats.totalExperiments + 1,
    liveBombs: stats.liveBombs + (result.live ? 1 : 0),
    dummyBombs: stats.dummyBombs + (result.live ? 0 : 1),
    safelyIdentified: stats.safelyIdentified + (result.safe ? 1 : 0),
    exploded: stats.exploded + (result.exploded ? 1 : 0),
    detectorD2:
      stats.detectorD2 + (!result.safe && !result.exploded ? 1 : 0),
  };
}

export function useBombTester(apiBaseUrl: string) {
  const [stats, setStats] = useState<BombStatistics>(INITIAL_STATS);
  const [currentPath, setCurrentPath] = useState<PhotonPath | null>(null);
  const [batchCount, setBatchCount] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const runRequest = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/simulation/run`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConnectionError(null);

      return {
        live: data.live,
        exploded: data.exploded,
        safe: data.safe > 0,
        path: data.path,
      } satisfies BombExperimentResponse;
    } catch {
      setConnectionError(CONNECTION_ERROR);
      return null;
    }
  }, [apiBaseUrl]);

  const runSingle = useCallback(async () => {
    setIsRunning(true);
    const result = await runRequest();

    if (!result) {
      setIsRunning(false);
      return;
    }

    setCurrentPath({
      id: stats.totalExperiments + 1,
      path: result.path,
      exploded: result.exploded,
      safe: result.safe,
    });

    await delay(ANIMATION_DURATION_MS);
    setStats((prev) => applyResult(prev, result));
    setIsRunning(false);
  }, [runRequest, stats.totalExperiments]);

  const runBatch = useCallback(
    async (count: number) => {
      setIsRunning(true);
      setCurrentPath(null);

      let nextStats = stats;

      for (let i = 0; i < count; i++) {
        const result = await runRequest();
        if (!result) break;

        nextStats = applyResult(nextStats, result);

        if (i < count - 1) {
          await delay(BATCH_DELAY_MS);
        }
      }

      setStats(nextStats);
      setIsRunning(false);
    },
    [runRequest, stats]
  );

  const reset = useCallback(() => {
    setCurrentPath(null);
    setStats(INITIAL_STATS);
  }, []);

  return {
    stats,
    currentPath,
    batchCount,
    isRunning,
    connectionError,
    setBatchCount,
    runSingle,
    runBatch,
    reset,
  };
}
