package at.technikumwien.qds.model;

public class Photon implements QuantumObject
{
    private final String id;

    // Complex amplitudes (Qunatum yay)
    private Complex amplitudeA;
    private Complex amplitudeB;

    public Photon(String id)
    {
        this.id = id;
        // Initial state: 100% chance of being in Path A (Input port)
        this.amplitudeA = Complex.ONE;
        this.amplitudeB = Complex.ZERO;
        System.out.println(id + " created with State: [1, 0]");
    }

    public void applyBeamSplitter()
    {
        double sqrt2 = Math.sqrt(2);

        Complex newA = amplitudeA.add(amplitudeB).divide(sqrt2);
        Complex newB = amplitudeA.subtract(amplitudeB).divide(sqrt2);

        this.amplitudeA = newA;
        this.amplitudeB = newB;
    }


    /**
     * Measures the state of the photon.
     * This collapses it at a probability of |amplitude|^2.
     * Returns A if detected on Path A and B if detected on Path B.
    **/
    public String measure()
    {
        double probA = amplitudeA.absSquared();

        // Randomly collapse based on probability
        if (Math.random() < probA)
        {
            return "A";
        }
        else
        {
            return "B";
        }
    }

    /**
     * Applies Phase Shift to Path B (relative to Path A) -> Simulates Delay
     */
    public void applyPhaseShift(double phi)
    {
        Complex phaseFactor = new Complex(Math.cos(phi), Math.sin(phi)); // Euler's
        this.amplitudeB = this.amplitudeB.multiply(phaseFactor);
    }

    public String getId() { return id; }

    // Debug helper pay no heed
    public String getStateString()
    {
        return String.format("A: %s, B: %s", amplitudeA, amplitudeB);
    }

    /**
     * Forces the photon into a specific path. (Wavefunction Collapse)
     */
    public void collapseToPath(String path)
    {
        if (path.equals("A"))
        {
            this.amplitudeA = Complex.ONE;
            this.amplitudeB = Complex.ZERO;
        }
        else
        {
            this.amplitudeA = Complex.ZERO;
            this.amplitudeB = Complex.ONE;
        }
    }
}
