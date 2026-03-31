import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { describe, expect, it } from "vitest";
import { createScopedFileRepository } from "@/lib/repository-core";
import { runRuntimeTick } from "@/lib/tick";

async function createTempRuntimeRoot() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "isideas-"));
  await fs.mkdir(path.join(root, "runtime", "seed"), { recursive: true });
  const seed = await fs.readFile(path.join(process.cwd(), "runtime", "seed", "state.json"), "utf8");
  await fs.writeFile(path.join(root, "runtime", "seed", "state.json"), seed, "utf8");
  return root;
}

describe("file repository", () => {
  it("marks a duplicate submission against an existing idea", async () => {
    const root = await createTempRuntimeRoot();
    const repository = createScopedFileRepository(root);

    const submission = await repository.addSubmission({
      title: "Fixed-Text Preservation System",
      context: "Same idea as the current frontier lane.",
      whyNow: "Checking dedupe.",
      desiredOutcome: "Do not create duplicate queue noise.",
    });

    expect(submission.status).toBe("duplicate");
    expect(submission.duplicateIdeaId).toBe("I-001");
    expect(submission.reviewNote).toContain("tracked idea workspace");
  });

  it("triages queued submissions during a runtime tick without promoting them", async () => {
    const root = await createTempRuntimeRoot();
    const repository = createScopedFileRepository(root);

    await repository.addSubmission({
      title: "Adaptive review map",
      context: "Potential meta-layer for review planning across memorization and study.",
      whyNow: "The portfolio needs broad coverage of compounding review systems.",
      desiredOutcome: "Challenge whether it deserves a candidate slot.",
    });

    const { state } = await runRuntimeTick(repository, "manual");
    const created = state.submissions.find((submission) => submission.slug === "adaptive-review-map");

    expect(created?.status).toBe("triaged");
    expect(state.ideas.some((idea) => idea.slug === "adaptive-review-map")).toBe(false);
  });
});
