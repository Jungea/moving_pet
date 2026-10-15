import type { PetState } from "../../shared/pet-state.js";
export interface BehaviorConfig {
  idleDurationMs: number;
  walkDurationMs: number;
  speedPixelsPerSecond: number;
  sleepEnergyThreshold: number;
  wakeEnergyThreshold: number;
}
const defaultConfig: BehaviorConfig = {
  idleDurationMs: 2200,
  walkDurationMs: 5000,
  speedPixelsPerSecond: 70,
  sleepEnergyThreshold: 20,
  wakeEnergyThreshold: 75
};
export class BasicBehaviorSystem {
  private elapsedInBehavior = 0;
  public constructor(private readonly config: BehaviorConfig = defaultConfig) {}
  public reset(): void { this.elapsedInBehavior = 0; }
  public update(state: PetState, deltaMs: number, maxX: number): PetState {
    this.elapsedInBehavior += deltaMs;
    const next = { ...state };

    if (next.behavior !== "sleep" && next.energy <= this.config.sleepEnergyThreshold) {
      next.behavior = "sleep";
      this.reset();
    } else if (next.behavior === "sleep") {
      if (next.energy >= this.config.wakeEnergyThreshold) {
        next.behavior = "idle";
        this.reset();
      } else {
        return next;
      }
    }

    const duration = next.behavior === "idle" ? this.config.idleDurationMs : this.config.walkDurationMs;
    if (this.elapsedInBehavior >= duration) {
      this.elapsedInBehavior %= duration;
      next.behavior = next.behavior === "idle" ? "walk" : "idle";
    }
    if (next.behavior === "walk") {
      next.x += (next.direction === "right" ? 1 : -1) * this.config.speedPixelsPerSecond * (deltaMs / 1000);
      if (next.x <= 0) { next.x = 0; next.direction = "right"; }
      else if (next.x >= maxX) { next.x = maxX; next.direction = "left"; }
    }
    return next;
  }
}
