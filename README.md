# Pharma Learning Platform

A software prototype for a pharmacy training platform, with a C#/.NET backend and a React/TypeScript web interface. The repository includes a layered backend, automated test projects, Docker configuration and Azure Container Apps deployment documentation.

## Repository structure

| Area | Location |
| --- | --- |
| HTTP API and controllers | [`src/PharmaTraining.Api`](./src/PharmaTraining.Api/) |
| Application logic | [`src/PharmaTraining.Application`](./src/PharmaTraining.Application/) |
| Domain model | [`src/PharmaTraining.Domain`](./src/PharmaTraining.Domain/) |
| Infrastructure | [`src/PharmaTraining.Infrastructure`](./src/PharmaTraining.Infrastructure/) |
| Web interface | [`src/app`](./src/app/) and [`new_frontend_pharmacy`](./new_frontend_pharmacy/) |
| Backend tests | [`tests/PharmaTraining.Tests`](./tests/PharmaTraining.Tests/) |
| Deployment scripts | [`scripts/azure`](./scripts/azure/) |

## Frontend development

From the repository root:

```sh
npm install
npm run dev
```

Backend and service configuration are separate from this frontend command. Review the environment-variable template and Docker Compose files before starting the full application.

## Deployment

See [Azure Container Apps deployment instructions](./DEPLOYMENT_CONTAINER_APPS.md) for the documented build, push and deployment process. The workflow is [`deploy-container-apps.yml`](./.github/workflows/deploy-container-apps.yml).

Local and production Docker Compose configurations are provided in the repository root.

## Design provenance

The initial frontend bundle originated from the [File Management design in Figma](https://www.figma.com/design/uUMF2UR6wW30xlcezpvqrS/File-Management). See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for third-party acknowledgements.
