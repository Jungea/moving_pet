import assert from "node:assert/strict";
import test from "node:test";
import { BasicBehaviorSystem } from "../src/renderer/behavior/basic-behavior-system";
import type { PetState } from "../src/shared/pet-state";
const config = { idleDurationMs: 1000, walkDurationMs: 2000, sleepDurationMs: 1500, speedPixelsPerSecond: 100 };
const calm = { mood: "calm" as const, y: 20 };
test("idle 상태가 끝나면 걷기 시작한다", () => { const system = new BasicBehaviorSystem(config); const initial: PetState = { behavior: "idle", direction: "right", x: 10, ...calm }; const result = system.update(initial, 1000, 500); assert.equal(result.behavior, "walk"); assert.equal(result.x, 110); });
test("화면 경계에서 위치를 제한하고 방향을 반전한다", () => { const system = new BasicBehaviorSystem(config); const initial: PetState = { behavior: "walk", direction: "right", x: 490, ...calm }; const result = system.update(initial, 500, 500); assert.equal(result.x, 500); assert.equal(result.direction, "left"); });
test("walk와 sleep은 순서대로 전환되고 sleep 중에는 움직이지 않는다", () => { const system = new BasicBehaviorSystem(config); const walking: PetState = { behavior: "walk", direction: "right", x: 10, ...calm }; const sleeping = system.update(walking, 2000, 500); assert.equal(sleeping.behavior, "sleep"); const afterSleep = system.update(sleeping, 500, 500); assert.equal(afterSleep.x, sleeping.x); const idle = system.update(afterSleep, 1000, 500); assert.equal(idle.behavior, "idle"); });
