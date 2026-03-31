import { PRESERVATION_STATE_PRIORITY } from "@/lib/config";
import type { PassageSummary } from "@/lib/types";

export function compareDueQueueItems(
  left: PassageSummary,
  right: PassageSummary,
): number {
  const leftPriority = left.currentPreservationState
    ? PRESERVATION_STATE_PRIORITY[left.currentPreservationState]
    : Number.MAX_SAFE_INTEGER;
  const rightPriority = right.currentPreservationState
    ? PRESERVATION_STATE_PRIORITY[right.currentPreservationState]
    : Number.MAX_SAFE_INTEGER;

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  const leftDueAt = left.nextDueAt ?? "";
  const rightDueAt = right.nextDueAt ?? "";

  if (leftDueAt !== rightDueAt) {
    return leftDueAt.localeCompare(rightDueAt);
  }

  const leftReviewedAt = left.lastReviewedAt ?? "";
  const rightReviewedAt = right.lastReviewedAt ?? "";

  if (leftReviewedAt !== rightReviewedAt) {
    return leftReviewedAt.localeCompare(rightReviewedAt);
  }

  return left.trackedPassageId.localeCompare(right.trackedPassageId);
}

export function sortDueQueue(items: PassageSummary[]): PassageSummary[] {
  return [...items].sort(compareDueQueueItems);
}
