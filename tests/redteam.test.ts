import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { describe, expect, it } from "vitest";
import { createScopedFileRepository } from "@/lib/repository-core";
import { runRedTeamCritique, selectRedTeamTarget } from "@/lib/redteam";
import { normalizeRepositoryState } from "@/lib/state";

async function createTempRepoRoot() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "isideas-redteam-"));
  await fs.mkdir(path.join(root, "runtime", "seed"), { recursive: true });
  await fs.mkdir(path.join(root, "ideas"), { recursive: true });
  await fs.mkdir(path.join(root, "catalog"), { recursive: true });
  await fs.mkdir(path.join(root, "shared"), { recursive: true });

  await fs.writeFile(
    path.join(root, "runtime", "seed", "state.json"),
    await fs.readFile(path.join(process.cwd(), "runtime", "seed", "state.json"), "utf8"),
    "utf8",
  );
  await fs.writeFile(
    path.join(root, "catalog", "ACTIVE_FOCUS.md"),
    await fs.readFile(path.join(process.cwd(), "catalog", "ACTIVE_FOCUS.md"), "utf8"),
    "utf8",
  );
  await fs.writeFile(
    path.join(root, "shared", "KR_STATUS.md"),
    await fs.readFile(path.join(process.cwd(), "shared", "KR_STATUS.md"), "utf8"),
    "utf8",
  );

  await fs.cp(path.join(process.cwd(), "ideas", "memorization-os"), path.join(root, "ideas", "memorization-os"), {
    recursive: true,
  });
  await fs.cp(
    path.join(process.cwd(), "ideas", "curriculum-architect"),
    path.join(root, "ideas", "curriculum-architect"),
    { recursive: true },
  );
  await fs.cp(
    path.join(process.cwd(), "ideas", "question-confusion-ledger"),
    path.join(root, "ideas", "question-confusion-ledger"),
    { recursive: true },
  );

  return root;
}

function makeRedTeamPaths(root: string) {
  return {
    ideasDir: path.join(root, "ideas"),
    activeFocusPath: path.join(root, "catalog", "ACTIVE_FOCUS.md"),
    krStatusPath: path.join(root, "shared", "KR_STATUS.md"),
    critiqueRunsDir: path.join(root, "runtime", "local", "critique-runs"),
  };
}

describe("red-team selection", () => {
  it("selects the oldest eligible frontier idea", async () => {
    const seed = normalizeRepositoryState(
      JSON.parse(await fs.readFile(path.join(process.cwd(), "runtime", "seed", "state.json"), "utf8")),
    );

    const state = {
      ...seed,
      critiqueArtifacts: [
        ...seed.critiqueArtifacts,
        {
          id: "CA-new-curriculum",
          title: "Recent curriculum critique",
          reviewer: "Claude Code CLI",
          reviewedAt: "2026-03-31T08:00:00.000Z",
          independence: "external" as const,
          sourceType: "design_review" as const,
          location: "runtime/local/critique-runs/mock",
          storagePath: "runtime/local/critique-runs/mock",
          targetIdeaIds: ["I-002"],
          targetBottleneckIds: ["B-002"],
          verdict: "mixed" as const,
          findingCounts: { critical: 0, high: 1, medium: 2, low: 0 },
          generator: "claude-cli",
          model: "opus",
          runId: "run-test",
          summary: "test",
          findingsSummary: "test",
        },
      ],
      ideas: seed.ideas.map((idea) =>
        idea.id === "I-002" ? { ...idea, critiqueArtifactIds: ["CA-new-curriculum", ...idea.critiqueArtifactIds] } : idea,
      ),
    };

    const selection = selectRedTeamTarget(state, {
      mode: "scheduled",
      now: "2026-04-02T08:00:00.000Z",
    });

    expect(selection.outcome).toBe("target");
    expect(selection.idea?.slug).toBe("fixed-text-preservation-system");
  });
});

