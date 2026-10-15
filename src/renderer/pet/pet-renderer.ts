import type { PetState } from "../../shared/pet-state.js";
export class PetRenderer {
  public constructor(private readonly element: HTMLElement) {}
  public render(state: PetState, showPanel = false): void {
    this.element.style.transform = `translate(${state.x}px, ${state.y}px)`;
    this.element.dataset.behavior = state.behavior;
    this.element.dataset.direction = state.direction;
    this.element.dataset.mood = state.mood;
    this.element.dataset.panelSide = state.y < 110 ? "below" : "above";
    const label = this.element.querySelector<HTMLElement>(".pet__status");
    if (label) label.textContent = state.mood === "happy" ? "pet!" : state.behavior;
    const panel = this.element.querySelector<HTMLElement>(".pet__panel");
    if (panel) panel.hidden = !showPanel;
    this.renderStat("hunger", state.hunger);
    this.renderStat("energy", state.energy);
  }
  public getWidth(): number { return this.element.getBoundingClientRect().width; }
  public getHeight(): number { return this.element.getBoundingClientRect().height; }
  private renderStat(name: string, value: number): void {
    const output = this.element.querySelector<HTMLOutputElement>(`[data-stat="${name}"]`);
    const fill = this.element.querySelector<HTMLElement>(`[data-fill="${name}"]`);
    const rounded = Math.round(value);
    if (output) output.value = String(rounded);
    if (fill) fill.style.width = `${rounded}%`;
  }
}
