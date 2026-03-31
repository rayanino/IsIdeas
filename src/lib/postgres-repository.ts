import { promises as fs } from "node:fs";
import { Pool } from "pg";
import {
  submissionInputSchema,
  type RepositoryState,
  type Submission,
  type SubmissionInput,
} from "@/lib/types";
import type { RuntimeRepository } from "@/lib/repository-core";
import { normalizeRepositoryState } from "@/lib/state";
import { nowIso, slugify } from "@/lib/utils";
import { getAppRootDir, getRuntimeSeedStatePath } from "@/lib/runtime-paths";

const DEFAULT_REPORT =
  "# IsIdeas Morning Report\n\nPostgres runtime is active. Run a runtime tick to generate a fresh report.\n";

function getSeedStatePath(): string {
  return getRuntimeSeedStatePath();
}

async function loadSeedState(): Promise<RepositoryState> {
  const raw = await fs.readFile(getSeedStatePath(), "utf8");
  return normalizeRepositoryState(JSON.parse(raw));
}

async function ensureState(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS runtime_documents (
      key TEXT PRIMARY KEY,
      body JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(
    `INSERT INTO runtime_documents (key, body) VALUES ('schema_meta', $1::jsonb)
     ON CONFLICT (key) DO NOTHING`,
    [
      JSON.stringify({
        version: 2,
        initializedAt: nowIso(),
        initializedByDecisionId: "D-0002",
      }),
    ],
  );

  const stateResult = await pool.query("SELECT body FROM runtime_documents WHERE key = 'state'");
  if (stateResult.rowCount === 0) {
    const seed = normalizeRepositoryState(await loadSeedState(), {
      runtimeMode: "postgres_runtime",
      transitionedAt: nowIso(),
    });
    await pool.query(
      `INSERT INTO runtime_documents (key, body) VALUES ('state', $1::jsonb)
       ON CONFLICT (key) DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()`,
      [JSON.stringify(seed)],
    );
  } else {
    const upgraded = normalizeRepositoryState(stateResult.rows[0]?.body, {
      runtimeMode: "postgres_runtime",
      transitionedAt: nowIso(),
    });
    if (JSON.stringify(stateResult.rows[0]?.body) !== JSON.stringify(upgraded)) {
      await pool.query(`UPDATE runtime_documents SET body = $1::jsonb, updated_at = NOW() WHERE key = 'state'`, [
        JSON.stringify(upgraded),
      ]);
    }
  }

  const reportResult = await pool.query("SELECT body FROM runtime_documents WHERE key = 'morning_report'");
  if (reportResult.rowCount === 0) {
    await pool.query(
      `INSERT INTO runtime_documents (key, body) VALUES ('morning_report', $1::jsonb)
       ON CONFLICT (key) DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()`,
      [JSON.stringify({ markdown: DEFAULT_REPORT })],
    );
  }
}

function buildSubmission(state: RepositoryState, input: SubmissionInput): Submission {
  const parsedInput = submissionInputSchema.parse(input);
  const slug = slugify(parsedInput.title);
  const knownIdea = state.ideas.find((idea) => idea.slug === slug);
  const knownSubmission = state.submissions.find((submission) => submission.slug === slug);

  return {
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
}

export function createPostgresRepository(databaseUrl: string): RuntimeRepository {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 4,
  });

  return {
    rootDir: getAppRootDir(),
    async readState() {
      await ensureState(pool);
      const result = await pool.query("SELECT body FROM runtime_documents WHERE key = 'state'");
      return normalizeRepositoryState(result.rows[0]?.body, {
        runtimeMode: "postgres_runtime",
      });
    },
    async saveState(state) {
      await ensureState(pool);
      const nextState = normalizeRepositoryState({
        ...state,
        generatedAt: nowIso(),
        profile: {
          ...state.profile,
          runtimeMode: "postgres_runtime",
        },
      });
      await pool.query(
        `INSERT INTO runtime_documents (key, body) VALUES ('state', $1::jsonb)
         ON CONFLICT (key) DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()`,
        [JSON.stringify(nextState)],
      );
    },
    async addSubmission(input) {
      await ensureState(pool);
      const state = await this.readState();
      const submission = buildSubmission(state, input);
      await this.saveState({
        ...state,
        submissions: [submission, ...state.submissions],
      });
      return submission;
    },
    async writeMorningReport(markdown) {
      await ensureState(pool);
      await pool.query(
        `INSERT INTO runtime_documents (key, body) VALUES ('morning_report', $1::jsonb)
         ON CONFLICT (key) DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()`,
        [JSON.stringify({ markdown })],
      );
    },
    async readMorningReport() {
      await ensureState(pool);
      const result = await pool.query("SELECT body FROM runtime_documents WHERE key = 'morning_report'");
      return (result.rows[0]?.body as { markdown?: string } | undefined)?.markdown ?? DEFAULT_REPORT;
    },
  };
}
