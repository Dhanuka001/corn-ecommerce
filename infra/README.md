# Infrastructure

## Deploying to the VPS

Use the helper script so the server always runs the latest commit from the configured branch and old containers are removed before a new stack is started.

```bash
./infra/deploy.sh
```

The script accepts additional Compose flags (for example `./infra/deploy.sh --profile prod`). It performs these steps:

1. `git fetch` + `git checkout -B <branch> origin/<branch>` – forces the repo on the server to match the branch (defaults to `main`, override with `GIT_BRANCH`).
2. `docker compose down --remove-orphans` – stops any existing containers in the project, removing stale names.
3. `docker compose up -d --build` (followed by `docker compose ps`) – rebuilds images, recreates the stack, and prints status for quick verification.

Run it from the repository root on the server (after pulling the latest commit) to perform a clean deployment.
