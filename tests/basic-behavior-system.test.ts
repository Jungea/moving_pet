import assert from "node:assert/strict";
import test from "node:test";
import { BasicBehaviorSystem } from "../src/renderer/behavior/basic-behavior-system";
import type { PetState } from "../src/shared/pet-state";
const config = { idleDurationMs: 1000, walkDurationMs: 2000, speedPixelsPerSecond: 100, sleepEnergyThreshold: 20, wakeEnergyThreshold: 75 };
const calm = { mood: "calm" as const, y: 20, hunger: 20, energy: 80, affection: 10 };
test("idle 상태가 끝나면 걷기 시작한다", () => { const system = new BasicBehaviorSystem(config); const initial: PetState = { behavior: "idle", direction: "right", x: 10, ...calm }; const result = system.update(initial, 1000, 500); assert.equal(result.behavior, "walk"); assert.equal(result.x, 110); });
test("화면 경계에서 위치를 제한하고 방향을 반전한다", () => { const system = new BasicBehaviorSystem(config); const initial: PetState = { behavior: "walk", direction: "right", x: 490, ...calm }; const result = system.update(initial, 500, 500); assert.equal(result.x, 500); assert.equal(result.direction, "left"); });
test("에너지가 낮으면 잠들고 충분히 회복하면 깨어난다", () => { const system = new BasicBehaviorSystem(config); const tired: PetState = { behavior: "walk", direction: "right", x: 10, ...calm, energy: 20 }; const sleeping = system.update(tired, 500, 500); assert.equal(sleeping.behavior, "sleep"); assert.equal(sleeping.x, 10); const resting = system.update({ ...sleeping, energy: 74 }, 500, 500); assert.equal(resting.behavior, "sleep"); const awake = system.update({ ...resting, energy: 75 }, 500, 500); assert.equal(awake.behavior, "idle"); });
