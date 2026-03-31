export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatRelativeFreshness(dateString: string): string {
  const deltaMs = Date.now() - new Date(dateString).getTime();
  const deltaHours = Math.round(deltaMs / 3_600_000);

  if (deltaHours < 1) {
    return "updated within the hour";
  }

  if (deltaHours < 24) {
    return `updated ${deltaHours}h ago`;
  }

  const deltaDays = Math.round(deltaHours / 24);
  return `updated ${deltaDays}d ago`;
}

export function rankSeverity(value: "low" | "medium" | "high" | "critical"): number {
  return {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  }[value];
}
