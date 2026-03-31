"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

const INITIAL_STATE = {
  title: "",
  context: "",
  whyNow: "",
  desiredOutcome: "",
};

export function SubmissionForm() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_STATE);
  const [status, setStatus] = useState<string>("Owner submissions land in the inbox and are triaged, not auto-promoted.");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setStatus("Submitting to the intake queue...");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { submission?: { status: string; reviewNote?: string }; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Submission failed.");
      }

      setForm(INITIAL_STATE);
      setStatus(
        payload.submission?.reviewNote
          ? payload.submission.reviewNote
          : `Submission accepted with status: ${payload.submission?.status ?? "queued"}.`,
      );
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      <label>
        <span>Idea title</span>
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Lecture ingestion ledger"
          required
        />
      </label>
      <label>
        <span>Context</span>
        <textarea
          value={form.context}
          onChange={(event) => setForm((current) => ({ ...current, context: event.target.value }))}
          placeholder="What real study bottleneck is this attacking?"
          required
          rows={4}
        />
      </label>
      <label>
        <span>Why now</span>
        <textarea
          value={form.whyNow}
          onChange={(event) => setForm((current) => ({ ...current, whyNow: event.target.value }))}
          placeholder="Why should the control tower think about this now?"
          required
          rows={3}
        />
      </label>
      <label>
        <span>Desired outcome</span>
        <textarea
          value={form.desiredOutcome}
          onChange={(event) => setForm((current) => ({ ...current, desiredOutcome: event.target.value }))}
          placeholder="What kind of artifact should come back from the system?"
          required
          rows={3}
        />
      </label>
      <div className="submission-actions">
        <button disabled={isPending} type="submit">
          {isPending ? "Submitting..." : "Submit to control tower"}
        </button>
        <p>{status}</p>
      </div>
    </form>
  );
}
