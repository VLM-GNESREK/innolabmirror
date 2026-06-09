package at.technikumwien.qds.simulation;

import at.technikumwien.qds.model.Photon;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class QuantumEraserInterferometerTest
{
    private static final double DELTA = 0.0001;

    @Test
    @DisplayName("Quantum eraser recovers interference fringes in the erased subensembles")
    void testConditionalInterferenceReturnsWhenErased()
    {
        QuantumEraserInterferometer setup = new QuantumEraserInterferometer(0.0, true);

        assertEquals(1.0, setup.getConditionalD0ProbabilityForErasedPlus(), DELTA);
        assertEquals(0.0, setup.getConditionalD1ProbabilityForErasedPlus(), DELTA);
        assertEquals(0.0, setup.getConditionalD0ProbabilityForErasedMinus(), DELTA);
        assertEquals(1.0, setup.getConditionalD1ProbabilityForErasedMinus(), DELTA);
    }

    @Test
    @DisplayName("Keeping which-path information removes the interference pattern")
    void testObservedDistributionWithoutErasureIsFlat()
    {
        QuantumEraserInterferometer setup = new QuantumEraserInterferometer(Math.PI / 3.0, false);

        assertEquals(0.5, setup.getObservedD0Probability(), DELTA);
        assertEquals(0.5, setup.getObservedD1Probability(), DELTA);
    }

    @Test
    @DisplayName("Running many erased shots keeps the overall signal distribution balanced")
    void testErasedExperimentBalancesWithoutCoincidenceFiltering()
    {
        QuantumEraserInterferometer setup = new QuantumEraserInterferometer(Math.PI / 2.0, true, true);

        for (int i = 0; i < 2_000; i++)
        {
            setup.runExperiment(new Photon("qe-" + i));
        }

        assertEquals(2_000, setup.getTotalRuns());
        assertTrue(setup.getDetectorD0Count() > 850 && setup.getDetectorD0Count() < 1150);
        assertTrue(setup.getDetectorD1Count() > 850 && setup.getDetectorD1Count() < 1150);
        assertEquals(2_000, setup.getDetectorD0Count() + setup.getDetectorD1Count());
    }

    @Test
    @DisplayName("Delayed choice measures the signal before the idler choice")
    void testDelayedChoiceMeasurementOrder()
    {
        QuantumEraserInterferometer setup = new QuantumEraserInterferometer(0.0, true, true);

        assertTrue(setup.isDelayedChoice());
        assertEquals("SIGNAL_FIRST_IDLER_DELAYED", setup.getMeasurementOrder());
    }

    @Test
    @DisplayName("Delayed erasure sorts already detected signals into interference subensembles")
    void testDelayedChoiceKeepsSignalFlatButCorrelatesLaterEraserResult()
    {
        QuantumEraserInterferometer setup = new QuantumEraserInterferometer(0.0, true, true);

        for (int i = 0; i < 2_000; i++)
        {
            setup.runExperiment(new Photon("dcqe-" + i));

            if ("D0".equals(setup.getLastSignalDetector()))
            {
                assertEquals("ERASED_PLUS", setup.getLastIdlerOutcome());
            }
            else
            {
                assertEquals("ERASED_MINUS", setup.getLastIdlerOutcome());
            }
        }

        assertEquals(0.5, setup.getObservedD0Probability(), DELTA);
        assertEquals(0.5, setup.getObservedD1Probability(), DELTA);
        assertTrue(setup.getDetectorD0Count() > 850 && setup.getDetectorD0Count() < 1150);
        assertTrue(setup.getDetectorD1Count() > 850 && setup.getDetectorD1Count() < 1150);
    }
}
