import { contextBridge, ipcRenderer } from "electron";
import type { DesktopLayout } from "../shared/desktop-layout";
import type { SavedPetState } from "../shared/pet-state";

contextBridge.exposeInMainWorld("desktopPet", {
  setInteractive: (interactive: boolean): void => { ipcRenderer.send("pet:set-interactive", interactive); },
  getDisplayLayout: (): Promise<DesktopLayout> => ipcRenderer.invoke("pet:get-display-layout") as Promise<DesktopLayout>,
  onDisplayLayoutChanged: (listener: (layout: DesktopLayout) => void): (() => void) => {
    const callback = (_event: Electron.IpcRendererEvent, layout: DesktopLayout): void => listener(layout);
    ipcRenderer.on("pet:display-layout-changed", callback);
    return () => ipcRenderer.removeListener("pet:display-layout-changed", callback);
  },
  loadState: (): Promise<SavedPetState | null> => ipcRenderer.invoke("pet:load-state") as Promise<SavedPetState | null>,
  saveState: (state: SavedPetState): Promise<void> => ipcRenderer.invoke("pet:save-state", state) as Promise<void>
});
