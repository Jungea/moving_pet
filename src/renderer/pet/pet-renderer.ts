import { experienceForNextLevel, type PetState } from "../../shared/pet-state.js";
export class PetRenderer {
  public constructor(private readonly element: HTMLElement) {}
  public render(state: PetState, showPanel = false, reaction: string | null = null): void {
    this.element.style.transform = `translate(${state.x}px, ${state.y}px)`;
    this.element.dataset.behavior = state.behavior;
    this.element.dataset.direction = state.direction;
    this.element.dataset.mood = state.mood;
    this.element.dataset.panelSide = state.y < 110 ? "below" : "above";
    const label = this.element.querySelector<HTMLElement>(".pet__status");
    if (label) label.textContent = reaction ?? state.behavior;
    const panel = this.element.querySelector<HTMLElement>(".pet__panel");
    if (panel) panel.hidden = !showPanel;
    this.renderStat("hunger", state.hunger);
    this.renderStat("energy", state.energy);
    this.renderStat("affection", state.affection);
    this.renderGrowth(state);
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
  private renderGrowth(state: PetState): void {
    const level = this.element.querySelector<HTMLOutputElement>("[data-level]");
    const output = this.element.querySelector<HTMLOutputElement>("[data-stat=\"experience\"]");
    const fill = this.element.querySelector<HTMLElement>("[data-fill=\"experience\"]");
    const required = experienceForNextLevel(state.level);
    if (level) level.value = String(state.level);
    if (output) output.value = `${state.experience}/${required}`;
    if (fill) fill.style.width = `${Math.round((state.experience / required) * 100)}%`;
  }
}
