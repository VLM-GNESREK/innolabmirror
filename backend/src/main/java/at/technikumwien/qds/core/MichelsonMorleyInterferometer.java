package at.technikumwien.qds.core;

import at.technikumwien.qds.model.Photon;
import at.technikumwien.qds.model.QuantumObject;

public class MichelsonMorleyInterferometer implements Interferometer
{
    private final Detector detector;
    private double armLengthDifference;

    // Statistics
    private int constructiveCount = 0;
    private int destructiveCount = 0;
    private int totalRuns = 0;

    public MichelsonMorleyInterferometer()
    {
        this(0.0);
    }

    public MichelsonMorleyInterferometer(double armLengthDifference)
    {
        this.detector = new Detector("Main Detector", Detector.PathType.PathA);
        this.armLengthDifference = armLengthDifference;
    }

    @Override
    public void runExperiment(QuantumObject input)
    {
        if (input instanceof Photon photon)
        {
            totalRuns++;

            // Superposition
            photon.applyBeamSplitter();

            // Here Green light example 550nm
            double wavelength = 550.0;
            double phi = (2 * Math.PI * armLengthDifference) / wavelength;

            photon.applyPhaseShift(phi);

            // interference
            photon.applyBeamSplitter();
            String result = photon.measure();


            if (result.equals("A"))
            {
                constructiveCount++;
                detector.feed(result);
            }
            else
            {
                destructiveCount++;
            }
        }
    }

    public void setArmLengthDifference(double difference)
    {
        this.armLengthDifference = difference;
        resetStats();
    }

    public double getArmLengthDifference()
    {
        return armLengthDifference;
    }

    public void printStats()
    {
        System.out.println("\n=== Michelson-Morley Results ===");
        System.out.println("Arm Difference: " + armLengthDifference + " nm");
        System.out.println("Total Photons: " + totalRuns);
        System.out.println("Detected (Constructive): " + constructiveCount);
        System.out.println("Lost/Dark (Destructive): " + destructiveCount);

        if (totalRuns > 0)
        {
            // Visibility V = (I_max - I_min) / (I_max + I_min)
            // Here roughly estimated by our counts
            double visibility = (double) (constructiveCount - destructiveCount) / totalRuns;
            System.out.println("Interference Visibility: " + String.format("%.2f", Math.abs(visibility)));
        }
    }

    public void resetStats()
    {
        constructiveCount = 0;
        destructiveCount = 0;
        totalRuns = 0;
        detector.reset();
    }
}