describe("red-team execution", () => {
  it("fails cleanly for an invalid manual target", async () => {
    const root = await createTempRepoRoot();
    const repository = createScopedFileRepository(root);

    const result = await runRedTeamCritique(
      {
        mode: "manual",
        targetSlug: "not-a-real-idea",
      },
      {
        repository,
        now: "2026-04-02T10:00:00.000Z",
        paths: makeRedTeamPaths(root),
      },
    );

    expect(result.outcome).toBe("failure");
    expect(result.reason).toContain("eligible frontier idea");
    expect(result.state.loops.find((loop) => loop.id === "L-004")?.status).toBe("blocked");
  });

  it("writes a success packet and does not change governed idea envelopes", async () => {
    const root = await createTempRepoRoot();
    const repository = createScopedFileRepository(root);
    const before = await repository.readState();

    const result = await runRedTeamCritique(
      {
        mode: "manual",
        targetSlug: "fixed-text-preservation-system",
      },
      {
        repository,
        now: "2026-04-02T10:00:00.000Z",
        paths: makeRedTeamPaths(root),
        executor: async () => ({
          structured: {
            verdict: "mixed",
            summary: "Test critique summary.",
            findingCounts: { critical: 0, high: 1, medium: 1, low: 0 },
            findings: [
              {
                severity: "high",
                title: "Boundary risk",
                evidenceRefs: ["DOSSIER.md"],
                whyItMatters: "test",
                recommendedFollowUp: "tighten the boundary",
              },
            ],
            suggestedNextJudgment: "Keep the idea in frontier but sharpen the preservation boundary.",
            safeNoChangeReason: "A critique artifact should inform judgment, not mutate it automatically.",
          },
          raw: {
            type: "result",
            structured_output: {
              verdict: "mixed",
              summary: "Test critique summary.",
              findingCounts: { critical: 0, high: 1, medium: 1, low: 0 },
              findings: [
                {
                  severity: "high",
                  title: "Boundary risk",
                  evidenceRefs: ["DOSSIER.md"],
                  whyItMatters: "test",
                  recommendedFollowUp: "tighten the boundary",
                },
              ],
              suggestedNextJudgment: "Keep the idea in frontier but sharpen the preservation boundary.",
              safeNoChangeReason: "A critique artifact should inform judgment, not mutate it automatically.",
            },
          },
          stdout: "{}",
          stderr: "",
          durationMs: 25,
        }),
      },
    );

    expect(result.outcome).toBe("success");
    expect(result.artifact?.targetIdeaIds).toEqual(["I-001"]);
    expect(result.state.critiqueArtifacts[0]?.id).toBe(result.artifact?.id);
    expect(result.state.loops.find((loop) => loop.id === "L-004")?.status).toBe("healthy");

    const afterIdeaEnvelopes = result.state.ideas.map((idea) => ({
      id: idea.id,
      stage: idea.stage,
      priority: idea.priority,
      attentionTier: idea.attentionTier,
    }));
    const beforeIdeaEnvelopes = before.ideas.map((idea) => ({
      id: idea.id,
      stage: idea.stage,
      priority: idea.priority,
      attentionTier: idea.attentionTier,
    }));

    expect(afterIdeaEnvelopes).toEqual(beforeIdeaEnvelopes);
    await expect(fs.access(path.join(result.packetPath, "prompt.md"))).resolves.toBeUndefined();
    await expect(fs.access(path.join(result.packetPath, "artifact.md"))).resolves.toBeUndefined();
    await expect(fs.access(path.join(result.packetPath, "response.json"))).resolves.toBeUndefined();
  });

  it("honestly skips scheduled runs inside the critique gap", async () => {
    const root = await createTempRepoRoot();
    const repository = createScopedFileRepository(root);

    const result = await runRedTeamCritique(
      {
        mode: "scheduled",
      },
      {
        repository,
        now: "2026-03-30T22:00:00.000Z",
        paths: makeRedTeamPaths(root),
      },
    );

    expect(result.outcome).toBe("honest_skip");
    expect(result.reason).toContain("inside the 20h gap");
    expect(result.state.loops.find((loop) => loop.id === "L-004")?.status).toBe("healthy");
  });
});
