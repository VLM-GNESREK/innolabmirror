package at.technikumwien.qds;

import at.technikumwien.qds.core.MichelsonMorleyInterferometer;
import at.technikumwien.qds.model.Photon;

import java.util.concurrent.Executors;

public class MichelsonMorleySimulation
{
    public static void main(String[] args)
    {
        System.out.println("Starting Michelson-Morley Experiment...");

        runTest(0.0, "Equal Arm Lengths (0 nm diff)");

        runTest(275.0, "Half-Wavelength Difference (275 nm)");

        runTest(100.0, "Arbitrary Difference (100 nm)");
    }

    private static void runTest(double armLengthDiff, String testName)
    {
        System.out.println("\n--- Test: " + testName + " ---");

        MichelsonMorleyInterferometer setup = new MichelsonMorleyInterferometer(armLengthDiff);

        try (var executor = Executors.newVirtualThreadPerTaskExecutor())
        {
            int experimentsToRun = 1000;
            for (int i = 0; i < experimentsToRun; i++)
            {
                final int id = i;
                executor.submit(() ->
                {
                    Photon photon = new Photon("Photon-" + id);
                    setup.runExperiment(photon);
                });
            }
        }

        setup.printStats();
    }
}