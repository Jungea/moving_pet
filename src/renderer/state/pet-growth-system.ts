import { experienceForNextLevel, MAX_PET_LEVEL, type PetState } from "../../shared/pet-state.js";

export interface GrowthResult {
  state: PetState;
  leveledUp: boolean;
}

export class PetGrowthSystem {
  public addExperience(state: PetState, amount: number): GrowthResult {
    if (amount <= 0 || state.level >= MAX_PET_LEVEL) return { state, leveledUp: false };
    let level = state.level;
    let experience = state.experience + amount;
    let leveledUp = false;

    while (level < MAX_PET_LEVEL && experience >= experienceForNextLevel(level)) {
      experience -= experienceForNextLevel(level);
      level += 1;
      leveledUp = true;
    }

    if (level >= MAX_PET_LEVEL) experience = 0;
    return { state: { ...state, level, experience }, leveledUp };
  }
}
