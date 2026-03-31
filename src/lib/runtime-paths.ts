import path from "node:path";

const APP_ROOT = /* turbopackIgnore: true */ process.cwd();

export function getAppRootDir() {
  return APP_ROOT;
}

export function getRuntimeSeedStatePath() {
  return path.join(APP_ROOT, "runtime", "seed", "state.json");
}

export function getRuntimeLocalStatePath() {
  return path.join(APP_ROOT, "runtime", "local", "state.json");
}

export function getRuntimeLocalReportPath() {
  return path.join(APP_ROOT, "runtime", "local", "MORNING_REPORT.md");
}

export function getIdeasDir() {
  return path.join(APP_ROOT, "ideas");
}

export function getActiveFocusPath() {
  return path.join(APP_ROOT, "catalog", "ACTIVE_FOCUS.md");
}

export function getKrStatusPath() {
  return path.join(APP_ROOT, "shared", "KR_STATUS.md");
}

export function getCritiqueRunsDir() {
  return path.join(APP_ROOT, "runtime", "local", "critique-runs");
}
