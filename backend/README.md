# E-commerce Admin Dashboard Backend

A comprehensive admin dashboard backend for an e-commerce platform built with NestJS, PostgreSQL, and Prisma.

## Technology Stack

- **Runtime**: Node.js v20.19.4 (LTS)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with refresh token rotation
- **Password Hashing**: bcrypt
- **Validation**: class-validator

## Features

### Complete Module Implementation

1. **Authentication** - JWT access & refresh tokens with rotation
2. **Permissions** - Granular permission system grouped by module
3. **Roles** - Role-based access control with permission bundles
4. **Users** - User management with role assignment
5. **Media** - Shared media library with upload management
6. **Categories** - Nested category tree structure
7. **Brands** - Brand management with logo support
8. **Attributes** - Product attributes (color, size, etc.) with values
9. **Products** - Complete product management with variants

### Security Features

- Global authentication guard (opt-out for public routes)
- Permission-based authorization guard
- JWT access tokens (15 minutes expiry)
- JWT refresh tokens (7 days expiry) with rotation
- Refresh token revocation on logout
- Password hashing with bcrypt
- Account activation/deactivation
- Protection against self-escalation

## Prerequisites

- Node.js v20.x or later
- PostgreSQL 12 or later
- npm or yarn

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_admin?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"
```

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed
```

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE ecommerce_admin;
```

2. Run migrations:
```bash
npm run prisma:migrate
```

3. Seed initial data:
```bash
npm run prisma:seed
```

## Seeded Accounts

### Super Administrator
- **Email**: admin@ecommerce.com
- **Password**: admin123
- **Permissions**: All permissions (full access)

### Catalog Manager
- **Email**: catalog@ecommerce.com
- **Password**: admin123
- **Permissions**: Limited to catalog management (products, categories, brands, attributes, media)

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

### Authentication

#### Login
```
POST /auth/login
Body: { "email": "admin@ecommerce.com", "password": "admin123" }
```

#### Refresh Token
```
POST /auth/refresh
Body: { "refreshToken": "your-refresh-token" }
```

#### Get Current Session
```
GET /auth/session
Headers: { "Authorization": "Bearer your-access-token" }
```

#### Logout
```
POST /auth/logout
Headers: { "Authorization": "Bearer your-access-token" }
```

### Token Strategy

This API uses **Bearer Token Authentication** via the Authorization header:

```
Authorization: Bearer <your-access-token>
```

### Permission System

Every protected route requires specific permissions. The permission naming convention is:

```
module:action
```

Examples:
- `product:create`
- `user:read`
- `role:update`

### Module Endpoints

#### Permissions
- `GET /permissions` - List all permissions (requires `permission:watch`)
- `POST /permissions/groups` - Create permission group (requires `permission:create`)
- `GET /permissions/groups/:id` - Get permission group (requires `permission:read`)
- `PATCH /permissions/groups/:id` - Update permission group (requires `permission:update`)
- `DELETE /permissions/groups/:id` - Delete permission group (requires `permission:delete`)

#### Roles
- `GET /roles` - List all roles (requires `role:watch`)
- `POST /roles` - Create role (requires `role:create`)
- `GET /roles/:id` - Get role details (requires `role:read`)
- `PATCH /roles/:id` - Update role (requires `role:update`)
- `DELETE /roles/:id` - Delete role (requires `role:delete`)
- `POST /roles/:id/permissions` - Assign permissions (requires `role:update`)

#### Users
- `GET /users` - List users with filters (requires `user:watch`)
- `POST /users` - Create user (requires `user:create`)
- `GET /users/:id` - Get user details (requires `user:read`)
- `PATCH /users/:id` - Update user (requires `user:update`)
- `DELETE /users/:id` - Delete user (requires `user:delete`)

#### Media
- `GET /media` - List media (requires `media:watch`)
- `POST /media/upload` - Upload files (requires `media:upload`)
- `GET /media/:id` - Get media details (requires `media:read`)
- `PATCH /media/:id` - Update media metadata (requires `media:write`)
- `DELETE /media/:id` - Delete media (requires `media:delete`)

#### Categories
- `GET /categories` - List categories (requires `category:watch`)
- `GET /categories/tree` - Get category tree (requires `category:read`)
- `POST /categories` - Create category (requires `category:create`)
- `GET /categories/:id` - Get category (requires `category:read`)
- `PATCH /categories/:id` - Update category (requires `category:update`)
- `DELETE /categories/:id` - Delete category (requires `category:delete`)

#### Brands
- `GET /brands` - List brands (requires `brand:watch`)
- `POST /brands` - Create brand (requires `brand:create`)
- `GET /brands/:id` - Get brand (requires `brand:read`)
- `PATCH /brands/:id` - Update brand (requires `brand:update`)
- `DELETE /brands/:id` - Delete brand (requires `brand:delete`)

#### Attributes
- `GET /attributes` - List attributes (requires `attribute:watch`)
- `POST /attributes` - Create attribute (requires `attribute:create`)
- `GET /attributes/:id` - Get attribute (requires `attribute:read`)
- `PATCH /attributes/:id` - Update attribute (requires `attribute:update`)
- `DELETE /attributes/:id` - Delete attribute (requires `attribute:delete`)
- `POST /attributes/:id/values` - Add attribute values (requires `attribute:update`)
- `PATCH /attributes/:id/values/:valueId` - Update attribute value (requires `attribute:update`)
- `DELETE /attributes/:id/values/:valueId` - Delete attribute value (requires `attribute:update`)

#### Products
- `GET /products` - List products with filters (requires `product:watch`)
- `POST /products` - Create product (requires `product:create`)
- `GET /products/:id` - Get product with full details (requires `product:read`)
- `PATCH /products/:id` - Update product (requires `product:update`)
- `DELETE /products/:id` - Delete product (requires `product:delete`)
- `POST /products/:id/variants` - Add product variants (requires `product:update`)
- `PATCH /products/:id/variants/:variantId` - Update variant (requires `product:update`)
- `DELETE /products/:id/variants/:variantId` - Delete variant (requires `product:update`)

## Access Control Implementation

### Global Guards

1. **JwtAuthGuard** - Validates JWT token on every request (except @Public() decorated routes)
2. **PermissionsGuard** - Checks user permissions against required permissions on each route

### How It Works

1. User logs in and receives access token + refresh token
2. Access token contains user ID, email, role ID, and permissions array
3. Every request includes: `Authorization: Bearer <access-token>`
4. JwtAuthGuard validates the token
5. PermissionsGuard checks if user has required permission(s)
6. Returns 401 if token invalid/expired, 403 if permission denied

### Permission Enforcement

- Routes declare required permissions using `@RequirePermissions()` decorator
- Guards check permissions on API level, not just UI level
- Tested with direct API calls (Postman/Thunder Client)

## Role Change Policy

When a user's role is changed, the new permissions take effect:
- **Immediately for new requests** after role change
- **On next token refresh** for existing sessions
- User must refresh token to get updated permissions in token payload

## Data Relationships

### Simple Product
- Has direct price, sale price, stock
- Belongs to one brand (optional)
- Belongs to many categories
- Has many media attachments

### Variable Product
- Has no direct price/stock (stored on variants)
- Has variants with unique SKUs
- Each variant has own price, sale price, stock
- Variants combine attribute values (e.g., Red + XL)
- Media can attach to product, variant, or attribute value

## Validation Rules

### Product Validation
- Duplicate slug: Rejected (409)
- Duplicate SKU: Rejected (409)
- Sale price > regular price: Rejected (400)
- Negative price/stock: Rejected (400)
- Variants with identical attribute combinations: Rejected (400)
- Multiple thumbnails on one product: Previous demoted automatically

### Category Validation
- Duplicate slug: Rejected (409)
- Cycle detection: Cannot make category its own ancestor (400)
- Deletion with children: Rejected (409)

### User Validation
- Self role change: Rejected (403)
- Last admin losing admin permissions: Rejected (400)
- Inactive user login: Rejected (401)

### File Upload Validation
- MIME type checked against allowlist
- File size limit enforced (5MB default)
- Thumbnails generated for images

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/         # Database migrations
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Seed script
├── src/
│   ├── auth/              # Authentication module
│   ├── permissions/       # Permissions management
│   ├── roles/             # Roles management
│   ├── users/             # User management
│   ├── media/             # Media library
│   ├── categories/        # Category management
│   ├── brands/            # Brand management
│   ├── attributes/        # Attribute management
│   ├── products/          # Product management
│   ├── common/            # Shared utilities
│   │   ├── decorators/    # Custom decorators
│   │   ├── guards/        # Auth & permission guards
│   │   ├── filters/       # Exception filters
│   │   └── interceptors/  # Response interceptors
│   ├── database/          # Database service
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
├── uploads/               # Uploaded files
├── .env                   # Environment variables
├── .env.example           # Environment template
└── README.md             # This file
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": ["Error message"],
  "errors": null,
  "timestamp": "2026-07-26T10:00:00.000Z"
}
```

