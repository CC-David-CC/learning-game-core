import assert from "node:assert/strict";
import test from "node:test";
import {makeLearningReport, validateLearningReport} from "../experience.mjs";

test("the learning report contract accepts and round-trips a valid report", () => {
  const report = makeLearningReport({
    appId: "math-path",
    audience: "grade-3",
    phase: "present",
    stars: 0,
    score: 0,
    firstTry: 2,
    attempts: 3,
    hintsUsed: 0,
    remaining: 16,
    objectives: ["Practice addition and subtraction facts."],
    details: {skills: {add: {answered: 3, correct: 2, difficulty: 1}}},
  });
  assert.equal(validateLearningReport(report), true);
  assert.equal(JSON.parse(JSON.stringify(report)).details.skills.add.correct, 2);
});

test("malformed reports are rejected", () => {
  const report = makeLearningReport({
    appId: "fraction-farm",
    audience: "grade-4-5",
    phase: "task",
    stars: 1,
    score: 10,
    firstTry: 1,
    attempts: 2,
    hintsUsed: 0,
    remaining: 11,
    objectives: ["Compare fractions."],
    details: {plotsSolved: 1},
  });
  for (const mutate of [
    value => { value.stars = 4; },
    value => { value.objectives = []; },
    value => { value.attempts = -1; },
    value => { value.details = []; },
  ]) {
    const broken = structuredClone(report);
    mutate(broken);
    assert.equal(validateLearningReport(broken), false);
  }
});
