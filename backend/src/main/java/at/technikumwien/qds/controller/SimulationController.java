package at.technikumwien.qds.controller;

import at.technikumwien.qds.simulation.BombTesterInterferometer;
import at.technikumwien.qds.simulation.MachZehnderInterferometer;
import at.technikumwien.qds.simulation.MichelsonMorleyInterferometer;
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
}
