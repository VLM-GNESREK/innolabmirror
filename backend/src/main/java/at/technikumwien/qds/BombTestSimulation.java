package at.technikumwien.qds;

import at.technikumwien.qds.core.BombTesterInterferometer;
import at.technikumwien.qds.model.Bomb;

public class BombTestSimulation {

    // Konstante statt mehrfacher magic number
    private static final int LINE_WIDTH = 60;

    public static void main(String[] args) {

        printHeader();

        BombTesterInterferometer tester = new BombTesterInterferometer();

        runDudTest(tester);
        runLiveTest(tester);
        runMixedTest(tester);

        printTheory();
    }

    private static void printHeader() {
        System.out.println("=".repeat(LINE_WIDTH));
        System.out.println("ELITZUR-VAIDMAN QUANTUM BOMB TESTER");
        System.out.println("=".repeat(LINE_WIDTH));
        System.out.println("Can we detect if a bomb is live WITHOUT triggering it?");
        System.out.println("Classical physics: IMPOSSIBLE");
        System.out.println("Quantum mechanics: POSSIBLE!\n");
    }

    private static void runDudTest(BombTesterInterferometer tester) {
        System.out.println("\n" + "=".repeat(LINE_WIDTH));
        System.out.println("TEST 1: Testing 10 DUD bombs");
        System.out.println("=".repeat(LINE_WIDTH));

        for (int i = 0; i < 10; i++) {
            tester.runExperiment(new Bomb("DUD-" + i, false));
        }

        tester.printStats();
        tester.resetStats();
    }

    private static void runLiveTest(BombTesterInterferometer tester) {
        System.out.println("\n\n" + "=".repeat(LINE_WIDTH));
        System.out.println("TEST 2: Testing 20 LIVE bombs");
        System.out.println("=".repeat(LINE_WIDTH));

        for (int i = 0; i < 20; i++) {
            tester.runExperiment(new Bomb("LIVE-" + i, true));
        }

        tester.printStats();
        tester.resetStats();
    }

    private static void runMixedTest(BombTesterInterferometer tester) {
        System.out.println("\n\n" + "=".repeat(LINE_WIDTH));
        System.out.println("TEST 3: Testing 100 mixed bombs (50% live, 50% dud)");
        System.out.println("=".repeat(LINE_WIDTH));

        for (int i = 0; i < 100; i++) {
            tester.runExperiment(new Bomb("Bomb-" + i, Math.random() < 0.5));
        }

        tester.printStats();
    }

    private static void printTheory() {
        System.out.println("\n\n" + "=".repeat(LINE_WIDTH));
        System.out.println("THEORETICAL EXPECTATION:");
        System.out.println("=".repeat(LINE_WIDTH));
        System.out.println("For each LIVE bomb:");
        System.out.println("  - 50% chance: Explodes");
        System.out.println("  - 25% chance: Inconclusive (Detector C)");
        System.out.println("  - 25% chance: Identified safely (Detector D)");
        System.out.println("\nFor each DUD:");
        System.out.println("  - 100% chance: Identified as DUD");
        System.out.println("\nOverall: ~12.5% of all bombs can be identified as live");
        System.out.println("Without triggering them");
        System.out.println("=".repeat(LINE_WIDTH));
    }
}
