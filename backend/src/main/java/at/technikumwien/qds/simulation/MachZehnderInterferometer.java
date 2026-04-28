package at.technikumwien.qds.simulation;
import at.technikumwien.qds.model.Photon;
import at.technikumwien.qds.model.QuantumObject;

public class MachZehnderInterferometer implements Interferometer
{

    private final Detector detectorA;
    private final Detector detectorB;
    private int totalRuns = 0;
    private String lastMeasuredPath = "A";
    private final double phaseShift;

    public MachZehnderInterferometer()
    {
        this(0.0);
    }

    public MachZehnderInterferometer(double phaseShift)
    {
        this.detectorA = new Detector("Detector A", Detector.PathType.PathA);
        this.detectorB = new Detector("Detector B", Detector.PathType.PathB);
        this.phaseShift = phaseShift;
    }

    @Override
    public void runExperiment(QuantumObject input)
    {
        if (input instanceof Photon photon)
        {
            totalRuns++;
            // Superposition of Path A & B
            photon.applyBeamSplitter();
            photon.applyPhaseShift(phaseShift);

            // Recombines the beams
            photon.applyBeamSplitter();

            // Collapse
            String result = photon.measure();
            lastMeasuredPath = result;
            detectorA.feed(result);
            detectorB.feed(result);
        }
    }

    public void printStats()
    {
        System.out.println("\n--- Mach-Zehnder Experiment Results ---");
        System.out.println("Total Photons: " + totalRuns);
        detectorA.printStats();
        detectorB.printStats();

        System.out.println("Analysis: If Quantum Logic is working, ~100% should be in Detector A.");
    }

    public void resetStats()
    {
        totalRuns = 0;
        lastMeasuredPath = "A";
        detectorA.reset();
        detectorB.reset();
    }

    public int getTotalRuns()
    {
        return totalRuns;
    }

    public int getDetectorACount()
    {
        return detectorA.getDetectionCount().get();
    }

    public int getDetectorBCount()
    {
        return detectorB.getDetectionCount().get();
    }

    public String getLastMeasuredPath()
    {
        return lastMeasuredPath;
    }
}
