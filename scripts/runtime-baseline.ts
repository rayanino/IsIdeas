import { config } from "dotenv";
import path from "node:path";
import { promises as fs } from "node:fs";
import { createRuntimeRepository } from "@/lib/repository";

config({
  path: ".env.local",
  quiet: true,
});

function makeStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function main() {
  const repository = createRuntimeRepository();
  const [state, report] = await Promise.all([repository.readState(), repository.readMorningReport()]);

  const stamp = makeStamp();
  const baselineDir = path.join(process.cwd(), "runtime", "local", "baselines", stamp);
  await fs.mkdir(baselineDir, { recursive: true });

  await fs.writeFile(path.join(baselineDir, "state.json"), `${JSON.stringify(state, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(baselineDir, "MORNING_REPORT.md"), report, "utf8");
  await fs.writeFile(
    path.join(baselineDir, "SUMMARY.md"),
    [
      "# Baseline Snapshot",
      "",
      `Created: ${new Date().toISOString()}`,
      `Runtime mode: ${state.profile.runtimeMode}`,
      `Frontier ideas: ${state.ideas.filter((idea) => idea.priority === "frontier").length}`,
      `Open integrity flags: ${state.integrityFlags.filter((flag) => flag.status !== "resolved").length}`,
      `Deep attention workspaces: ${state.ideas.filter((idea) => idea.attentionTier === "deep").length}`,
      "",
    ].join("\n"),
    "utf8",
  );

  console.log(`Baseline snapshot written to ${baselineDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
