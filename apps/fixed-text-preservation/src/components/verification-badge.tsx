import { formatVerificationMode } from "@/lib/format";
import type { VerificationMode } from "@/lib/types";

export function VerificationBadge({
  verificationMode,
}: {
  verificationMode: VerificationMode | null;
}) {
  return (
    <span className="tag tag-outline">
      {formatVerificationMode(verificationMode)}
    </span>
  );
}
