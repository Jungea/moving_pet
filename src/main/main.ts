import { app, BrowserWindow, ipcMain, Menu, nativeImage, screen, Tray } from "electron";
import path from "node:path";
import type { DesktopLayout, DesktopWorkArea } from "../shared/desktop-layout";
import { PetSaveSystem } from "./save/pet-save-system";

let petWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let activeDisplayId: number | null = null;

const trayIconPng = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAe0lEQVR4nO3TUQrAIAwDUA/qUby7/krZOtrEqqMBwY/SPDYsJXNDWu1dHmTuLsDTUgsARhwPkHcq4G2h5yRga7kLsRWwohxGzNEKtDnoFyQgFGBdbJmDEGEvIAFHAL4QMvRy9ldwAVgIdzkDAZcjCFq5FbKkWAOFFv4uA3zNSGIpFU+VAAAAAElFTkSuQmCC";

function getDesktopWorkAreas(): { bounds: DesktopWorkArea; layout: DesktopLayout } {
  const displays = screen.getAllDisplays();
  const activeDisplay = displays.find((display) => display.id === activeDisplayId) ?? screen.getPrimaryDisplay();
  activeDisplayId = activeDisplay.id;
  const workArea = activeDisplay.workArea;
  return {
    bounds: workArea,
    layout: {
      width: workArea.width,
      height: workArea.height,
      workAreas: [{ x: 0, y: 0, width: workArea.width, height: workArea.height }]
    }
  };
}

function createPetWindow(): void {
  const { bounds } = getDesktopWorkAreas();
  petWindow = new BrowserWindow({
    ...bounds, frame: false, transparent: true, backgroundColor: "#00000000",
    alwaysOnTop: true, skipTaskbar: true, resizable: false, movable: false,
    focusable: false, hasShadow: false,
    webPreferences: { preload: path.join(__dirname, "../preload/preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  petWindow.setAlwaysOnTop(true, "floating");
  petWindow.setIgnoreMouseEvents(true, { forward: true });
  void petWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  petWindow.on("closed", () => { petWindow = null; });
}

function refreshDesktopLayout(): void {
  if (!petWindow) return;
  const { bounds, layout } = getDesktopWorkAreas();
  petWindow.setBounds(bounds);
  petWindow.webContents.send("pet:display-layout-changed", layout);
}

function refreshTrayMenu(): void {
  if (!tray) return;
  const activeDisplay = screen.getAllDisplays().find((display) => display.id === activeDisplayId);
  const displayItems = screen.getAllDisplays().map((display, index) => ({
    label: `모니터 ${index + 1}${display.id === screen.getPrimaryDisplay().id ? " (기본)" : ""}`,
    type: "radio" as const,
    checked: display.id === activeDisplay?.id,
    click: (): void => {
      activeDisplayId = display.id;
      refreshDesktopLayout();
      refreshTrayMenu();
    }
  }));
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "펫 표시 모니터", enabled: false },
    ...displayItems,
    { type: "separator" },
    { label: "종료", click: () => app.quit() }
  ]));
}

function createTray(): void {
  const icon = nativeImage.createFromBuffer(Buffer.from(trayIconPng, "base64"));
  if (icon.isEmpty()) throw new Error("Failed to load tray icon");
  tray = new Tray(icon);
  tray.setToolTip("Moving Pet");
  refreshTrayMenu();
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
  ipcMain.handle("pet:get-display-layout", (event): DesktopLayout => {
    if (event.sender !== petWindow?.webContents) throw new Error("Untrusted display request");
    return getDesktopWorkAreas().layout;
  });
  createPetWindow();
  createTray();
  const refreshDisplays = (): void => {
    refreshDesktopLayout();
    refreshTrayMenu();
  };
  screen.on("display-added", refreshDisplays);
  screen.on("display-removed", refreshDisplays);
  screen.on("display-metrics-changed", refreshDisplays);
});
app.on("window-all-closed", () => app.quit());
