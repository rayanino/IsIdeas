import Link from "next/link";
import type { Route } from "next";

import { CreateTrackedPassageForm } from "@/components/create-tracked-passage-form";
import { StatusBadge } from "@/components/status-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { getRepository } from "@/lib/db/repository";
import { formatDate, formatPassageRange } from "@/lib/format";
import { getQuranReferenceAdapter } from "@/lib/quran-reference/adapter";

export default function TrackedPassagesPage() {
  const repository = getRepository();
  const trackedPassages = repository.listTrackedPassages();
  const surahs = getQuranReferenceAdapter().listSurahSummaries();

  return (
    <section className="split-layout">
      <CreateTrackedPassageForm surahs={surahs} />

      <div className="stack">
        <div className="section-heading panel">
          <div>
            <h2>Tracked passages</h2>
            <p>
              Active and pending passages only. Nothing here implies that the app
              verified the recitation quality itself.
            </p>
          </div>
        </div>

        {trackedPassages.length === 0 ? (
          <div className="panel empty-state">
            <h3>No passages are being tracked yet.</h3>
            <p>Use the form to define your first ayah-bounded passage.</p>
          </div>
        ) : (
          <div className="stack">
            {trackedPassages.map((passage) => (
              <article key={passage.trackedPassageId} className="panel tracked-card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">{formatPassageRange(passage)}</p>
                    <h3>{passage.label}</h3>
                  </div>
                  <StatusBadge
                    trackingStatus={passage.trackingStatus}
                    preservationState={passage.currentPreservationState}
                  />
                </div>

                <p className="meta-copy">
                  Next due {formatDate(passage.nextDueAt)}. Last recorded review
                  mode is shown explicitly below.
                </p>

                <div className="tag-row">
                  <VerificationBadge verificationMode={passage.lastVerificationMode} />
                </div>

                <Link
                  className="text-link"
                  href={`/tracked-passages/${passage.trackedPassageId}` as Route}
                >
                  Open detail
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
