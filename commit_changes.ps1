# commit_changes.ps1
# Commits all post-launch changes: dark mode, theme toggle, and floating numbers animation

# Add remote if not already added
git remote add origin https://github.com/aayushnema12/Suduko_Solver.git 2>$null

# ── 1. Dark mode: ThemeToggle rewrite ───────────────────────────────────────
git add src/components/ThemeToggle.jsx
git commit -m "refactor: Rewrite ThemeToggle with inline styles to fix SVG sizing"

# ── 2. Dark mode: global CSS updates ────────────────────────────────────────
git add src/index.css
git commit -m "styles: Replace flip-card CSS with floatUp keyframe for floating numbers"

# ── 3. New component: FloatingNumbers ───────────────────────────────────────
git add src/components/FloatingNumbers.jsx
git commit -m "feat: Add FloatingNumbers component with rising digit particle animation"

# ── 4. Unused SideImage component (retained for reference) ──────────────────
git add src/components/SideImage.jsx
git commit -m "chore: Add SideImage component (unused, retained for reference)"

# ── 5. Image assets (light and dark variants) ───────────────────────────────
git add src/assets/left-right-light.jpg src/assets/left-right-dark.jpg
git commit -m "assets: Add light and dark number collage images"

# ── 6. App layout: 3-column stretch + FloatingNumbers integration ────────────
git add src/App.jsx
git commit -m "feat: Restructure layout to 3-column with full-height floating number panels"

Write-Host ""
Write-Host "--------------------------------------------------------" -ForegroundColor Green
Write-Host " All changes committed successfully!" -ForegroundColor Green
Write-Host " Run the following to push to GitHub:" -ForegroundColor Cyan
Write-Host " git push origin main" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Green
