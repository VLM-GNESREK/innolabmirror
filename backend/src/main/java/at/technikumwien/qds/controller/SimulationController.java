package at.technikumwien.qds.controller;

import at.technikumwien.qds.simulation.BombTesterInterferometer;
import at.technikumwien.qds.model.Bomb;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "http://localhost:4200")
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
}