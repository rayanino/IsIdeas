import path from "node:path";
import { promises as fs } from "node:fs";
import {
  submissionInputSchema,
  type RepositoryState,
  type Submission,
  type SubmissionInput,
} from "@/lib/types";
import { normalizeRepositoryState } from "@/lib/state";
import { nowIso, slugify } from "@/lib/utils";

interface RepositoryPaths {
  seedStatePath: string;
  localStatePath: string;
  localReportPath: string;
}

export interface RuntimeRepository {
  rootDir: string;
  readState(): Promise<RepositoryState>;
  saveState(state: RepositoryState): Promise<void>;
  addSubmission(input: SubmissionInput): Promise<Submission>;
  writeMorningReport(markdown: string): Promise<void>;
  readMorningReport(): Promise<string>;
}

function getPaths(rootDir: string): RepositoryPaths {
  return {
    seedStatePath: path.join(rootDir, "runtime", "seed", "state.json"),
    localStatePath: path.join(rootDir, "runtime", "local", "state.json"),
    localReportPath: path.join(rootDir, "runtime", "local", "MORNING_REPORT.md"),
  };
}

async function ensureRuntimeFiles(paths: RepositoryPaths): Promise<void> {
  await fs.mkdir(path.dirname(paths.localStatePath), { recursive: true });

  try {
    await fs.access(paths.localStatePath);
  } catch {
    const seed = await fs.readFile(paths.seedStatePath, "utf8");
    await fs.writeFile(paths.localStatePath, seed, "utf8");
  }

  try {
    await fs.access(paths.localReportPath);
  } catch {
    await fs.writeFile(
      paths.localReportPath,
      "# IsIdeas Morning Report\n\nBootstrap mode is active. Run a runtime tick to generate a live report.\n",
      "utf8",
    );
  }
}

async function readJsonState(filePath: string): Promise<RepositoryState> {
  const raw = await fs.readFile(filePath, "utf8");
  return normalizeRepositoryState(JSON.parse(raw));
}

async function writeJsonState(filePath: string, state: RepositoryState): Promise<void> {
  const nextState = normalizeRepositoryState({
    ...state,
    generatedAt: nowIso(),
  });
  await fs.writeFile(filePath, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");
}

export function createScopedFileRepository(rootDir: string): RuntimeRepository {
  const paths = getPaths(rootDir);

  return {
    rootDir,
    async readState() {
      await ensureRuntimeFiles(paths);
      return readJsonState(paths.localStatePath);
    },
    async saveState(state) {
      await ensureRuntimeFiles(paths);
      await writeJsonState(paths.localStatePath, state);
    },
    async addSubmission(input) {
      await ensureRuntimeFiles(paths);
      const state = await readJsonState(paths.localStatePath);
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

      const nextState = {
        ...state,
        submissions: [submission, ...state.submissions],
      };

      await writeJsonState(paths.localStatePath, nextState);
      return submission;
    },
    async writeMorningReport(markdown) {
      await ensureRuntimeFiles(paths);
      await fs.writeFile(paths.localReportPath, markdown, "utf8");
    },
    async readMorningReport() {
      await ensureRuntimeFiles(paths);
      return fs.readFile(paths.localReportPath, "utf8");
    },
  };
}
