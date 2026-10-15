import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { parseSavedPetState, PetSaveSystem } from "../src/main/save/pet-save-system";
import type { SavedPetState } from "../src/shared/pet-state";

const saved: SavedPetState = { version: 2, behavior: "idle", direction: "right", x: 30, y: 40, hunger: 25, energy: 70, affection: 15, savedAt: 1_700_000_000_000 };

test("저장 데이터 구조와 값 범위를 검증한다", () => {
  assert.deepEqual(parseSavedPetState(saved), saved);
  assert.equal(parseSavedPetState({ ...saved, energy: 101 }), null);
  assert.equal(parseSavedPetState({ ...saved, affection: -1 }), null);
  assert.equal(parseSavedPetState({ ...saved, version: 3 }), null);
});

test("v1 저장 데이터는 기본 친밀도를 포함한 v2로 마이그레이션한다", () => {
  const legacy = { ...saved, version: 1, affection: undefined };
  const migrated = parseSavedPetState(legacy);
  assert.equal(migrated?.version, 2);
  assert.equal(migrated?.affection, 10);
});

test("상태를 JSON 파일에 저장하고 다시 불러온다", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "moving-pet-test-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const saveSystem = new PetSaveSystem(directory);
  assert.equal(await saveSystem.load(), null);
  await saveSystem.save(saved);
  assert.deepEqual(await saveSystem.load(), saved);
});
