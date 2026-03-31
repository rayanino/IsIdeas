import {
  repositoryStateSchema,
  type CritiqueArtifact,
  type IntegrityFlag,
  type Loop,
  type RepositoryState,
} from "@/lib/types";
import { nowIso, rankSeverity } from "@/lib/utils";

const CURRENT_SCHEMA_VERSION = 2;
const DEFAULT_EXTERNAL_CRITIQUE_ID = "CA-2026-03-30-adversarial-review";
const POSTGRES_TRANSITION_DECISION_ID = "D-0002";
const FRONTIER_GATE_DECISION_ID = "D-0003";

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord {
  return typeof value === "object" && value !== null ? (value as AnyRecord) : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function defaultCritiqueArtifact(): CritiqueArtifact {
  return {
    id: DEFAULT_EXTERNAL_CRITIQUE_ID,
    title: "Adversarial Architecture & Integrity Review",
    reviewer: "Claude Opus 4.6",
    reviewedAt: "2026-03-30T19:00:00.000Z",
    independence: "external",
    sourceType: "adversarial_review",
    location: "ADVERSARIAL_REVIEW_2026-03-30.md",
    storagePath: "ADVERSARIAL_REVIEW_2026-03-30.md",
    targetIdeaIds: ["I-001", "I-002", "I-003"],
    targetBottleneckIds: ["B-001", "B-002", "B-003"],
    verdict: "mixed",
    findingCounts: {
      critical: 3,
      high: 5,
      medium: 7,
      low: 0,
    },
    generator: "Claude Code CLI",
    model: "claude-opus-4-6",
    runId: undefined,
    summary: "External adversarial review of the Codex-led reset and runtime architecture.",
    findingsSummary: "15 findings ordered by severity, including 3 critical and 5 high.",
  };
}

function defaultKrDependency(slug: string) {
  const map: Record<string, { status: RepositoryState["ideas"][number]["krDependencyStatus"]; note: string }> = {
    "fixed-text-preservation-system": {
      status: "boundary_only",
      note: "Dossier work may continue with conceptual fixed-text boundaries, but build-grade integration depends on kr exposing canonical fixed text and IDs.",
    },
    "curriculum-architect": {
      status: "blocked_for_build",
      note: "Real build work is blocked until kr defines stable topic, source, and dependency primitives. Dossier work remains valid.",
    },
    "question-confusion-ledger": {
      status: "boundary_only",
      note: "Question workflow design can proceed now, but deep integration depends on kr entity IDs and excerpt linkage contracts.",
    },
    "lecture-ingestion-ledger": {
      status: "independent_for_now",
      note: "Early workflow design can proceed without a hard kr contract, though later integration may enrich lecture artifacts with source links.",
    },
  };

  return map[slug] ?? {
    status: "boundary_only",
    note: "This idea assumes kr exists conceptually, but no stable machine contract is defined yet.",
  };
}

function defaultBottleneckMetadata(id: string) {
  const defaults: Record<
    string,
    { uncertaintyNote: string; basis: RepositoryState["bottlenecks"][number]["basis"] }
  > = {
    "B-001": {
      basis: "analytical",
      uncertaintyNote: "Working study hypothesis based on preparation goals and memorization-risk analysis; still needs explicit source-backed grounding.",
    },
    "B-002": {
      basis: "analytical",
      uncertaintyNote: "This sequencing claim is plausible but not yet backed here by explicit scholarly or pedagogical sourcing.",
    },
    "B-003": {
      basis: "analytical",
      uncertaintyNote: "Uncertainty preservation is treated as strategically important, but the repo still needs source-backed study-process grounding.",
    },
    "B-004": {
      basis: "analytical",
      uncertaintyNote: "This bottleneck is inferred from likely future workflows and remains open to revision after real lecture-system research.",
    },
    "B-005": {
      basis: "analytical",
      uncertaintyNote: "This is a meta-level operational hypothesis and should not outrank direct study leverage without stronger evidence.",
    },
  };

  return defaults[id] ?? {
    basis: "analytical",
    uncertaintyNote: "Working analytical bottleneck hypothesis pending stronger evidence.",
  };
}

function defaultLoopMetadata(id: string) {
  const defaults: Record<
    string,
    Pick<Loop, "staleAfterHours" | "escalatesTo" | "failureImpact" | "lastOutcome">
  > = {
    "L-001": {
      staleAfterHours: 2,
      escalatesTo: "medium",
      failureImpact: "Owner submissions can queue silently and intake confidence decays.",
      lastOutcome: "Bootstrap seed only; no verified post-reset intake run recorded yet.",
    },
    "L-002": {
      staleAfterHours: 18,
      escalatesTo: "high",
      failureImpact: "The bottleneck map can go stale and keep selecting the wrong frontier ideas.",
      lastOutcome: "No dedicated bottleneck refresh run has been recorded since the Codex-led reset.",
    },
    "L-003": {
      staleAfterHours: 30,
      escalatesTo: "medium",
      failureImpact: "Tool scouting can become decorative, causing the repo to reinvent known solutions.",
      lastOutcome: "Initial survey completed, but no recurring scouting accountability exists yet.",
    },
    "L-004": {
      staleAfterHours: 30,
      escalatesTo: "high",
      failureImpact: "Frontier ideas can self-confirm if critique stops arriving.",
      lastOutcome: "External adversarial review exists, but no recurring independent critique has been logged yet.",
    },
    "L-005": {
      staleAfterHours: 30,
      escalatesTo: "medium",
      failureImpact: "The repo can appear active while runtime accountability silently drifts.",
      lastOutcome: "Bootstrap morning report generated.",
    },
  };

  return defaults[id] ?? {
    staleAfterHours: 24,
    escalatesTo: "medium",
    failureImpact: "Loop failure impact is not documented yet.",
    lastOutcome: "No outcome recorded.",
  };
}

function normalizeCritiqueArtifacts(rawCritiqueArtifacts: unknown): CritiqueArtifact[] {
  const critiqueArtifacts: CritiqueArtifact[] = asArray<AnyRecord>(rawCritiqueArtifacts).map((artifact) => ({
    id: String(artifact.id ?? `critique-${Math.random().toString(36).slice(2)}`),
    title: String(artifact.title ?? "Untitled critique"),
    reviewer: String(artifact.reviewer ?? "unknown"),
    reviewedAt: String(artifact.reviewedAt ?? nowIso()),
    independence: (artifact.independence ?? "internal") as CritiqueArtifact["independence"],
    sourceType: (artifact.sourceType ?? "design_review") as CritiqueArtifact["sourceType"],
    location: String(artifact.location ?? ""),
    storagePath: artifact.storagePath ? String(artifact.storagePath) : String(artifact.location ?? ""),
    targetIdeaIds: asArray<string>(artifact.targetIdeaIds).map(String),
    targetBottleneckIds: asArray<string>(artifact.targetBottleneckIds).map(String),
    verdict: artifact.verdict ? (String(artifact.verdict) as CritiqueArtifact["verdict"]) : undefined,
    findingCounts: artifact.findingCounts
      ? {
          critical: Number(asRecord(artifact.findingCounts).critical ?? 0),
          high: Number(asRecord(artifact.findingCounts).high ?? 0),
          medium: Number(asRecord(artifact.findingCounts).medium ?? 0),
          low: Number(asRecord(artifact.findingCounts).low ?? 0),
        }
      : undefined,
    generator: artifact.generator ? String(artifact.generator) : undefined,
    model: artifact.model ? String(artifact.model) : undefined,
    runId: artifact.runId ? String(artifact.runId) : undefined,
    summary: String(artifact.summary ?? ""),
    findingsSummary: String(artifact.findingsSummary ?? ""),
  }));

  if (!critiqueArtifacts.some((artifact) => artifact.id === DEFAULT_EXTERNAL_CRITIQUE_ID)) {
    critiqueArtifacts.unshift(defaultCritiqueArtifact());
  }

  return critiqueArtifacts;
}

function normalizeDecisions(rawDecisions: unknown): RepositoryState["decisions"] {
  return asArray<AnyRecord>(rawDecisions).map((decision, index) => ({
    id: String(decision.id ?? `D-${String(index + 1).padStart(4, "0")}`),
    kind:
      (decision.kind as RepositoryState["decisions"][number]["kind"] | undefined) ??
      (decision.id === "D-0001" ? "governance" : "portfolio_state"),
    title: String(decision.title ?? "Untitled decision"),
    decidedAt: String(decision.decidedAt ?? nowIso()),
    owner: String(decision.owner ?? "codex"),
    summary: String(decision.summary ?? ""),
    critiqueSummary: String(decision.critiqueSummary ?? ""),
    sourceBacked: asArray<string>(decision.sourceBacked).map(String),
    analytical: asArray<string>(decision.analytical).map(String),
    affects: asArray<string>(decision.affects).map(String),
    critiqueArtifactIds: asArray<string>(decision.critiqueArtifactIds).map(String),
  }));
}

function normalizeBottlenecks(rawBottlenecks: unknown): RepositoryState["bottlenecks"] {
  return asArray<AnyRecord>(rawBottlenecks).map((bottleneck) => {
    const metadata = defaultBottleneckMetadata(String(bottleneck.id ?? ""));
    return {
      id: String(bottleneck.id ?? `B-${Math.random().toString(36).slice(2)}`),
      title: String(bottleneck.title ?? "Unnamed bottleneck"),
      leverageScore: Number(bottleneck.leverageScore ?? 1),
      coverage: (bottleneck.coverage ?? "weak") as RepositoryState["bottlenecks"][number]["coverage"],
      basis: (bottleneck.basis ?? metadata.basis) as RepositoryState["bottlenecks"][number]["basis"],
      evidenceLinkIds: asArray<string>(bottleneck.evidenceLinkIds).map(String),
      uncertaintyNote: String(bottleneck.uncertaintyNote ?? metadata.uncertaintyNote),
      whyItMatters: String(bottleneck.whyItMatters ?? ""),
      nextMove: String(bottleneck.nextMove ?? ""),
    };
  });
}

function normalizeIdeas(rawIdeas: unknown): RepositoryState["ideas"] {
  return asArray<AnyRecord>(rawIdeas).map((idea) => {
    const slug = String(idea.slug ?? `idea-${Math.random().toString(36).slice(2)}`);
    const krDefaults = defaultKrDependency(slug);
    const priority = (idea.priority ?? "watch") as RepositoryState["ideas"][number]["priority"];
    const rawStage = String(idea.stage ?? "incubating");
    const normalizedStage =
      rawStage === "candidate"
        ? "dossier"
        : rawStage === "spec"
          ? "spec_ready"
          : rawStage === "ready_to_build"
            ? "handoff_ready"
            : rawStage;

    return {
      id: String(idea.id ?? `I-${Math.random().toString(36).slice(2)}`),
      slug,
      name: String(idea.name ?? "Unnamed idea"),
      stage: normalizedStage as RepositoryState["ideas"][number]["stage"],
      priority,
      attentionTier:
        (idea.attentionTier as RepositoryState["ideas"][number]["attentionTier"] | undefined) ??
        (priority === "frontier" ? "deep" : priority === "parked" ? "parked" : "visible"),
      contestable: Boolean(idea.contestable ?? true),
      thesis: String(idea.thesis ?? ""),
      bottleneckIds: asArray<string>(idea.bottleneckIds).map(String),
      critiqueArtifactIds:
        asArray<string>(idea.critiqueArtifactIds).length > 0
          ? asArray<string>(idea.critiqueArtifactIds).map(String)
          : priority === "frontier"
            ? [DEFAULT_EXTERNAL_CRITIQUE_ID]
            : [],
      nextMove: String(idea.nextMove ?? ""),
      mainRisk: String(idea.mainRisk ?? ""),
      krRelationship: String(idea.krRelationship ?? ""),
      krDependencyStatus:
        (idea.krDependencyStatus as RepositoryState["ideas"][number]["krDependencyStatus"] | undefined) ??
        krDefaults.status,
      krDependencyNote: String(idea.krDependencyNote ?? krDefaults.note),
      lastJudgedAt: String(idea.lastJudgedAt ?? nowIso()),
    };
  });
}

function normalizeIntegrityFlags(rawIntegrityFlags: unknown): RepositoryState["integrityFlags"] {
  return asArray<AnyRecord>(rawIntegrityFlags).map((flag) => ({
    id: String(flag.id ?? `F-${Math.random().toString(36).slice(2)}`),
    severity: (flag.severity ?? "medium") as RepositoryState["integrityFlags"][number]["severity"],
    title: String(flag.title ?? "Unnamed integrity flag"),
    detail: String(flag.detail ?? ""),
    status: (flag.status ?? "open") as RepositoryState["integrityFlags"][number]["status"],
    blocking:
      typeof flag.blocking === "boolean"
        ? flag.blocking
        : ["high", "critical"].includes(String(flag.severity ?? "medium")),
    raisedAt: String(flag.raisedAt ?? nowIso()),
    updatedAt: String(flag.updatedAt ?? flag.raisedAt ?? nowIso()),
    resolutionNote: flag.resolutionNote ? String(flag.resolutionNote) : undefined,
    resolvedAt: flag.resolvedAt ? String(flag.resolvedAt) : undefined,
    escalatesAfterHours:
      typeof flag.escalatesAfterHours === "number" ? Math.trunc(flag.escalatesAfterHours) : undefined,
    escalatesTo: flag.escalatesTo
      ? (String(flag.escalatesTo) as RepositoryState["integrityFlags"][number]["severity"])
      : undefined,
  }));
}

function normalizeLoops(rawLoops: unknown): RepositoryState["loops"] {
  return asArray<AnyRecord>(rawLoops).map((loop) => {
    const metadata = defaultLoopMetadata(String(loop.id ?? ""));
    return {
      id: String(loop.id ?? `L-${Math.random().toString(36).slice(2)}`),
      name: String(loop.name ?? "Unnamed loop"),
      cadence: String(loop.cadence ?? "manual"),
      status: (loop.status ?? "watching") as RepositoryState["loops"][number]["status"],
      purpose: String(loop.purpose ?? ""),
      staleAfterHours:
        typeof loop.staleAfterHours === "number" ? Math.trunc(loop.staleAfterHours) : metadata.staleAfterHours,
      escalatesTo:
        (loop.escalatesTo as RepositoryState["loops"][number]["escalatesTo"] | undefined) ??
        metadata.escalatesTo,
      failureImpact: String(loop.failureImpact ?? metadata.failureImpact),
      lastOutcome: String(loop.lastOutcome ?? metadata.lastOutcome),
      lastRunAt: String(loop.lastRunAt ?? nowIso()),
      nextRunAt: String(loop.nextRunAt ?? nowIso()),
    };
  });
}

function normalizeRuns(rawRuns: unknown): RepositoryState["runs"] {
  return asArray<AnyRecord>(rawRuns).map((run, index) => ({
    id: String(run.id ?? `run-${index + 1}`),
    startedAt: String(run.startedAt ?? nowIso()),
    finishedAt: String(run.finishedAt ?? nowIso()),
    trigger: (run.trigger ?? "manual") as RepositoryState["runs"][number]["trigger"],
    focus: String(run.focus ?? "No focus recorded."),
    summary: asArray<string>(run.summary).map(String),
    executedLoopIds: asArray<string>(run.executedLoopIds).map(String),
    outcome: run.outcome ? (String(run.outcome) as RepositoryState["runs"][number]["outcome"]) : undefined,
    notes: asArray<string>(run.notes).map(String),
  }));
}

function ensureDecision(
  decisions: RepositoryState["decisions"],
  nextDecision: RepositoryState["decisions"][number],
): RepositoryState["decisions"] {
  const existing = decisions.find((decision) => decision.id === nextDecision.id);
  if (!existing) {
    return [nextDecision, ...decisions];
  }

  return decisions;
}

export function upsertIntegrityFlag(
  integrityFlags: RepositoryState["integrityFlags"],
  nextFlag: RepositoryState["integrityFlags"][number],
): RepositoryState["integrityFlags"] {
  const existing = integrityFlags.find((flag) => flag.id === nextFlag.id);
  if (!existing) {
    return [nextFlag, ...integrityFlags];
  }

  return integrityFlags.map((flag) => (flag.id === nextFlag.id ? { ...flag, ...nextFlag } : flag));
}

function resolveIntegrityFlag(
  integrityFlags: RepositoryState["integrityFlags"],
  flagId: string,
  resolutionNote: string,
  resolvedAt: string,
): RepositoryState["integrityFlags"] {
  return integrityFlags.map((flag) =>
    flag.id === flagId
      ? {
          ...flag,
          status: "resolved",
          blocking: false,
          updatedAt: resolvedAt,
          resolvedAt,
          resolutionNote,
        }
      : flag,
  );
}

export function applyPostgresActivationTransition(state: RepositoryState, transitionedAt = nowIso()): RepositoryState {
  const nextState = structuredClone(state);

  nextState.profile.runtimeMode = "postgres_runtime";
  nextState.profile.schemaVersion = CURRENT_SCHEMA_VERSION;

  const transitionDecision: RepositoryState["decisions"][number] = {
    id: POSTGRES_TRANSITION_DECISION_ID,
    kind: "storage_transition",
    title: "Postgres runtime activation must leave an explicit trace",
    decidedAt: transitionedAt,
    owner: "codex",
    summary:
      "When the local runtime activates Postgres, the storage transition must be recorded explicitly rather than silently changing state semantics.",
    critiqueSummary:
      "This addresses the adversarial review finding that silent flag deletion and undocumented schema activation create a built-in corruption vector.",
    sourceBacked: [],
    analytical: [
      "The operational runtime may change storage backends locally, but the transition itself must remain visible in decision and integrity history.",
    ],
    affects: ["runtime.storage", "integrity.F-001", "runtime.schema"],
    critiqueArtifactIds: [DEFAULT_EXTERNAL_CRITIQUE_ID],
  };

  nextState.decisions = ensureDecision(nextState.decisions, transitionDecision);

  const storageFlag = nextState.integrityFlags.find((flag) => flag.id === "F-001");
  const resolutionNote =
    "Postgres runtime is active for this local environment. The tracked seed remains the bootstrap snapshot, and the storage transition was recorded explicitly.";

  if (storageFlag) {
    if (storageFlag.status !== "resolved") {
      nextState.integrityFlags = resolveIntegrityFlag(nextState.integrityFlags, "F-001", resolutionNote, transitionedAt);
    }
  } else {
    nextState.integrityFlags = upsertIntegrityFlag(nextState.integrityFlags, {
      id: "F-001",
      severity: "medium",
      title: "Storage backend transition must be explicitly recorded",
      detail:
        "The tracked seed snapshot begins in bootstrap file-store mode. Any Postgres activation must leave a visible transition record rather than silently replacing the flag.",
      status: "resolved",
      blocking: false,
      raisedAt: transitionedAt,
      updatedAt: transitionedAt,
      resolvedAt: transitionedAt,
      resolutionNote,
      escalatesAfterHours: 24,
      escalatesTo: "high",
    });
  }

  return nextState;
}

export function validateRepositoryState(rawState: RepositoryState): RepositoryState {
  const parsed = repositoryStateSchema.parse(rawState);
  const critiqueArtifactsById = new Map(parsed.critiqueArtifacts.map((artifact) => [artifact.id, artifact]));
  const deepAttentionIdeas = parsed.ideas.filter((idea) => idea.attentionTier === "deep");

  if (deepAttentionIdeas.length > 3) {
    throw new Error(`Deep attention limit exceeded: ${deepAttentionIdeas.length} ideas are marked as deep.`);
  }

  for (const idea of parsed.ideas) {
    if (idea.priority === "frontier" && idea.attentionTier !== "deep") {
      throw new Error(`Frontier idea ${idea.slug} must be marked as deep attention.`);
    }

    if (idea.priority === "frontier" && idea.stage !== "dossier" && idea.stage !== "spec_ready" && idea.stage !== "handoff_ready") {
      throw new Error(`Frontier idea ${idea.slug} must be at dossier stage or beyond.`);
    }

    if (idea.priority === "frontier") {
      const hasIndependentCritique = idea.critiqueArtifactIds.some((artifactId) => {
        const artifact = critiqueArtifactsById.get(artifactId);
        return artifact && artifact.independence !== "internal";
      });

      if (!hasIndependentCritique) {
        throw new Error(`Frontier idea ${idea.slug} is missing an independent critique artifact.`);
      }
    }

    if (idea.stage === "handoff_ready" && idea.krDependencyStatus === "blocked_for_build") {
      throw new Error(`Idea ${idea.slug} cannot be handoff-ready while blocked on an undefined kr contract.`);
    }
  }

  return parsed;
}

export function normalizeRepositoryState(
  rawState: unknown,
  options: {
    runtimeMode?: RepositoryState["profile"]["runtimeMode"];
    transitionedAt?: string;
  } = {},
): RepositoryState {
  const state = asRecord(rawState);
  const profile = asRecord(state.profile);

  const nextState: RepositoryState = {
    generatedAt: String(state.generatedAt ?? nowIso()),
    profile: {
      thesis: String(profile.thesis ?? ""),
      horizon: String(profile.horizon ?? ""),
      runtimeMode: (options.runtimeMode ?? profile.runtimeMode ?? "bootstrap_file_store") as RepositoryState["profile"]["runtimeMode"],
      canonicalEndState: String(profile.canonicalEndState ?? ""),
      operatorRole: String(profile.operatorRole ?? ""),
      schemaVersion:
        typeof profile.schemaVersion === "number" ? Math.trunc(profile.schemaVersion) : CURRENT_SCHEMA_VERSION,
    },
    evidenceLinks: asArray<AnyRecord>(state.evidenceLinks).map((link) => ({
      id: String(link.id ?? `evidence-${Math.random().toString(36).slice(2)}`),
      title: String(link.title ?? ""),
      url: String(link.url ?? "https://example.com"),
      sourceClass: (link.sourceClass ?? "note") as RepositoryState["evidenceLinks"][number]["sourceClass"],
      fetchedAt: String(link.fetchedAt ?? nowIso()),
      note: String(link.note ?? ""),
    })),
    critiqueArtifacts: normalizeCritiqueArtifacts(state.critiqueArtifacts),
    decisions: normalizeDecisions(state.decisions),
    bottlenecks: normalizeBottlenecks(state.bottlenecks),
    ideas: normalizeIdeas(state.ideas),
    submissions: asArray<AnyRecord>(state.submissions).map((submission) => ({
      id: String(submission.id ?? `submission-${Math.random().toString(36).slice(2)}`),
      title: String(submission.title ?? ""),
      slug: String(submission.slug ?? ""),
      submittedAt: String(submission.submittedAt ?? nowIso()),
      status: (submission.status ?? "queued") as RepositoryState["submissions"][number]["status"],
      context: String(submission.context ?? ""),
      whyNow: String(submission.whyNow ?? ""),
      desiredOutcome: String(submission.desiredOutcome ?? ""),
      reviewNote: submission.reviewNote ? String(submission.reviewNote) : undefined,
      duplicateIdeaId: submission.duplicateIdeaId ? String(submission.duplicateIdeaId) : undefined,
    })),
    tools: asArray<AnyRecord>(state.tools).map((tool) => ({
      id: String(tool.id ?? `tool-${Math.random().toString(36).slice(2)}`),
      name: String(tool.name ?? ""),
      category: String(tool.category ?? ""),
      status: (tool.status ?? "watching") as RepositoryState["tools"][number]["status"],
      url: String(tool.url ?? "https://example.com"),
      note: String(tool.note ?? ""),
    })),
    researchArtifacts: asArray<AnyRecord>(state.researchArtifacts).map((artifact) => ({
      id: String(artifact.id ?? `research-${Math.random().toString(36).slice(2)}`),
      title: String(artifact.title ?? ""),
      status: (artifact.status ?? "active") as RepositoryState["researchArtifacts"][number]["status"],
      focus: String(artifact.focus ?? ""),
      sourceType: String(artifact.sourceType ?? ""),
      note: String(artifact.note ?? ""),
    })),
    integrityFlags: normalizeIntegrityFlags(state.integrityFlags),
    loops: normalizeLoops(state.loops),
    runs: normalizeRuns(state.runs),
  };

  let normalizedState = nextState;

  if (normalizedState.profile.runtimeMode === "postgres_runtime") {
    normalizedState = applyPostgresActivationTransition(normalizedState, options.transitionedAt ?? nowIso());
  }

  return validateRepositoryState(normalizedState);
}

export function syncLoopAccountability(
  state: RepositoryState,
  executedLoops: Array<{ id: string; nextRunAt: string; outcome: string }>,
  checkedAt = nowIso(),
): RepositoryState {
  const nextState = structuredClone(state);
  const executedById = new Map(executedLoops.map((loop) => [loop.id, loop]));

  nextState.loops = nextState.loops.map((loop) => {
    const executed = executedById.get(loop.id);
    if (executed) {
      return {
        ...loop,
        status: "healthy",
        lastRunAt: checkedAt,
        nextRunAt: executed.nextRunAt,
        lastOutcome: executed.outcome,
      };
    }

    const hoursSinceRun = (new Date(checkedAt).getTime() - new Date(loop.lastRunAt).getTime()) / 3_600_000;
    const overdue = hoursSinceRun > loop.staleAfterHours;

    return {
      ...loop,
      status: overdue ? (rankSeverity(loop.escalatesTo) >= rankSeverity("high") ? "blocked" : "watching") : loop.status,
    };
  });

  for (const loop of nextState.loops) {
    const flagId = `F-LOOP-${loop.id}`;
    const hoursSinceRun = (new Date(checkedAt).getTime() - new Date(loop.lastRunAt).getTime()) / 3_600_000;
    const overdue = hoursSinceRun > loop.staleAfterHours;

    if (overdue) {
      nextState.integrityFlags = upsertIntegrityFlag(nextState.integrityFlags, {
        id: flagId,
        severity: loop.escalatesTo,
        title: `${loop.name} missed cadence`,
        detail: `No successful ${loop.name.toLowerCase()} run has been recorded for ${Math.floor(hoursSinceRun)}h. ${loop.failureImpact}`,
        status: rankSeverity(loop.escalatesTo) >= rankSeverity("high") ? "open" : "watching",
        blocking: rankSeverity(loop.escalatesTo) >= rankSeverity("critical"),
        raisedAt: checkedAt,
        updatedAt: checkedAt,
        escalatesAfterHours: loop.staleAfterHours,
        escalatesTo: loop.escalatesTo,
      });
    } else if (nextState.integrityFlags.some((flag) => flag.id === flagId && flag.status !== "resolved")) {
      nextState.integrityFlags = resolveIntegrityFlag(
        nextState.integrityFlags,
        flagId,
        `${loop.name} has resumed and is back within its expected cadence window.`,
        checkedAt,
      );
    }
  }

  return validateRepositoryState(nextState);
}
