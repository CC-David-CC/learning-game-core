import assert from "node:assert/strict";
import test from "node:test";
import {FractionFarmSession} from "../../fraction-farm/model.mjs";
import {MarketMathSession} from "../../market-math/model.mjs";
import {MathPathSession} from "../../math-path/model.mjs";
import {PocketConquestSession} from "../../pocket-conquest/model.mjs";
import {RuleDetectiveSession} from "../../rule-detective/model.mjs";
import {TileIslandsSession} from "../../tile-islands/model.mjs";
import {WordWeaverSession} from "../../word-weaver/model.mjs";
import {validateLearningReport} from "../experience.mjs";

test("every core session exposes a valid learning report", () => {
  const sessions = [
    new MathPathSession("report-math", 3),
    new FractionFarmSession("report-fraction", 4),
    new MarketMathSession("report-market"),
    new PocketConquestSession("report-conquest", 3, 2),
    new RuleDetectiveSession("report-rule", 2),
    new TileIslandsSession("report-tiles", 3, 2),
    new WordWeaverSession("report-word"),
  ];
  for (const session of sessions) {
    const report = session.report;
    assert.equal(validateLearningReport(report), true);
    const before = session.state;
    report.details.skills = "mutated";
    assert.notEqual(session.state.details?.skills, "mutated");
    assert.deepEqual(session.state, before);
  }
});
