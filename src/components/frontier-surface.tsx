"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Idea } from "@/lib/types";

interface FrontierSurfaceProps {
  ideas: Idea[];
}

export function FrontierSurface({ ideas }: FrontierSurfaceProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredIdeas = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) {
      return ideas;
    }

    return ideas.filter((idea) => {
      return [idea.name, idea.thesis, idea.mainRisk, idea.nextMove].some((field) =>
        field.toLowerCase().includes(normalized),
      );
    });
  }, [deferredQuery, ideas]);

  return (
    <section className="surface surface-frontier">
      <div className="surface-heading">
        <div>
          <p className="eyebrow">Frontier board</p>
          <h2>Contest the strongest candidates before they harden into specs.</h2>
        </div>
        <label className="query-field">
          <span>Filter</span>
          <input
            aria-label="Filter ideas"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ideas, risks, next moves"
            value={query}
          />
        </label>
      </div>

      <div className="idea-grid">
        {filteredIdeas.map((idea) => (
          <article className="idea-row" key={idea.id}>
            <div className="idea-header">
              <div>
                <p className="idea-stage">{idea.stage}</p>
                <h3>{idea.name}</h3>
              </div>
              <div className="idea-badges">
                <span className={`priority-badge priority-${idea.priority}`}>{idea.priority}</span>
                <span className={`attention-badge attention-${idea.attentionTier}`}>{idea.attentionTier}</span>
              </div>
            </div>
            <p className="idea-thesis">{idea.thesis}</p>
            <dl className="idea-meta">
              <div>
                <dt>Main risk</dt>
                <dd>{idea.mainRisk}</dd>
              </div>
              <div>
                <dt>KR boundary</dt>
                <dd>{idea.krRelationship}</dd>
              </div>
              <div>
                <dt>KR dependency</dt>
                <dd>{idea.krDependencyStatus}</dd>
              </div>
              <div>
                <dt>Next move</dt>
                <dd>{idea.nextMove}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
