# Deployment Guide

## Deployment Options

This guide covers multiple deployment options for the E-commerce Admin Dashboard backend.

## Option 1: Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Install Heroku CLI**
   ```bash
   # Windows
   Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create ecommerce-admin-api
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET="your-production-secret"
   heroku config:set JWT_REFRESH_SECRET="your-production-refresh-secret"
   heroku config:set JWT_EXPIRES_IN="15m"
   heroku config:set JWT_REFRESH_EXPIRES_IN="7d"
   ```

6. **Add Procfile**
   Create `Procfile` in project root:
   ```
   web: npm run start:prod
   release: npx prisma migrate deploy && npm run prisma:seed
   ```

7. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

8. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

## Option 2: Railway

### Steps

1. **Visit Railway.app**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New"
   - Select "Database"
   - Choose "PostgreSQL"

4. **Configure Environment Variables**
   In Railway dashboard, add:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

5. **Configure Build**
   Railway auto-detects NestJS. If needed, add:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     }
   }
   ```

6. **Deploy**
   - Commits to main branch auto-deploy
   - View logs in Railway dashboard

---

## Option 3: DigitalOcean App Platform

### Steps

1. **Create Account**
   - Sign up at https://digitalocean.com

2. **Create App**
   - Go to App Platform
   - Click "Create App"
   - Connect GitHub repository

3. **Add Database**
   - Add PostgreSQL database component
   - Note the connection string

4. **Configure Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=${db.DATABASE_URL}
   JWT_SECRET=your-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   ```

5. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm run start:prod`

6. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

---

## Option 4: AWS (EC2 + RDS)

### Prerequisites
- AWS account
- AWS CLI installed

### Steps

1. **Launch RDS PostgreSQL Instance**
   - Go to AWS RDS
   - Create PostgreSQL database
   - Note endpoint and credentials

2. **Launch EC2 Instance**
   - Use Ubuntu 22.04 LTS
   - Configure security groups (ports 22, 80, 3000)

3. **Connect to EC2**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

4. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install -y nginx
   ```

5. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd backend
   ```

6. **Configure Environment**
   ```bash
   nano .env
   ```
   Add production values with RDS endpoint

7. **Install and Build**
   ```bash
   npm install
   npm run build
   npm run prisma:migrate deploy
   npm run prisma:seed
   ```

8. **Start with PM2**
   ```bash
   pm2 start dist/main.js --name ecommerce-api
   pm2 startup
   pm2 save
   ```

9. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup SSL (Optional but Recommended)**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

---

## Option 5: Docker + Docker Compose

### Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecommerce_admin
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/ecommerce_admin?schema=public
      JWT_SECRET: your-secret
      JWT_REFRESH_SECRET: your-refresh-secret
      JWT_EXPIRES_IN: 15m
      JWT_REFRESH_EXPIRES_IN: 7d
      NODE_ENV: production
    depends_on:
      - db
    command: sh -c "npx prisma migrate deploy && npm run start:prod"

volumes:
  postgres_data:
```

### Deploy

```bash
docker-compose up -d
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| JWT_SECRET | Secret for access tokens | random-string-64-chars |
| JWT_REFRESH_SECRET | Secret for refresh tokens | another-random-string-64-chars |
| JWT_EXPIRES_IN | Access token expiry | 15m |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d |
| PORT | Server port | 3000 |
| NODE_ENV | Environment | production |

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Seed data created
- [ ] Can login with admin credentials
- [ ] Can login with catalog manager credentials
- [ ] Permission checks work (403 for unauthorized)
- [ ] File upload works
- [ ] All endpoints return proper responses
- [ ] HTTPS/SSL configured
- [ ] CORS configured for frontend
- [ ] Environment variables secured
- [ ] Database backed up
- [ ] Monitoring/logging set up
- [ ] API documentation accessible

---

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Database Monitoring
```bash
# Check connection count
psql -U postgres -d ecommerce_admin -c "SELECT count(*) FROM pg_stat_activity;"

# Check table sizes
psql -U postgres -d ecommerce_admin -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

## Backup Strategy

### Database Backup
```bash
# Manual backup
pg_dump -U postgres -d ecommerce_admin > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres -d ecommerce_admin < backup_20260726.sql
```

### Automated Backups
Add to crontab:
```bash
0 2 * * * pg_dump -U postgres -d ecommerce_admin > /backups/db_$(date +\%Y\%m\%d).sql
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Run multiple API instances
- Share session storage (Redis)

### Database Scaling
- Enable connection pooling
- Use read replicas for read-heavy operations
- Consider database sharding for large datasets

### Caching
- Add Redis for:
  - Session storage
  - API response caching
  - Rate limiting

---

## Troubleshooting Deployment Issues

### Build Fails
- Check Node.js version (should be 20.x)
- Verify all dependencies in package.json
- Check for TypeScript errors

### Migration Fails
- Verify DATABASE_URL is correct
- Check database exists
- Ensure database user has proper permissions

### Cannot Connect to Database
- Check firewall rules
- Verify security groups (AWS)
- Check database is running
- Test connection string manually

### 502 Bad Gateway
- Check if API is running
- Verify port configuration
- Check Nginx/proxy configuration

---

## Security Hardening

1. **Use Strong Secrets**
   - Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

2. **Enable Rate Limiting**
   ```bash
   npm install @nestjs/throttler
   ```

3. **Use Helmet**
   ```bash
   npm install helmet
   ```

4. **Configure CORS Properly**
   ```typescript
   app.enableCors({
     origin: ['https://yourdomain.com'],
     credentials: true,
   });
   ```

5. **Use HTTPS Only**
   - Configure SSL certificate
   - Redirect HTTP to HTTPS

6. **Hide Version Information**
   - Remove X-Powered-By header
   - Don't expose stack traces in production

---

## Support

For deployment issues:
- Check service provider documentation
- Review application logs
- Check database connectivity
- Verify environment variables
- Test endpoints with Postman

---

## Congratulations! 🚀

Your E-commerce Admin Dashboard API is now deployed and ready for production use!
