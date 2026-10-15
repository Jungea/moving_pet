import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { parseSavedPetState, PetSaveSystem } from "../src/main/save/pet-save-system";
import type { SavedPetState } from "../src/shared/pet-state";

const saved: SavedPetState = { version: 1, behavior: "idle", direction: "right", x: 30, y: 40, hunger: 25, energy: 70, savedAt: 1_700_000_000_000 };

test("저장 데이터 구조와 값 범위를 검증한다", () => {
  assert.deepEqual(parseSavedPetState(saved), saved);
  assert.equal(parseSavedPetState({ ...saved, energy: 101 }), null);
  assert.equal(parseSavedPetState({ ...saved, version: 2 }), null);
});

test("상태를 JSON 파일에 저장하고 다시 불러온다", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "moving-pet-test-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const saveSystem = new PetSaveSystem(directory);
  assert.equal(await saveSystem.load(), null);
  await saveSystem.save(saved);
  assert.deepEqual(await saveSystem.load(), saved);
});
