import { config } from "dotenv";
import { createRuntimeRepository } from "@/lib/repository";

config({
  path: ".env.local",
  quiet: true,
});

async function main() {
  const repository = createRuntimeRepository();
  const report = await repository.readMorningReport();
  process.stdout.write(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
