import type { PetState } from "../../shared/pet-state.js";
export class PetRenderer {
  public constructor(private readonly element: HTMLElement) {}
  public render(state: PetState): void {
    this.element.style.transform = `translateX(${state.x}px)`;
    this.element.dataset.behavior = state.behavior;
    this.element.dataset.direction = state.direction;
    const label = this.element.querySelector<HTMLElement>(".pet__status");
    if (label) label.textContent = state.behavior;
  }
  public getWidth(): number { return this.element.getBoundingClientRect().width; }
}
