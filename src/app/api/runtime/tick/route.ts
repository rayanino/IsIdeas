import { NextResponse } from "next/server";
import { runRuntimeTick } from "@/lib/tick";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { runRecord } = await runRuntimeTick(undefined, "manual");
    return NextResponse.json({ run: runRecord });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Runtime tick failed.",
      },
      { status: 500 },
    );
  }
}
