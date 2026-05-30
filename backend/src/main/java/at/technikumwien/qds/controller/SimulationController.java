package at.technikumwien.qds.controller;

import at.technikumwien.qds.simulation.BombTesterInterferometer;
import at.technikumwien.qds.simulation.MachZehnderInterferometer;
import at.technikumwien.qds.simulation.MichelsonMorleyInterferometer;
import at.technikumwien.qds.simulation.QuantumEraserInterferometer;
import at.technikumwien.qds.model.Bomb;
import at.technikumwien.qds.model.Photon;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Simulation", description = "Quantum bomb tester simulation endpoints")
public class SimulationController {

    @GetMapping("/run")
    public Map<String, Object> runSimulation() {

        BombTesterInterferometer tester = new BombTesterInterferometer();

        Bomb bomb = new Bomb("B1", Math.random() < 0.5);

        tester.runExperiment(bomb);

        Map<String, Object> result = new HashMap<>();
        result.put("safe", tester.getBombsIdentifiedSafely());
        result.put("exploded", bomb.hasExploded());
        result.put("live", bomb.isLive());

        String path = tester.getBombsIdentifiedSafely() > 0 ? "B" : "A";
        result.put("path", path);

        return result;
    }

    @GetMapping("/mach-zehnder/run")
    public Map<String, Object> runMachZehnderSimulation(
            @RequestParam(defaultValue = "0.0") double phaseShift) {
        MachZehnderInterferometer setup = new MachZehnderInterferometer(phaseShift);
        Photon photon = new Photon("MZ-Photon");

        setup.runExperiment(photon);

        Map<String, Object> result = new HashMap<>();
        result.put("path", setup.getLastMeasuredPath());
        result.put("detectorA", setup.getDetectorACount());
        result.put("detectorB", setup.getDetectorBCount());
        result.put("totalRuns", setup.getTotalRuns());
        result.put("phaseShift", phaseShift);

        return result;
    }

    @GetMapping("/michelson-morley/run")
    public Map<String, Object> runMichelsonMorleySimulation(
            @RequestParam(defaultValue = "0.0") double armLengthDifference) {
        MichelsonMorleyInterferometer setup =
                new MichelsonMorleyInterferometer(armLengthDifference);
        Photon photon = new Photon("MM-Photon");

        setup.runExperiment(photon);

        Map<String, Object> result = new HashMap<>();
        result.put("path", setup.getLastMeasuredPath());
        result.put("constructive", setup.getConstructiveCount());
        result.put("destructive", setup.getDestructiveCount());
        result.put("totalRuns", setup.getTotalRuns());
        result.put("armLengthDifference", armLengthDifference);

        return result;
    }

    @GetMapping("/quantum-eraser/run")
    public Map<String, Object> runQuantumEraserSimulation(
            @RequestParam(defaultValue = "0.0") double phaseShift,
            @RequestParam(defaultValue = "true") boolean eraseWhichPath,
            @RequestParam(defaultValue = "1") int shots) {
        QuantumEraserInterferometer setup =
                new QuantumEraserInterferometer(phaseShift, eraseWhichPath);

        int runCount = Math.max(1, shots);
        for (int i = 0; i < runCount; i++)
        {
            setup.runExperiment(new Photon("QE-Photon-" + i));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("phaseShift", phaseShift);
        result.put("eraseWhichPath", eraseWhichPath);
        result.put("shots", runCount);
        result.put("signalDetector", setup.getLastSignalDetector());
        result.put("idlerOutcome", setup.getLastIdlerOutcome());
        result.put("detectorD0", setup.getDetectorD0Count());
        result.put("detectorD1", setup.getDetectorD1Count());
        result.put("eraserPlus", setup.getEraserPlusCount());
        result.put("eraserMinus", setup.getEraserMinusCount());
        result.put("whichPathA", setup.getWhichPathACount());
        result.put("whichPathB", setup.getWhichPathBCount());
        result.put("totalRuns", setup.getTotalRuns());
        result.put("observedD0Probability", setup.getObservedD0Probability());
        result.put("observedD1Probability", setup.getObservedD1Probability());
        result.put("conditionalD0GivenErasedPlus", setup.getConditionalD0ProbabilityForErasedPlus());
        result.put("conditionalD1GivenErasedPlus", setup.getConditionalD1ProbabilityForErasedPlus());
        result.put("conditionalD0GivenErasedMinus", setup.getConditionalD0ProbabilityForErasedMinus());
        result.put("conditionalD1GivenErasedMinus", setup.getConditionalD1ProbabilityForErasedMinus());

        return result;
    }
}
