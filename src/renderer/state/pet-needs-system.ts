import type { PetState } from "../../shared/pet-state.js";

export interface NeedsConfig {
  hungerPerMinute: number;
  awakeEnergyLossPerMinute: number;
  sleepEnergyRecoveryPerMinute: number;
}

const defaultConfig: NeedsConfig = {
  hungerPerMinute: 1,
  awakeEnergyLossPerMinute: 1.5,
  sleepEnergyRecoveryPerMinute: 12
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export class PetNeedsSystem {
  public constructor(private readonly config: NeedsConfig = defaultConfig) {}

  public update(state: PetState, deltaMs: number): PetState {
    const minutes = deltaMs / 60_000;
    const energyDelta = state.behavior === "sleep"
      ? this.config.sleepEnergyRecoveryPerMinute * minutes
      : -this.config.awakeEnergyLossPerMinute * minutes;

    return {
      ...state,
      hunger: clamp(state.hunger + this.config.hungerPerMinute * minutes),
      energy: clamp(state.energy + energyDelta)
    };
  }
}
