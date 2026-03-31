import { execSync } from "node:child_process";

function getWslIpAddress(): string | null {
  if (process.platform !== "win32") {
    return null;
  }

  try {
    const output = execSync("wsl.exe bash -lc \"hostname -I | awk '{print $1}'\"", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return output || null;
  } catch {
    return null;
  }
}

export function resolveDatabaseUrl(databaseUrl: string | undefined): string | undefined {
  if (!databaseUrl) {
    return undefined;
  }

  try {
    const parsed = new URL(databaseUrl);
    if (process.platform === "win32" && (parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost")) {
      const wslIp = getWslIpAddress();
      if (wslIp) {
        parsed.hostname = wslIp;
      }
    }
    return parsed.toString();
  } catch {
    return databaseUrl;
  }
}
