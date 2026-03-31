import { formatPreservationState, formatTrackingStatus } from "@/lib/format";
import type { PreservationState, TrackingStatus } from "@/lib/types";

interface StatusBadgeProps {
  trackingStatus?: TrackingStatus;
  preservationState?: PreservationState | null;
}

export function StatusBadge({
  trackingStatus,
  preservationState,
}: StatusBadgeProps) {
  const className =
    preservationState === "relearn_soon"
      ? "tag tag-danger"
      : preservationState === "watch"
        ? "tag tag-warn"
        : preservationState === "stable"
          ? "tag tag-calm"
          : "tag";

  if (preservationState) {
    return (
      <span className={className}>{formatPreservationState(preservationState)}</span>
    );
  }

  if (trackingStatus) {
    return <span className="tag">{formatTrackingStatus(trackingStatus)}</span>;
  }

  return null;
}
