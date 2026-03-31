import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import { z } from "zod";
import { createRuntimeRepository } from "@/lib/repository";
import type { RuntimeRepository } from "@/lib/repository-core";
import { generateMorningReport } from "@/lib/tick";
import { syncLoopAccountability, upsertIntegrityFlag } from "@/lib/state";
import type { CritiqueArtifact, Idea, RepositoryState, RunRecord } from "@/lib/types";
import { nowIso } from "@/lib/utils";
import { getActiveFocusPath, getCritiqueRunsDir, getIdeasDir, getKrStatusPath } from "@/lib/runtime-paths";

const RED_TEAM_LOOP_ID = "L-004";
const DEFAULT_MODEL = "opus";
const CRITIQUE_GAP_HOURS = 20;

const redTeamFindingSchema = z.object({
  severity: z.enum(["critical", "high", "medium", "low"]),
  title: z.string(),
  evidenceRefs: z.array(z.string()),
  whyItMatters: z.string(),
  recommendedFollowUp: z.string(),
});

const redTeamStructuredOutputSchema = z.object({
  verdict: z.enum(["strengthens", "weakens", "mixed", "blocked"]),
  summary: z.string(),
  findingCounts: z.object({
    critical: z.number().int().nonnegative(),
    high: z.number().int().nonnegative(),
    medium: z.number().int().nonnegative(),
    low: z.number().int().nonnegative(),
  }),
  findings: z.array(redTeamFindingSchema),
  suggestedNextJudgment: z.string(),
  safeNoChangeReason: z.string(),
});

const claudeResultSchema = z.object({
  type: z.literal("result"),
  subtype: z.string().optional(),
  is_error: z.boolean().optional(),
  result: z.string().optional(),
  structured_output: redTeamStructuredOutputSchema.optional(),
});

export type RedTeamMode = "manual" | "scheduled";

interface RedTeamSelection {
  outcome: "target" | "honest_skip";
  idea?: Idea;
  reason: string;
}

interface RedTeamRunResult {
  outcome: "success" | "honest_skip" | "failure";
  packetPath: string;
  runRecord: RunRecord;
  state: RepositoryState;
  artifact?: CritiqueArtifact;
  reason?: string;
}

interface BuiltPromptPacket {
  prompt: string;
  idea: Idea;
  bottleneckTitles: string[];
}

interface ClaudeInvocationResult {
  structured: z.infer<typeof redTeamStructuredOutputSchema>;
  raw: z.infer<typeof claudeResultSchema>;
  stdout: string;
  stderr: string;
  durationMs: number;
}

type ClaudeExecutor = (args: { prompt: string; model: string }) => Promise<ClaudeInvocationResult>;

interface RedTeamPaths {
  ideasDir: string;
  activeFocusPath: string;
  krStatusPath: string;
  critiqueRunsDir: string;
}

function toRunSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function getDefaultRedTeamPaths(): RedTeamPaths {
  return {
    ideasDir: getIdeasDir(),
    activeFocusPath: getActiveFocusPath(),
    krStatusPath: getKrStatusPath(),
    critiqueRunsDir: getCritiqueRunsDir(),
  };
}

function getLatestExternalCritiqueForIdea(state: RepositoryState, idea: Idea) {
  const critiqueArtifactsById = new Map(state.critiqueArtifacts.map((artifact) => [artifact.id, artifact]));
  const artifacts = idea.critiqueArtifactIds
    .map((artifactId) => critiqueArtifactsById.get(artifactId))
    .filter((artifact): artifact is CritiqueArtifact => Boolean(artifact))
    .filter((artifact) => artifact.independence === "external")
    .sort((left, right) => new Date(right.reviewedAt).getTime() - new Date(left.reviewedAt).getTime());

  return artifacts[0];
}

