import { config } from "dotenv";
import path from "node:path";
import { promises as fs } from "node:fs";

config({
  path: ".env.local",
  quiet: true,
});

async function main() {
  const rootDir = process.cwd();
  const seedStatePath = path.join(rootDir, "runtime", "seed", "state.json");
  const localDir = path.join(rootDir, "runtime", "local");
  const localStatePath = path.join(localDir, "state.json");
  const localReportPath = path.join(localDir, "MORNING_REPORT.md");
  const seed = await fs.readFile(seedStatePath, "utf8");

  await fs.mkdir(localDir, { recursive: true });
  await fs.writeFile(localStatePath, seed, "utf8");
  await fs.writeFile(
    localReportPath,
    "# IsIdeas Morning Report\n\nRuntime reset completed. Run `npm run runtime:tick` to generate a fresh report.\n",
    "utf8",
  );

  console.log("Runtime state reset from seed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
