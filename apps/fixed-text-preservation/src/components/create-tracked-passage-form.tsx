"use client";

import { useActionState } from "react";

import { createTrackedPassageAction } from "@/app/actions";
import {
  INITIAL_FORM_ACTION_STATE,
  type FormActionState,
} from "@/lib/actions/form-state";
import type { SurahReferenceSummary } from "@/lib/types";

interface CreateTrackedPassageFormProps {
  surahs: SurahReferenceSummary[];
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

export function CreateTrackedPassageForm({
  surahs,
}: CreateTrackedPassageFormProps) {
  const [state, formAction, pending] = useActionState(
    createTrackedPassageAction,
    INITIAL_FORM_ACTION_STATE,
  );

  return (
    <form action={formAction} className="panel form-panel">
      <div className="section-heading">
        <div>
          <h2>Create tracked passage</h2>
          <p>
            Manually define one ayah-bounded passage. New passages stay pending
            until the first recorded clean review.
          </p>
        </div>
      </div>

      <label className="field">
        <span>Passage label</span>
        <input name="label" type="text" placeholder="Juz 30 opening review set" />
        <FieldError state={state} field="label" />
      </label>

      <label className="field">
        <span>Surah</span>
        <select name="surahNumber" defaultValue="1">
          {surahs.map((surah) => (
            <option key={surah.surahNumber} value={surah.surahNumber}>
              {surah.surahNumber}. {surah.transliteration} ({surah.totalAyahs} ayat)
            </option>
          ))}
        </select>
        <FieldError state={state} field="surahNumber" />
      </label>

      <div className="field-grid">
        <label className="field">
          <span>Start ayah</span>
          <input name="ayahStart" type="number" min={1} defaultValue={1} />
          <FieldError state={state} field="ayahStart" />
        </label>

        <label className="field">
          <span>End ayah</span>
          <input name="ayahEnd" type="number" min={1} defaultValue={1} />
          <FieldError state={state} field="ayahEnd" />
        </label>
      </div>

      {state.message ? <p className="form-message">{state.message}</p> : null}

      <button type="submit" className="button" disabled={pending}>
        {pending ? "Saving..." : "Create tracked passage"}
      </button>
    </form>
  );
}
