import { createRuntimeRepository } from "@/lib/repository";
import type { RuntimeRepository } from "@/lib/repository-core";
import type { RepositoryState, RunRecord, Submission } from "@/lib/types";
import { syncLoopAccountability } from "@/lib/state";
import { nowIso, rankSeverity } from "@/lib/utils";

function triageSubmission(state: RepositoryState, submission: Submission): Submission {
  if (submission.status !== "queued") {
    return submission;
  }

  const matchingBottleneck = state.bottlenecks.find((bottleneck) => {
    const normalizedTitle = submission.title.toLowerCase();
    return normalizedTitle.includes(bottleneck.title.toLowerCase().split(" ")[0] ?? "");
  });

  return {
    ...submission,
    status: "triaged",
    reviewNote: matchingBottleneck
      ? `Challenge against bottleneck ${matchingBottleneck.title} before candidate promotion.`
      : "Needs red-team critique before it can enter the candidate lane.",
  };
}

function buildSummary(state: RepositoryState, triagedCount: number): string[] {
  const highestSeverity = [...state.integrityFlags]
    .filter((flag) => flag.status !== "resolved")
    .sort((left, right) => rankSeverity(right.severity) - rankSeverity(left.severity))[0];

  const frontierIdeas = state.ideas.filter((idea) => idea.priority === "frontier").length;
  const openSubmissions = state.submissions.filter((submission) => submission.status === "queued").length;
  const overdueLoops = state.loops.filter((loop) => loop.status === "blocked" || loop.status === "watching").length;

  return [
    highestSeverity
      ? `Integrity watch: ${highestSeverity.title}`
      : "Integrity watch: no open high-severity flags.",
    `Frontier ideas under active pressure: ${frontierIdeas}.`,
    overdueLoops > 0 ? `Loop accountability: ${overdueLoops} loop(s) need attention.` : "Loop accountability: all loops within their stated windows.",
    triagedCount > 0
      ? `Triaged ${triagedCount} new owner submissions without promoting them automatically.`
      : `Owner submission queue currently holds ${openSubmissions} item(s).`,
  ];
}

export function generateMorningReport(state: RepositoryState, runRecord: RunRecord): string {
  const unresolvedFlags = state.integrityFlags.filter((flag) => flag.status !== "resolved");
  const frontierIdeas = state.ideas.filter((idea) => idea.priority === "frontier");
  const queuedSubmissions = state.submissions.filter((submission) => submission.status === "queued");
  const accountableLoops = state.loops.filter((loop) => loop.status !== "healthy");

  const lines = [
    "# IsIdeas Morning Report",
    "",
    `Generated: ${runRecord.finishedAt}`,
    `Trigger: ${runRecord.trigger}`,
    `Runtime mode: ${state.profile.runtimeMode}`,
    "",
    "## Focus",
    "",
    `- ${runRecord.focus}`,
    "",
    "## Summary",
    "",
    ...runRecord.summary.map((item) => `- ${item}`),
    "",
    "## Integrity",
    "",
    ...(unresolvedFlags.length
      ? unresolvedFlags.map((flag) => `- [${flag.severity}] ${flag.title}: ${flag.detail}`)
      : ["- No unresolved integrity flags."]),
    "",
    "## Frontier Ideas",
    "",
    ...frontierIdeas.map((idea) => `- ${idea.name}: ${idea.nextMove}`),
    "",
    "## Submission Queue",
    "",
    ...(queuedSubmissions.length
      ? queuedSubmissions.map((submission) => `- ${submission.title}`)
      : ["- Queue is clear."]),
    "",
    "## Loop Accountability",
    "",
    ...(accountableLoops.length
      ? accountableLoops.map((loop) => `- [${loop.status}] ${loop.name}: ${loop.lastOutcome}`)
      : ["- All tracked loops are currently inside their accountability window."]),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

export async function runRuntimeTick(
  repository: RuntimeRepository = createRuntimeRepository(),
  trigger: RunRecord["trigger"] = "manual",
): Promise<{ state: RepositoryState; runRecord: RunRecord; report: string }> {
  const state = await repository.readState();
  const startedAt = nowIso();
  let triagedCount = 0;

  const submissions = state.submissions.map((submission) => {
    const next = triageSubmission(state, submission);
    if (submission.status === "queued" && next.status === "triaged") {
      triagedCount += 1;
    }
    return next;
  });

  const openIntegrityFlag = [...state.integrityFlags]
    .filter((flag) => flag.status !== "resolved")
    .sort((left, right) => rankSeverity(right.severity) - rankSeverity(left.severity))[0];

  const focus =
    openIntegrityFlag?.severity === "critical" || openIntegrityFlag?.severity === "high"
      ? `Integrity first: ${openIntegrityFlag.title}`
      : triagedCount > 0
        ? "Submission triage and red-team staging"
        : "Bottleneck pressure and frontier hardening";

  const checkedAt = nowIso();
  const executedLoopIds = ["L-001", "L-005"];
  const nextState = syncLoopAccountability(
    {
      ...state,
      submissions,
    },
    [
      {
        id: "L-001",
        nextRunAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        outcome:
          triagedCount > 0
            ? `Queue scan completed; ${triagedCount} submission(s) moved from queued to triaged.`
            : "Queue scan completed; no queued submissions required triage.",
      },
      {
        id: "L-005",
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        outcome: `Morning report prepared for focus: ${focus}.`,
      },
    ],
    checkedAt,
  );

  const runRecord: RunRecord = {
    id: `run-${Date.now()}`,
    startedAt,
    finishedAt: checkedAt,
    trigger,
    focus,
    summary: buildSummary(nextState, triagedCount),
    executedLoopIds,
  };

  nextState.runs = [runRecord, ...state.runs].slice(0, 24);

  const report = generateMorningReport(nextState, runRecord);
  await repository.saveState(nextState);
  await repository.writeMorningReport(report);

  return {
    state: nextState,
    runRecord,
    report,
  };
}
