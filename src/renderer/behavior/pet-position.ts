import type { DesktopLayout, DesktopWorkArea } from "../../shared/desktop-layout.js";
import type { PetDirection } from "../../shared/pet-state.js";

export interface PetMovementBounds extends DesktopLayout {
  petWidth: number;
  petHeight: number;
}

export interface PetPosition {
  x: number;
  y: number;
}

export interface MovedPetPosition extends PetPosition {
  blocked: boolean;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function fittingAreas(bounds: PetMovementBounds): DesktopWorkArea[] {
  const areas = bounds.workAreas.filter((area) => area.width >= bounds.petWidth && area.height >= bounds.petHeight);
  return areas.length > 0 ? areas : [{ x: 0, y: 0, width: bounds.width, height: bounds.height }];
}

function clampToArea(position: PetPosition, area: DesktopWorkArea, bounds: PetMovementBounds): PetPosition {
  return {
    x: clamp(position.x, area.x, area.x + area.width - bounds.petWidth),
    y: clamp(position.y, area.y, area.y + area.height - bounds.petHeight)
  };
}

function distanceSquared(first: PetPosition, second: PetPosition): number {
  return (first.x - second.x) ** 2 + (first.y - second.y) ** 2;
}

function closestArea(position: PetPosition, bounds: PetMovementBounds): DesktopWorkArea {
  const areas = fittingAreas(bounds);
  let nearest = areas[0]!;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const area of areas) {
    const distance = distanceSquared(position, clampToArea(position, area, bounds));
    if (distance < nearestDistance) {
      nearest = area;
      nearestDistance = distance;
    }
  }
  return nearest;
}

function areaAt(position: PetPosition, bounds: PetMovementBounds): DesktopWorkArea | null {
  return fittingAreas(bounds).find((area) => (
    position.x >= area.x
    && position.x < area.x + area.width
    && position.y >= area.y
    && position.y < area.y + area.height
  )) ?? null;
}

function overlaps(firstStart: number, firstEnd: number, secondStart: number, secondEnd: number): boolean {
  return Math.max(firstStart, secondStart) < Math.min(firstEnd, secondEnd);
}

function adjacentArea(area: DesktopWorkArea, position: PetPosition, direction: PetDirection, bounds: PetMovementBounds): DesktopWorkArea | null {
  const areas = fittingAreas(bounds);
  const candidates = areas.filter((candidate) => {
    if (candidate === area) return false;
    if (direction === "left") return candidate.x + candidate.width === area.x && overlaps(position.y, position.y + bounds.petHeight, candidate.y, candidate.y + candidate.height);
    if (direction === "right") return candidate.x === area.x + area.width && overlaps(position.y, position.y + bounds.petHeight, candidate.y, candidate.y + candidate.height);
    if (direction === "up") return candidate.y + candidate.height === area.y && overlaps(position.x, position.x + bounds.petWidth, candidate.x, candidate.x + candidate.width);
    return candidate.y === area.y + area.height && overlaps(position.x, position.x + bounds.petWidth, candidate.x, candidate.x + candidate.width);
  });
  if (candidates.length === 0) return null;
  return candidates.reduce((best, candidate) => {
    const bestDistance = distanceSquared(position, clampToArea(position, best, bounds));
    const candidateDistance = distanceSquared(position, clampToArea(position, candidate, bounds));
    return candidateDistance < bestDistance ? candidate : best;
  });
}

export function clampPetPosition(position: PetPosition, bounds: PetMovementBounds, preferredAreaPoint?: PetPosition): PetPosition {
  const preferredArea = preferredAreaPoint ? areaAt(preferredAreaPoint, bounds) : null;
  return clampToArea(position, preferredArea ?? closestArea(position, bounds), bounds);
}

export function movePetPosition(position: PetPosition, direction: PetDirection, distance: number, bounds: PetMovementBounds): MovedPetPosition {
  const current = clampPetPosition(position, bounds);
  const area = closestArea(current, bounds);
  const maximumX = area.x + area.width - bounds.petWidth;
  const maximumY = area.y + area.height - bounds.petHeight;
  const horizontal = direction === "left" || direction === "right";
  const sign = direction === "left" || direction === "up" ? -1 : 1;
  const available = horizontal ? (sign > 0 ? maximumX - current.x : current.x - area.x) : (sign > 0 ? maximumY - current.y : current.y - area.y);

  if (distance <= available) {
    return horizontal
      ? { x: current.x + sign * distance, y: current.y, blocked: false }
      : { x: current.x, y: current.y + sign * distance, blocked: false };
  }

  const neighbor = adjacentArea(area, current, direction, bounds);
  if (!neighbor) {
    return { ...current, blocked: true };
  }

  const remainder = distance - Math.max(0, available);
  const entered = clampToArea(
    horizontal
      ? { x: sign > 0 ? neighbor.x + remainder : neighbor.x + neighbor.width - bounds.petWidth - remainder, y: current.y }
      : { x: current.x, y: sign > 0 ? neighbor.y + remainder : neighbor.y + neighbor.height - bounds.petHeight - remainder },
    neighbor,
    bounds
  );
  return { ...entered, blocked: false };
}
