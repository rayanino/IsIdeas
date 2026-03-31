"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  INITIAL_FORM_ACTION_STATE,
  type FormActionState,
} from "@/lib/actions/form-state";
import { getRepository } from "@/lib/db/repository";
import { getQuranReferenceAdapter } from "@/lib/quran-reference/adapter";

const createTrackedPassageSchema = z.object({
  label: z.string().trim().min(1, "A passage label is required."),
  surahNumber: z.coerce.number().int().min(1).max(114),
  ayahStart: z.coerce.number().int().min(1),
  ayahEnd: z.coerce.number().int().min(1),
});

const recordReviewEventSchema = z.object({
  trackedPassageId: z.string().uuid("Select a tracked passage."),
  reviewedAt: z.string().min(1, "Record when the review happened."),
  verificationMode: z.enum([
    "self_checked",
    "peer_checked",
    "teacher_checked",
  ]),
  outcomeState: z.enum(["clean", "hesitant", "break", "fail"]),
  note: z.string().trim().max(500).optional(),
});

function invalidStateFromZod(error: z.ZodError): FormActionState {
  return {
    message: "Check the form fields and try again.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function invalidState(message: string): FormActionState {
  return {
    ...INITIAL_FORM_ACTION_STATE,
    message,
  };
}

export async function createTrackedPassageAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = createTrackedPassageSchema.safeParse({
    label: formData.get("label"),
    surahNumber: formData.get("surahNumber"),
    ayahStart: formData.get("ayahStart"),
    ayahEnd: formData.get("ayahEnd"),
  });

  if (!parsed.success) {
    return invalidStateFromZod(parsed.error);
  }

  const validation = getQuranReferenceAdapter().validateAyahRange(
    parsed.data.surahNumber,
    parsed.data.ayahStart,
    parsed.data.ayahEnd,
  );

  if (!validation.valid) {
    return invalidState(validation.message ?? "Select a valid ayah range.");
  }

  const trackedPassageId = getRepository().createTrackedPassage(parsed.data);
  revalidatePath("/");
  revalidatePath("/tracked-passages");
  revalidatePath("/review-events/new");
  redirect(`/tracked-passages/${trackedPassageId}`);
}

export async function recordReviewEventAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = recordReviewEventSchema.safeParse({
    trackedPassageId: formData.get("trackedPassageId"),
    reviewedAt: formData.get("reviewedAt"),
    verificationMode: formData.get("verificationMode"),
    outcomeState: formData.get("outcomeState"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return invalidStateFromZod(parsed.error);
  }

  const reviewedAt = new Date(parsed.data.reviewedAt);
  if (Number.isNaN(reviewedAt.getTime())) {
    return invalidState("Record a valid review timestamp.");
  }

  getRepository().recordReviewEvent({
    trackedPassageId: parsed.data.trackedPassageId,
    reviewedAt: reviewedAt.toISOString(),
    verificationMode: parsed.data.verificationMode,
    outcomeState: parsed.data.outcomeState,
    note: parsed.data.note ? parsed.data.note : null,
  });

  revalidatePath("/");
  revalidatePath("/tracked-passages");
  revalidatePath("/review-events/new");
  revalidatePath(`/tracked-passages/${parsed.data.trackedPassageId}`);
  redirect(`/tracked-passages/${parsed.data.trackedPassageId}`);
}
