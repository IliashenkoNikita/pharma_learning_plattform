# Azure Container Apps Deployment (Automated)

This repository is configured to auto-deploy both containers to Azure Container Apps using GitHub Actions.

## What is automated

- Build API Docker image from `src/PharmaTraining.Api/Dockerfile`
- Build frontend Docker image from `new_frontend_pharmacy/Dockerfile.prod`
- Push both images to Docker Hub
- Deploy/update API container app
- Deploy/update frontend container app
- Set API CORS to the deployed frontend URL (or your custom CORS secret)

## One-time setup

### 1) Prepare Azure environment

Run locally (PowerShell):

```powershell
az login
./scripts/azure/bootstrap-container-apps.ps1 -ResourceGroup "pharma-rg" -Location "westeurope" -ContainerAppsEnvironment "pharma-env"
```

### 2) Create service principal for GitHub Actions

Run locally (PowerShell):

```powershell
$sp = az ad sp create-for-rbac --name "github-pharma-deploy" --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/pharma-rg --sdk-auth
$sp
```

Copy full JSON output into GitHub secret `AZURE_CREDENTIALS`.

### 3) Create Docker Hub repositories

Create two Docker Hub repositories:

- `<your-user>/pharma-api`
- `<your-user>/pharma-frontend`

### 4) Configure GitHub secrets

Add these repository secrets:

Required:

- `AZURE_CREDENTIALS`: service principal JSON
- `AZURE_RESOURCE_GROUP`: e.g. `pharma-rg`
- `AZURE_CONTAINERAPPS_ENV`: e.g. `pharma-env`
- `AZURE_LOCATION`: e.g. `westeurope`
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (access token, not password)
- `DOCKERHUB_API_IMAGE`: e.g. `youruser/pharma-api`
- `DOCKERHUB_FRONTEND_IMAGE`: e.g. `youruser/pharma-frontend`
- `API_CONNECTION_STRING`: Postgres connection string (recommended external managed Postgres)
- `API_JWT_SECRET`: at least 32 chars
- `API_JWT_ISSUER`: e.g. `PharmaTraining`
- `API_JWT_AUDIENCE`: e.g. `PharmaTrainingClient`
- `API_JWT_EXPIRES_MINUTES`: e.g. `120`
- `AZURE_BLOB_CONNECTION_STRING`
- `AZURE_BLOB_CONTAINER`: e.g. `pharma-files`

Optional:

- `CORS_ALLOWED_ORIGINS`: comma-separated origins if you use custom domain(s)

If `CORS_ALLOWED_ORIGINS` is not set, workflow locks CORS to the generated frontend URL.

## Deploy

Push to `main` branch or trigger workflow manually:

- Workflow: `.github/workflows/deploy-container-apps.yml`

The workflow prints API and frontend URLs in logs.

## Security notes

- Keep all secrets only in GitHub Secrets or Azure Key Vault.
- Never commit `.env.prod` or any real credentials.
- Rotate JWT, DB, and Docker Hub tokens periodically.
- For production, map custom domain and set `CORS_ALLOWED_ORIGINS` explicitly.
