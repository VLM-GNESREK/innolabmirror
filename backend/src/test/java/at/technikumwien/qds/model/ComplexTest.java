package at.technikumwien.qds.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

class ComplexTest
{
    private static final double DELTA = 0.0001;

    @Test
    @DisplayName("Addition: (1+2i) + (3+4i) = 4+6i")
    void testAdd()
    {
        Complex c1 = new Complex(1, 2);
        Complex c2 = new Complex(3, 4);

        Complex result = c1.add(c2);

        assertEquals(4.0, result.getReal(), DELTA);
        assertEquals(6.0, result.getImag(), DELTA);
    }

    @Test
    @DisplayName("Subtraction: (1+2i) - (3+4i) = -2-2i")
    void testSubtract()
    {
        Complex c1 = new Complex(1, 2);
        Complex c2 = new Complex(3, 4);

        Complex result = c1.subtract(c2);

        assertEquals(-2.0, result.getReal(), DELTA);
        assertEquals(-2.0, result.getImag(), DELTA);
    }

    @Test
    @DisplayName("Multiplication (Scalar): (2+3i) * 2 = 4+6i")
    void testMultiplyScalar()
    {
        Complex c = new Complex(2, 3);

        Complex result = c.multiply(2.0);

        assertEquals(4.0, result.getReal(), DELTA);
        assertEquals(6.0, result.getImag(), DELTA);
    }

    @Test
    @DisplayName("Multiplication (Complex): (1+2i) * (3+4i) = -5+10i")
    void testMultiplyComplex()
    {
        // Math: (1*3 - 2*4) + (1*4 + 2*3)i = (3-8) + (4+6)i = -5 + 10i
        Complex c1 = new Complex(1, 2);
        Complex c2 = new Complex(3, 4);

        Complex result = c1.multiply(c2);

        assertEquals(-5.0, result.getReal(), DELTA, "Real part should be -5");
        assertEquals(10.0, result.getImag(), DELTA, "Imaginary part should be 10");
    }

    @Test
    @DisplayName("Probability: |3+4i|^2 = 9+16 = 25")
    void testAbsSquared()
    {
        Complex c = new Complex(3, 4);

        // |z|^2 = real^2 + imag^2
        double probability = c.absSquared();

        assertEquals(25.0, probability, DELTA);
    }

    @Test
    @DisplayName("Constants: ONE and ZERO are correct")
    void testConstants()
    {
        assertEquals(1.0, Complex.ONE.getReal(), DELTA);
        assertEquals(0.0, Complex.ONE.getImag(), DELTA);

        assertEquals(0.0, Complex.ZERO.getReal(), DELTA);
        assertEquals(0.0, Complex.ZERO.getImag(), DELTA);
    }
}