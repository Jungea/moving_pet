import type { PetState } from "../../shared/pet-state.js";

export type CareReaction = "pet!" | "yum!" | "fun!" | "tired...";

export interface CareResult {
  state: PetState;
  reaction: CareReaction;
}

export interface CareConfig {
  feedHungerReduction: number;
  feedAffectionGain: number;
  playEnergyCost: number;
  playHungerGain: number;
  playAffectionGain: number;
  petAffectionGain: number;
}

const defaultConfig: CareConfig = {
  feedHungerReduction: 25,
  feedAffectionGain: 2,
  playEnergyCost: 10,
  playHungerGain: 4,
  playAffectionGain: 6,
  petAffectionGain: 1
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export class PetCareSystem {
  public constructor(private readonly config: CareConfig = defaultConfig) {}

  public pet(state: PetState): CareResult {
    return {
      state: { ...state, mood: "happy", affection: clamp(state.affection + this.config.petAffectionGain) },
      reaction: "pet!"
    };
  }

  public feed(state: PetState): CareResult {
    return {
      state: {
        ...state,
        mood: "happy",
        hunger: clamp(state.hunger - this.config.feedHungerReduction),
        affection: clamp(state.affection + this.config.feedAffectionGain)
      },
      reaction: "yum!"
    };
  }

  public play(state: PetState): CareResult {
    if (state.energy < this.config.playEnergyCost) return { state, reaction: "tired..." };
    return {
      state: {
        ...state,
        mood: "happy",
        behavior: "idle",
        energy: clamp(state.energy - this.config.playEnergyCost),
        hunger: clamp(state.hunger + this.config.playHungerGain),
        affection: clamp(state.affection + this.config.playAffectionGain)
      },
      reaction: "fun!"
    };
  }
}
