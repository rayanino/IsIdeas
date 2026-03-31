import { PROVISIONAL_SCHEDULING_DAYS } from "@/lib/config";

export default function SettingsPage() {
  return (
    <section className="stack">
      <article className="panel">
        <div className="section-heading">
          <div>
            <h2>Settings and constants</h2>
            <p>
              These are provisional defaults. They are explicit here so the MVP
              does not hide scheduling logic behind the UI.
            </p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="setting-card">
            <span className="metric-label">Relearn soon</span>
            <strong>{PROVISIONAL_SCHEDULING_DAYS.relearn_soon} day</strong>
          </div>
          <div className="setting-card">
            <span className="metric-label">Watch</span>
            <strong>{PROVISIONAL_SCHEDULING_DAYS.watch} days</strong>
          </div>
          <div className="setting-card">
            <span className="metric-label">Stable</span>
            <strong>{PROVISIONAL_SCHEDULING_DAYS.stable} days</strong>
          </div>
        </div>
      </article>
    </section>
  );
}
