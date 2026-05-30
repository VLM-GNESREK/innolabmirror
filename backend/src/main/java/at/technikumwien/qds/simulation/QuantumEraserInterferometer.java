package at.technikumwien.qds.simulation;

import at.technikumwien.qds.model.Photon;
import at.technikumwien.qds.model.QuantumObject;

public class QuantumEraserInterferometer implements Interferometer
{
    private int detectorD0Count = 0;
    private int detectorD1Count = 0;
    private int eraserPlusCount = 0;
    private int eraserMinusCount = 0;
    private int whichPathACount = 0;
    private int whichPathBCount = 0;
    private int totalRuns = 0;

    private String lastSignalDetector = "D0";
    private String lastIdlerOutcome = "PATH_A";

    private final double phaseShift;
    private final boolean eraseWhichPath;

    public QuantumEraserInterferometer()
    {
        this(0.0, true);
    }

    public QuantumEraserInterferometer(double phaseShift, boolean eraseWhichPath)
    {
        this.phaseShift = phaseShift;
        this.eraseWhichPath = eraseWhichPath;
    }

    @Override
    public void runExperiment(QuantumObject input)
    {
        if (!(input instanceof Photon))
        {
            return;
        }

        totalRuns++;

        double detectorD0Probability;
        if (eraseWhichPath)
        {
            boolean plusOutcome = Math.random() < 0.5;
            lastIdlerOutcome = plusOutcome ? "ERASED_PLUS" : "ERASED_MINUS";

            if (plusOutcome)
            {
                eraserPlusCount++;
                detectorD0Probability = getConditionalD0ProbabilityForErasedPlus();
            }
            else
            {
                eraserMinusCount++;
                detectorD0Probability = getConditionalD0ProbabilityForErasedMinus();
            }
        }
        else
        {
            boolean pathAOutcome = Math.random() < 0.5;
            lastIdlerOutcome = pathAOutcome ? "PATH_A" : "PATH_B";

            if (pathAOutcome)
            {
                whichPathACount++;
            }
            else
            {
                whichPathBCount++;
            }

            detectorD0Probability = 0.5;
        }

        boolean hitD0 = Math.random() < detectorD0Probability;
        lastSignalDetector = hitD0 ? "D0" : "D1";

        if (hitD0)
        {
            detectorD0Count++;
        }
        else
        {
            detectorD1Count++;
        }
    }

    public double getConditionalD0ProbabilityForErasedPlus()
    {
        return (1.0 + Math.cos(phaseShift)) / 2.0;
    }

    public double getConditionalD1ProbabilityForErasedPlus()
    {
        return 1.0 - getConditionalD0ProbabilityForErasedPlus();
    }

    public double getConditionalD0ProbabilityForErasedMinus()
    {
        return (1.0 - Math.cos(phaseShift)) / 2.0;
    }

    public double getConditionalD1ProbabilityForErasedMinus()
    {
        return 1.0 - getConditionalD0ProbabilityForErasedMinus();
    }

    public double getObservedD0Probability()
    {
        return eraseWhichPath ? 0.5 : 0.5;
    }

    public double getObservedD1Probability()
    {
        return 1.0 - getObservedD0Probability();
    }

    public boolean isEraseWhichPath()
    {
        return eraseWhichPath;
    }

    public double getPhaseShift()
    {
        return phaseShift;
    }

    public int getDetectorD0Count()
    {
        return detectorD0Count;
    }

    public int getDetectorD1Count()
    {
        return detectorD1Count;
    }

    public int getEraserPlusCount()
    {
        return eraserPlusCount;
    }

    public int getEraserMinusCount()
    {
        return eraserMinusCount;
    }

    public int getWhichPathACount()
    {
        return whichPathACount;
    }

    public int getWhichPathBCount()
    {
        return whichPathBCount;
    }

    public int getTotalRuns()
    {
        return totalRuns;
    }

    public String getLastSignalDetector()
    {
        return lastSignalDetector;
    }

    public String getLastIdlerOutcome()
    {
        return lastIdlerOutcome;
    }
}
