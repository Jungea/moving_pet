import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { experienceForNextLevel, MAX_PET_LEVEL, type PetBehavior, type PetDirection, type SavedPetState } from "../../shared/pet-state";

const behaviors: PetBehavior[] = ["idle", "walk", "sleep"];
const directions: PetDirection[] = ["left", "right", "up", "down"];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseSavedPetState(value: unknown): SavedPetState | null {
  if (!value || typeof value !== "object") return null;
  const state = value as Record<string, unknown>;
  if (state.version !== 1 && state.version !== 2 && state.version !== 3) return null;
  if (!behaviors.includes(state.behavior as PetBehavior)) return null;
  if (!directions.includes(state.direction as PetDirection)) return null;
  if (![state.x, state.y, state.hunger, state.energy, state.savedAt].every(isFiniteNumber)) return null;
  if ((state.x as number) < 0 || (state.y as number) < 0) return null;
  if ((state.hunger as number) < 0 || (state.hunger as number) > 100) return null;
  if ((state.energy as number) < 0 || (state.energy as number) > 100) return null;
  const affection = state.version === 1 ? 10 : state.affection;
  if (!isFiniteNumber(affection) || affection < 0 || affection > 100) return null;
  const level = state.version === 3 ? state.level : 1;
  const experience = state.version === 3 ? state.experience : 0;
  if (!isFiniteNumber(level) || !Number.isInteger(level) || level < 1 || level > MAX_PET_LEVEL) return null;
  if (!isFiniteNumber(experience) || experience < 0 || experience >= experienceForNextLevel(level)) return null;

  return {
    version: 3,
    behavior: state.behavior as PetBehavior,
    direction: state.direction as PetDirection,
    x: state.x as number,
    y: state.y as number,
    hunger: state.hunger as number,
    energy: state.energy as number,
    affection,
    level,
    experience,
    savedAt: state.savedAt as number
  };
}

export class PetSaveSystem {
  private readonly filePath: string;

  public constructor(directory: string) {
    this.filePath = path.join(directory, "pet-state.json");
  }

  public async load(): Promise<SavedPetState | null> {
    try {
      const contents = await readFile(this.filePath, "utf8");
      return parseSavedPetState(JSON.parse(contents));
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT" && !(error instanceof SyntaxError)) console.error("Failed to load pet state", error);
      return null;
    }
  }

  public async save(value: unknown): Promise<void> {
    const state = parseSavedPetState(value);
    if (!state) throw new Error("Invalid pet state");
    const directory = path.dirname(this.filePath);
    await mkdir(directory, { recursive: true });
    await writeFile(this.filePath, JSON.stringify(state, null, 2), "utf8");
  }
}
