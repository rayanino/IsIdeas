import type { PreservationState } from "@/lib/types";

export const PROVISIONAL_SCHEDULING_DAYS: Record<PreservationState, number> = {
  relearn_soon: 1,
  watch: 3,
  stable: 7,
};

export const PRESERVATION_STATE_PRIORITY: Record<PreservationState, number> = {
  relearn_soon: 0,
  watch: 1,
  stable: 2,
};

export const VERIFICATION_MODE_LABELS = {
  self_checked: "Self checked",
  peer_checked: "Peer checked",
  teacher_checked: "Teacher checked",
} as const;

export const OUTCOME_STATE_LABELS = {
  clean: "Clean",
  hesitant: "Hesitant",
  break: "Break",
  fail: "Fail",
} as const;

export const PRESERVATION_STATE_LABELS = {
  relearn_soon: "Relearn soon",
  watch: "Watch",
  stable: "Stable",
} as const;

export const TRACKING_STATUS_LABELS = {
  pending_acquisition_gate: "Pending acquisition gate",
  active: "Active",
} as const;
