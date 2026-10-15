import assert from "node:assert/strict";
import test from "node:test";
import { PetGrowthSystem } from "../src/renderer/state/pet-growth-system";
import type { PetState } from "../src/shared/pet-state";

const state: PetState = { behavior: "idle", direction: "right", mood: "calm", x: 0, y: 0, hunger: 20, energy: 80, affection: 10, level: 1, experience: 18 };
const growth = new PetGrowthSystem();

test("필요 경험치를 넘으면 레벨업하고 남은 경험치를 유지한다", () => {
  const result = growth.addExperience(state, 5);
  assert.equal(result.state.level, 2);
  assert.equal(result.state.experience, 3);
  assert.equal(result.leveledUp, true);
});

test("한 번에 여러 레벨을 올릴 수 있다", () => {
  const result = growth.addExperience({ ...state, experience: 0 }, 65);
  assert.equal(result.state.level, 3);
  assert.equal(result.state.experience, 5);
});

test("경험치가 없으면 원래 상태를 유지한다", () => {
  const result = growth.addExperience(state, 0);
  assert.equal(result.state, state);
  assert.equal(result.leveledUp, false);
});
