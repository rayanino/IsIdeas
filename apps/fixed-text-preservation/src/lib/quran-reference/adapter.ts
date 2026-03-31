import {
  getLocalQuranReferencePackage,
  getSeededQuranReferenceAyahs,
} from "@/lib/quran-reference/local-package";
import type { QuranReferenceAyah, SurahReferenceSummary } from "@/lib/types";

export interface QuranReferenceAdapter {
  listSeedAyahs(): QuranReferenceAyah[];
  listSurahSummaries(): SurahReferenceSummary[];
  getAyahRange(
    surahNumber: number,
    ayahStart: number,
    ayahEnd: number,
  ): QuranReferenceAyah[];
  validateAyahRange(
    surahNumber: number,
    ayahStart: number,
    ayahEnd: number,
  ): { valid: boolean; message?: string };
}

class LocalSeededQuranReferenceAdapter implements QuranReferenceAdapter {
  listSeedAyahs(): QuranReferenceAyah[] {
    return getSeededQuranReferenceAyahs();
  }

  listSurahSummaries(): SurahReferenceSummary[] {
    return getLocalQuranReferencePackage().surahs.map((surah) => ({
      surahNumber: surah.surah_number,
      arabicName: surah.arabic_name,
      transliteration: surah.transliteration,
      totalAyahs: surah.total_ayahs,
    }));
  }

  getAyahRange(
    surahNumber: number,
    ayahStart: number,
    ayahEnd: number,
  ): QuranReferenceAyah[] {
    const surah = getLocalQuranReferencePackage().surahs.find(
      (candidate) => candidate.surah_number === surahNumber,
    );

    if (!surah) {
      return [];
    }

    return surah.ayahs
      .filter(
        (ayah) => ayah.ayah_number >= ayahStart && ayah.ayah_number <= ayahEnd,
      )
      .map((ayah) => ({
        surahNumber,
        ayahNumber: ayah.ayah_number,
        uthmaniText: ayah.uthmani_text,
      }));
  }

  validateAyahRange(
    surahNumber: number,
    ayahStart: number,
    ayahEnd: number,
  ): { valid: boolean; message?: string } {
    const surah = getLocalQuranReferencePackage().surahs.find(
      (candidate) => candidate.surah_number === surahNumber,
    );

    if (!surah) {
      return {
        valid: false,
        message: "Select a valid surah from the provisional reference package.",
      };
    }

    if (ayahStart < 1 || ayahEnd < 1) {
      return {
        valid: false,
        message: "Ayah numbers must start at 1.",
      };
    }

    if (ayahEnd < ayahStart) {
      return {
        valid: false,
        message: "The ending ayah must be the same as or later than the starting ayah.",
      };
    }

    if (ayahEnd > surah.total_ayahs) {
      return {
        valid: false,
        message: `Surah ${surahNumber} only has ${surah.total_ayahs} ayat in the provisional package.`,
      };
    }

    return { valid: true };
  }
}

const localSeededQuranReferenceAdapter = new LocalSeededQuranReferenceAdapter();

export function getQuranReferenceAdapter(): QuranReferenceAdapter {
  return localSeededQuranReferenceAdapter;
}
