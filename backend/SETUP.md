# E-commerce Admin Dashboard - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x or later (LTS version recommended)
- **PostgreSQL**: v12 or later
- **npm**: Comes with Node.js
- **Git**: For version control

## Installation Steps

### 1. Install PostgreSQL

#### Windows:
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

During installation:
- Remember your postgres user password
- Default port: 5432

#### macOS:
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

Open PostgreSQL command line (psql) or use pgAdmin:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE ecommerce_admin;

-- Verify
\l
```

### 3. Clone/Setup Project

If you have the project:
```bash
cd d:\Assignment_backend\backend
```

### 4. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- NestJS framework
- Prisma ORM
- JWT authentication
- bcrypt for password hashing
- Sharp for image processing
- class-validator for validation
- And more...

### 5. Configure Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Or manually create `.env` file with:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ecommerce_admin?schema=public"

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"
```

**Important**: Replace `yourpassword` with your actual PostgreSQL password!

### 6. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 7. Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

This will:
- Create all database tables
- Set up relationships
- Create indexes

### 8. Seed Initial Data

```bash
npm run prisma:seed
```

This creates:
- All permission groups and permissions
- Super Administrator role (with all permissions)
- Catalog Manager role (limited permissions)
- Admin user account
- Catalog manager account

You'll see output like:
```
✅ Created 45 permissions
✅ Created Super Administrator role with all permissions
✅ Created Catalog Manager role with limited permissions
✅ Created Super Administrator user
   Email: admin@ecommerce.com
   Password: admin123
✅ Created Catalog Manager user
   Email: catalog@ecommerce.com
   Password: admin123
```

### 9. Start Development Server

```bash
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:3000
```

## Verification

### 1. Test Health Check

Open your browser or use curl:
```bash
curl http://localhost:3000
```

### 2. Test Login

#### Using curl:
```bash
curl -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@ecommerce.com\",\"password\":\"admin123\"}"
```

#### Using Postman:
1. Import the `postman_collection.json` file
2. Go to Authentication > Login
3. Click Send
4. Access token will be automatically saved

### 3. Test Protected Endpoint

```bash
curl http://localhost:3000/users ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Database Connection Issues

**Error: Can't reach database server**

Solutions:
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   services.msc (look for postgresql-x64-14)
   
   # macOS/Linux
   ps aux | grep postgres
   ```

2. Check your DATABASE_URL in `.env`
3. Verify database exists:
   ```sql
   psql -U postgres -l
   ```

4. Check PostgreSQL port (default 5432):
   ```bash
   netstat -an | findstr 5432
   ```

### Migration Errors

**Error: Unique constraint violation**

Solution: Drop and recreate database:
```sql
DROP DATABASE ecommerce_admin;
CREATE DATABASE ecommerce_admin;
```

Then re-run migrations:
```bash
npm run prisma:migrate
npm run prisma:seed
```

### Port Already in Use

**Error: Port 3000 is already in use**

Solutions:
1. Change PORT in `.env` file:
   ```env
   PORT=3001
   ```

2. Or kill process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```

### Sharp Installation Issues

If Sharp fails to install:

```bash
npm install --platform=win32 --arch=x64 sharp
```

## Development Tools

### Prisma Studio

Visual database browser:
```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

### API Documentation

Use the Postman collection (`postman_collection.json`) for:
- Complete API documentation
- Request/response examples
- Automated token handling

### VS Code Extensions (Recommended)

- Prisma
- ESLint
- Prettier
- REST Client
- Thunder Client (Postman alternative)

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Set Production Environment Variables

Update `.env` or set environment variables:
```env
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-random-secret"
JWT_REFRESH_SECRET="another-strong-random-secret"
```

### 3. Run Migrations in Production

```bash
npm run prisma:migrate deploy
```

### 4. Start Production Server

```bash
npm run start:prod
```

### 5. Use Process Manager (PM2)

```bash
npm install -g pm2
pm2 start dist/main.js --name ecommerce-api
pm2 save
pm2 startup
```

## Testing Permissions

### Test Super Admin Access

1. Login as admin@ecommerce.com
2. Try accessing all endpoints - should work

### Test Limited Access

1. Login as catalog@ecommerce.com
2. Try accessing `/users` - should return 403 Forbidden
3. Try accessing `/products` - should work
4. Try accessing `/permissions` - should return 403 Forbidden

This confirms permission enforcement at API level!

## Database Schema

View the complete schema:
```bash
npx prisma studio
```

Or view the file:
```
prisma/schema.prisma
```

## Next Steps

1. **Create Categories**: POST /categories
2. **Create Brands**: POST /brands
3. **Upload Media**: POST /media/upload
4. **Create Attributes**: POST /attributes
5. **Create Products**: POST /products

## Support

For issues:
1. Check the README.md file
2. Review error logs in console
3. Check Prisma documentation: https://www.prisma.io/docs
4. Check NestJS documentation: https://docs.nestjs.com

## Security Checklist

Before deploying to production:

- [ ] Change all JWT secrets to strong random values
- [ ] Change default admin password
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up proper logging
- [ ] Configure file upload size limits
- [ ] Set up backup strategy for database
- [ ] Review and test all permission boundaries
- [ ] Set up monitoring and alerts

## Useful Commands

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugging

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
npm run test               # Run tests

# Production
npm run build              # Build for production
npm run start:prod         # Start production server
```

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/           # Database migrations
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Seed script
├── src/
│   ├── auth/                # Authentication module
│   ├── permissions/         # Permissions module
│   ├── roles/               # Roles module
│   ├── users/               # Users module
│   ├── media/               # Media module
│   ├── categories/          # Categories module
│   ├── brands/              # Brands module
│   ├── attributes/          # Attributes module
│   ├── products/            # Products module
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Auth & permission guards
│   │   ├── filters/         # Exception filters
│   │   └── interceptors/    # Response interceptors
│   ├── database/            # Database service
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry
├── uploads/                 # Uploaded files
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── README.md                # Documentation
├── SETUP.md                 # This file
└── postman_collection.json  # API collection
```

## API Endpoints Summary

### Public Endpoints
- POST /auth/login
- POST /auth/refresh

### Protected Endpoints (require authentication + permissions)
- All other endpoints require valid JWT token
- Each endpoint checks specific permission
- Returns 401 if token invalid
- Returns 403 if permission denied

See README.md for complete endpoint list.

## Congratulations! 🎉

Your E-commerce Admin Dashboard backend is now set up and ready for development!
