const UINT32 = 0xffffffff;

export class SeededRng {
  #state;

  constructor(seed) {
    this.#state = seedState(seed);
  }

  static fromState(state) {
    if (!Number.isSafeInteger(state) || state < 0 || state > UINT32) {
      throw Error("Invalid RNG state.");
    }
    const rng = new SeededRng(0);
    rng.#state = state;
    return rng;
  }

  get state() {
    return this.#state;
  }

  nextUint() {
    this.#state = (this.#state + 0x6d2b79f5) >>> 0;
    let value = this.#state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return (value ^ (value >>> 14)) >>> 0;
  }

  int(min, max) {
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || max < min) {
      throw Error("Invalid RNG integer range.");
    }
    return min + (this.nextUint() % (max - min + 1));
  }

  pick(items) {
    if (!Array.isArray(items) || !items.length) throw Error("Cannot pick from an empty list.");
    return items[this.int(0, items.length - 1)];
  }

  shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const other = this.int(0, index);
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }
}

function seedState(seed) {
  if (Number.isSafeInteger(seed) && seed >= 0 && seed <= UINT32) return seed;
  const text = String(seed);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export const SAVE_FORMAT = "codi.core.save";
export const SAVE_VERSION = 1;

export function encodeSave(appId, payload, contentVersion = "1") {
  if (!/^[a-z][a-z0-9-]{0,31}$/.test(appId)) throw Error("Invalid app id.");
  return JSON.stringify({
    format: SAVE_FORMAT,
    schemaVersion: SAVE_VERSION,
    appId,
    kind: "core-snapshot",
    contentVersion,
    payload,
  });
}

export function decodeSave(text, appId, contentVersion, validate) {
  if (typeof text !== "string") throw Error("Save must be text.");
  if (new TextEncoder().encode(text).byteLength > 256 * 1024) throw Error("Save is too large.");
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw Error("Save is not valid JSON.");
  }
  if (!plainObject(value)) throw Error("Save envelope must be an object.");
  if (value.format !== SAVE_FORMAT || value.schemaVersion !== SAVE_VERSION) throw Error("Unsupported save format.");
  if (value.appId !== appId || value.kind !== "core-snapshot" || value.contentVersion !== contentVersion) {
    throw Error("Save belongs to another game or content version.");
  }
  validate(value.payload);
  return value.payload;
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function plainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

export function exactKeys(value, keys) {
  if (!plainObject(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

export function integer(value, min, max) {
  return Number.isSafeInteger(value) && value >= min && value <= max;
}

export function string(value, max = 128) {
  return typeof value === "string" && value.length > 0 && value.length <= max;
}

export function oneOf(value, choices) {
  return choices.includes(value);
}

export function uniqueNumbers(values, min, max) {
  return Array.isArray(values) && values.length === new Set(values).size &&
    values.every(value => integer(value, min, max));
}
