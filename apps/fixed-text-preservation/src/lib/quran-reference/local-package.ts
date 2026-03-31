import { readFileSync } from "node:fs";
import path from "node:path";

interface LocalQuranReferencePackage {
  source: {
    package: string;
    version: string;
    license: string;
    upstream_url: string;
    uthmani_text_origin: string;
    pinned_at: string;
  };
  surahs: Array<{
    surah_number: number;
    arabic_name: string;
    transliteration: string;
    total_ayahs: number;
    ayahs: Array<{
      ayah_number: number;
      uthmani_text: string;
    }>;
  }>;
}

let cachedLocalPackage: LocalQuranReferencePackage | null = null;

function localPackagePath(): string {
  return path.join(
    process.cwd(),
    "data",
    "quran-reference",
    "provisional-quran-reference.json",
  );
}

export function getLocalQuranReferencePackage(): LocalQuranReferencePackage {
  if (cachedLocalPackage) {
    return cachedLocalPackage;
  }

  cachedLocalPackage = JSON.parse(
    readFileSync(localPackagePath(), "utf8"),
  ) as LocalQuranReferencePackage;

  return cachedLocalPackage;
}

export function getSeededQuranReferenceAyahs() {
  return getLocalQuranReferencePackage().surahs.flatMap((surah) =>
    surah.ayahs.map((ayah) => ({
      surahNumber: surah.surah_number,
      ayahNumber: ayah.ayah_number,
      uthmaniText: ayah.uthmani_text,
    })),
  );
}
