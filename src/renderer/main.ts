import { BasicBehaviorSystem } from "./behavior/basic-behavior-system.js";
import { InteractionSystem } from "./interaction/interaction-system.js";
import { PetRenderer } from "./pet/pet-renderer.js";
import { PetCareSystem, type CareResult } from "./state/pet-care-system.js";
import { PetNeedsSystem } from "./state/pet-needs-system.js";
import type { PetState, SavedPetState } from "../shared/pet-state.js";
const petElement = document.querySelector<HTMLElement>("#pet");
if (!petElement) throw new Error("Pet element was not found.");
const panelElement = document.querySelector<HTMLElement>("#pet-panel");
const feedButton = document.querySelector<HTMLButtonElement>("[data-action=\"feed\"]");
const playButton = document.querySelector<HTMLButtonElement>("[data-action=\"play\"]");
if (!panelElement || !feedButton || !playButton) throw new Error("Pet controls were not found.");
const renderer = new PetRenderer(petElement);
const behavior = new BasicBehaviorSystem();
const care = new PetCareSystem();
const needs = new PetNeedsSystem();
let dragging = false;
let happyUntil = 0;
let panelUntil = 0;
let lastSaveAt = 0;
let saving = false;
let reaction: string | null = null;
let reactionUntil = 0;
let state: PetState = {
  behavior: "idle",
  direction: "right",
  mood: "calm",
  x: 40,
  y: Math.max(0, window.innerHeight - renderer.getHeight() - 8),
  hunger: 20,
  energy: 80,
  affection: 10
};

function clampToScreen(value: PetState): PetState {
  return {
    ...value,
    x: Math.max(0, Math.min(window.innerWidth - renderer.getWidth(), value.x)),
    y: Math.max(0, Math.min(window.innerHeight - renderer.getHeight(), value.y))
  };
}

function toSavedState(value: PetState): SavedPetState {
  return {
    version: 2,
    behavior: value.behavior,
    direction: value.direction,
    x: value.x,
    y: value.y,
    hunger: value.hunger,
    energy: value.energy,
    affection: value.affection,
    savedAt: Date.now()
  };
}

async function saveState(): Promise<void> {
  if (saving) return;
  saving = true;
  try {
    await window.desktopPet.saveState(toSavedState(state));
    lastSaveAt = performance.now();
  } catch (error) {
    console.error("Failed to save pet state", error);
  } finally {
    saving = false;
  }
}

function applyCare(result: CareResult): void {
  state = result.state;
  reaction = result.reaction;
  reactionUntil = performance.now() + 900;
  happyUntil = state.mood === "happy" ? performance.now() + 700 : happyUntil;
  panelUntil = performance.now() + 4000;
  behavior.reset();
  void saveState();
}

const interaction = new InteractionSystem(petElement, {
  onClick: () => {
    applyCare(care.pet(state));
  },
  onDragStart: () => { behavior.reset(); dragging = true; },
  onDrag: (x, y) => { state = { ...state, x, y, behavior: "idle" }; },
  onDragEnd: () => { dragging = false; void saveState(); }
}, [panelElement]);
feedButton.addEventListener("click", () => applyCare(care.feed(state)));
playButton.addEventListener("click", () => applyCare(care.play(state)));
let previousTimestamp = performance.now();
function tick(timestamp: number): void {
  const deltaMs = Math.min(timestamp - previousTimestamp, 100);
  previousTimestamp = timestamp;
  state = needs.update(state, deltaMs);
  if (!dragging) state = behavior.update(state, deltaMs, Math.max(0, window.innerWidth - renderer.getWidth()));
  if (state.mood === "happy" && timestamp >= happyUntil) state = { ...state, mood: "calm" };
  if (reaction && timestamp >= reactionUntil) reaction = null;
  state = clampToScreen(state);
  renderer.render(state, timestamp < panelUntil, reaction);
  interaction.refresh();
  if (timestamp - lastSaveAt >= 5000) void saveState();
  requestAnimationFrame(tick);
}

async function start(): Promise<void> {
  try {
    const saved = await window.desktopPet.loadState();
    if (saved) state = clampToScreen({ ...saved, mood: "calm" });
  } catch (error) {
    console.error("Failed to restore pet state", error);
  }
  lastSaveAt = performance.now();
  renderer.render(state);
  interaction.start();
  requestAnimationFrame(tick);
}

void start();
