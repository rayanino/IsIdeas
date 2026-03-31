import { spawn } from "node:child_process";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const requestSchema = z.object({
  mode: z.enum(["manual", "scheduled"]).default("manual"),
  targetSlug: z.string().trim().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json().catch(() => ({})));
    const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
    const args = ["run", "runtime:redteam", "--", `--mode=${body.mode}`, "--json"];
    if (body.targetSlug) {
      args.push(`--target=${body.targetSlug}`);
    }

    const output = await new Promise<string>((resolve, reject) => {
      const child = spawn(npmCommand, args, {
        cwd: process.cwd(),
        env: process.env,
        shell: false,
        windowsHide: true,
      });

      let stdout = "";
      let stderr = "";
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(stderr.trim() || `runtime:redteam exited with code ${code}`));
          return;
        }
        resolve(stdout);
      });
    });

    const result = JSON.parse(output) as {
      outcome: "success" | "honest_skip" | "failure";
      packetPath: string;
      run: { focus: string };
      artifact?: { title?: string; verdict?: string; findingsSummary?: string };
      reason?: string;
    };

    if (result.outcome === "failure") {
      return NextResponse.json(
        {
          error: result.reason ?? "Red-team critique failed.",
          packetPath: result.packetPath,
          run: result.run,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      run: result.run,
      packetPath: result.packetPath,
      skipped: result.outcome === "honest_skip",
      artifact: result.artifact
        ? {
            title: result.artifact.title,
            verdict: result.artifact.verdict,
            findingsSummary: result.artifact.findingsSummary,
          }
        : undefined,
      reason: result.reason,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Red-team critique failed.",
      },
      { status: 400 },
    );
  }
}
