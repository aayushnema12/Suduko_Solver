# commit_all.ps1

# Ensure we are on the main branch
git branch -M main

# Add the remote repository (ignoring error if it already exists)
git remote add origin https://github.com/aayushnema12/Suduko_Solver.git 2>$null

# Commit the 25 files individually with appropriate messages
git add .gitignore
git commit -m "chore: Add gitignore"

git add README.md
git commit -m "docs: Add README documentation"

git add eslint.config.js
git commit -m "chore: Configure ESLint"

git add index.html
git commit -m "chore: Add main HTML entry point"

git add package.json
git commit -m "chore: Add package configuration and dependencies"

git add package-lock.json
git commit -m "chore: Add package lockfile"

git add public/favicon.svg
git commit -m "assets: Add favicon"

git add public/icons.svg
git commit -m "assets: Add public SVG icons"

git add src/assets/hero.png
git commit -m "assets: Add hero image"

git add src/assets/react.svg
git commit -m "assets: Add React logo"

git add src/assets/vite.svg
git commit -m "assets: Add Vite logo"

git add vite.config.js
git commit -m "chore: Add Vite configuration for React and Tailwind"

git add src/index.css
git commit -m "styles: Add global CSS and Tailwind setup"

git add src/App.css
git commit -m "styles: Add App specific styles"

git add src/main.jsx
git commit -m "feat: Add React root mounting script"

git add src/utils/puzzles.js
git commit -m "feat: Add sample Sudoku puzzles data"

git add src/utils/validator.js
git commit -m "feat: Add Sudoku conflict detection logic"

git add src/utils/solver.js
git commit -m "feat: Add Sudoku backtracking solver algorithm"

git add src/components/Cell.jsx
git commit -m "feat: Create individual Sudoku cell component"

git add src/components/ConflictCounter.jsx
git commit -m "feat: Create conflict counter UI component"

git add src/components/Controls.jsx
git commit -m "feat: Create control buttons panel component"

git add src/components/ResetModal.jsx
git commit -m "feat: Create reset confirmation modal component"

git add src/components/SudokuGrid.jsx
git commit -m "feat: Create main 9x9 Sudoku grid component"

git add src/components/ThemeToggle.jsx
git commit -m "feat: Create light/dark theme toggle component"

git add src/App.jsx
git commit -m "feat: Build root App with game state and theme logic"

Write-Host "--------------------------------------------------------" -ForegroundColor Green
Write-Host "All 25 files have been committed successfully!" -ForegroundColor Green
Write-Host "To push these commits to your GitHub repository, run:" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Green