export function selectRedTeamTarget(
  state: RepositoryState,
  options: { mode: RedTeamMode; targetSlug?: string; now?: string },
): RedTeamSelection {
  const checkedAt = options.now ?? nowIso();
  const frontierIdeas = state.ideas.filter((idea) => {
    return (
      idea.priority === "frontier" &&
      idea.attentionTier === "deep" &&
      (idea.stage === "dossier" || idea.stage === "spec_ready" || idea.stage === "handoff_ready")
    );
  });

  if (options.targetSlug) {
    const targeted = frontierIdeas.find((idea) => idea.slug === options.targetSlug);
    if (!targeted) {
      return {
        outcome: "honest_skip",
        reason: `Target slug ${options.targetSlug} is not an eligible frontier idea.`,
      };
    }

    return {
      outcome: "target",
      idea: targeted,
      reason: `Manual target override selected ${targeted.slug}.`,
    };
  }

  if (frontierIdeas.length === 0) {
    return {
      outcome: "honest_skip",
      reason: "No frontier idea is currently eligible for independent critique.",
    };
  }

  const ranked = [...frontierIdeas].sort((left, right) => {
    const leftCritique = getLatestExternalCritiqueForIdea(state, left);
    const rightCritique = getLatestExternalCritiqueForIdea(state, right);
    const leftTime = leftCritique ? new Date(leftCritique.reviewedAt).getTime() : 0;
    const rightTime = rightCritique ? new Date(rightCritique.reviewedAt).getTime() : 0;

    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    const leftJudged = new Date(left.lastJudgedAt).getTime();
    const rightJudged = new Date(right.lastJudgedAt).getTime();
    if (leftJudged !== rightJudged) {
      return leftJudged - rightJudged;
    }

    return left.slug.localeCompare(right.slug);
  });

  const selected = ranked[0];
  if (!selected) {
    return {
      outcome: "honest_skip",
      reason: "No frontier idea was selectable after ranking.",
    };
  }

  if (options.mode === "scheduled") {
    const latestCritique = getLatestExternalCritiqueForIdea(state, selected);
    if (latestCritique) {
      const hoursSinceCritique =
        (new Date(checkedAt).getTime() - new Date(latestCritique.reviewedAt).getTime()) / 3_600_000;
      if (hoursSinceCritique < CRITIQUE_GAP_HOURS) {
        return {
          outcome: "honest_skip",
          reason: `Most critiqueable frontier idea ${selected.slug} was reviewed ${hoursSinceCritique.toFixed(1)}h ago, inside the ${CRITIQUE_GAP_HOURS}h gap.`,
        };
      }
    }
  }

  return {
    outcome: "target",
    idea: selected,
    reason: `Selected ${selected.slug} as the oldest eligible frontier idea for independent critique.`,
  };
}

async function resolveIdeaWorkspace(paths: RedTeamPaths, idea: Idea) {
  const ideasDir = paths.ideasDir;
  const entries = await fs.readdir(ideasDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const readmePath = path.join(ideasDir, entry.name, "README.md");
    try {
      const readme = await fs.readFile(readmePath, "utf8");
      if (readme.includes(idea.id) || readme.includes(idea.name)) {
        return {
          workspacePath: path.join(ideasDir, entry.name),
          readmePath,
          dossierPath: path.join(ideasDir, entry.name, "DOSSIER.md"),
        };
      }
    } catch {
      continue;
    }
  }

  throw new Error(`Could not resolve a workspace directory for idea ${idea.slug}.`);
}

