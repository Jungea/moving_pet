import type { PetState } from "../../shared/pet-state.js";
export class PetRenderer {
  public constructor(private readonly element: HTMLElement) {}
  public render(state: PetState): void {
    this.element.style.transform = `translate(${state.x}px, ${state.y}px)`;
    this.element.dataset.behavior = state.behavior;
    this.element.dataset.direction = state.direction;
    this.element.dataset.mood = state.mood;
    const label = this.element.querySelector<HTMLElement>(".pet__status");
    if (label) label.textContent = state.mood === "happy" ? "pet!" : state.behavior;
  }
  public getWidth(): number { return this.element.getBoundingClientRect().width; }
  public getHeight(): number { return this.element.getBoundingClientRect().height; }
}
