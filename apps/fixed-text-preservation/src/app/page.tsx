import Link from "next/link";
import type { Route } from "next";

import { StatusBadge } from "@/components/status-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { getRepository } from "@/lib/db/repository";
import { formatDate, formatDateTime, formatPassageRange } from "@/lib/format";

export default function DueQueuePage() {
  const dueQueue = getRepository().listDueQueue();

  return (
    <section className="stack">
      <div className="section-heading panel">
        <div>
          <h2>Due queue</h2>
          <p>
            Ordered by preservation urgency, then next due date. State labels are
            provisional scheduling buckets, not verification claims.
          </p>
        </div>
      </div>

      {dueQueue.length === 0 ? (
        <div className="panel empty-state">
          <h3>No active passages are due yet.</h3>
          <p>
            Create a tracked passage, then record a clean review to move it out
            of the acquisition gate.
          </p>
          <Link className="button" href="/tracked-passages">
            Go to tracked passages
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {dueQueue.map((passage) => (
            <article key={passage.trackedPassageId} className="panel queue-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">{formatPassageRange(passage)}</p>
                  <h3>{passage.label}</h3>
                </div>
                <StatusBadge preservationState={passage.currentPreservationState} />
              </div>

              <p className="meta-copy">
                Due {formatDate(passage.nextDueAt)}. Last recorded review{" "}
                {formatDateTime(passage.lastReviewedAt)}.
              </p>

              <div className="tag-row">
                <VerificationBadge verificationMode={passage.lastVerificationMode} />
              </div>

              <Link
                className="text-link"
                href={`/tracked-passages/${passage.trackedPassageId}` as Route}
              >
                Open passage detail
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
