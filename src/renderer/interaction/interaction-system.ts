export class InteractionSystem {
  private interactive = false;
  private pointer: { x: number; y: number } | null = null;
  public constructor(private readonly petElement: HTMLElement) {}
  public start(): void { window.addEventListener("mousemove", this.onMouseMove); window.addEventListener("blur", this.disableInteraction); }
  private readonly onMouseMove = (event: MouseEvent): void => {
    this.pointer = { x: event.clientX, y: event.clientY };
    this.refresh();
  };
  public refresh(): void {
    if (!this.pointer) return;
    const rect = this.petElement.getBoundingClientRect();
    const isOverPet = this.pointer.x >= rect.left && this.pointer.x <= rect.right && this.pointer.y >= rect.top && this.pointer.y <= rect.bottom;
    if (isOverPet !== this.interactive) { this.interactive = isOverPet; window.desktopPet.setInteractive(isOverPet); }
  }
  private readonly disableInteraction = (): void => { this.interactive = false; window.desktopPet.setInteractive(false); };
}
