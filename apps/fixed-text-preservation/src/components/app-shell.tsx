import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Fixed-Text Preservation MVP</p>
          <h1>Qur'an-first preservation tracker</h1>
          <p className="hero-note">
            Human-entered review record and due ordering for already memorized
            passages. This app does not verify recitation.
          </p>
        </div>
        <nav className="nav-links">
          <Link href="/">Due queue</Link>
          <Link href="/tracked-passages">Tracked passages</Link>
          <Link href="/review-events/new">Review entry</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </header>

      <main className="content-grid">{children}</main>
    </div>
  );
}
