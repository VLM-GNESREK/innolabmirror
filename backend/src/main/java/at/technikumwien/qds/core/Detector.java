package at.technikumwien.qds.core;

import java.util.concurrent.atomic.AtomicInteger;

public class Detector
{

    private final AtomicInteger detectionCount = new AtomicInteger(0);
    private final String name;
    private final String targetPath; // "A" or "B"

    public enum PathType
    {
        PathA("A"),
        PathB("B");

        public final String signal;
        PathType(String signal)
        {
            this.signal = signal;
        }
    }

    public Detector(String name, PathType path)
    {
        this.name = name;
        this.targetPath = path.signal;
    }

    /**
     * Records a detection if the measurement result matches this detector's path.
     */
    public void feed(String measuredPath)
    {
        if (targetPath.equals(measuredPath))
        {
            detectionCount.incrementAndGet();
            // Could add a Print here if we have a smaller amount of runs?
        }
    }

    public AtomicInteger getDetectionCount()
    {
        return detectionCount;
    }

    public void reset()
    {
        detectionCount.set(0);
    }

    public void printStats()
    {
        System.out.println(name + " (" + targetPath + "): " + detectionCount);
    }
}