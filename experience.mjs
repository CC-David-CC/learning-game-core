import {exactKeys, integer, plainObject, string} from "./core.mjs";

export const LEARNING_REPORT_FORMAT = "codi.learning.report";
export const LEARNING_REPORT_VERSION = 1;

export function makeLearningReport(fields) {
  const required = ["appId", "audience", "phase", "stars", "score", "firstTry", "attempts", "hintsUsed",
    "remaining", "objectives", "details"];
  if (!exactKeys(fields, required)) throw Error("Invalid learning report fields.");
  const report = {
    format: LEARNING_REPORT_FORMAT,
    version: LEARNING_REPORT_VERSION,
    ...fields,
  };
  validateLearningReport(report);
  return report;
}

export function validateLearningReport(report) {
  if (!exactKeys(report, ["format", "version", "appId", "audience", "phase", "stars", "score", "firstTry",
    "attempts", "hintsUsed", "remaining", "objectives", "details"])) return false;
  if (report.format !== LEARNING_REPORT_FORMAT || report.version !== LEARNING_REPORT_VERSION ||
      !/^[a-z][a-z0-9-]{0,31}$/.test(report.appId) || !string(report.audience, 32) ||
      !string(report.phase, 32) || !integer(report.stars, 0, 3) || !integer(report.score, 0, 1000000) ||
      !integer(report.firstTry, 0, 1000000) || !integer(report.attempts, 0, 1000000) ||
      !integer(report.hintsUsed, 0, 1000000) || !integer(report.remaining, 0, 1000000) ||
      !Array.isArray(report.objectives) || report.objectives.length < 1 ||
      !report.objectives.every(objective => string(objective, 160)) ||
      !plainObject(report.details)) return false;
  return true;
}
