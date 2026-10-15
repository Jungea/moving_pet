import { BasicBehaviorSystem } from "./behavior/basic-behavior-system.js";
import { InteractionSystem } from "./interaction/interaction-system.js";
import { PetRenderer } from "./pet/pet-renderer.js";
import type { PetState } from "../shared/pet-state.js";
const petElement = document.querySelector<HTMLElement>("#pet");
if (!petElement) throw new Error("Pet element was not found.");
const renderer = new PetRenderer(petElement);
const behavior = new BasicBehaviorSystem();
const interaction = new InteractionSystem(petElement);
let state: PetState = { behavior: "idle", direction: "right", x: 40 };
let previousTimestamp = performance.now();
function tick(timestamp: number): void {
  const deltaMs = Math.min(timestamp - previousTimestamp, 100);
  previousTimestamp = timestamp;
  state = behavior.update(state, deltaMs, Math.max(0, window.innerWidth - renderer.getWidth()));
  renderer.render(state);
  interaction.refresh();
  requestAnimationFrame(tick);
}
renderer.render(state); interaction.start(); requestAnimationFrame(tick);
