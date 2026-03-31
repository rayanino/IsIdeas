import { NextResponse } from "next/server";
import { createRuntimeRepository } from "@/lib/repository";
import { submissionInputSchema } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = submissionInputSchema.parse(await request.json());
    const repository = createRuntimeRepository();
    const submission = await repository.addSubmission(payload);

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to submit idea.",
      },
      { status: 400 },
    );
  }
}
