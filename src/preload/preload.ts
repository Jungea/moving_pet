import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("desktopPet", { setInteractive: (interactive: boolean): void => { ipcRenderer.send("pet:set-interactive", interactive); } });
