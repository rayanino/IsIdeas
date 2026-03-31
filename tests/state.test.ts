import { describe, expect, it } from "vitest";
import { normalizeRepositoryState, syncLoopAccountability } from "@/lib/state";

describe("state normalization", () => {
  it("upgrades legacy candidate stage and injects the external critique gate", () => {
    const normalized = normalizeRepositoryState({
      generatedAt: "2026-03-30T18:00:00.000Z",
      profile: {
        thesis: "test",
        horizon: "test",
        runtimeMode: "bootstrap_file_store",
        canonicalEndState: "test",
        operatorRole: "test",
      },
      evidenceLinks: [],
      decisions: [],
      bottlenecks: [
        {
          id: "B-001",
          title: "Bottleneck",
          leverageScore: 8,
          coverage: "partial",
          whyItMatters: "test",
          nextMove: "test",
        },
      ],
      ideas: [
        {
          id: "I-001",
          slug: "fixed-text-preservation-system",
          name: "Fixed-Text Preservation System",
          stage: "candidate",
          priority: "frontier",
          contestable: true,
          thesis: "test",
          bottleneckIds: ["B-001"],
          nextMove: "test",
          mainRisk: "test",
          krRelationship: "test",
          lastJudgedAt: "2026-03-30T18:00:00.000Z",
        },
      ],
      submissions: [],
      tools: [],
      researchArtifacts: [],
      integrityFlags: [],
      loops: [],
      runs: [],
    });

    expect(normalized.ideas[0]?.stage).toBe("dossier");
    expect(normalized.ideas[0]?.critiqueArtifactIds).toContain("CA-2026-03-30-adversarial-review");
    expect(normalized.critiqueArtifacts[0]?.independence).toBe("external");
  });

  it("resolves the storage-transition flag explicitly in postgres mode", () => {
    const normalized = normalizeRepositoryState({
      generatedAt: "2026-03-30T18:00:00.000Z",
      profile: {
        thesis: "test",
        horizon: "test",
        runtimeMode: "bootstrap_file_store",
        canonicalEndState: "test",
        operatorRole: "test",
      },
      evidenceLinks: [],
      decisions: [],
      bottlenecks: [],
      ideas: [],
      submissions: [],
      tools: [],
      researchArtifacts: [],
      integrityFlags: [
        {
          id: "F-001",
          severity: "medium",
          title: "Storage backend transition must be explicitly recorded",
          detail: "test",
          status: "open",
          raisedAt: "2026-03-30T18:00:00.000Z",
        },
      ],
      loops: [],
      runs: [],
    }, { runtimeMode: "postgres_runtime", transitionedAt: "2026-03-30T20:30:00.000Z" });

    const storageFlag = normalized.integrityFlags.find((flag) => flag.id === "F-001");
    const transitionDecision = normalized.decisions.find((decision) => decision.id === "D-0002");

    expect(storageFlag?.status).toBe("resolved");
    expect(storageFlag?.resolutionNote).toContain("recorded explicitly");
    expect(transitionDecision?.kind).toBe("storage_transition");
  });
});

describe("loop accountability", () => {
  it("raises a loop integrity flag when a loop misses its stale window", () => {
    const normalized = normalizeRepositoryState({
      generatedAt: "2026-03-30T18:00:00.000Z",
      profile: {
        thesis: "test",
        horizon: "test",
        runtimeMode: "bootstrap_file_store",
        canonicalEndState: "test",
        operatorRole: "test",
      },
      evidenceLinks: [],
      decisions: [],
      bottlenecks: [],
      ideas: [],
      submissions: [],
      tools: [],
      researchArtifacts: [],
      integrityFlags: [],
      loops: [
        {
          id: "L-002",
          name: "Bottleneck map refresh",
          cadence: "twice daily",
          status: "healthy",
          purpose: "test",
          lastRunAt: "2026-03-28T10:00:00.000Z",
          nextRunAt: "2026-03-28T22:00:00.000Z",
        },
      ],
      runs: [],
    });

    const checked = syncLoopAccountability(normalized, [], "2026-03-30T20:00:00.000Z");
    const flag = checked.integrityFlags.find((item) => item.id === "F-LOOP-L-002");

    expect(flag?.status).toBe("open");
    expect(flag?.title).toContain("missed cadence");
  });
});
