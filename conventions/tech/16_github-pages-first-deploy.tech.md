# GitHub Pages First-Deploy Setup

## Rule

After the repository is created and the GitHub Actions workflow is in place, GitHub Pages must be manually enabled **once** before the first deployment can succeed. Without this step, the deploy job fails with a 404 error.

---

## Steps

### 1. Push the code

Push to `main`. The Actions workflow will trigger, the **build** job will succeed, but the **deploy** job will fail with:

```
Error: Creating Pages deployment failed (404 Not Found)
```

This is expected — Pages hasn't been enabled yet.

### 2. Enable GitHub Pages

1. Go to the repository on GitHub.
2. Open **Settings → Pages** (left sidebar, under *Code and automation*).
3. Under **Build and deployment → Source**, select **GitHub Actions**.
   - Do **not** select a branch — that is the legacy method and conflicts with `actions/deploy-pages`.
4. Click **Save**.

### 3. Re-run the failed workflow

1. Go to the **Actions** tab.
2. Click the failed workflow run.
3. Click **Re-run all jobs**.

The deploy job will succeed and the app will be live at:

```
https://<username>.github.io/<repo-name>/
```

---

## Notes

- This setup is done **once per repository**. After that, every push to `main` deploys automatically — no manual steps needed.
- Do **not** follow suggestions to select a branch/folder as the Pages source — that breaks the `actions/deploy-pages@v4` workflow.
- Never commit `node_modules/` or `dist/` — the CI builds them. Make sure `.gitignore` includes both.

---

## Relation to other conventions

- **`14_deploy.tech.md`**: General deploy workflow definition. This document covers the one-time GitHub UI setup that must happen before that workflow can succeed.
