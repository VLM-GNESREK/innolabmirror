package at.technikumwien.qds.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions .*;

    class PhotonTest
    {

        private Photon photon;

        @BeforeEach
        void setUp()
        {
            photon = new Photon("test-photon");
        }

        @Test
        @DisplayName("Initial State: Photon should be created in Path A")
        void testInitialState()
        {
            // A newly created photon is [1, 0], so measuring it should always return "A"
            // We run this multiple times to be sure, as measure() is probabilistic
            for (int i = 0; i < 50; i++)
            {
                assertEquals("A", photon.measure(), "Initial photon must always be in path A");
            }
        }

        @Test
        @DisplayName("Collapse: Forcing path B ensures subsequent measurements are B")
        void testCollapseToPath()
        {
            photon.collapseToPath("B");

            for (int i = 0; i < 50; i++)
            {
                assertEquals("B", photon.measure(), "Collapsed photon must stay in path B");
            }
        }

        /**
         * MATHEMATICAL BASELINE TEST
         * This tests the complex number arithmetic (Hadamard gate) indirectly.
         * Logic:
         * 1. Start [1, 0]
         * 2. BeamSplitter -> [0.707, 0.707] (50/50 chance)
         */
        @Test
        @DisplayName("Beam Splitter: Should result in approx 50/50 distribution")
        void testBeamSplitterStatistics()
        {
            int countA = 0;
            int countB = 0;
            int runs = 1000;

            for (int i = 0; i < runs; i++)
            {
                Photon p = new Photon("p" + i);
                p.applyBeamSplitter();
                if (p.measure().equals("A")) countA++;
                else countB++;
            }

            // Check if results are within ~10% of 50/50
            // This confirms the math produced equal amplitudes
            assertTrue(countA > 400 && countA < 600, "Split should be roughly 50%");
            assertTrue(countB > 400 && countB < 600, "Split should be roughly 50%");
        }

        /**
         * INTERFERENCE TEST (The "Golden" Test)
         * This validates the complex math purely deterministically.
         * * Physics:
         * 1. Start: [1, 0]
         * 2. BS:    [1/√2, 1/√2]
         * 3. Phase Shift (PI): B becomes -1/√2 -> State [1/√2, -1/√2]
         * 4. BS:    Recombines the waves.
         * New A = (1/√2 - 1/√2)/√2 = 0
         * New B = (1/√2 + 1/√2)/√2 = 1
         * * Result: 100% Probability of Path B. If the complex math is wrong, this fails.
         */
        @Test
        @DisplayName("Interference: Constructive/Destructive interference check")
        void testMachZehnderInterference()
        {
            photon.applyBeamSplitter();

            // Phase Shift of 180 degrees (PI) on Path B
            // This flips the sign of Amplitude B
            photon.applyPhaseShift(Math.PI);

            // Second Beam Splitter (Recombination)
            photon.applyBeamSplitter();

            // If complex math is correct, A cancels out to 0, B sums to 1.
            String result = photon.measure();

            assertEquals("B", result, "Interference with PI shift should result in 100% Path B");
        }
    }
