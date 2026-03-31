import { FrontierSurface } from "@/components/frontier-surface";
import { RuntimeActions } from "@/components/runtime-actions";
import { SubmissionForm } from "@/components/submission-form";
import { getDashboardSnapshot } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { state, headlineFreshness, latestRun, morningReport, unresolvedFlags, latestFrontierCritiques } =
    await getDashboardSnapshot();
  const deepAttentionIdeas = state.ideas.filter((idea) => idea.attentionTier === "deep");

  return (
    <main className="dashboard-shell">
      <section className="masthead">
        <div className="masthead-copy">
          <p className="eyebrow">IsIdeas / Control Tower</p>
          <h1>Codex-led command for the future personal Islamic hub.</h1>
          <p className="masthead-summary">
            This surface is the command layer, not the knowledge layer itself. It keeps breadth running in the
            background while forcing the best ideas through integrity gates before they become specs.
          </p>
        </div>
        <div className="masthead-metrics">
          <div>
            <span>Runtime mode</span>
            <strong>{state.profile.runtimeMode}</strong>
          </div>
          <div>
            <span>Latest run</span>
            <strong>{headlineFreshness}</strong>
          </div>
          <div>
            <span>Frontier lane</span>
            <strong>{state.ideas.filter((idea) => idea.priority === "frontier").length} ideas</strong>
          </div>
          <div>
            <span>Deep attention</span>
            <strong>{deepAttentionIdeas.length} workspaces</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="column-main">
          <FrontierSurface ideas={state.ideas} />

          <section className="surface">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Bottleneck map</p>
                <h2>Work the deep recurring losses, not feature excitement.</h2>
              </div>
            </div>
            <div className="bottleneck-list">
              {state.bottlenecks.map((bottleneck) => (
                <article className="bottleneck-row" key={bottleneck.id}>
                  <div>
                    <p className="bottleneck-score">Leverage {bottleneck.leverageScore}/10</p>
                    <h3>{bottleneck.title}</h3>
                  </div>
                  <p>{bottleneck.whyItMatters}</p>
                  <p className="bottleneck-note">{bottleneck.uncertaintyNote}</p>
                  <p className="bottleneck-next">{bottleneck.nextMove}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="surface">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Challenge Record</p>
                <h2>Frontier status stays tied to independent critique.</h2>
              </div>
            </div>
            <div className="tool-list">
              {latestFrontierCritiques.map(({ idea, artifact }) => (
                <article className="tool-row" key={idea.id}>
                  <div>
                    <p className="tool-status">{artifact?.verdict ?? "pending"}</p>
                    <h3>{idea.name}</h3>
                  </div>
                  <p>{artifact?.findingsSummary ?? "No independent critique artifact recorded yet."}</p>
                  <span>{artifact ? `${artifact.reviewer} / ${artifact.reviewedAt}` : "awaiting critique"}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="surface">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Research and tooling</p>
                <h2>Adopt the strongest substrate, don&apos;t rewrite it.</h2>
              </div>
            </div>
            <div className="tool-list">
              {state.tools.map((tool) => (
                <article className="tool-row" key={tool.id}>
                  <div>
                    <p className="tool-status">{tool.status}</p>
                    <h3>{tool.name}</h3>
                  </div>
                  <p>{tool.note}</p>
                  <a href={tool.url} rel="noreferrer" target="_blank">
                    {tool.category}
                  </a>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="column-side">
          <section className="surface surface-rail">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Integrity rail</p>
                <h2>Silent corruption outranks convenience as the main enemy.</h2>
              </div>
            </div>
            <div className="integrity-list">
              {unresolvedFlags.map((flag) => (
                <article className={`integrity-item severity-${flag.severity}`} key={flag.id}>
                  <p>{flag.severity}</p>
                  <h3>{flag.title}</h3>
                  <p>{flag.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="surface surface-console">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Runtime console</p>
                <h2>Run the local control tower and inspect the autonomous loops.</h2>
              </div>
            </div>
            <RuntimeActions />
            <div className="loop-list">
              {state.loops.map((loop) => (
                <article className="loop-row" key={loop.id}>
                  <div>
                    <p className={`loop-status loop-${loop.status}`}>{loop.status}</p>
                    <h3>{loop.name}</h3>
                  </div>
                  <p>{loop.purpose}</p>
                  <p>{loop.lastOutcome}</p>
                  <span>
                    {loop.cadence} / stale after {loop.staleAfterHours}h
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="surface surface-submission">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Owner intake</p>
                <h2>Inject ideas without stealing the steering wheel.</h2>
              </div>
            </div>
            <SubmissionForm />
            <div className="submission-list">
              {state.submissions.slice(0, 4).map((submission) => (
                <article className="submission-row" key={submission.id}>
                  <div>
                    <p className="submission-status">{submission.status}</p>
                    <h3>{submission.title}</h3>
                  </div>
                  <p>{submission.reviewNote ?? submission.context}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="surface surface-report">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Morning report</p>
                <h2>{latestRun?.focus ?? "Bootstrap report"}</h2>
              </div>
            </div>
            <pre>{morningReport}</pre>
          </section>
        </div>
      </section>
    </main>
  );
}
