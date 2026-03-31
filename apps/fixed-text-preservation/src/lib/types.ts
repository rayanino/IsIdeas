export type VerificationMode =
  | "self_checked"
  | "peer_checked"
  | "teacher_checked";

export type OutcomeState = "clean" | "hesitant" | "break" | "fail";

export type TrackingStatus = "pending_acquisition_gate" | "active";

export type PreservationState = "relearn_soon" | "watch" | "stable";

export interface QuranReferenceAyah {
  surahNumber: number;
  ayahNumber: number;
  uthmaniText: string;
}

export interface SurahReferenceSummary {
  surahNumber: number;
  arabicName: string;
  transliteration: string;
  totalAyahs: number;
}

export interface PassageDefinition {
  passageId: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  label: string;
}

export interface TrackedPassage {
  trackedPassageId: string;
  passageId: string;
  trackingStatus: TrackingStatus;
  currentPreservationState: PreservationState | null;
  nextDueAt: string | null;
  consecutiveCleanSinceRelearn: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewEvent {
  reviewEventId: string;
  trackedPassageId: string;
  reviewedAt: string;
  verificationMode: VerificationMode;
  outcomeState: OutcomeState;
  note: string | null;
}

export interface PassageSummary extends PassageDefinition, TrackedPassage {
  lastReviewedAt: string | null;
  lastVerificationMode: VerificationMode | null;
  lastOutcomeState: OutcomeState | null;
}

export interface PassageDetail {
  trackedPassage: PassageSummary;
  ayahs: QuranReferenceAyah[];
  reviewEvents: ReviewEvent[];
}

export interface ReviewEventInput {
  trackedPassageId: string;
  reviewedAt: string;
  verificationMode: VerificationMode;
  outcomeState: OutcomeState;
  note: string | null;
}
