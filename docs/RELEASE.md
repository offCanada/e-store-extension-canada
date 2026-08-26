### 1. Release branch

- `git checkout -b release/v0.0.2 main`

### edit package.json → "version": "0.0.2"

- `git commit -am "chore(release): v0.0.2"`
- `git push -u origin release/v0.0.2`

### 2. Open PR on GitHub → CI runs (lint/test/build) → merge

### 3. Back on main, tag the merge commit

- `git checkout main && git pull`
- `git tag v0.0.2`
- `git push origin v0.0.2   # ← this triggers the Release workflow`
