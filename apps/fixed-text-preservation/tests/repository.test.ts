import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resetDatabaseForTests } from "@/lib/db/database";
import { FixedTextRepository } from "@/lib/db/repository";

describe("FixedTextRepository", () => {
  let temporaryDirectory: string;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(
      path.join(os.tmpdir(), "fixed-text-preservation-tests-"),
    );
    process.env.FIXED_TEXT_PRESERVATION_DB_PATH = path.join(
      temporaryDirectory,
      "test.sqlite",
    );
    resetDatabaseForTests();
  });

  afterEach(() => {
    resetDatabaseForTests();
    delete process.env.FIXED_TEXT_PRESERVATION_DB_PATH;
    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it("recomputes tracked-passage state from chronologically sorted review history", () => {
    const repository = new FixedTextRepository();
    const trackedPassageId = repository.createTrackedPassage({
      label: "Backdated review regression",
      surahNumber: 1,
      ayahStart: 1,
      ayahEnd: 3,
    });

    repository.recordReviewEvent({
      trackedPassageId,
      reviewedAt: "2026-03-05T09:00:00.000Z",
      verificationMode: "self_checked",
      outcomeState: "clean",
      note: null,
    });

    repository.recordReviewEvent({
      trackedPassageId,
      reviewedAt: "2026-03-10T09:00:00.000Z",
      verificationMode: "self_checked",
      outcomeState: "clean",
      note: null,
    });

    repository.recordReviewEvent({
      trackedPassageId,
      reviewedAt: "2026-03-08T09:00:00.000Z",
      verificationMode: "teacher_checked",
      outcomeState: "break",
      note: "Inserted after the later clean.",
    });

    const detail = repository.getPassageDetail(trackedPassageId);

    expect(detail).not.toBeNull();
    expect(detail?.trackedPassage.currentPreservationState).toBe("watch");
    expect(detail?.trackedPassage.nextDueAt).toBe("2026-03-13T09:00:00.000Z");
    expect(detail?.trackedPassage.consecutiveCleanSinceRelearn).toBe(1);
    expect(detail?.trackedPassage.lastReviewedAt).toBe("2026-03-10T09:00:00.000Z");
    expect(detail?.trackedPassage.lastOutcomeState).toBe("clean");
    expect(detail?.reviewEvents.map((event) => event.outcomeState)).toEqual([
      "clean",
      "break",
      "clean",
    ]);
  });
});
