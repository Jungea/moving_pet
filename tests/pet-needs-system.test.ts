import assert from "node:assert/strict";
import test from "node:test";
import { PetNeedsSystem } from "../src/renderer/state/pet-needs-system";
import type { PetState } from "../src/shared/pet-state";

const base: PetState = { behavior: "idle", direction: "right", mood: "calm", x: 10, y: 20, hunger: 20, energy: 80, affection: 10 };
const system = new PetNeedsSystem({ hungerPerMinute: 10, awakeEnergyLossPerMinute: 20, sleepEnergyRecoveryPerMinute: 30 });

test("깨어 있는 동안 배고픔은 증가하고 에너지는 감소한다", () => {
  const result = system.update(base, 60_000);
  assert.equal(result.hunger, 30);
  assert.equal(result.energy, 60);
});

test("자는 동안 에너지가 회복되고 상태 값은 0에서 100 사이로 제한된다", () => {
  const result = system.update({ ...base, behavior: "sleep", hunger: 95, energy: 90 }, 60_000);
  assert.equal(result.hunger, 100);
  assert.equal(result.energy, 100);
});
