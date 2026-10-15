import { contextBridge, ipcRenderer } from "electron";
import type { SavedPetState } from "../shared/pet-state";

contextBridge.exposeInMainWorld("desktopPet", {
  setInteractive: (interactive: boolean): void => { ipcRenderer.send("pet:set-interactive", interactive); },
  loadState: (): Promise<SavedPetState | null> => ipcRenderer.invoke("pet:load-state") as Promise<SavedPetState | null>,
  saveState: (state: SavedPetState): Promise<void> => ipcRenderer.invoke("pet:save-state", state) as Promise<void>
});
