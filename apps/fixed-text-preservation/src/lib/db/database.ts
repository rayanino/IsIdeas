import { mkdirSync } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { getQuranReferenceAdapter } from "@/lib/quran-reference/adapter";

declare global {
  // eslint-disable-next-line no-var
  var __fixedTextPreservationDatabase__: Database.Database | undefined;
}

function databaseFilePath(): string {
  const configuredPath = process.env.FIXED_TEXT_PRESERVATION_DB_PATH;
  if (configuredPath) {
    if (configuredPath !== ":memory:") {
      mkdirSync(path.dirname(configuredPath), { recursive: true });
    }

    return configuredPath;
  }

  const directory = path.join(process.cwd(), "data", "local");
  mkdirSync(directory, { recursive: true });
  return path.join(directory, "fixed-text-preservation.sqlite");
}

function createSchema(database: Database.Database): void {
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS quran_reference_ayah (
      surah_number INTEGER NOT NULL,
      ayah_number INTEGER NOT NULL,
      uthmani_text TEXT NOT NULL,
      PRIMARY KEY (surah_number, ayah_number)
    );

    CREATE TABLE IF NOT EXISTS passage_definition (
      passage_id TEXT PRIMARY KEY,
      surah_number INTEGER NOT NULL,
      ayah_start INTEGER NOT NULL,
      ayah_end INTEGER NOT NULL,
      label TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tracked_passage (
      tracked_passage_id TEXT PRIMARY KEY,
      passage_id TEXT NOT NULL,
      tracking_status TEXT NOT NULL CHECK (tracking_status IN ('pending_acquisition_gate', 'active')),
      current_preservation_state TEXT CHECK (current_preservation_state IN ('relearn_soon', 'watch', 'stable')),
      next_due_at TEXT,
      consecutive_clean_since_relearn INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (passage_id) REFERENCES passage_definition(passage_id)
    );

    CREATE TABLE IF NOT EXISTS review_event (
      review_event_id TEXT PRIMARY KEY,
      tracked_passage_id TEXT NOT NULL,
      reviewed_at TEXT NOT NULL,
      verification_mode TEXT NOT NULL CHECK (verification_mode IN ('self_checked', 'peer_checked', 'teacher_checked')),
      outcome_state TEXT NOT NULL CHECK (outcome_state IN ('clean', 'hesitant', 'break', 'fail')),
      note TEXT,
      FOREIGN KEY (tracked_passage_id) REFERENCES tracked_passage(tracked_passage_id)
    );

    CREATE INDEX IF NOT EXISTS idx_passage_definition_range
      ON passage_definition (surah_number, ayah_start, ayah_end);

    CREATE INDEX IF NOT EXISTS idx_tracked_passage_due
      ON tracked_passage (tracking_status, current_preservation_state, next_due_at);

    CREATE INDEX IF NOT EXISTS idx_review_event_tracked_passage
      ON review_event (tracked_passage_id, reviewed_at DESC);
  `);
}

function seedQuranReference(database: Database.Database): void {
  const existingAyahCount = database
    .prepare("SELECT COUNT(*) AS count FROM quran_reference_ayah")
    .get() as { count: number };

  if (existingAyahCount.count > 0) {
    return;
  }

  const insertAyah = database.prepare(`
    INSERT INTO quran_reference_ayah (
      surah_number,
      ayah_number,
      uthmani_text
    ) VALUES (
      @surahNumber,
      @ayahNumber,
      @uthmaniText
    )
  `);

  const insertMany = database.transaction(
    (
      ayahs: Array<{
        surahNumber: number;
        ayahNumber: number;
        uthmaniText: string;
      }>,
    ) => {
      for (const ayah of ayahs) {
        insertAyah.run(ayah);
      }
    },
  );

  insertMany(getQuranReferenceAdapter().listSeedAyahs());
}

function initializeDatabase(): Database.Database {
  const database = new Database(databaseFilePath());
  database.pragma("journal_mode = WAL");
  createSchema(database);
  seedQuranReference(database);
  return database;
}

export function getDatabase(): Database.Database {
  if (!globalThis.__fixedTextPreservationDatabase__) {
    globalThis.__fixedTextPreservationDatabase__ = initializeDatabase();
  }

  return globalThis.__fixedTextPreservationDatabase__;
}

export function resetDatabaseForTests(): void {
  globalThis.__fixedTextPreservationDatabase__?.close();
  globalThis.__fixedTextPreservationDatabase__ = undefined;
}
