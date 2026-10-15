export interface InteractionCallbacks {
  onClick(): void;
  onDragStart(): void;
  onDrag(x: number, y: number): void;
  onDragEnd(): void;
}

export class InteractionSystem {
  private interactive = false;
  private dragging = false;
  private didDrag = false;
  private grabOffset = { x: 0, y: 0 };
  private pointer: { x: number; y: number } | null = null;
  public constructor(private readonly petElement: HTMLElement, private readonly callbacks: InteractionCallbacks) {}
  public start(): void {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("blur", this.disableInteraction);
    this.petElement.addEventListener("mousedown", this.onMouseDown);
  }
  private readonly onMouseMove = (event: MouseEvent): void => {
    this.pointer = { x: event.clientX, y: event.clientY };
    if (this.dragging) {
      const x = Math.max(0, Math.min(window.innerWidth - this.petElement.offsetWidth, event.clientX - this.grabOffset.x));
      const y = Math.max(0, Math.min(window.innerHeight - this.petElement.offsetHeight, event.clientY - this.grabOffset.y));
      this.didDrag = true;
      this.callbacks.onDrag(x, y);
    }
    this.refresh();
  };
  private readonly onMouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) return;
    const rect = this.petElement.getBoundingClientRect();
    this.dragging = true;
    this.didDrag = false;
    this.grabOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    this.callbacks.onDragStart();
  };
  private readonly onMouseUp = (): void => {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.didDrag) this.callbacks.onDragEnd();
    else this.callbacks.onClick();
    this.refresh();
  };
  public refresh(): void {
    if (this.dragging) return;
    if (!this.pointer) return;
    const rect = this.petElement.getBoundingClientRect();
    const isOverPet = this.pointer.x >= rect.left && this.pointer.x <= rect.right && this.pointer.y >= rect.top && this.pointer.y <= rect.bottom;
    if (isOverPet !== this.interactive) { this.interactive = isOverPet; window.desktopPet.setInteractive(isOverPet); }
  }
  private readonly disableInteraction = (): void => {
    if (this.dragging) this.callbacks.onDragEnd();
    this.dragging = false;
    this.interactive = false;
    window.desktopPet.setInteractive(false);
  };
}
