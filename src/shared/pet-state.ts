export type PetBehavior = "idle" | "walk" | "sleep";
export type PetDirection = "left" | "right";
export type PetMood = "calm" | "happy";
export const MAX_PET_LEVEL = 100;
export function experienceForNextLevel(level: number): number { return level * 20; }
export interface PetState {
  behavior: PetBehavior;
  direction: PetDirection;
  mood: PetMood;
  x: number;
  y: number;
  hunger: number;
  energy: number;
  affection: number;
  level: number;
  experience: number;
}

export interface SavedPetState {
  version: 3;
  behavior: PetBehavior;
  direction: PetDirection;
  x: number;
  y: number;
  hunger: number;
  energy: number;
  affection: number;
  level: number;
  experience: number;
  savedAt: number;
}