## Development Commands

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Run tests
npm run test

# Lint code
npm run lint
```

## Module Status

| Module | Status | Notes |
|--------|--------|-------|
| Authentication | ✅ Complete | JWT with refresh token rotation |
| Permissions | ✅ Complete | Group-based permission system |
| Roles | ✅ Complete | With permission assignment |
| Users | ✅ Complete | With role management |
| Media | ✅ Complete | Upload, library, thumbnail generation |
| Categories | ✅ Complete | Nested tree with cycle detection |
| Brands | ✅ Complete | With logo support |
| Attributes | ✅ Complete | With typed values |
| Products | ✅ Complete | Simple & variable products with variants |

## Known Issues

None at this time.

## Design Decisions

1. **Token Storage**: Using Bearer tokens in Authorization header (not cookies) for simplicity and compatibility with various clients
2. **Refresh Token Rotation**: New refresh token issued on each refresh for security
3. **Permission Check**: Enforced at API level via guards, not just UI
4. **Role Changes**: Take effect on next token refresh
5. **File Storage**: Local filesystem (uploads directory)
6. **Soft vs Hard Delete**: Hard delete for all entities (cascade handled by Prisma)
7. **Category Deletion**: Rejected if has children or products
8. **Brand Deletion**: Rejected if products reference it
9. **Attribute Deletion**: Rejected if used by product variants
10. **Media Deletion**: Allowed, but detaches from products
11. **Transaction Handling**: Product creation/update wrapped in transactions

## Testing Access Control

To test permission enforcement:

1. Login as catalog manager:
```bash
POST /auth/login
Body: { "email": "catalog@ecommerce.com", "password": "admin123" }
```

2. Try to access users endpoint (should return 403):
```bash
GET /users
Headers: { "Authorization": "Bearer <catalog-token>" }
```

3. Try to create product (should succeed):
```bash
POST /products
Headers: { "Authorization": "Bearer <catalog-token>" }
Body: { ... }
```

## Submission Details

- **Repository**: Public GitHub repository
- **Live Demo**: [Will be deployed]
- **API Collection**: Available in `/postman` directory (to be created)
- **Database Migrations**: Committed and runnable
- **Seed Data**: Super admin + catalog manager

## License

UNLICENSED - For assignment purposes only
