import assert from 'node:assert/strict';
import test from 'node:test';
import { MathPathSession } from '../../math-path/model.mjs';
import { FractionFarmSession } from '../../fraction-farm/model.mjs';
import { WordWeaverSession } from '../../word-weaver/model.mjs';
import { MarketMathSession } from '../../market-math/model.mjs';
import { RuleDetectiveSession } from '../../rule-detective/model.mjs';
import { readFileSync } from 'node:fs';

const legacy = JSON.parse(readFileSync(new URL('./fixtures/core-1-initial.json', import.meta.url)));
const sessions = [
  ['math-path', MathPathSession], ['fraction-farm', FractionFarmSession],
  ['word-weaver', WordWeaverSession], ['market-math', MarketMathSession],
  ['rule-detective', RuleDetectiveSession],
];

test('changed cores round-trip version 2 and explicitly reject real version 1 saves', () => {
  for (const [id, Session] of sessions) {
    const session = new Session('version-test');
    const snapshot = session.encodeSave();
    assert.equal(JSON.parse(snapshot).contentVersion, `${id}-core-2`);
    assert.deepEqual(Session.fromSave(snapshot).state, session.state);
    assert.equal(JSON.parse(legacy[id]).contentVersion, `${id}-core-1`);
    assert.throws(() => Session.fromSave(legacy[id]), /another game or content version/);
  }
});
