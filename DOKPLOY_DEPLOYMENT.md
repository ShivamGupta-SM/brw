# Baserow Deployment Guide for Dokploy

This guide walks you through deploying Baserow on Dokploy with Traefik reverse proxy.

## Prerequisites

- Dokploy installed and running
- Domain name pointing to your Dokploy server
- Docker and Docker Compose on the Dokploy server

## Deployment Steps

### 1. Create New Application in Dokploy

1. Open Dokploy dashboard
2. Create a new **Docker Compose** application
3. Name it: `baserow`

### 2. Configure Git Repository

In the Dokploy application settings:

1. **Repository URL**: `https://github.com/ShivamGupta-SM/brw.git`
2. **Branch**: `main`
3. **Compose File Path**: `docker-compose.dokploy.yml`

### 3. Set Environment Variables

In Dokploy's Environment Variables section, add these required variables:

```env
# === REQUIRED - Generate with: openssl rand -base64 48 ===
SECRET_KEY=<generate-random-string>
BASEROW_JWT_SIGNING_KEY=<generate-random-string>
DATABASE_PASSWORD=<generate-random-string>
REDIS_PASSWORD=<generate-random-string>

# === REQUIRED - Your domain ===
BASEROW_PUBLIC_URL=https://baserow.yourdomain.com
```

**To generate random secure keys:**
```bash
openssl rand -base64 48
```

Run this command 4 times to generate unique values for each key.

### 4. Configure Traefik Domain

In Dokploy's domain settings:

1. Add your domain: `baserow.yourdomain.com`
2. Enable SSL/TLS (Dokploy will handle Let's Encrypt automatically)
3. Ensure Traefik is configured to route to the application

### 5. Optional Environment Variables

Add these for enhanced functionality:

#### Email Configuration (for notifications and password resets)
```env
EMAIL_SMTP=true
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USE_TLS=true
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourdomain.com
```

#### AWS S3 Storage (recommended for production)
```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1
```

#### Performance Tuning
```env
BASEROW_AMOUNT_OF_WORKERS=3
BASEROW_FILE_UPLOAD_SIZE_LIMIT_MB=100
```

### 6. Deploy

1. Click **Deploy** in Dokploy
2. Dokploy will:
   - Pull the code from GitHub
   - Read `docker-compose.dokploy.yml`
   - Inject environment variables
   - Start all services
   - Configure Traefik routing and SSL

### 7. Verify Deployment

1. Check application logs in Dokploy
2. Wait for database migrations to complete (~1-2 minutes on first startup)
3. Access your Baserow instance at `https://baserow.yourdomain.com`

## Services Overview

The deployment includes these services:

- **backend**: Django REST API (port 8000 internal)
- **web-frontend**: Nuxt.js web interface (port 3000 internal)
- **celery**: Background task worker
- **celery-export-worker**: Export job worker
- **celery-beat-worker**: Scheduled task worker
- **db**: PostgreSQL 15 with pgvector extension
- **redis**: Redis 6 for caching and queues
- **volume-permissions-fixer**: Sets correct permissions for media files

## Routing

Dokploy's Traefik will automatically route traffic:

- **Port 3000** (web-frontend): Main application interface
- **Port 8000** (backend): API endpoints at `/api`, websockets at `/ws`, media at `/media`
- **SSL**: Automatic Let's Encrypt certificates via Dokploy
- **WebSocket**: Enabled for real-time features

## Data Persistence

These volumes persist your data:

- `pgdata`: PostgreSQL database
- `media`: User-uploaded files

**Important**: Dokploy manages these volumes. To backup your data, use Dokploy's backup features or manually backup these volumes.

## Updating

To update Baserow:

1. Push changes to your GitHub repository
2. Click **Redeploy** in Dokploy
3. Dokploy will pull the latest code and restart services

## Troubleshooting

### Application won't start
- Check Dokploy logs for errors
- Verify all required environment variables are set
- Ensure domain DNS is correctly configured

### 502 Bad Gateway
- Backend is still starting (wait 1-2 minutes)
- Check backend service logs in Dokploy
- Verify database migrations completed

### Can't upload files
- Check media volume permissions
- Verify `volume-permissions-fixer` ran successfully
- Consider using S3 storage for production

### Email not sending
- Verify EMAIL_SMTP variables are correct
- Test SMTP credentials separately
- Check backend logs for email errors

## Security Notes

This deployment includes:

- ✅ All Premium/Enterprise features unlocked
- ✅ All telemetry removed (PostHog, Sentry)
- ✅ No license validation
- ✅ SSL/TLS via Traefik and Let's Encrypt
- ✅ Secure proxy headers enabled
- ✅ Redis password protection
- ✅ PostgreSQL password protection

## Additional Configuration

For advanced configuration options, see `.env.dokploy` file or Baserow documentation.

## Support

For Dokploy-specific issues, refer to Dokploy documentation.
For Baserow configuration, see the original `.env.example` file.
