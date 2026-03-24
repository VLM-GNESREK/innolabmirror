package at.technikumwien.qds.core;

import at.technikumwien.qds.model.Bomb;
import at.technikumwien.qds.model.Photon;
import at.technikumwien.qds.model.QuantumObject;

public class BombTesterInterferometer implements Interferometer
{

    private final Detector detectorC;  // "Safe" detector (Path A)
    private final Detector detectorD;  // "Bomb" detector (Path B) - The "dark" port

    // Stats
    private int bombsExploded = 0;
    private int bombsIdentifiedSafely = 0;
    private int inconclusiveResults = 0;
    private int dudsDetected = 0;
    private int totalTests = 0;

    public BombTesterInterferometer()
    {
        this.detectorC = new Detector("Detector C", Detector.PathType.PathA);
        this.detectorD = new Detector("Detector D", Detector.PathType.PathB);
    }

    @Override
    public void runExperiment(QuantumObject input)
    {
        if (!(input instanceof Bomb bomb))
        {
            System.out.println("Error: Bomb Tester requires a Bomb object!");
            return;
        }

        totalTests++;
        Photon photon = new Photon("Test-Photon-" + totalTests);

        // Superposition
        photon.applyBeamSplitter();

        // Bomb Interaction
        boolean photonSurvives = true;

        if (bomb.isLive())
        {
            // Check if photon hits the bomb
            String path = photon.measure();

            if (path.equals("B"))
            {
                // EXPLOSION
                bomb.checkPhotonInteraction();
                bombsExploded++;
                photonSurvives = false;
            } else {
                // Survived! Yay
                photon.collapseToPath("A");
            }
        }
        else
        {
            // DUD
        }

        if (!photonSurvives) return;

        photon.applyBeamSplitter();

        String finalResult = photon.measure();

        // Interpret Results
        if (bomb.isLive())
        {
            if (finalResult.equals("B"))
            {
                bombsIdentifiedSafely++;
                detectorD.feed(finalResult);
            }
            else
            {
                inconclusiveResults++;
                detectorC.feed(finalResult);
            }
        }
        else
        {
            if (finalResult.equals("A"))
            {
                dudsDetected++;
                detectorC.feed(finalResult);
            }
            else
            {
                detectorD.feed(finalResult); // Shouldn't happen ideally
            }
        }
    }

    public void printStats()
    {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("Elitzur-Vaidman bomb tester statistic");
        System.out.println("=".repeat(60));
        System.out.println("Total tests: " + totalTests);
        System.out.println("\nLive bombs:");
        System.out.println("  - Exploded: " + bombsExploded);
        System.out.println("  - Identified safely (interaction-free!): " + bombsIdentifiedSafely);
        System.out.println("  - Inconclusive: " + inconclusiveResults);
        System.out.println("\nDuds identified: " + dudsDetected);
        detectorC.printStats();
        detectorD.printStats();
    }

    public void resetStats()
    {
        bombsExploded = 0;
        bombsIdentifiedSafely = 0;
        inconclusiveResults = 0;
        dudsDetected = 0;
        totalTests = 0;
        detectorC.reset();
        detectorD.reset();
    }
    public int getBombsIdentifiedSafely()
    {
        return bombsIdentifiedSafely;
    }

    public int getBombsExploded()
    {
        return bombsExploded;
    }

    public int getTotalTests()
    {
        return totalTests;
    }
}