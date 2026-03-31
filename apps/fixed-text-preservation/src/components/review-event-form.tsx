"use client";

import { useActionState } from "react";

import { recordReviewEventAction } from "@/app/actions";
import {
  INITIAL_FORM_ACTION_STATE,
  type FormActionState,
} from "@/lib/actions/form-state";
import { OUTCOME_STATE_LABELS, VERIFICATION_MODE_LABELS } from "@/lib/config";

interface ReviewEventFormProps {
  trackedPassages: Array<{
    trackedPassageId: string;
    label: string;
  }>;
  defaultReviewedAt: string;
}

function FieldError({
  state,
  field,
}: {
  state: FormActionState;
  field: string;
}) {
  const error = state.fieldErrors?.[field]?.[0];
  if (!error) {
    return null;
  }

  return <p className="field-error">{error}</p>;
}

export function ReviewEventForm({
  trackedPassages,
  defaultReviewedAt,
}: ReviewEventFormProps) {
  const [state, formAction, pending] = useActionState(
    recordReviewEventAction,
    INITIAL_FORM_ACTION_STATE,
  );

  return (
    <form action={formAction} className="panel form-panel">
      <div className="section-heading">
        <div>
          <h2>Record review event</h2>
          <p>
            The oral review happens outside the app. Record one human-entered
            outcome afterward.
          </p>
        </div>
      </div>

      <label className="field">
        <span>Tracked passage</span>
        <select
          name="trackedPassageId"
          defaultValue={trackedPassages[0]?.trackedPassageId}
        >
          {trackedPassages.map((passage) => (
            <option key={passage.trackedPassageId} value={passage.trackedPassageId}>
              {passage.label}
            </option>
          ))}
        </select>
        <FieldError state={state} field="trackedPassageId" />
      </label>

      <label className="field">
        <span>Reviewed at</span>
        <input
          name="reviewedAt"
          type="datetime-local"
          defaultValue={defaultReviewedAt}
        />
        <FieldError state={state} field="reviewedAt" />
      </label>

      <label className="field">
        <span>Verification mode</span>
        <select name="verificationMode" defaultValue="self_checked">
          {Object.entries(VERIFICATION_MODE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <FieldError state={state} field="verificationMode" />
      </label>

      <label className="field">
        <span>Outcome state</span>
        <select name="outcomeState" defaultValue="clean">
          {Object.entries(OUTCOME_STATE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <FieldError state={state} field="outcomeState" />
      </label>

      <label className="field">
        <span>Note (optional)</span>
        <textarea
          name="note"
          rows={4}
          placeholder="Optional reminder about where the review felt fragile."
        />
        <FieldError state={state} field="note" />
      </label>

      {state.message ? <p className="form-message">{state.message}</p> : null}

      <button type="submit" className="button" disabled={pending}>
        {pending ? "Saving..." : "Save review event"}
      </button>
    </form>
  );
}
