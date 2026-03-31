import { randomUUID } from "node:crypto";

import { getDatabase } from "@/lib/db/database";
import { computeTrackedPassageStateFromReviewHistory } from "@/lib/preservation/logic";
import { sortDueQueue } from "@/lib/preservation/queue";
import { getQuranReferenceAdapter } from "@/lib/quran-reference/adapter";
import type {
  PassageDetail,
  PassageSummary,
  ReviewEvent,
  ReviewEventInput,
  TrackedPassage,
} from "@/lib/types";

function nowIsoString(): string {
  return new Date().toISOString();
}

export interface CreateTrackedPassageInput {
  label: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
}

function mapTrackedPassage(row: Record<string, unknown>): TrackedPassage {
  return {
    trackedPassageId: row.trackedPassageId as string,
    passageId: row.passageId as string,
    trackingStatus: row.trackingStatus as TrackedPassage["trackingStatus"],
    currentPreservationState:
      (row.currentPreservationState as TrackedPassage["currentPreservationState"]) ??
      null,
    nextDueAt: (row.nextDueAt as string | null) ?? null,
    consecutiveCleanSinceRelearn: row.consecutiveCleanSinceRelearn as number,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

function mapPassageSummary(row: Record<string, unknown>): PassageSummary {
  return {
    ...mapTrackedPassage(row),
    passageId: row.passageId as string,
    surahNumber: row.surahNumber as number,
    ayahStart: row.ayahStart as number,
    ayahEnd: row.ayahEnd as number,
    label: row.label as string,
    lastReviewedAt: (row.lastReviewedAt as string | null) ?? null,
    lastVerificationMode:
      (row.lastVerificationMode as PassageSummary["lastVerificationMode"]) ?? null,
    lastOutcomeState:
      (row.lastOutcomeState as PassageSummary["lastOutcomeState"]) ?? null,
  };
}

function mapReviewEvent(row: Record<string, unknown>): ReviewEvent {
  return {
    reviewEventId: row.reviewEventId as string,
    trackedPassageId: row.trackedPassageId as string,
    reviewedAt: row.reviewedAt as string,
    verificationMode: row.verificationMode as ReviewEvent["verificationMode"],
    outcomeState: row.outcomeState as ReviewEvent["outcomeState"],
    note: (row.note as string | null) ?? null,
  };
}

export class FixedTextRepository {
  private readonly database = getDatabase();

  listDueQueue(): PassageSummary[] {
    const rows = this.database
      .prepare(
        `
          SELECT
            tp.tracked_passage_id AS trackedPassageId,
            tp.passage_id AS passageId,
            tp.tracking_status AS trackingStatus,
            tp.current_preservation_state AS currentPreservationState,
            tp.next_due_at AS nextDueAt,
            tp.consecutive_clean_since_relearn AS consecutiveCleanSinceRelearn,
            tp.created_at AS createdAt,
            tp.updated_at AS updatedAt,
            pd.surah_number AS surahNumber,
            pd.ayah_start AS ayahStart,
            pd.ayah_end AS ayahEnd,
            pd.label AS label,
            last_event.reviewed_at AS lastReviewedAt,
            last_event.verification_mode AS lastVerificationMode,
            last_event.outcome_state AS lastOutcomeState
          FROM tracked_passage tp
          INNER JOIN passage_definition pd
            ON pd.passage_id = tp.passage_id
          LEFT JOIN review_event last_event
            ON last_event.review_event_id = (
              SELECT re.review_event_id
              FROM review_event re
              WHERE re.tracked_passage_id = tp.tracked_passage_id
              ORDER BY re.reviewed_at DESC, re.rowid DESC
              LIMIT 1
            )
          WHERE tp.tracking_status = 'active'
            AND tp.next_due_at IS NOT NULL
        `,
      )
      .all() as Record<string, unknown>[];

    return sortDueQueue(rows.map(mapPassageSummary));
  }

  listTrackedPassages(): PassageSummary[] {
    const rows = this.database
      .prepare(
        `
          SELECT
            tp.tracked_passage_id AS trackedPassageId,
            tp.passage_id AS passageId,
            tp.tracking_status AS trackingStatus,
            tp.current_preservation_state AS currentPreservationState,
            tp.next_due_at AS nextDueAt,
            tp.consecutive_clean_since_relearn AS consecutiveCleanSinceRelearn,
            tp.created_at AS createdAt,
            tp.updated_at AS updatedAt,
            pd.surah_number AS surahNumber,
            pd.ayah_start AS ayahStart,
            pd.ayah_end AS ayahEnd,
            pd.label AS label,
            last_event.reviewed_at AS lastReviewedAt,
            last_event.verification_mode AS lastVerificationMode,
            last_event.outcome_state AS lastOutcomeState
          FROM tracked_passage tp
          INNER JOIN passage_definition pd
            ON pd.passage_id = tp.passage_id
          LEFT JOIN review_event last_event
            ON last_event.review_event_id = (
              SELECT re.review_event_id
              FROM review_event re
              WHERE re.tracked_passage_id = tp.tracked_passage_id
              ORDER BY re.reviewed_at DESC, re.rowid DESC
              LIMIT 1
            )
          ORDER BY tp.created_at DESC, tp.tracked_passage_id DESC
        `,
      )
      .all() as Record<string, unknown>[];

    return rows.map(mapPassageSummary);
  }

  listTrackedPassageOptions(): Pick<PassageSummary, "trackedPassageId" | "label">[] {
    return this.listTrackedPassages().map((passage) => ({
      trackedPassageId: passage.trackedPassageId,
      label: passage.label,
    }));
  }

  getPassageDetail(trackedPassageId: string): PassageDetail | null {
    const row = this.database
      .prepare(
        `
          SELECT
            tp.tracked_passage_id AS trackedPassageId,
            tp.passage_id AS passageId,
            tp.tracking_status AS trackingStatus,
            tp.current_preservation_state AS currentPreservationState,
            tp.next_due_at AS nextDueAt,
            tp.consecutive_clean_since_relearn AS consecutiveCleanSinceRelearn,
            tp.created_at AS createdAt,
            tp.updated_at AS updatedAt,
            pd.surah_number AS surahNumber,
            pd.ayah_start AS ayahStart,
            pd.ayah_end AS ayahEnd,
            pd.label AS label,
            last_event.reviewed_at AS lastReviewedAt,
            last_event.verification_mode AS lastVerificationMode,
            last_event.outcome_state AS lastOutcomeState
          FROM tracked_passage tp
          INNER JOIN passage_definition pd
            ON pd.passage_id = tp.passage_id
          LEFT JOIN review_event last_event
            ON last_event.review_event_id = (
              SELECT re.review_event_id
              FROM review_event re
              WHERE re.tracked_passage_id = tp.tracked_passage_id
              ORDER BY re.reviewed_at DESC, re.rowid DESC
              LIMIT 1
            )
          WHERE tp.tracked_passage_id = ?
        `,
      )
      .get(trackedPassageId) as Record<string, unknown> | undefined;

    if (!row) {
      return null;
    }

    const summary = mapPassageSummary(row);
    const reviewRows = this.database
      .prepare(
        `
          SELECT
            review_event_id AS reviewEventId,
            tracked_passage_id AS trackedPassageId,
            reviewed_at AS reviewedAt,
            verification_mode AS verificationMode,
            outcome_state AS outcomeState,
            note
          FROM review_event
          WHERE tracked_passage_id = ?
          ORDER BY reviewed_at DESC, rowid DESC
        `,
      )
      .all(trackedPassageId) as Record<string, unknown>[];

    const ayahs = getQuranReferenceAdapter().getAyahRange(
      summary.surahNumber,
      summary.ayahStart,
      summary.ayahEnd,
    );

    return {
      trackedPassage: summary,
      ayahs,
      reviewEvents: reviewRows.map(mapReviewEvent),
    };
  }

  createTrackedPassage(input: CreateTrackedPassageInput): string {
    const passageId = randomUUID();
    const trackedPassageId = randomUUID();
    const timestamp = nowIsoString();

    const createTrackedPassageTransaction = this.database.transaction(() => {
      this.database
        .prepare(
          `
            INSERT INTO passage_definition (
              passage_id,
              surah_number,
              ayah_start,
              ayah_end,
              label
            ) VALUES (?, ?, ?, ?, ?)
          `,
        )
        .run(
          passageId,
          input.surahNumber,
          input.ayahStart,
          input.ayahEnd,
          input.label,
        );

      this.database
        .prepare(
          `
            INSERT INTO tracked_passage (
              tracked_passage_id,
              passage_id,
              tracking_status,
              current_preservation_state,
              next_due_at,
              consecutive_clean_since_relearn,
              created_at,
              updated_at
            ) VALUES (?, ?, 'pending_acquisition_gate', NULL, NULL, 0, ?, ?)
          `,
        )
        .run(trackedPassageId, passageId, timestamp, timestamp);
    });

    createTrackedPassageTransaction();
    return trackedPassageId;
  }

  recordReviewEvent(input: ReviewEventInput): void {
    const trackedPassageRow = this.database
      .prepare(
        `
          SELECT
            tracked_passage_id AS trackedPassageId,
            passage_id AS passageId,
            tracking_status AS trackingStatus,
            current_preservation_state AS currentPreservationState,
            next_due_at AS nextDueAt,
            consecutive_clean_since_relearn AS consecutiveCleanSinceRelearn,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM tracked_passage
          WHERE tracked_passage_id = ?
        `,
      )
      .get(input.trackedPassageId) as Record<string, unknown> | undefined;

    if (!trackedPassageRow) {
      throw new Error("Tracked passage not found.");
    }
    const reviewEventId = randomUUID();
    const updatedAt = nowIsoString();

    const recordReviewEventTransaction = this.database.transaction(() => {
      this.database
        .prepare(
          `
            INSERT INTO review_event (
              review_event_id,
              tracked_passage_id,
              reviewed_at,
              verification_mode,
              outcome_state,
              note
            ) VALUES (?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          reviewEventId,
          input.trackedPassageId,
          input.reviewedAt,
          input.verificationMode,
          input.outcomeState,
          input.note,
        );

      const orderedReviewEvents = this.database
        .prepare(
          `
            SELECT
              reviewed_at AS reviewedAt,
              outcome_state AS outcomeState
            FROM review_event
            WHERE tracked_passage_id = ?
            ORDER BY reviewed_at ASC, rowid ASC
          `,
        )
        .all(input.trackedPassageId) as Array<{
        reviewedAt: string;
        outcomeState: ReviewEvent["outcomeState"];
      }>;

      const nextState = computeTrackedPassageStateFromReviewHistory(
        orderedReviewEvents,
      );

      this.database
        .prepare(
          `
            UPDATE tracked_passage
            SET
              tracking_status = ?,
              current_preservation_state = ?,
              next_due_at = ?,
              consecutive_clean_since_relearn = ?,
              updated_at = ?
            WHERE tracked_passage_id = ?
          `,
        )
        .run(
          nextState.trackingStatus,
          nextState.currentPreservationState,
          nextState.nextDueAt,
          nextState.consecutiveCleanSinceRelearn,
          updatedAt,
          input.trackedPassageId,
        );
    });

    recordReviewEventTransaction();
  }
}

let repositoryInstance: FixedTextRepository | null = null;

export function getRepository(): FixedTextRepository {
  if (!repositoryInstance) {
    repositoryInstance = new FixedTextRepository();
  }

  return repositoryInstance;
}
