import type { SavedPetState } from "../shared/pet-state.js";
export {};
declare global {
  interface Window {
    desktopPet: {
      setInteractive(interactive: boolean): void;
      loadState(): Promise<SavedPetState | null>;
      saveState(state: SavedPetState): Promise<void>;
    };
  }
}
