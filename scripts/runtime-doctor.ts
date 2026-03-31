import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { Client } from "pg";
import { resolveDatabaseUrl } from "@/lib/database-url";

config({
  path: ".env.local",
  quiet: true,
});

function presentEnv(name: string): string {
  return process.env[name] ? "present" : "missing";
}

function presentCli(command: string): string {
  try {
    execSync(`${command} --version`, {
      stdio: "ignore",
    });
    return "present";
  } catch {
    return "missing";
  }
}

async function main() {
  const rootDir = process.cwd();
  let databaseCheck = "not configured";
  const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL);

  if (databaseUrl) {
    const client = new Client({
      connectionString: databaseUrl,
    });
    try {
      await client.connect();
      const result = await client.query("select current_database()");
      databaseCheck = `connected (${result.rows[0]?.current_database ?? "unknown"})`;
    } catch {
      databaseCheck = "configured but unreachable";
    } finally {
      await client.end().catch(() => undefined);
    }
  }

  const checks = [
    ["Node", process.version],
    ["Storage mode", process.env.ISIDEAS_STORAGE_MODE ?? "file"],
    ["Seed state", fs.existsSync(path.join(rootDir, "runtime", "seed", "state.json")) ? "present" : "missing"],
    ["WSL host", process.platform === "linux" ? "yes" : "no"],
    ["Codex CLI", presentCli("codex")],
    ["Claude CLI", presentCli("claude")],
    ["Gemini CLI", presentCli("gemini")],
    ["OPENAI_API_KEY", presentEnv("OPENAI_API_KEY")],
    ["OPENROUTER_API_KEY", presentEnv("OPENROUTER_API_KEY")],
    ["ANTHROPIC_API_KEY", presentEnv("ANTHROPIC_API_KEY")],
    ["Database", databaseCheck],
  ];

  for (const [label, value] of checks) {
    console.log(`${label}: ${value}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
