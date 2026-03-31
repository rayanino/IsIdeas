import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/status-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { OUTCOME_STATE_LABELS } from "@/lib/config";
import { getRepository } from "@/lib/db/repository";
import {
  formatDate,
  formatDateTime,
  formatPassageRange,
} from "@/lib/format";

export default async function PassageDetailPage({
  params,
}: {
  params: Promise<{ trackedPassageId: string }>;
}) {
  const { trackedPassageId } = await params;
  const detail = getRepository().getPassageDetail(trackedPassageId);

  if (!detail) {
    notFound();
  }

  return (
    <section className="stack">
      <article className="panel detail-hero">
        <div className="card-header">
          <div>
            <p className="eyebrow">{formatPassageRange(detail.trackedPassage)}</p>
            <h2>{detail.trackedPassage.label}</h2>
          </div>
          <StatusBadge
            trackingStatus={detail.trackedPassage.trackingStatus}
            preservationState={detail.trackedPassage.currentPreservationState}
          />
        </div>

        <div className="detail-metrics">
          <div>
            <span className="metric-label">Next due</span>
            <strong>{formatDate(detail.trackedPassage.nextDueAt)}</strong>
          </div>
          <div>
            <span className="metric-label">Consecutive clean after relearn</span>
            <strong>{detail.trackedPassage.consecutiveCleanSinceRelearn}</strong>
          </div>
          <div>
            <span className="metric-label">Last recorded review</span>
            <strong>{formatDateTime(detail.trackedPassage.lastReviewedAt)}</strong>
          </div>
        </div>

        <p className="meta-copy">
          Stable means lower current urgency only. It does not imply guaranteed
          safety or that the app verified correctness.
        </p>

        <Link className="button" href="/review-events/new">
          Record a review event
        </Link>
      </article>

      <article className="panel">
        <div className="section-heading">
          <div>
            <h3>Passage text</h3>
            <p>Seeded from the provisional local Qur'an reference package.</p>
          </div>
        </div>

        <ol className="ayah-list">
          {detail.ayahs.map((ayah) => (
            <li key={`${ayah.surahNumber}-${ayah.ayahNumber}`} className="ayah-line">
              <span className="ayah-number">{ayah.ayahNumber}</span>
              <span className="ayah-text" lang="ar" dir="rtl">
                {ayah.uthmaniText}
              </span>
            </li>
          ))}
        </ol>
      </article>

      <article className="panel">
        <div className="section-heading">
          <div>
            <h3>Review history</h3>
            <p>
              Every entry keeps its human-entered verification mode visible. No
              outcome here implies automated checking.
            </p>
          </div>
        </div>

        {detail.reviewEvents.length === 0 ? (
          <p className="meta-copy">No review events have been recorded yet.</p>
        ) : (
          <div className="history-list">
            {detail.reviewEvents.map((event) => (
              <article key={event.reviewEventId} className="history-card">
                <div className="card-header">
                  <div>
                    <h4>{OUTCOME_STATE_LABELS[event.outcomeState]}</h4>
                    <p className="meta-copy">{formatDateTime(event.reviewedAt)}</p>
                  </div>
                  <VerificationBadge verificationMode={event.verificationMode} />
                </div>

                {event.note ? <p className="history-note">{event.note}</p> : null}
              </article>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
