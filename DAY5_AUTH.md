# Day 5: Authentication

## Repository
`assignment_backend_ecommerce_admin` — E-Commerce Admin Dashboard (NestJS + React + PostgreSQL + Prisma)

## Day 5 Task
Authentication - admin/staff/vendor roles, OAuth2, JWT, MFA | 1 PR

## Authentication Implemented

### 1. MFA (TOTP) — Time-Based One-Time Password
New `MfaService` (`backend/src/auth/mfa.service.ts`) and `MfaController` (`backend/src/auth/mfa.controller.ts`):

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `POST /auth/mfa/setup` | GET | Generate TOTP secret + QR code | JWT |
| `POST /auth/mfa/enable` | POST | Enable MFA with password + token | JWT |
| `POST /auth/mfa/disable` | POST | Disable MFA with password | JWT |
| `POST /auth/mfa/verify` | POST | Verify TOTP token or backup code | JWT |

**MFA flow:**
1. User calls `GET /auth/mfa/setup` → receives TOTP secret, QR code URL, and 8 backup codes
2. User scans QR code with authenticator app (Google Authenticator, Authy, etc.)
3. User calls `POST /auth/mfa/enable` with password + 6-digit TOTP token → MFA enabled
4. On subsequent login, if `mfaEnabled=true`, login returns `requiresMfa: true` with `userId`
5. User calls `POST /auth/mfa/verify` with token → receives access/refresh tokens

**Backup codes:** 8 single-use codes generated on enable. Used when TOTP device is unavailable. Each code is consumed on use.

**Prisma schema:** Added `mfaEnabled`, `mfaSecret`, `mfaRecoveryCodes` fields to `User` model.

### 2. OAuth2 — Social Login
New OAuth2 strategies (`backend/src/auth/strategies/`):

| Strategy | File | Provider | Endpoint |
|----------|------|----------|----------|
| Google | `google.strategy.ts` | Google | `GET /auth/google` → `GET /auth/google/callback` |
| GitHub | `github.strategy.ts` | GitHub | `GET /auth/github` → `GET /auth/github/callback` |
| Manual | `oauth-login.dto.ts` | Any | `POST /auth/oauth` |

**OAuth2 flow:**
1. User redirects to provider OAuth2 URL
2. Provider authenticates user and redirects back with authorization code
3. Passport strategy exchanges code for profile
4. `AuthService.oauthLogin()` finds or creates user by email
5. New users are assigned the "Vendor" role by default
6. JWT access/refresh tokens issued

**Configuration:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL` in `.env`

### 3. JWT — Existing (enhanced)
Existing JWT authentication enhanced with MFA awareness:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `POST /auth/login` | POST | Returns `requiresMfa: true` if MFA enabled |
| `POST /auth/mfa/verify-login` | POST | Verify MFA token during login flow |
| `POST /auth/refresh` | POST | Refresh access token |
| `POST /auth/logout` | POST | Revoke refresh token |
| `GET /auth/session` | GET | Get current user session |

Login response now includes `requiresMfa` flag and `mfaEnabled` on user object.

### 4. Roles — Admin / Staff / Vendor
Seed updated (`backend/prisma/seed.ts`) to create three default roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| **Super Administrator** | Full system access | All 44 permissions |
| **Catalog Manager** | Catalog management only | Dashboard, Media, Category, Brand, Attribute, Product (read/create/update) |
| **Staff** | Operational access | Dashboard, Product (read), Order (watch/read/update), Inventory (watch/read) |
| **Vendor** | Marketplace partner | Dashboard, Product (watch/create/read/update), Order (watch/read) |

Default seeded users:
- `admin@ecommerce.com` / `admin123` — Super Administrator
- `catalog@ecommerce.com` / `admin123` — Catalog Manager

### 5. Dependencies Added
| Package | Purpose |
|---------|---------|
| `passport-google-oauth20` | Google OAuth2 strategy |
| `passport-github2` | GitHub OAuth2 strategy |
| `speakeasy` | TOTP generation/verification |
| `qrcode` | QR code generation for MFA setup |
| `@types/passport-google-oauth20` | TypeScript types |
| `@types/passport-github2` | TypeScript types |
| `@types/speakeasy` | TypeScript types |
| `@types/qrcode` | TypeScript types |

### Day 5 Outcome
Authentication module complete: MFA (TOTP + backup codes), OAuth2 (Google + GitHub), JWT with MFA-aware login, and four default roles (Super Administrator, Catalog Manager, Staff, Vendor). 1 PR's worth of authentication implemented.
