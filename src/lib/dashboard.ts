import { createRuntimeRepository } from "@/lib/repository";
import { formatRelativeFreshness, rankSeverity } from "@/lib/utils";

export async function getDashboardSnapshot() {
  const repository = createRuntimeRepository();
  const [state, morningReport] = await Promise.all([
    repository.readState(),
    repository.readMorningReport(),
  ]);

  const unresolvedFlags = [...state.integrityFlags]
    .filter((flag) => flag.status !== "resolved")
    .sort((left, right) => rankSeverity(right.severity) - rankSeverity(left.severity));

  const frontierIdeas = state.ideas.filter((idea) => idea.priority === "frontier");
  const critiqueArtifactsById = new Map(state.critiqueArtifacts.map((artifact) => [artifact.id, artifact]));
  const latestFrontierCritiques = frontierIdeas.map((idea) => {
    const latestExternalArtifact = idea.critiqueArtifactIds
      .map((artifactId) => critiqueArtifactsById.get(artifactId))
      .filter((artifact): artifact is NonNullable<typeof artifact> => Boolean(artifact))
      .filter((artifact) => artifact.independence === "external")
      .sort((left, right) => new Date(right.reviewedAt).getTime() - new Date(left.reviewedAt).getTime())[0];

    return {
      idea,
      artifact: latestExternalArtifact,
    };
  });
  const latestRun = state.runs[0];

  return {
    state,
    morningReport,
    unresolvedFlags,
    frontierIdeas,
    latestFrontierCritiques,
    latestRun,
    headlineFreshness: latestRun ? formatRelativeFreshness(latestRun.finishedAt) : "no runtime runs yet",
  };
}
