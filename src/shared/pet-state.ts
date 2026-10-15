export type PetBehavior = "idle" | "walk" | "sleep";
export type PetDirection = "left" | "right";
export type PetMood = "calm" | "happy";
export interface PetState {
  behavior: PetBehavior;
  direction: PetDirection;
  mood: PetMood;
  x: number;
  y: number;
  hunger: number;
  energy: number;
  affection: number;
}

export interface SavedPetState {
  version: 2;
  behavior: PetBehavior;
  direction: PetDirection;
  x: number;
  y: number;
  hunger: number;
  energy: number;
  affection: number;
  savedAt: number;
}
