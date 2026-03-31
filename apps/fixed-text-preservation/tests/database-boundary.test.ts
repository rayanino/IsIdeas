import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("database reference seeding boundary", () => {
  let temporaryDirectory: string;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(
      path.join(os.tmpdir(), "fixed-text-preservation-db-boundary-"),
    );
    process.env.FIXED_TEXT_PRESERVATION_DB_PATH = path.join(
      temporaryDirectory,
      "test.sqlite",
    );
    vi.resetModules();
  });

  afterEach(async () => {
    try {
      const { resetDatabaseForTests } = await import("@/lib/db/database");
      resetDatabaseForTests();
    } catch {
      // The database module is loaded lazily per test.
    }

    vi.doUnmock("@/lib/quran-reference/adapter");
    vi.resetModules();
    delete process.env.FIXED_TEXT_PRESERVATION_DB_PATH;
    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it("seeds Qur'an reference data through the adapter boundary", async () => {
    const listSeedAyahs = vi.fn(() => [
      {
        surahNumber: 1,
        ayahNumber: 1,
        uthmaniText: "seeded through adapter",
      },
    ]);

    vi.doMock("@/lib/quran-reference/adapter", () => ({
      getQuranReferenceAdapter: () => ({
        listSeedAyahs,
        listSurahSummaries: () => [],
        getAyahRange: () => [],
        validateAyahRange: () => ({ valid: true }),
      }),
    }));

    const { getDatabase } = await import("@/lib/db/database");
    const database = getDatabase();
    const seededAyahCount = database
      .prepare("SELECT COUNT(*) AS count FROM quran_reference_ayah")
      .get() as { count: number };

    expect(listSeedAyahs).toHaveBeenCalledTimes(1);
    expect(seededAyahCount.count).toBe(1);
  });
});
