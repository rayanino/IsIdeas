$ErrorActionPreference = "Stop"

if (-not (Get-Command wsl.exe -ErrorAction SilentlyContinue)) {
  throw "WSL is not installed."
}

Write-Host "Bootstrapping IsIdeas inside WSL..."
wsl.exe bash -lc "cd /mnt/c/Users/Rayane/Desktop/IsIdeas && bash scripts/bootstrap_wsl.sh /mnt/c/Users/Rayane/Desktop/IsIdeas"
