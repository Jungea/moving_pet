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
  private dragOrigin = { x: 0, y: 0 };
  private pointer: { x: number; y: number } | null = null;
  public constructor(
    private readonly petElement: HTMLElement,
    private readonly callbacks: InteractionCallbacks,
    private readonly interactiveElements: HTMLElement[] = []
  ) {}
  public start(): void {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("blur", this.disableInteraction);
    this.petElement.addEventListener("mousedown", this.onMouseDown);
  }
  private readonly onMouseMove = (event: MouseEvent): void => {
    this.pointer = { x: event.clientX, y: event.clientY };
    if (this.dragging) {
      const distance = Math.hypot(event.clientX - this.dragOrigin.x, event.clientY - this.dragOrigin.y);
      if (distance < 4 && !this.didDrag) return;
      const x = Math.max(0, Math.min(window.innerWidth - this.petElement.offsetWidth, event.clientX - this.grabOffset.x));
      const y = Math.max(0, Math.min(window.innerHeight - this.petElement.offsetHeight, event.clientY - this.grabOffset.y));
      this.didDrag = true;
      this.callbacks.onDrag(x, y);
    }
    this.refresh();
  };
  private readonly onMouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) return;
    if (this.interactiveElements.some((element) => element.contains(event.target as Node))) return;
    const rect = this.petElement.getBoundingClientRect();
    this.dragging = true;
    this.didDrag = false;
    this.dragOrigin = { x: event.clientX, y: event.clientY };
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
    const isOverInteractiveArea = [this.petElement, ...this.interactiveElements].some((element) => {
      const rect = element.getBoundingClientRect();
      return this.pointer !== null && this.pointer.x >= rect.left && this.pointer.x <= rect.right && this.pointer.y >= rect.top && this.pointer.y <= rect.bottom;
    });
    if (isOverInteractiveArea !== this.interactive) {
      this.interactive = isOverInteractiveArea;
      window.desktopPet.setInteractive(isOverInteractiveArea);
    }
  }
  private readonly disableInteraction = (): void => {
    if (this.dragging) this.callbacks.onDragEnd();
    this.dragging = false;
    this.interactive = false;
    window.desktopPet.setInteractive(false);
  };
}
