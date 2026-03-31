"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

export function RuntimeActions() {
  const router = useRouter();
  const [status, setStatus] = useState("Manual runtime tick available.");
  const [pendingAction, setPendingAction] = useState<"tick" | "redteam" | null>(null);

  async function runAction(action: "tick" | "redteam") {
    setPendingAction(action);
    setStatus(action === "tick" ? "Running autonomous tick..." : "Running independent red-team critique...");

    try {
      const response = await fetch(action === "tick" ? "/api/runtime/tick" : "/api/runtime/red-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: action === "redteam" ? JSON.stringify({ mode: "manual" }) : undefined,
      });
      const payload = (await response.json()) as {
        run?: { focus: string };
        artifact?: { verdict?: string; findingsSummary?: string };
        skipped?: boolean;
        reason?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Runtime tick failed.");
      }

      if (action === "redteam") {
        if (payload.skipped) {
          setStatus(payload.reason ?? "Red-team run skipped honestly.");
        } else {
          setStatus(
            payload.artifact?.verdict
              ? `Red-team critique finished with verdict: ${payload.artifact.verdict}.`
              : payload.run
                ? `Red-team critique finished. Focus: ${payload.run.focus}`
                : "Red-team critique finished.",
          );
        }
      } else {
        setStatus(payload.run ? `Tick finished. Focus: ${payload.run.focus}` : "Tick finished.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : `${action} failed.`);
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="runtime-actions">
      <button disabled={pendingAction !== null} onClick={() => runAction("tick")} type="button">
        {pendingAction === "tick" ? "Running..." : "Run manual tick"}
      </button>
      <button disabled={pendingAction !== null} onClick={() => runAction("redteam")} type="button">
        {pendingAction === "redteam" ? "Running..." : "Run red-team critique"}
      </button>
      <p>{status}</p>
    </div>
  );
}
