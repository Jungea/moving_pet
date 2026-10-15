import type { PetState } from "../../shared/pet-state.js";
import { movePetPosition, type PetMovementBounds } from "./pet-position.js";
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
  private hasCompletedWalk = false;
  public constructor(
    private readonly config: BehaviorConfig = defaultConfig,
    private readonly random: () => number = Math.random
  ) {}
  public reset(): void { this.elapsedInBehavior = 0; }
  public update(state: PetState, deltaMs: number, bounds: PetMovementBounds): PetState {
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
      if (next.behavior === "idle") {
        next.behavior = "walk";
        if (this.hasCompletedWalk) next.direction = this.pickDirection();
      } else {
        next.behavior = "idle";
        this.hasCompletedWalk = true;
      }
    }
    if (next.behavior === "walk") {
      const moved = movePetPosition(next, next.direction, this.config.speedPixelsPerSecond * (deltaMs / 1000), bounds);
      next.x = moved.x;
      next.y = moved.y;
      if (moved.blocked) next.direction = this.opposite(next.direction);
    }
    return next;
  }
  private pickDirection(): PetState["direction"] {
    const directions: PetState["direction"][] = ["left", "right", "up", "down"];
    return directions[Math.min(directions.length - 1, Math.floor(this.random() * directions.length))]!;
  }
  private opposite(direction: PetState["direction"]): PetState["direction"] {
    if (direction === "left") return "right";
    if (direction === "right") return "left";
    if (direction === "up") return "down";
    return "up";
  }
}
