package at.technikumwien.qds.simulation;

import java.util.Random;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

public class BB84Simulation 
{
    private final int numQbits;
    private final boolean evePresent;
    private final Random random = new Random();

    public BB84Simulation(int numQbits, boolean evePresent) 
    {
        this.numQbits = numQbits;
        this.evePresent = evePresent;
    }

    public Map<String, Object>  run()
    {
        List<Integer> aliceBits = new ArrayList<>();
        List<Character> aliceBases = new ArrayList<>();
        List<Character> eveBases = new ArrayList<>();
        List<Integer> eveMeasurements = new ArrayList<>();
        List<Character> bobBases = new ArrayList<>();
        List<Integer> bobMeasurements = new ArrayList<>();
        List<Boolean> siftedKeyIndices = new ArrayList<>();

        int errors = 0;
        int siftedLength = 0;
        
        for (int i = 0; i < numQbits; i++)
        {
            int aliceBit = random.nextInt(2);
            char aliceBasis = random.nextBoolean() ? '+' : 'x';
            aliceBits.add(aliceBit);
            aliceBases.add(aliceBasis);

            int currentPhotonState = aliceBit;
            char currentBasis = aliceBasis;

            if(evePresent)
            {
                char eveBasis = random.nextBoolean() ? '+' : 'x';
                eveBases.add(eveBasis);

                int eveMeasurement;
                if(eveBasis == currentBasis)
                {
                    eveMeasurement = currentPhotonState;
                }
                else
                {
                    eveMeasurement = random.nextInt(2);
                }
                eveMeasurements.add(eveMeasurement);

                currentPhotonState = eveMeasurement;
                currentBasis = eveBasis;
            }

            char bobBasis = random.nextBoolean() ? '+' : 'x';
            bobBases.add(bobBasis);

            int bobMeasurement;
            if(bobBasis == currentBasis)
            {
                bobMeasurement = currentPhotonState;
            }
            else
            {
                bobMeasurement = random.nextInt(2);
            }
            bobMeasurements.add(bobMeasurement);

            if(aliceBasis == bobBasis)
            {
                siftedKeyIndices.add(true);
                siftedLength++;
                if(aliceBit != bobMeasurement)
                {
                    errors++;
                }
            }
            else
            {
                siftedKeyIndices.add(false);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("aliceBits", aliceBits);
        result.put("aliceBases", aliceBases);
        if(evePresent)
        {
            result.put("eveBases", eveBases);
            result.put("eveMeasurements", eveMeasurements);
        }
        result.put("bobBases", bobBases);
        result.put("bobMeasurements", bobMeasurements);
        result.put("siftedKeyIndices", siftedKeyIndices);
        result.put("siftedLength", siftedLength);
        result.put("errors", errors);
        result.put("errorRate", siftedLength > 0 ? (double) errors / siftedLength : 0.0);

        return result;
    }
}