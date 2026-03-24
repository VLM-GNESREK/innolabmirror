package at.technikumwien.qds.core;

import at.technikumwien.qds.model.Photon;
import at.technikumwien.qds.model.QuantumObject;

public class MachZehnderInterferometer implements Interferometer
{

    private final Detector detectorA;
    private final Detector detectorB;
    private int totalRuns = 0;

    public MachZehnderInterferometer()
    {
        this.detectorA = new Detector("Detector A", Detector.PathType.PathA);
        this.detectorB = new Detector("Detector B", Detector.PathType.PathB);
    }

    @Override
    public void runExperiment(QuantumObject input)
    {
        if (input instanceof Photon photon)
        {
            totalRuns++;
            // Superposition of Path A & B
            photon.applyBeamSplitter();
            // Phases / Mirrors can go here later?

            // Recombines the beams
            photon.applyBeamSplitter();

            // Collapse
            String result = photon.measure();
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
        detectorA.reset();
        detectorB.reset();
    }
}