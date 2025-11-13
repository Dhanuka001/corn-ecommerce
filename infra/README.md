# Infrastructure

## Deploying to the VPS

Use the helper script so old containers are removed before a new stack is started. This prevents the `container name is already in use` errors that appear when `docker compose up` is run repeatedly by CI/CD.

```bash
./infra/deploy.sh
```

The script accepts additional Compose flags (for example `./infra/deploy.sh --profile prod`). It performs these steps:

1. `docker compose down --remove-orphans` – stops any existing containers in the project, removing stale names.
2. `docker compose up -d --build` – rebuilds images and recreates the stack.
3. `docker compose ps` – prints the status for quick verification.

Run it from the repository root on the server (after pulling the latest commit) to perform a clean deployment.
