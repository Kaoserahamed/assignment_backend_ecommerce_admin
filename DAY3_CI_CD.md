# Day 3 CI/CD: Build / Test / Deploy Pipeline

## Repository
`assignment_backend_ecommerce_admin` — E-Commerce Admin Dashboard (NestJS + React)

## Pipeline Overview
GitHub Actions CI/CD for NestJS v10 + React v19 monorepo.

### Trigger
- Push/Pull Request to `main`
- Manual workflow dispatch

### Stages

#### 1. Lint & Format
- Backend: ESLint + Prettier (NestJS)
- Frontend: ESLint + Prettier (React Vite)

#### 2. Test
- Backend: `npm test` (Jest, NestJS test utilities)
- Frontend: `npm test` (Vitest)
- Coverage: Jest coverage + frontend coverage

#### 3. Build
- Backend: `npm run build` (NestJS compilation)
- Frontend: `npm run build` (Vite production build)
- Prisma: `npx prisma generate` + `npx prisma migrate deploy`

#### 4. Security Scan
- `npm audit` (backend + frontend)
- Secret detection (no `.env`, no JWT secrets in code)
- Dependency vulnerability check

#### 5. Deploy (on merge to `main`)
- Build and push Docker images (backend + frontend)
- Deploy with `docker-compose up -d` (PostgreSQL + app)
- Run Prisma migrations on deploy

### Quality Gates
- All tests pass (backend + frontend)
- Prisma schema valid
- Build artifacts produced
- No secrets committed

### Artifacts
- Backend build output (`dist/`)
- Frontend build output (`dist/`)
- Docker images
- Prisma migration files
- Test reports

## Day 3 Outcome
CI/CD pipeline documented. No code changes. 0 PRs. Ready for Day 4 (project restructuring).