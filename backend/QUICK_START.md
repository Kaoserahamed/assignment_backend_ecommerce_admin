# Quick Start Guide

Get the E-commerce Admin Dashboard backend running in 5 minutes!

## Prerequisites

- **Node.js v20.x** installed
- **PostgreSQL** installed and running
- **Terminal/Command Prompt** access

## 5-Minute Setup

### Step 1: Install PostgreSQL (if not installed)

**Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/) and install.

**During installation**: Remember your postgres password!

### Step 2: Create Database

Open Command Prompt and run:

```bash
psql -U postgres
```

Then in PostgreSQL shell:

```sql
CREATE DATABASE ecommerce_admin;
\q
```

### Step 3: Configure Environment

In the backend folder, edit `.env` file (or copy from `.env.example`):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ecommerce_admin?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

**Important**: Replace `YOUR_PASSWORD` with your actual PostgreSQL password!

### Step 4: Install Dependencies

```bash
cd d:\Assignment_backend\backend
npm install
```

Wait 1-2 minutes for installation...

### Step 5: Setup Database

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

You'll see:
```
✅ Created 45 permissions
✅ Created Super Administrator role
✅ Created Catalog Manager role
✅ Created Super Administrator user
   Email: admin@ecommerce.com
   Password: admin123
✅ Created Catalog Manager user
   Email: catalog@ecommerce.com
   Password: admin123
```

### Step 6: Start Server

```bash
npm run start:dev
```

You'll see:
```
🚀 Application is running on: http://localhost:3000
```

## Test It Works

### Test 1: Login as Admin

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@ecommerce.com\",\"password\":\"admin123\"}"
```

You should get back a JSON response with `accessToken` and `refreshToken`.

### Test 2: Use Postman Collection

1. Import `postman_collection.json` into Postman/Thunder Client
2. Go to "Authentication" > "Login"
3. Click Send
4. Access token is automatically saved!
5. Try other endpoints

### Test 3: Check Permission Enforcement

1. Login as **catalog@ecommerce.com** (limited permissions)
2. Try to access `/users` endpoint
3. Should get **403 Forbidden** (working correctly!)
4. Try to access `/products` endpoint
5. Should work (catalog manager has product access)

## Default Accounts

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@ecommerce.com | admin123 | Super Administrator | Full access to all endpoints |
| catalog@ecommerce.com | admin123 | Catalog Manager | Products, categories, brands, attributes, media only |

## API Endpoints

Base URL: `http://localhost:3000`

### Authentication (Public)
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `GET /auth/session` - Get current session (protected)
- `POST /auth/logout` - Logout (protected)

### All Other Endpoints (Protected)

**Require**: `Authorization: Bearer YOUR_ACCESS_TOKEN` header

- `/permissions` - Permission management
- `/roles` - Role management
- `/users` - User management
- `/media` - Media library
- `/categories` - Category management
- `/brands` - Brand management
- `/attributes` - Attribute management
- `/products` - Product management

See **README.md** for complete endpoint list!

## Common Issues

### Issue: "Can't reach database server"
**Solution**: Make sure PostgreSQL is running.

**Windows**: Check Services (services.msc) for "postgresql-x64-14"

### Issue: "Port 3000 already in use"
**Solution**: Change PORT in `.env` to 3001 or kill the process:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Migration fails
**Solution**: Drop and recreate database:

```sql
psql -U postgres
DROP DATABASE ecommerce_admin;
CREATE DATABASE ecommerce_admin;
\q
```

Then rerun migrations:
```bash
npm run prisma:migrate
npm run prisma:seed
```

### Issue: "Sharp installation failed"
**Solution**:
```bash
npm install --platform=win32 --arch=x64 sharp
```

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Login, JWT, refresh tokens
│   ├── permissions/       # Permission management
│   ├── roles/             # Role management
│   ├── users/             # User management
│   ├── media/             # File uploads
│   ├── categories/        # Categories with tree
│   ├── brands/            # Brand management
│   ├── attributes/        # Product attributes
│   ├── products/          # Products & variants
│   └── common/            # Guards, filters, decorators
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts           # Seed script
├── uploads/              # Uploaded files
├── .env                  # Your configuration
└── README.md            # Full documentation
```

## Next Steps

1. **Read Documentation**: Check `README.md` for complete API reference
2. **Import Postman Collection**: Use `postman_collection.json` for testing
3. **Create Categories**: Start building your catalog
4. **Upload Media**: Test file upload functionality
5. **Create Products**: Add simple and variable products
6. **Test Permissions**: Try both admin and catalog accounts

## Documentation Files

| File | Purpose |
|------|---------|
| README.md | Complete API documentation |
| SETUP.md | Detailed setup guide |
| DEPLOYMENT.md | Production deployment options |
| PROJECT_STATUS.md | Implementation status |
| QUICK_START.md | This file |

## Development Commands

```bash
# Start development server with hot-reload
npm run start:dev

# View database in browser
npm run prisma:studio

# Generate Prisma Client after schema changes
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Reseed database
npm run prisma:seed

# Build for production
npm run build

# Start production server
npm run start:prod
```

## Getting Help

1. Check `README.md` for detailed documentation
2. Check `SETUP.md` for troubleshooting
3. Review error messages in terminal
4. Check PostgreSQL is running
5. Verify `.env` configuration

## Production Deployment

When ready to deploy:

1. Read `DEPLOYMENT.md` for deployment options
2. Change JWT secrets to secure random values
3. Update DATABASE_URL to production database
4. Set NODE_ENV=production
5. Follow deployment guide for your platform

## Testing Checklist

- [ ] Server starts successfully
- [ ] Can login as admin
- [ ] Can login as catalog manager
- [ ] Admin can access all endpoints
- [ ] Catalog manager gets 403 on /users
- [ ] Catalog manager can access /products
- [ ] File upload works
- [ ] Can create categories
- [ ] Can create brands
- [ ] Can create products

## API Testing Tools

**Recommended**: 
- Postman (import `postman_collection.json`)
- Thunder Client (VS Code extension)
- Insomnia
- curl (command line)

## Success Indicators

✅ Server shows: `🚀 Application is running on: http://localhost:3000`  
✅ Login returns access token and refresh token  
✅ Protected endpoints require Authorization header  
✅ Permission checks return 403 when access denied  
✅ File upload creates thumbnails  
✅ Prisma Studio opens at http://localhost:5555  

## You're All Set! 🎉

Your E-commerce Admin Dashboard backend is now running!

- API: http://localhost:3000
- Prisma Studio: Run `npm run prisma:studio` then visit http://localhost:5555

**Happy Coding!** 🚀
