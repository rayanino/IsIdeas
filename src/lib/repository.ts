import { promises as fs } from "node:fs";
import path from "node:path";
import { resolveDatabaseUrl } from "@/lib/database-url";
import { createPostgresRepository } from "@/lib/postgres-repository";
import {
  submissionInputSchema,
  type RepositoryState,
  type Submission,
  type SubmissionInput,
} from "@/lib/types";
import { normalizeRepositoryState } from "@/lib/state";
import { nowIso, slugify } from "@/lib/utils";
import {
  getAppRootDir,
  getRuntimeLocalReportPath,
  getRuntimeLocalStatePath,
  getRuntimeSeedStatePath,
} from "@/lib/runtime-paths";

async function ensureRuntimeFiles() {
  const localStatePath = getRuntimeLocalStatePath();
  const localReportPath = getRuntimeLocalReportPath();

  await fs.mkdir(path.dirname(localStatePath), { recursive: true });

  try {
    await fs.access(localStatePath);
  } catch {
    const seed = await fs.readFile(getRuntimeSeedStatePath(), "utf8");
    await fs.writeFile(localStatePath, seed, "utf8");
  }

  try {
    await fs.access(localReportPath);
  } catch {
    await fs.writeFile(
      localReportPath,
      "# IsIdeas Morning Report\n\nBootstrap mode is active. Run a runtime tick to generate a live report.\n",
      "utf8",
    );
  }
}

async function readStateFile(): Promise<RepositoryState> {
  const raw = await fs.readFile(getRuntimeLocalStatePath(), "utf8");
  return normalizeRepositoryState(JSON.parse(raw));
}

async function writeStateFile(state: RepositoryState) {
  const normalized = normalizeRepositoryState({
    ...state,
    generatedAt: nowIso(),
  });
  await fs.writeFile(getRuntimeLocalStatePath(), `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}

export function createFileRepository() {
  return {
    rootDir: getAppRootDir(),
    async readState() {
      await ensureRuntimeFiles();
      return readStateFile();
    },
    async saveState(state: RepositoryState) {
      await ensureRuntimeFiles();
      await writeStateFile(state);
    },
    async addSubmission(input: SubmissionInput): Promise<Submission> {
      await ensureRuntimeFiles();
      const state = await readStateFile();
      const parsedInput = submissionInputSchema.parse(input);
      const slug = slugify(parsedInput.title);
      const knownIdea = state.ideas.find((idea) => idea.slug === slug);
      const knownSubmission = state.submissions.find((submission) => submission.slug === slug);

      const submission: Submission = {
        id: `submission-${slug}-${Date.now()}`,
        title: parsedInput.title,
        slug,
        submittedAt: nowIso(),
        status: knownIdea || knownSubmission ? "duplicate" : "queued",
        context: parsedInput.context,
        whyNow: parsedInput.whyNow,
        desiredOutcome: parsedInput.desiredOutcome,
        reviewNote: knownIdea
          ? `Duplicate of existing tracked idea workspace: ${knownIdea.name}.`
          : knownSubmission
            ? "Duplicate of an existing queued submission."
            : undefined,
        duplicateIdeaId: knownIdea?.id,
      };

      await writeStateFile({
        ...state,
        submissions: [submission, ...state.submissions],
      });

      return submission;
    },
    async writeMorningReport(markdown: string) {
      await ensureRuntimeFiles();
      await fs.writeFile(getRuntimeLocalReportPath(), markdown, "utf8");
    },
    async readMorningReport() {
      await ensureRuntimeFiles();
      return fs.readFile(getRuntimeLocalReportPath(), "utf8");
    },
  };
}

export function createRuntimeRepository() {
  const storageMode = process.env.ISIDEAS_STORAGE_MODE;
  const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL);

  if (storageMode === "postgres" && databaseUrl) {
    return createPostgresRepository(databaseUrl);
  }

  return createFileRepository();
}
