import { config } from "dotenv";
import path from "node:path";
import { promises as fs } from "node:fs";
import { createRuntimeRepository } from "@/lib/repository";
import { runRuntimeTick } from "@/lib/tick";
import type { Idea, RepositoryState } from "@/lib/types";

config({
  path: ".env.local",
  quiet: true,
});

function makeStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function sameIdeaEnvelope(before: Idea[], after: Idea[]) {
  const beforeEnvelope = before.map((idea) => ({
    id: idea.id,
    stage: idea.stage,
    priority: idea.priority,
    attentionTier: idea.attentionTier,
  }));
  const afterEnvelope = after.map((idea) => ({
    id: idea.id,
    stage: idea.stage,
    priority: idea.priority,
    attentionTier: idea.attentionTier,
  }));
  return JSON.stringify(beforeEnvelope) === JSON.stringify(afterEnvelope);
}

function renderSummary(params: {
  submissionTitle: string;
  baselineDir: string;
  stateBefore: RepositoryState;
  stateAfter: RepositoryState;
  reportBefore: string;
  reportAfter: string;
  runFocus: string;
  executedLoopIds: string[];
}) {
  const { submissionTitle, baselineDir, stateBefore, stateAfter, reportBefore, reportAfter, runFocus, executedLoopIds } = params;

  const beforeSubmissionCount = stateBefore.submissions.length;
  const afterSubmissionCount = stateAfter.submissions.length;
  const createdSubmission = stateAfter.submissions.find((submission) => submission.title === submissionTitle);
  const preservedIdeas = sameIdeaEnvelope(stateBefore.ideas, stateAfter.ideas);
  const unresolvedFlags = stateAfter.integrityFlags.filter((flag) => flag.status !== "resolved");

  const sections = [
    "# Supervised Proving Run",
    "",
    `Created: ${new Date().toISOString()}`,
    `Submission title: ${submissionTitle}`,
    `Run focus: ${runFocus}`,
    `Executed loops: ${executedLoopIds.join(", ") || "none recorded"}`,
    "",
    "## Verdict",
    "",
    preservedIdeas
      ? "- Governed idea envelopes stayed stable during the proving run."
      : "- WARNING: idea stage/priority/attention changed during the proving run.",
    createdSubmission
      ? `- Submission landed with status: ${createdSubmission.status}.`
      : "- WARNING: submission was not found after the run.",
    `- Submission count moved from ${beforeSubmissionCount} to ${afterSubmissionCount}.`,
    `- Unresolved integrity flags after run: ${unresolvedFlags.length}.`,
    "",
    "## Interpretation",
    "",
    createdSubmission?.reviewNote
      ? `- Intake note: ${createdSubmission.reviewNote}`
      : "- No review note was recorded for the new submission.",
    `- Baseline packet: ${baselineDir}`,
    `- Morning report changed: ${reportBefore !== reportAfter ? "yes" : "no"}`,
    "",
    "## Next Judgment",
    "",
    "- If the intake result is useful and idea envelopes stayed stable, the system passed the supervised proving threshold.",
    "- The next work should target the first genuinely recurring loop that still shows as watching or blocked.",
    "",
  ];

  return `${sections.join("\n")}\n`;
}

async function main() {
  const repository = createRuntimeRepository();
  const stamp = makeStamp();
  const provingDir = path.join(process.cwd(), "runtime", "local", "proving-runs", stamp);
  await fs.mkdir(provingDir, { recursive: true });

  const stateBefore = await repository.readState();
  const reportBefore = await repository.readMorningReport();
  const submissionTitle = `Lecture attendance continuity tracker ${stamp}`;

  await fs.writeFile(path.join(provingDir, "before-state.json"), `${JSON.stringify(stateBefore, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(provingDir, "before-report.md"), reportBefore, "utf8");

  const submission = await repository.addSubmission({
    title: submissionTitle,
    context:
      "Need continuity on what lectures were attended, what was covered, and how that links back to follow-up actions inside the wider study environment.",
    whyNow:
      "Lecture continuity was explicitly named as a real need, and the current runtime should prove it can triage a real study workflow request without silently mutating portfolio truth.",
    desiredOutcome:
      "Triage the idea honestly, attach it to the right bottleneck if applicable, and leave a clear next move in the runtime state.",
  });

  const { state: stateAfter, runRecord, report: reportAfter } = await runRuntimeTick(repository, "manual");

  await fs.writeFile(path.join(provingDir, "after-state.json"), `${JSON.stringify(stateAfter, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(provingDir, "after-report.md"), reportAfter, "utf8");
  await fs.writeFile(
    path.join(provingDir, "submission.json"),
    `${JSON.stringify(submission, null, 2)}\n`,
    "utf8",
  );

  const summary = renderSummary({
    submissionTitle,
    baselineDir: provingDir,
    stateBefore,
    stateAfter,
    reportBefore,
    reportAfter,
    runFocus: runRecord.focus,
    executedLoopIds: runRecord.executedLoopIds,
  });

  await fs.writeFile(path.join(provingDir, "SUMMARY.md"), summary, "utf8");
  process.stdout.write(summary);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
