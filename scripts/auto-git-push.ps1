param(
  [int]$MinCommits = 2,
  [int]$MaxCommits = 6
)

$ErrorActionPreference = 'Stop'

function Write-Log($msg) {
  $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Write-Host "[$ts] $msg"
}

# Ensure we run from the git repo root
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
  throw 'git repo root not found. Run this script from inside a git repository.'
}
Set-Location $repoRoot

Write-Log "Repo root: $repoRoot"

# If working tree is clean, create/update a timestamp file so commits can still be created
$porcelain = git status --porcelain
if ([string]::IsNullOrWhiteSpace($porcelain)) {
  $automationDir = Join-Path $repoRoot 'scripts'
  if (-not (Test-Path $automationDir)) {
    New-Item -ItemType Directory -Path $automationDir | Out-Null
  }

  $tsFile = Join-Path $automationDir 'git-automation-timestamp.txt'
  $content = "Last automation run: $(Get-Date -Format o)`r`n"
  Set-Content -Path $tsFile -Value $content -Encoding UTF8

  Write-Log 'Working tree was clean; created/updated timestamp file to enable commits.'
} else {
  Write-Log 'Working tree has changes; will commit them.'
}

$n = Get-Random -Minimum $MinCommits -Maximum ($MaxCommits + 1)
Write-Log "Will create $n commits." 

for ($i = 1; $i -le $n; $i++) {
  Write-Log ("Commit {0}/{1}: staging changes..." -f $i, $n)
  git add -A

  # If nothing staged (can happen in edge cases), create the timestamp file and stage again
  $stagedAny = git diff --cached --name-only
  if ([string]::IsNullOrWhiteSpace($stagedAny)) {
    $automationDir = Join-Path $repoRoot 'scripts'
    if (-not (Test-Path $automationDir)) {
      New-Item -ItemType Directory -Path $automationDir | Out-Null
    }
    $tsFile = Join-Path $automationDir 'git-automation-timestamp.txt'
    $content = "Last automation run (commit $i/$n): $(Get-Date -Format o)`r`n"
    Set-Content -Path $tsFile -Value $content -Encoding UTF8
    git add -A
  }

  $msg = "Auto commit ($i/$n) - $(Get-Date -Format o)"
  Write-Log "Committing: $msg"
  git commit -m $msg

  Write-Log 'Pushing to origin...'
  git push
}

Write-Log 'Automation completed successfully.'

