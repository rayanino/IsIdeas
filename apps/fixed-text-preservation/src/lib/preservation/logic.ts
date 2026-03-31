import { PROVISIONAL_SCHEDULING_DAYS } from "@/lib/config";
import type { OutcomeState, ReviewEventInput, TrackedPassage } from "@/lib/types";

export interface PreservationComputationResult {
  trackingStatus: TrackedPassage["trackingStatus"];
  currentPreservationState: TrackedPassage["currentPreservationState"];
  nextDueAt: string | null;
  consecutiveCleanSinceRelearn: number;
}

interface ChronologicalReviewEvent {
  reviewedAt: string;
  outcomeState: OutcomeState;
}

interface PreservationRuntimeState extends PreservationComputationResult {
  recoveryRequired: boolean;
}

function addDays(isoTimestamp: string, days: number): string {
  const date = new Date(isoTimestamp);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function nextDueAt(
  reviewedAt: string,
  preservationState: NonNullable<
    PreservationComputationResult["currentPreservationState"]
  >,
): string {
  return addDays(reviewedAt, PROVISIONAL_SCHEDULING_DAYS[preservationState]);
}

function initialRuntimeState(): PreservationRuntimeState {
  return {
    trackingStatus: "pending_acquisition_gate",
    currentPreservationState: null,
    nextDueAt: null,
    consecutiveCleanSinceRelearn: 0,
    recoveryRequired: false,
  };
}

function applyReviewEvent(
  state: PreservationRuntimeState,
  reviewEvent: ChronologicalReviewEvent,
): PreservationRuntimeState {
  if (state.trackingStatus === "pending_acquisition_gate") {
    if (reviewEvent.outcomeState !== "clean") {
      return {
        ...state,
        consecutiveCleanSinceRelearn: 0,
      };
    }

    return {
      trackingStatus: "active",
      currentPreservationState: "stable",
      nextDueAt: nextDueAt(reviewEvent.reviewedAt, "stable"),
      consecutiveCleanSinceRelearn: 0,
      recoveryRequired: false,
    };
  }

  if (reviewEvent.outcomeState === "break" || reviewEvent.outcomeState === "fail") {
    return {
      trackingStatus: "active",
      currentPreservationState: "relearn_soon",
      nextDueAt: nextDueAt(reviewEvent.reviewedAt, "relearn_soon"),
      consecutiveCleanSinceRelearn: 0,
      recoveryRequired: true,
    };
  }

  if (reviewEvent.outcomeState === "hesitant") {
    return {
      trackingStatus: "active",
      currentPreservationState: "watch",
      nextDueAt: nextDueAt(reviewEvent.reviewedAt, "watch"),
      consecutiveCleanSinceRelearn: 0,
      recoveryRequired: state.recoveryRequired,
    };
  }

  if (!state.recoveryRequired) {
    return {
      trackingStatus: "active",
      currentPreservationState: "stable",
      nextDueAt: nextDueAt(reviewEvent.reviewedAt, "stable"),
      consecutiveCleanSinceRelearn: 0,
      recoveryRequired: false,
    };
  }

  const nextConsecutiveCleanCount = state.consecutiveCleanSinceRelearn + 1;

  if (nextConsecutiveCleanCount >= 2) {
    return {
      trackingStatus: "active",
      currentPreservationState: "stable",
      nextDueAt: nextDueAt(reviewEvent.reviewedAt, "stable"),
      consecutiveCleanSinceRelearn: 0,
      recoveryRequired: false,
    };
  }

  return {
    trackingStatus: "active",
    currentPreservationState: "watch",
    nextDueAt: nextDueAt(reviewEvent.reviewedAt, "watch"),
    consecutiveCleanSinceRelearn: nextConsecutiveCleanCount,
    recoveryRequired: true,
  };
}

export function sortReviewEventsChronologically<
  T extends Pick<ReviewEventInput, "reviewedAt">,
>(reviewEvents: T[]): T[] {
  return [...reviewEvents]
    .map((reviewEvent, index) => ({ reviewEvent, index }))
    .sort((left, right) => {
      const timestampOrder = left.reviewEvent.reviewedAt.localeCompare(
        right.reviewEvent.reviewedAt,
      );

      if (timestampOrder !== 0) {
        return timestampOrder;
      }

      return left.index - right.index;
    })
    .map(({ reviewEvent }) => reviewEvent);
}

export function computeTrackedPassageStateFromReviewHistory(
  reviewEvents: ChronologicalReviewEvent[],
): PreservationComputationResult {
  const finalState = sortReviewEventsChronologically(reviewEvents).reduce(
    applyReviewEvent,
    initialRuntimeState(),
  );

  return {
    trackingStatus: finalState.trackingStatus,
    currentPreservationState: finalState.currentPreservationState,
    nextDueAt: finalState.nextDueAt,
    consecutiveCleanSinceRelearn: finalState.consecutiveCleanSinceRelearn,
  };
}
