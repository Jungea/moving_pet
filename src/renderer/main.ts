import { BasicBehaviorSystem } from "./behavior/basic-behavior-system.js";
import { InteractionSystem } from "./interaction/interaction-system.js";
import { PetRenderer } from "./pet/pet-renderer.js";
import type { PetState } from "../shared/pet-state.js";
const petElement = document.querySelector<HTMLElement>("#pet");
if (!petElement) throw new Error("Pet element was not found.");
const renderer = new PetRenderer(petElement);
const behavior = new BasicBehaviorSystem();
let dragging = false;
let happyUntil = 0;
let state: PetState = { behavior: "idle", direction: "right", mood: "calm", x: 40, y: Math.max(0, window.innerHeight - renderer.getHeight() - 8) };
const interaction = new InteractionSystem(petElement, {
  onClick: () => { behavior.reset(); state = { ...state, mood: "happy", behavior: "idle" }; happyUntil = performance.now() + 700; },
  onDragStart: () => { behavior.reset(); dragging = true; },
  onDrag: (x, y) => { state = { ...state, x, y, behavior: "idle" }; },
  onDragEnd: () => { dragging = false; }
});
let previousTimestamp = performance.now();
function tick(timestamp: number): void {
  const deltaMs = Math.min(timestamp - previousTimestamp, 100);
  previousTimestamp = timestamp;
  if (!dragging) state = behavior.update(state, deltaMs, Math.max(0, window.innerWidth - renderer.getWidth()));
  if (state.mood === "happy" && timestamp >= happyUntil) state = { ...state, mood: "calm" };
  renderer.render(state);
  interaction.refresh();
  requestAnimationFrame(tick);
}
renderer.render(state); interaction.start(); requestAnimationFrame(tick);