async function buildPromptPacket(paths: RedTeamPaths, state: RepositoryState, idea: Idea): Promise<BuiltPromptPacket> {
  const workspace = await resolveIdeaWorkspace(paths, idea);
  const [ideaReadme, dossier, activeFocus, krStatus] = await Promise.all([
    fs.readFile(workspace.readmePath, "utf8"),
    fs.readFile(workspace.dossierPath, "utf8"),
    fs.readFile(paths.activeFocusPath, "utf8"),
    fs.readFile(paths.krStatusPath, "utf8"),
  ]);

  const bottlenecks = state.bottlenecks.filter((bottleneck) => idea.bottleneckIds.includes(bottleneck.id));
  const unresolvedFlags = state.integrityFlags.filter((flag) => flag.status !== "resolved");
  const priorCritique = getLatestExternalCritiqueForIdea(state, idea);

  const promptSections = [
    "# Independent Red-Team Critique Task",
    "",
    "You are acting as an independent critic for one frontier idea in the IsIdeas control tower.",
    "Your job is to critique the idea, not to rewrite the repo and not to auto-promote or auto-rerank anything.",
    "",
    "## Hard Rules",
    "",
    "- Treat the current portfolio state as contestable.",
    "- Do not propose direct file mutations.",
    "- Focus on strategic weakness, false authority, hidden blockers, and substrate assumptions.",
    "- Critique the target idea on its own terms and against its linked bottleneck(s).",
    "- If the best outcome is 'no change yet', say so clearly.",
    "",
    `## Target Idea: ${idea.name}`,
    "",
    `- slug: ${idea.slug}`,
    `- stage: ${idea.stage}`,
    `- priority: ${idea.priority}`,
    `- attention: ${idea.attentionTier}`,
    `- kr dependency: ${idea.krDependencyStatus}`,
    "",
    "## Linked Bottlenecks",
    "",
    ...bottlenecks.map((bottleneck) => `- ${bottleneck.title}: ${bottleneck.whyItMatters}`),
    "",
    "## Unresolved Integrity Flags",
    "",
    ...(unresolvedFlags.length
      ? unresolvedFlags.map((flag) => `- [${flag.severity}] ${flag.title}: ${flag.detail}`)
      : ["- none"]),
    "",
    "## Current Active Focus",
    "",
    activeFocus,
    "",
    "## KR Status",
    "",
    krStatus,
    "",
    "## Idea README",
    "",
    ideaReadme,
    "",
    "## Idea Dossier",
    "",
    dossier,
    "",
    "## Latest Prior External Critique Summary",
    "",
    priorCritique
      ? `- ${priorCritique.reviewedAt}: ${priorCritique.findingsSummary}`
      : "- No prior external critique exists for this idea.",
    "",
    "## Output Instructions",
    "",
    "Return only the structured output requested by the schema.",
  ];

  return {
    prompt: `${promptSections.join("\n")}\n`,
    idea,
    bottleneckTitles: bottlenecks.map((bottleneck) => bottleneck.title),
  };
}

function renderArtifactMarkdown(params: {
  idea: Idea;
  packet: BuiltPromptPacket;
  output: z.infer<typeof redTeamStructuredOutputSchema>;
}) {
  const { idea, output, packet } = params;

  const lines = [
    `# Red-Team Critique — ${idea.name}`,
    "",
    `Verdict: ${output.verdict}`,
    `Reviewed: ${nowIso()}`,
    "",
    "## Summary",
    "",
    output.summary,
    "",
    "## Finding Counts",
    "",
    `- Critical: ${output.findingCounts.critical}`,
    `- High: ${output.findingCounts.high}`,
    `- Medium: ${output.findingCounts.medium}`,
    `- Low: ${output.findingCounts.low}`,
    "",
    "## Findings",
    "",
    ...output.findings.flatMap((finding, index) => [
      `### ${index + 1}. [${finding.severity}] ${finding.title}`,
      "",
      `- Evidence refs: ${finding.evidenceRefs.join(", ") || "none"}`,
      `- Why it matters: ${finding.whyItMatters}`,
      `- Recommended follow-up: ${finding.recommendedFollowUp}`,
      "",
    ]),
    "## Suggested Next Judgment",
    "",
    output.suggestedNextJudgment,
    "",
    "## Safe No-Change Reason",
    "",
    output.safeNoChangeReason,
    "",
    "## Target Bottlenecks",
    "",
    ...packet.bottleneckTitles.map((title) => `- ${title}`),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

async function invokeClaudeExecutor(args: { prompt: string; model: string }): Promise<ClaudeInvocationResult> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "isideas-redteam-"));
  const commandArgs = [
    "-p",
    "--output-format",
    "json",
    "--json-schema",
    JSON.stringify({
      type: "object",
      properties: {
        verdict: { type: "string", enum: ["strengthens", "weakens", "mixed", "blocked"] },
        summary: { type: "string" },
        findingCounts: {
          type: "object",
          properties: {
            critical: { type: "integer", minimum: 0 },
            high: { type: "integer", minimum: 0 },
            medium: { type: "integer", minimum: 0 },
            low: { type: "integer", minimum: 0 },
          },
          required: ["critical", "high", "medium", "low"],
          additionalProperties: false,
        },
        findings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
              title: { type: "string" },
              evidenceRefs: {
                type: "array",
                items: { type: "string" },
              },
              whyItMatters: { type: "string" },
              recommendedFollowUp: { type: "string" },
            },
            required: ["severity", "title", "evidenceRefs", "whyItMatters", "recommendedFollowUp"],
            additionalProperties: false,
          },
        },
        suggestedNextJudgment: { type: "string" },
        safeNoChangeReason: { type: "string" },
      },
      required: ["verdict", "summary", "findingCounts", "findings", "suggestedNextJudgment", "safeNoChangeReason"],
      additionalProperties: false,
    }),
    "--no-session-persistence",
    "--tools",
    "",
    "--model",
    args.model,
    "--effort",
    "high",
  ];

  const started = Date.now();
  const child = spawn("claude", commandArgs, {
    cwd: tempDir,
    env: process.env,
    shell: false,
    windowsHide: true,
  });

  let stdout = "";
  let stderr = "";

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  child.stdin.write(args.prompt);
  child.stdin.end();

  const exitCode = await new Promise<number>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });

  if (exitCode !== 0) {
    throw new Error(`Claude CLI exited with code ${exitCode}: ${stderr.trim() || "unknown error"}`);
  }

  const raw = claudeResultSchema.parse(JSON.parse(stdout));
  const structured = raw.structured_output ?? redTeamStructuredOutputSchema.parse(JSON.parse(raw.result ?? "{}"));

  return {
    structured,
    raw,
    stdout,
    stderr,
    durationMs: Date.now() - started,
  };
}

