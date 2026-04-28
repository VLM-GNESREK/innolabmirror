"use client";

import { useCallback, useState } from "react";

interface PhotonPath {
  id: number;
  path: "A" | "B";
}

interface MichelsonMorleyStatistics {
  totalExperiments: number;
  constructive: number;
  destructive: number;
  lastPath: "A" | "B" | null;
}

interface MichelsonMorleyResponse {
  path: "A" | "B";
  constructive: number;
  destructive: number;
}

const INITIAL_STATS: MichelsonMorleyStatistics = {
  totalExperiments: 0,
  constructive: 0,
  destructive: 0,
  lastPath: null,
};

const ANIMATION_DURATION_MS = 1600;
const BATCH_DELAY_MS = 50;
const CONNECTION_ERROR =
  "Unable to connect to Spring Boot backend. Make sure it is running.";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyResult(
  stats: MichelsonMorleyStatistics,
  result: MichelsonMorleyResponse
) {
  return {
    totalExperiments: stats.totalExperiments + 1,
    constructive: stats.constructive + result.constructive,
    destructive: stats.destructive + result.destructive,
    lastPath: result.path,
  } satisfies MichelsonMorleyStatistics;
}

export function useMichelsonMorley(apiBaseUrl: string) {
  const [stats, setStats] = useState<MichelsonMorleyStatistics>(INITIAL_STATS);
  const [currentPath, setCurrentPath] = useState<PhotonPath | null>(null);
  const [batchCount, setBatchCount] = useState(100);
  const [armLengthDifference, setArmLengthDifference] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const runRequest = useCallback(async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/simulation/michelson-morley/run?armLengthDifference=${armLengthDifference}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setConnectionError(null);
      const data = await response.json();

      return {
        path: data.path,
        constructive: data.constructive,
        destructive: data.destructive,
      } satisfies MichelsonMorleyResponse;
    } catch {
      setConnectionError(CONNECTION_ERROR);
      return null;
    }
  }, [apiBaseUrl, armLengthDifference]);

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
      let lastPath: "A" | "B" | null = null;

      for (let i = 0; i < count; i++) {
        const result = await runRequest();
        if (!result) break;

        nextStats = applyResult(nextStats, result);
        lastPath = result.path;

        if (i < count - 1) {
          await delay(BATCH_DELAY_MS);
        }
      }

      if (lastPath) {
        setCurrentPath({
          id: nextStats.totalExperiments,
          path: lastPath,
        });
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
    armLengthDifference,
    isRunning,
    connectionError,
    setBatchCount,
    setArmLengthDifference,
    runSingle,
    runBatch,
    reset,
  };
}
