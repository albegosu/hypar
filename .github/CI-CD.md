# CI/CD Documentation

## GitHub Actions Workflows

Complete CI/CD pipeline for the From Zero RAG project.

## Workflow Overview

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **CI** | `ci.yml` | PR/Push | Orchestrates backend, frontend, security tests |
| **Test Backend** | `test-backend.yml` | Backend changes | Unit tests, e2e tests with PostgreSQL |
| **Test Frontend** | `test-frontend.yml` | Frontend changes | Build, lint, type check |
| **Docker Build** | `docker-build.yml` | Push to main | Build and push images to GHCR |
| **Security** | `security.yml` | Daily/PR | npm audit, CodeQL, Trivy scan |
| **Deploy** | `deploy.yml` | Tag/Manual | Deploy to production server |
| **Release** | `release.yml` | Tag push | Create GitHub releases, changelogs |

## Workflow Details

### CI Orchestrator (ci.yml)

Main entry point that coordinates other workflows:

1. **Detects changes** - Only runs workflows for changed components
2. **Runs tests** - Backend + Frontend in parallel
3. **Security scan** - After successful tests
4. **Docker build** - On main branch only

```yaml
graph TD
    A[Push/PR] --> B{Detect Changes}
    B -->|Backend| C[Test Backend]
    B -->|Frontend| D[Test Frontend]
    C --> E[Security Scan]
    D --> E
    E -->|Main Branch| F[Docker Build]
```

### Test Backend

- **PostgreSQL service** - Spins up pgvector container
- **Prisma setup** - Generates client, runs migrations
- **Tests** - Unit + e2e with coverage
- **Reports** - Uploads to Codecov

### Test Frontend

- **Lint** - ESLint checks
- **Type check** - Vue/Nuxt type checking
- **Build** - Ensures production build works
- **Tests** - Vitest/Jest (when added)

### Docker Build

- **Multi-platform** - linux/amd64, linux/arm64
- **Caching** - Uses GitHub Actions cache
- **Registry** - Pushes to GHCR (GitHub Container Registry)
- **Tags** - Branch, SHA, semver

### Security

- **npm audit** - Checks for vulnerable dependencies
- **CodeQL** - Static analysis for security issues
- **Trivy** - Docker image vulnerability scanning
- **SARIF** - Uploads results to GitHub Security tab

### Deploy

- **SSH** - Uses GitHub secrets for deployment
- **Zero-downtime** - Docker Compose rolling update
- **Migrations** - Runs Prisma migrate automatically
- **Notifications** - Slack webhook (optional)

## Required Secrets

Configure these in GitHub → Settings → Secrets:

| Secret | Workflow | Description |
|--------|----------|-------------|
| `SSH_PRIVATE_KEY` | deploy | SSH key for server access |
| `SSH_HOST` | deploy | Production server IP/hostname |
| `SSH_USER` | deploy | SSH username |
| `ENV_FILE` | deploy | Production .env contents |
| `SLACK_WEBHOOK_URL` | deploy | Slack notifications (optional) |
| `CODECOV_TOKEN` | test-* | Codecov.io upload token |

## Test Matrix

### Backend Tests
```
Node.js 20.x
├── Unit Tests
│   ├── Search Service
│   ├── Chunking Service
│   ├── Documents Service
│   └── Embedding Service
├── E2E Tests
│   └── Full API flow
└── Coverage Report
    └── > 80% threshold
```

### Frontend Tests
```
Node.js 20.x
├── Lint
├── Type Check
├── Build Test
└── Unit Tests (when added)
```

## Local Testing

Run workflows locally with [act](https://github.com/nektos/act):

```bash
# Test backend workflow
act -j test-backend

# Test all workflows
act

# Test with secrets
act --secret-file .secrets
```

## Deployment Strategy

### Staging

```bash
# Manual trigger
git tag v1.0.0-rc.1
git push origin v1.0.0-rc.1
# Then manually deploy to staging in Actions
```

### Production

```bash
# Automatic deployment
git tag v1.0.0
git push origin v1.0.0
# Deploy workflow runs automatically
```

## Troubleshooting

### Tests failing

```bash
# Run tests locally
cd rag-api
npm test

# With coverage
npm run test:cov
```

### Docker build fails

```bash
# Test build locally
cd rag-api
docker build -t rag-backend:test .
```

### Secrets not working

Check in GitHub:
- Settings → Secrets → Actions
- Ensure secrets are added to the repository
- For dependabot: Settings → Secrets → Dependabot

## Status Badges

Add to README.md:

```markdown
![CI](https://github.com/albegosu/from-zero-rag/actions/workflows/ci.yml/badge.svg)
![Docker](https://github.com/albegosu/from-zero-rag/actions/workflows/docker-build.yml/badge.svg)
![Security](https://github.com/albegosu/from-zero-rag/actions/workflows/security.yml/badge.svg)
```

## Dependabot

Automatic dependency updates configured:

- **Weekly** - Every Monday
- **Backend** - rag-api/package.json
- **Frontend** - rag-ui/package.json
- **Docker** - Dockerfile updates

## Release Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Develop and test**
   - Push triggers CI
   - PR requires passing tests

3. **Merge to main**
   - Docker image builds automatically

4. **Create release**
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

5. **Automatic deployment**
   - Release workflow creates GitHub release
   - Deploy workflow pushes to production

## Monitoring

Check workflow status:

- GitHub → Actions tab
- Pull requests → Checks tab
- GitHub Security → Code scanning alerts

## Maintenance

### Update Node.js version

Edit all workflow files:
```yaml
node-version: '20'  # Change this
```

### Add new workflow

1. Create `.github/workflows/my-workflow.yml`
2. Reference from `ci.yml` if needed
3. Add to this documentation

## License

Private - Alberto
