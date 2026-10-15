import { app, BrowserWindow, ipcMain, Menu, nativeImage, screen, Tray } from "electron";
import path from "node:path";
import { PetSaveSystem } from "./save/pet-save-system";

let petWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const trayIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="17" r="12" fill="#7c5cff"/><path d="M7 10 9 3l6 6M25 10l-2-7-6 6" fill="#7c5cff" stroke="#5a3ee8" stroke-width="2"/><circle cx="12" cy="16" r="2" fill="#fff"/><circle cx="20" cy="16" r="2" fill="#fff"/><path d="M13 22q3 3 6 0" fill="none" stroke="#fff" stroke-width="2"/></svg>`;

function createPetWindow(): void {
  const workArea = screen.getPrimaryDisplay().workArea;
  petWindow = new BrowserWindow({
    ...workArea, frame: false, transparent: true, backgroundColor: "#00000000",
    alwaysOnTop: true, skipTaskbar: true, resizable: false, movable: false,
    focusable: false, hasShadow: false,
    webPreferences: { preload: path.join(__dirname, "../preload/preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  petWindow.setAlwaysOnTop(true, "floating");
  petWindow.setIgnoreMouseEvents(true, { forward: true });
  void petWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  petWindow.on("closed", () => { petWindow = null; });
}

function createTray(): void {
  const encoded = Buffer.from(trayIconSvg).toString("base64");
  const icon = nativeImage.createFromDataURL(`data:image/svg+xml;base64,${encoded}`).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip("Moving Pet");
  tray.setContextMenu(Menu.buildFromTemplate([{ label: "종료", click: () => app.quit() }]));
}

app.whenReady().then(() => {
  const saveSystem = new PetSaveSystem(path.join(app.getPath("userData"), "save"));
  ipcMain.on("pet:set-interactive", (event, interactive: boolean) => {
    if (event.sender !== petWindow?.webContents || typeof interactive !== "boolean") return;
    petWindow.setIgnoreMouseEvents(!interactive, { forward: true });
  });
  ipcMain.handle("pet:load-state", (event) => {
    if (event.sender !== petWindow?.webContents) throw new Error("Untrusted state request");
    return saveSystem.load();
  });
  ipcMain.handle("pet:save-state", (event, state: unknown) => {
    if (event.sender !== petWindow?.webContents) throw new Error("Untrusted state request");
    return saveSystem.save(state);
  });
  createPetWindow();
  createTray();
  screen.on("display-metrics-changed", () => petWindow?.setBounds(screen.getPrimaryDisplay().workArea));
});
app.on("window-all-closed", () => app.quit());
