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
    private final boolean delayedChoice;

    //Delayed Choice is off per default
    public QuantumEraserInterferometer()
    {
        this(0.0, true, false);
    }

    public QuantumEraserInterferometer(double phaseShift, boolean eraseWhichPath)
    {
        this(phaseShift, eraseWhichPath, false);
    }

    public QuantumEraserInterferometer(double phaseShift, boolean eraseWhichPath, boolean delayedChoice)
    {
        this.phaseShift = phaseShift;
        this.eraseWhichPath = eraseWhichPath;
        this.delayedChoice = delayedChoice;
    }

    @Override
    public void runExperiment(QuantumObject input)
    {
        if (!(input instanceof Photon))
        {
            return;
        }

        totalRuns++;

        if (delayedChoice)
        {
            runDelayedChoiceExperiment();
            return;
        }

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

    private void runDelayedChoiceExperiment()
    {
        boolean hitD0 = Math.random() < getObservedD0Probability();
        lastSignalDetector = hitD0 ? "D0" : "D1";

        if (hitD0)
        {
            detectorD0Count++;
        }
        else
        {
            detectorD1Count++;
        }

        if (eraseWhichPath)
        {
            boolean plusOutcome = Math.random() < getEraserPlusProbabilityGivenSignal(hitD0);
            lastIdlerOutcome = plusOutcome ? "ERASED_PLUS" : "ERASED_MINUS";

            if (plusOutcome)
            {
                eraserPlusCount++;
            }
            else
            {
                eraserMinusCount++;
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
        return 0.5;
    }

    public double getObservedD1Probability()
    {
        return 0.5;
    }

    public double getEraserPlusProbabilityGivenD0()
    {
        return getConditionalD0ProbabilityForErasedPlus();
    }

    public double getEraserPlusProbabilityGivenD1()
    {
        return getConditionalD1ProbabilityForErasedPlus();
    }

    private double getEraserPlusProbabilityGivenSignal(boolean hitD0)
    {
        if (hitD0)
        {
            return getEraserPlusProbabilityGivenD0();
        }

        return getEraserPlusProbabilityGivenD1();
    }

    public boolean isEraseWhichPath()
    {
        return eraseWhichPath;
    }

    public boolean isDelayedChoice()
    {
        return delayedChoice;
    }

    public String getMeasurementOrder()
    {
        return delayedChoice ? "SIGNAL_FIRST_IDLER_DELAYED" : "IDLER_CHOICE_BEFORE_SIGNAL";
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
