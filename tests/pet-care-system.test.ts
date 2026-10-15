import assert from "node:assert/strict";
import test from "node:test";
import { PetCareSystem } from "../src/renderer/state/pet-care-system";
import type { PetState } from "../src/shared/pet-state";

const state: PetState = { behavior: "idle", direction: "right", mood: "calm", x: 0, y: 0, hunger: 40, energy: 50, affection: 10 };
const care = new PetCareSystem();

test("먹이주기는 배고픔을 줄이고 친밀도를 올린다", () => {
  const result = care.feed(state);
  assert.equal(result.state.hunger, 15);
  assert.equal(result.state.affection, 12);
  assert.equal(result.reaction, "yum!");
});

test("놀아주기는 에너지를 소비하고 친밀도와 배고픔을 올린다", () => {
  const result = care.play(state);
  assert.equal(result.state.energy, 40);
  assert.equal(result.state.hunger, 44);
  assert.equal(result.state.affection, 16);
  assert.equal(result.reaction, "fun!");
});

test("에너지가 부족하면 놀지 않는다", () => {
  const tired = { ...state, energy: 9 };
  const result = care.play(tired);
  assert.deepEqual(result.state, tired);
  assert.equal(result.reaction, "tired...");
});

test("쓰다듬기는 친밀도를 100 이하로 유지한다", () => {
  const result = care.pet({ ...state, affection: 100 });
  assert.equal(result.state.affection, 100);
  assert.equal(result.reaction, "pet!");
});
