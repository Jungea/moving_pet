export interface DesktopWorkArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesktopLayout {
  width: number;
  height: number;
  workAreas: DesktopWorkArea[];
}
