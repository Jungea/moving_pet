import type { SavedPetState } from "../shared/pet-state.js";
import type { DesktopLayout } from "../shared/desktop-layout.js";
export {};
declare global {
  interface Window {
    desktopPet: {
      setInteractive(interactive: boolean): void;
      getDisplayLayout(): Promise<DesktopLayout>;
      onDisplayLayoutChanged(listener: (layout: DesktopLayout) => void): () => void;
      loadState(): Promise<SavedPetState | null>;
      saveState(state: SavedPetState): Promise<void>;
    };
  }
}
