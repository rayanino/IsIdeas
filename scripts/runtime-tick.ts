import { config } from "dotenv";
import { runRuntimeTick } from "@/lib/tick";

config({
  path: ".env.local",
  quiet: true,
});

async function main() {
  const { runRecord } = await runRuntimeTick(undefined, "manual");
  console.log(`Runtime tick complete: ${runRecord.focus}`);
  for (const line of runRecord.summary) {
    console.log(`- ${line}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
