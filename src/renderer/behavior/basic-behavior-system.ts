import type { PetBehavior, PetState } from "../../shared/pet-state.js";
export interface BehaviorConfig { idleDurationMs: number; walkDurationMs: number; sleepDurationMs: number; speedPixelsPerSecond: number; }
const defaultConfig: BehaviorConfig = { idleDurationMs: 2200, walkDurationMs: 5000, sleepDurationMs: 3600, speedPixelsPerSecond: 70 };
export class BasicBehaviorSystem {
  private elapsedInBehavior = 0;
  public constructor(private readonly config: BehaviorConfig = defaultConfig) {}
  public reset(): void { this.elapsedInBehavior = 0; }
  public update(state: PetState, deltaMs: number, maxX: number): PetState {
    this.elapsedInBehavior += deltaMs;
    const duration = this.getDuration(state.behavior);
    const next = { ...state };
    if (this.elapsedInBehavior >= duration) { this.elapsedInBehavior %= duration; next.behavior = this.nextBehavior(state.behavior); }
    if (next.behavior === "walk") {
      next.x += (next.direction === "right" ? 1 : -1) * this.config.speedPixelsPerSecond * (deltaMs / 1000);
      if (next.x <= 0) { next.x = 0; next.direction = "right"; }
      else if (next.x >= maxX) { next.x = maxX; next.direction = "left"; }
    }
    return next;
  }
  private getDuration(behavior: PetBehavior): number {
    if (behavior === "idle") return this.config.idleDurationMs;
    if (behavior === "walk") return this.config.walkDurationMs;
    return this.config.sleepDurationMs;
  }
  private nextBehavior(current: PetBehavior): PetBehavior {
    if (current === "idle") return "walk";
    if (current === "walk") return "sleep";
    return "idle";
  }
}
