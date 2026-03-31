import { z } from "zod";

export const evidenceSourceClassSchema = z.enum([
  "official",
  "repository",
  "article",
  "forum",
  "note",
]);

export const evidenceLinkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  sourceClass: evidenceSourceClassSchema,
  fetchedAt: z.string(),
  note: z.string(),
});

export const ideaStageSchema = z.enum([
  "spark",
  "incubating",
  "dossier",
  "spec_ready",
  "handoff_ready",
  "parked",
  "rejected",
]);

export const priorityBandSchema = z.enum([
  "frontier",
  "challenge",
  "watch",
  "parked",
]);

export const attentionTierSchema = z.enum([
  "deep",
  "visible",
  "parked",
]);

export const integritySeveritySchema = z.enum([
  "low",
  "medium",
  "high",
  "critical",
]);

export const loopStatusSchema = z.enum([
  "healthy",
  "watching",
  "blocked",
  "offline",
]);

export const critiqueArtifactSchema = z.object({
  id: z.string(),
  title: z.string(),
  reviewer: z.string(),
  reviewedAt: z.string(),
  independence: z.enum(["external", "owner", "internal"]),
  sourceType: z.enum([
    "adversarial_review",
    "design_review",
    "owner_note",
    "migration_record",
  ]),
  location: z.string(),
  storagePath: z.string().optional(),
  targetIdeaIds: z.array(z.string()).default([]),
  targetBottleneckIds: z.array(z.string()).default([]),
  verdict: z.enum(["strengthens", "weakens", "mixed", "blocked"]).optional(),
  findingCounts: z
    .object({
      critical: z.number().int().nonnegative(),
      high: z.number().int().nonnegative(),
      medium: z.number().int().nonnegative(),
      low: z.number().int().nonnegative(),
    })
    .optional(),
  generator: z.string().optional(),
  model: z.string().optional(),
  runId: z.string().optional(),
  summary: z.string(),
  findingsSummary: z.string(),
});

export const decisionSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "governance",
    "storage_transition",
    "frontier_policy",
    "stage_reconciliation",
    "kr_contract",
    "portfolio_state",
    "tool_verdict",
  ]),
  title: z.string(),
  decidedAt: z.string(),
  owner: z.string(),
  summary: z.string(),
  critiqueSummary: z.string(),
  sourceBacked: z.array(z.string()),
  analytical: z.array(z.string()),
  affects: z.array(z.string()),
  critiqueArtifactIds: z.array(z.string()),
});

export const bottleneckSchema = z.object({
  id: z.string(),
  title: z.string(),
  leverageScore: z.number().min(1).max(10),
  coverage: z.enum(["weak", "partial", "strong"]),
  basis: z.enum(["analytical", "source_backed"]),
  evidenceLinkIds: z.array(z.string()),
  uncertaintyNote: z.string(),
  whyItMatters: z.string(),
  nextMove: z.string(),
});

export const ideaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  stage: ideaStageSchema,
  priority: priorityBandSchema,
  attentionTier: attentionTierSchema,
  contestable: z.boolean(),
  thesis: z.string(),
  bottleneckIds: z.array(z.string()),
  critiqueArtifactIds: z.array(z.string()),
  nextMove: z.string(),
  mainRisk: z.string(),
  krRelationship: z.string(),
  krDependencyStatus: z.enum([
    "boundary_only",
    "contract_defined",
    "blocked_for_build",
    "independent_for_now",
  ]),
  krDependencyNote: z.string(),
  lastJudgedAt: z.string(),
});

export const submissionSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  submittedAt: z.string(),
  status: z.enum(["queued", "triaged", "duplicate"]),
  context: z.string(),
  whyNow: z.string(),
  desiredOutcome: z.string(),
  reviewNote: z.string().optional(),
  duplicateIdeaId: z.string().optional(),
});

export const toolCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.enum(["adopted", "evaluating", "watching", "deferred"]),
  url: z.string().url(),
  note: z.string(),
});

export const researchArtifactSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["active", "watching", "archived"]),
  focus: z.string(),
  sourceType: z.string(),
  note: z.string(),
});

export const integrityFlagSchema = z.object({
  id: z.string(),
  severity: integritySeveritySchema,
  title: z.string(),
  detail: z.string(),
  status: z.enum(["open", "watching", "resolved"]),
  blocking: z.boolean(),
  raisedAt: z.string(),
  updatedAt: z.string(),
  resolutionNote: z.string().optional(),
  resolvedAt: z.string().optional(),
  escalatesAfterHours: z.number().int().positive().optional(),
  escalatesTo: integritySeveritySchema.optional(),
});

export const loopSchema = z.object({
  id: z.string(),
  name: z.string(),
  cadence: z.string(),
  status: loopStatusSchema,
  purpose: z.string(),
  staleAfterHours: z.number().int().positive(),
  escalatesTo: integritySeveritySchema,
  failureImpact: z.string(),
  lastOutcome: z.string(),
  lastRunAt: z.string(),
  nextRunAt: z.string(),
});

export const runRecordSchema = z.object({
  id: z.string(),
  startedAt: z.string(),
  finishedAt: z.string(),
  trigger: z.enum(["bootstrap", "manual", "scheduled"]),
  focus: z.string(),
  summary: z.array(z.string()),
  executedLoopIds: z.array(z.string()),
  outcome: z.enum(["success", "honest_skip", "failure"]).optional(),
  notes: z.array(z.string()).optional(),
});

export const repositoryProfileSchema = z.object({
  thesis: z.string(),
  horizon: z.string(),
  runtimeMode: z.enum(["bootstrap_file_store", "postgres_runtime"]),
  canonicalEndState: z.string(),
  operatorRole: z.string(),
  schemaVersion: z.number().int().positive(),
});

export const repositoryStateSchema = z.object({
  generatedAt: z.string(),
  profile: repositoryProfileSchema,
  evidenceLinks: z.array(evidenceLinkSchema),
  critiqueArtifacts: z.array(critiqueArtifactSchema),
  decisions: z.array(decisionSchema),
  bottlenecks: z.array(bottleneckSchema),
  ideas: z.array(ideaSchema),
  submissions: z.array(submissionSchema),
  tools: z.array(toolCandidateSchema),
  researchArtifacts: z.array(researchArtifactSchema),
  integrityFlags: z.array(integrityFlagSchema),
  loops: z.array(loopSchema),
  runs: z.array(runRecordSchema),
});

export const submissionInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  context: z.string().trim().min(10).max(600),
  whyNow: z.string().trim().min(10).max(400),
  desiredOutcome: z.string().trim().min(10).max(400),
});

export type RepositoryState = z.infer<typeof repositoryStateSchema>;
export type SubmissionInput = z.infer<typeof submissionInputSchema>;
export type Idea = z.infer<typeof ideaSchema>;
export type Submission = z.infer<typeof submissionSchema>;
export type IntegrityFlag = z.infer<typeof integrityFlagSchema>;
export type RunRecord = z.infer<typeof runRecordSchema>;
export type CritiqueArtifact = z.infer<typeof critiqueArtifactSchema>;
export type Loop = z.infer<typeof loopSchema>;
