# Prodigy Phantasm push helper (PowerShell)
git status
git add -A | Out-Null

# If there are staged changes, git diff --cached --quiet returns non-zero
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "chore: pp bootstrap & hygiene"
} else {
  Write-Host "Nothing to commit." -ForegroundColor Yellow
}

git push -u origin main
