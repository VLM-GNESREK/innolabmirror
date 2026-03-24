package at.technikumwien.qds.model;

public class Bomb implements QuantumObject {
    private String id;
    private boolean isLive;  // true = funktionsfähig, false = blindgänger
    private boolean hasExploded;

    public Bomb(String id, boolean isLive) {
        this.id = id;
        this.isLive = isLive;
        this.hasExploded = false;
        System.out.println(id + " created. Status: " + (isLive ? "LIVE" : "DUD"));
    }

    /**
     * Eine funktionierende Bombe detektiert das Photon und explodiert.
     */
    public boolean checkPhotonInteraction() {
        if (isLive) {
            hasExploded = true;
            System.out.println(id + "Photon was detected by bomb.");
            return true;  // Photon wurde erkannt
        }
        return false;  // Blindgänger
    }

    public boolean isLive() {
        return isLive;
    }

    public boolean hasExploded() {
        return hasExploded;
    }

    public String getId() {
        return id;
    }

    public String getStatus() {
        if (hasExploded) return "EXPLODED";
        if (isLive) return "LIVE (not triggered)";
        return "DUD";
    }
}