import Link from "next/link";

import { ReviewEventForm } from "@/components/review-event-form";
import { getRepository } from "@/lib/db/repository";
import { toDateTimeLocalValue } from "@/lib/format";

export default function ReviewEventEntryPage() {
  const trackedPassages = getRepository().listTrackedPassageOptions();

  if (trackedPassages.length === 0) {
    return (
      <section className="stack">
        <div className="panel empty-state">
          <h2>No tracked passages available</h2>
          <p>
            Create a tracked passage before recording a review event. The first
            clean review will move it through the acquisition gate.
          </p>
          <Link className="button" href="/tracked-passages">
            Create tracked passage
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <ReviewEventForm
        trackedPassages={trackedPassages}
        defaultReviewedAt={toDateTimeLocalValue(new Date().toISOString())}
      />
    </section>
  );
}
