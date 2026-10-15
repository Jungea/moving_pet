export type PetBehavior = "idle" | "walk";
export type PetDirection = "left" | "right";
export interface PetState { behavior: PetBehavior; direction: PetDirection; x: number; }