function buildRunRecord(params: {
  id: string;
  startedAt: string;
  finishedAt: string;
  trigger: RunRecord["trigger"];
  focus: string;
  summary: string[];
  outcome: NonNullable<RunRecord["outcome"]>;
  notes?: string[];
}) {
  return {
    id: params.id,
    startedAt: params.startedAt,
    finishedAt: params.finishedAt,
    trigger: params.trigger,
    focus: params.focus,
    summary: params.summary,
    executedLoopIds: [RED_TEAM_LOOP_ID],
    outcome: params.outcome,
    notes: params.notes,
  } satisfies RunRecord;
}

export async function runRedTeamCritique(
  options: {
    mode: RedTeamMode;
    targetSlug?: string;
    model?: string;
  },
  dependencies: {
    repository?: RuntimeRepository;
    executor?: ClaudeExecutor;
    now?: string;
    paths?: RedTeamPaths;
  } = {},
): Promise<RedTeamRunResult> {
  const repository = dependencies.repository ?? createRuntimeRepository();
  const executor = dependencies.executor ?? invokeClaudeExecutor;
  const checkedAt = dependencies.now ?? nowIso();
  const paths = dependencies.paths ?? getDefaultRedTeamPaths();
  const stateBefore = await repository.readState();
  const selection = selectRedTeamTarget(stateBefore, {
    mode: options.mode,
    targetSlug: options.targetSlug,
    now: checkedAt,
  });

  if (options.targetSlug && selection.outcome === "honest_skip") {
    const packetPath = path.join(paths.critiqueRunsDir, `${timestampSlug()}-invalid-target`);
    await fs.mkdir(packetPath, { recursive: true });
    await fs.writeFile(
      path.join(packetPath, "metadata.json"),
      `${JSON.stringify(
        {
          mode: options.mode,
          targetSlug: options.targetSlug,
          outcome: "failure",
          error: selection.reason,
          createdAt: checkedAt,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    const nextState: RepositoryState = {
      ...stateBefore,
      loops: stateBefore.loops.map((loop) =>
        loop.id === RED_TEAM_LOOP_ID
          ? {
              ...loop,
              status: "blocked",
              lastRunAt: checkedAt,
              nextRunAt: new Date(new Date(checkedAt).getTime() + 24 * 3_600_000).toISOString(),
              lastOutcome: `Red-team critique request failed: ${selection.reason}`,
            }
          : loop,
      ),
      integrityFlags: upsertIntegrityFlag(stateBefore.integrityFlags, {
        id: `F-LOOP-${RED_TEAM_LOOP_ID}`,
        severity: "high",
        title: "Red-team critique loop failed",
        detail: selection.reason,
        status: "open",
        blocking: false,
        raisedAt: checkedAt,
        updatedAt: checkedAt,
        escalatesAfterHours: 30,
        escalatesTo: "high",
      }),
    };

    const runRecord = buildRunRecord({
      id: `run-${Date.now()}`,
      startedAt: checkedAt,
      finishedAt: checkedAt,
      trigger: options.mode,
      focus: "Independent critique request failed",
      summary: [selection.reason],
      outcome: "failure",
      notes: ["Requested target was not eligible for critique."],
    });

    nextState.runs = [runRecord, ...nextState.runs].slice(0, 24);
    const report = generateMorningReport(nextState, runRecord);
    await repository.saveState(nextState);
    await repository.writeMorningReport(report);

    return {
      outcome: "failure",
      packetPath,
      runRecord,
      state: nextState,
      reason: selection.reason,
    };
  }

  const packetSlug = selection.idea ? selection.idea.slug : "skip";
  const packetPath = path.join(paths.critiqueRunsDir, `${timestampSlug()}-${toRunSlug(packetSlug)}`);
  await fs.mkdir(packetPath, { recursive: true });

  if (selection.outcome === "honest_skip" || !selection.idea) {
    await fs.writeFile(
      path.join(packetPath, "metadata.json"),
      `${JSON.stringify(
        {
          mode: options.mode,
          targetSlug: options.targetSlug ?? null,
          outcome: "honest_skip",
          reason: selection.reason,
          createdAt: checkedAt,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    const nextState = syncLoopAccountability(
      stateBefore,
      [
        {
          id: RED_TEAM_LOOP_ID,
          nextRunAt: new Date(new Date(checkedAt).getTime() + 24 * 3_600_000).toISOString(),
          outcome: `Skipped red-team critique honestly: ${selection.reason}`,
        },
      ],
      checkedAt,
    );

    const runRecord = buildRunRecord({
      id: `run-${Date.now()}`,
      startedAt: checkedAt,
      finishedAt: checkedAt,
      trigger: options.mode,
      focus: "Independent red-team critique",
      summary: [selection.reason],
      outcome: "honest_skip",
      notes: ["No eligible frontier idea required critique in this run window."],
    });

    nextState.runs = [runRecord, ...nextState.runs].slice(0, 24);
    const report = generateMorningReport(nextState, runRecord);
    await repository.saveState(nextState);
    await repository.writeMorningReport(report);

    return {
      outcome: "honest_skip",
      packetPath,
      runRecord,
      state: nextState,
      reason: selection.reason,
    };
  }

  const selectedIdea = selection.idea;
  const startedAt = checkedAt;
  try {
    const packet = await buildPromptPacket(paths, stateBefore, selectedIdea);
    await fs.writeFile(path.join(packetPath, "prompt.md"), packet.prompt, "utf8");

    const invocation = await executor({
      prompt: packet.prompt,
      model: options.model ?? DEFAULT_MODEL,
    });

    const artifactId = `CA-${Date.now()}-${toRunSlug(selectedIdea.slug)}`;
    const runId = `run-${Date.now()}`;
    const artifactMarkdown = renderArtifactMarkdown({
      idea: selectedIdea,
      packet,
      output: invocation.structured,
    });

    const artifact: CritiqueArtifact = {
      id: artifactId,
      title: `Independent red-team critique — ${selectedIdea.name}`,
      reviewer: "Claude Code CLI",
      reviewedAt: checkedAt,
      independence: "external",
      sourceType: "design_review",
      location: packetPath,
      storagePath: packetPath,
      targetIdeaIds: [selectedIdea.id],
      targetBottleneckIds: selectedIdea.bottleneckIds,
      verdict: invocation.structured.verdict,
      findingCounts: invocation.structured.findingCounts,
      generator: "claude-cli",
      model: options.model ?? DEFAULT_MODEL,
      runId,
      summary: invocation.structured.summary,
      findingsSummary: `Verdict ${invocation.structured.verdict}; findings C${invocation.structured.findingCounts.critical}/H${invocation.structured.findingCounts.high}/M${invocation.structured.findingCounts.medium}/L${invocation.structured.findingCounts.low}.`,
    };

    await Promise.all([
      fs.writeFile(path.join(packetPath, "response.json"), `${JSON.stringify(invocation.raw, null, 2)}\n`, "utf8"),
      fs.writeFile(path.join(packetPath, "artifact.md"), artifactMarkdown, "utf8"),
      fs.writeFile(
        path.join(packetPath, "metadata.json"),
        `${JSON.stringify(
          {
            mode: options.mode,
            targetSlug: selection.idea.slug,
            outcome: "success",
            verdict: invocation.structured.verdict,
            durationMs: invocation.durationMs,
            model: options.model ?? DEFAULT_MODEL,
            runId,
            createdAt: checkedAt,
          },
          null,
          2,
        )}\n`,
        "utf8",
      ),
    ]);

    let nextState: RepositoryState = {
      ...stateBefore,
      critiqueArtifacts: [artifact, ...stateBefore.critiqueArtifacts],
      ideas: stateBefore.ideas.map((idea) =>
        idea.id === selectedIdea.id && !idea.critiqueArtifactIds.includes(artifactId)
          ? { ...idea, critiqueArtifactIds: [artifactId, ...idea.critiqueArtifactIds] }
          : idea,
      ),
    };

    nextState = syncLoopAccountability(
      nextState,
      [
        {
          id: RED_TEAM_LOOP_ID,
          nextRunAt: new Date(new Date(checkedAt).getTime() + 24 * 3_600_000).toISOString(),
          outcome: `Critiqued ${selectedIdea.slug} with verdict ${invocation.structured.verdict}.`,
        },
      ],
      checkedAt,
    );

    const runRecord = buildRunRecord({
      id: runId,
      startedAt,
      finishedAt: nowIso(),
      trigger: options.mode,
      focus: `Independent critique: ${selectedIdea.name}`,
      summary: [
        `Critiqued ${selectedIdea.slug}.`,
        `Verdict: ${invocation.structured.verdict}.`,
      ],
      outcome: "success",
      notes: [selection.reason, invocation.structured.suggestedNextJudgment],
    });

    nextState.runs = [runRecord, ...nextState.runs].slice(0, 24);
    const report = generateMorningReport(nextState, runRecord);
    await repository.saveState(nextState);
    await repository.writeMorningReport(report);

    return {
      outcome: "success",
      packetPath,
      runRecord,
      state: nextState,
      artifact,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown red-team failure.";
    await fs.writeFile(
      path.join(packetPath, "metadata.json"),
      `${JSON.stringify(
        {
          mode: options.mode,
          targetSlug: selectedIdea.slug,
          outcome: "failure",
          error: message,
          createdAt: checkedAt,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    const nextState: RepositoryState = {
      ...stateBefore,
      loops: stateBefore.loops.map((loop) =>
        loop.id === RED_TEAM_LOOP_ID
          ? {
              ...loop,
              status: "blocked",
              lastRunAt: checkedAt,
              nextRunAt: new Date(new Date(checkedAt).getTime() + 24 * 3_600_000).toISOString(),
              lastOutcome: `Red-team critique failed for ${selectedIdea.slug}: ${message}`,
            }
          : loop,
      ),
      integrityFlags: upsertIntegrityFlag(stateBefore.integrityFlags, {
        id: `F-LOOP-${RED_TEAM_LOOP_ID}`,
        severity: "high",
        title: "Red-team critique loop failed",
        detail: `The independent critique loop failed for ${selectedIdea.slug}. ${message}`,
        status: "open",
        blocking: false,
        raisedAt: checkedAt,
        updatedAt: checkedAt,
        escalatesAfterHours: 30,
        escalatesTo: "high",
      }),
    };

    const runRecord = buildRunRecord({
      id: `run-${Date.now()}`,
      startedAt,
      finishedAt: nowIso(),
      trigger: options.mode,
      focus: `Independent critique failed: ${selectedIdea.name}`,
      summary: [`Critique run failed for ${selectedIdea.slug}.`],
      outcome: "failure",
      notes: [message],
    });

    nextState.runs = [runRecord, ...nextState.runs].slice(0, 24);
    const report = generateMorningReport(nextState, runRecord);
    await repository.saveState(nextState);
    await repository.writeMorningReport(report);

    return {
      outcome: "failure",
      packetPath,
      runRecord,
      state: nextState,
      reason: message,
    };
  }
}
