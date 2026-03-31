import {
  PRESERVATION_STATE_LABELS,
  TRACKING_STATUS_LABELS,
  VERIFICATION_MODE_LABELS,
} from "@/lib/config";
import type {
  PassageSummary,
  PreservationState,
  TrackingStatus,
  VerificationMode,
} from "@/lib/types";

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
});

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "Not recorded";
  }

  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "Not scheduled";
  }

  return dateFormatter.format(new Date(value));
}

export function formatPassageRange(
  passage: Pick<PassageSummary, "surahNumber" | "ayahStart" | "ayahEnd">,
): string {
  return `Surah ${passage.surahNumber}, ayah ${passage.ayahStart}-${passage.ayahEnd}`;
}

export function formatTrackingStatus(status: TrackingStatus): string {
  return TRACKING_STATUS_LABELS[status];
}

export function formatPreservationState(state: PreservationState | null): string {
  if (!state) {
    return "Pending acquisition gate";
  }

  return PRESERVATION_STATE_LABELS[state];
}

export function formatVerificationMode(mode: VerificationMode | null): string {
  if (!mode) {
    return "No recorded review yet";
  }

  return VERIFICATION_MODE_LABELS[mode];
}

export function toDateTimeLocalValue(value: string): string {
  const date = new Date(value);
  const offsetMilliseconds = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMilliseconds)
    .toISOString()
    .slice(0, 16);
}
