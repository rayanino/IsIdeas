import { config } from "dotenv";
import { runRedTeamCritique, type RedTeamMode } from "@/lib/redteam";

config({
  path: ".env.local",
  quiet: true,
});

function parseArgs() {
  const args = process.argv.slice(2);
  let mode: RedTeamMode = "manual";
  let targetSlug: string | undefined;
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current) {
      continue;
    }

    if (current.startsWith("--mode=")) {
      mode = current.replace("--mode=", "") as RedTeamMode;
      continue;
    }

    if (current === "--mode") {
      const next = args[index + 1];
      if (next === "manual" || next === "scheduled") {
        mode = next;
        index += 1;
      }
      continue;
    }

    if (current.startsWith("--target=")) {
      targetSlug = current.replace("--target=", "");
      continue;
    }

    if (current === "--target") {
      targetSlug = args[index + 1] ?? targetSlug;
      index += 1;
    }

    if (current === "--json") {
      json = true;
    }
  }

  return {
    mode,
    targetSlug,
    json,
  };
}

async function main() {
  const args = parseArgs();
  const result = await runRedTeamCritique({
    mode: args.mode,
    targetSlug: args.targetSlug,
  });

  if (args.json) {
    process.stdout.write(
      `${JSON.stringify(
        {
          outcome: result.outcome,
          packetPath: result.packetPath,
          run: result.runRecord,
          artifact: result.artifact
            ? {
                title: result.artifact.title,
                verdict: result.artifact.verdict,
                findingsSummary: result.artifact.findingsSummary,
              }
            : undefined,
          reason: result.reason,
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  console.log(`Red-team run outcome: ${result.outcome}`);
  console.log(`Packet: ${result.packetPath}`);
  console.log(`Focus: ${result.runRecord.focus}`);
  for (const line of result.runRecord.summary) {
    console.log(`- ${line}`);
  }
  if (result.reason) {
    console.log(`Reason: ${result.reason}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
