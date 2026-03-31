import { describe, expect, it } from "vitest";

import { sortDueQueue } from "@/lib/preservation/queue";
import { computeTrackedPassageStateFromReviewHistory } from "@/lib/preservation/logic";
import type { PassageSummary, ReviewEventInput } from "@/lib/types";

function reviewEvent(
  overrides: Partial<ReviewEventInput> = {},
): ReviewEventInput {
  return {
    trackedPassageId: "tracked-1",
    reviewedAt: "2026-03-30T09:00:00.000Z",
    verificationMode: "self_checked",
    outcomeState: "clean",
    note: null,
    ...overrides,
  };
}

function queueItem(
  trackedPassageId: string,
  overrides: Partial<PassageSummary> = {},
): PassageSummary {
  return {
    trackedPassageId,
    passageId: `passage-${trackedPassageId}`,
    trackingStatus: "active",
    currentPreservationState: "stable",
    nextDueAt: "2026-04-06T09:00:00.000Z",
    consecutiveCleanSinceRelearn: 0,
    createdAt: "2026-03-30T08:00:00.000Z",
    updatedAt: "2026-03-30T08:00:00.000Z",
    surahNumber: 1,
    ayahStart: 1,
    ayahEnd: 7,
    label: trackedPassageId,
    lastReviewedAt: "2026-03-30T09:00:00.000Z",
    lastVerificationMode: "self_checked",
    lastOutcomeState: "clean",
    ...overrides,
  };
}

describe("computeTrackedPassageStateFromReviewHistory", () => {
  it("activates a pending passage on the first clean review", () => {
    const result = computeTrackedPassageStateFromReviewHistory([reviewEvent()]);

    expect(result).toEqual({
      trackingStatus: "active",
      currentPreservationState: "stable",
      nextDueAt: "2026-04-06T09:00:00.000Z",
      consecutiveCleanSinceRelearn: 0,
    });
  });

  it("keeps non-clean acquisition-side reviews pending", () => {
    const result = computeTrackedPassageStateFromReviewHistory([
      reviewEvent({ outcomeState: "hesitant" }),
    ]);

    expect(result).toEqual({
      trackingStatus: "pending_acquisition_gate",
      currentPreservationState: null,
      nextDueAt: null,
      consecutiveCleanSinceRelearn: 0,
    });
  });

  it("requires two later consecutive clean reviews after an interrupted recovery", () => {
    const result = computeTrackedPassageStateFromReviewHistory([
      reviewEvent({
        reviewedAt: "2026-03-29T09:00:00.000Z",
        outcomeState: "clean",
      }),
      reviewEvent({
        reviewedAt: "2026-03-30T09:00:00.000Z",
        outcomeState: "break",
      }),
      reviewEvent({
        reviewedAt: "2026-03-31T09:00:00.000Z",
        outcomeState: "clean",
      }),
      reviewEvent({
        reviewedAt: "2026-04-01T09:00:00.000Z",
        outcomeState: "hesitant",
      }),
      reviewEvent({
        reviewedAt: "2026-04-02T09:00:00.000Z",
        outcomeState: "clean",
      }),
    ]);

    expect(result).toEqual({
      trackingStatus: "active",
      currentPreservationState: "watch",
      nextDueAt: "2026-04-05T09:00:00.000Z",
      consecutiveCleanSinceRelearn: 1,
    });
  });

  it("returns to stable after the second later consecutive clean", () => {
    const result = computeTrackedPassageStateFromReviewHistory([
      reviewEvent({
        reviewedAt: "2026-03-29T09:00:00.000Z",
        outcomeState: "clean",
      }),
      reviewEvent({
        reviewedAt: "2026-03-30T09:00:00.000Z",
        outcomeState: "break",
      }),
      reviewEvent({
        reviewedAt: "2026-03-31T09:00:00.000Z",
        outcomeState: "clean",
      }),
      reviewEvent({
        reviewedAt: "2026-04-01T09:00:00.000Z",
        outcomeState: "hesitant",
      }),
      reviewEvent({
        reviewedAt: "2026-04-02T09:00:00.000Z",
        outcomeState: "clean",
      }),
      reviewEvent({
        reviewedAt: "2026-04-03T09:00:00.000Z",
        outcomeState: "clean",
      }),
    ]);

    expect(result).toEqual({
      trackingStatus: "active",
      currentPreservationState: "stable",
      nextDueAt: "2026-04-10T09:00:00.000Z",
      consecutiveCleanSinceRelearn: 0,
    });
  });
});

describe("sortDueQueue", () => {
  it("orders by urgency, next due date, last review timestamp, then tracked passage id", () => {
    const ordered = sortDueQueue([
      queueItem("stable-earlier", {
        currentPreservationState: "stable",
        nextDueAt: "2026-04-01T09:00:00.000Z",
      }),
      queueItem("watch-later-reviewed", {
        currentPreservationState: "watch",
        nextDueAt: "2026-04-01T09:00:00.000Z",
        lastReviewedAt: "2026-03-30T11:00:00.000Z",
      }),
      queueItem("relearn-latest", {
        currentPreservationState: "relearn_soon",
        nextDueAt: "2026-04-05T09:00:00.000Z",
      }),
      queueItem("watch-earlier-reviewed", {
        currentPreservationState: "watch",
        nextDueAt: "2026-04-01T09:00:00.000Z",
        lastReviewedAt: "2026-03-29T11:00:00.000Z",
      }),
      queueItem("watch-earlier-reviewed-b", {
        currentPreservationState: "watch",
        nextDueAt: "2026-04-01T09:00:00.000Z",
        lastReviewedAt: "2026-03-29T11:00:00.000Z",
      }),
    ]);

    expect(ordered.map((item) => item.trackedPassageId)).toEqual([
      "relearn-latest",
      "watch-earlier-reviewed",
      "watch-earlier-reviewed-b",
      "watch-later-reviewed",
      "stable-earlier",
    ]);
  });
});
