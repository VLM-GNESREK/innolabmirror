package at.technikumwien.qds.model;

public class Complex
{
    private final double real;
    private final double imag;

    // Common constants
    public static final Complex ZERO = new Complex(0, 0);
    public static final Complex ONE = new Complex(1, 0);

    public Complex(double real, double imag)
    {
        this.real = real;
        this.imag = imag;
    }

    public Complex add(Complex other)
    {
        return new Complex(this.real + other.real, this.imag + other.imag);
    }

    public Complex subtract(Complex other)
    {
        return new Complex(this.real - other.real, this.imag - other.imag);
    }

    public Complex multiply(double scalar)
    {
        return new Complex(this.real * scalar, this.imag * scalar);
    }

    public Complex multiply(Complex other)
    {
        return new Complex
        (
                this.real * other.real - this.imag * other.imag,
                this.real * other.imag + this.imag * other.real
        );
    }

    public Complex divide(double scalar) // Scalar for normalization
    {
        return new Complex(this.real / scalar, this.imag / scalar);
    }

    // Returns |z|^2 which represents the probability
    public double absSquared()
    {
        return real * real + imag * imag;
    }

    public double getReal()
    {
        return real;
    }

    public double getImag()
    {
        return imag;
    }

    @Override
    public String toString()
    {
        if (imag >= 0)
        {
            return String.format("%.3f + %.3fi", real, imag);
        }
        else
        {
            return String.format("%.3f - %.3fi", real, -imag);
        }
    }
}