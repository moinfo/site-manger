# Arusha Site Manager — Deployment Procedure

Step-by-step guide for deploying the application to a production Linux server (Ubuntu 22.04/24.04).

---

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Server Preparation](#2-server-preparation)
3. [Database Setup](#3-database-setup)
4. [Application Deployment](#4-application-deployment)
5. [Web Server Configuration](#5-web-server-configuration)
6. [SSL Certificate](#6-ssl-certificate)
7. [Queue Worker Setup](#7-queue-worker-setup)
8. [Post-Deployment Verification](#8-post-deployment-verification)
9. [Updating the Application](#9-updating-the-application)
10. [Rollback Procedure](#10-rollback-procedure)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Pre-Deployment Checklist

Before starting, confirm you have:

- [ ] Ubuntu 22.04 or 24.04 server with root/sudo access
- [ ] Domain name pointed to server IP (DNS A record)
- [ ] SSH access to the server
- [ ] Git repository URL (or project files ready to transfer)
- [ ] MySQL root password or a database user prepared

---

## 2. Server Preparation

### 2.1 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install PHP 8.2 and Extensions

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

sudo apt install -y \
    php8.2-fpm \
    php8.2-cli \
    php8.2-common \
    php8.2-mysql \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    php8.2-gd \
    php8.2-mbstring \
    php8.2-bcmath \
    php8.2-intl \
    php8.2-readline
```

Verify:

```bash
php -v
# Should show PHP 8.2.x
```

### 2.3 Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

### 2.4 Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # Should show v20.x
npm -v
```

### 2.5 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2.6 Install MySQL 8

```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql

# Secure the installation
sudo mysql_secure_installation
```

### 2.7 Install Git

```bash
sudo apt install -y git
```

---

## 3. Database Setup

### 3.1 Create Database and User

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE site_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sitemanager'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON site_manager.* TO 'sitemanager'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> Replace `YOUR_STRONG_PASSWORD_HERE` with a strong password. Save it — you will need it for `.env`.

---

## 4. Application Deployment

### 4.1 Create Application Directory

```bash
sudo mkdir -p /var/www/site-manager
sudo chown $USER:$USER /var/www/site-manager
```

### 4.2 Clone the Repository

```bash
cd /var/www
git clone <repo-url> site-manager
cd site-manager
```

**Alternative — upload files manually:**

```bash
# From your local machine:
scp -r ./site-manager user@server-ip:/var/www/site-manager
```

### 4.3 Install PHP Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### 4.4 Configure Environment

```bash
cp .env.example .env
nano .env
```

Update the following values:

```env
APP_NAME="Arusha Site Manager"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=site_manager
DB_USERNAME=sitemanager
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

> **Important:** Set `APP_DEBUG=false` in production. Never leave it as `true`.

### 4.5 Generate Application Key

```bash
php artisan key:generate
```

### 4.6 Run Database Migrations

```bash
php artisan migrate --force
```

Expected output: tables created for users, projects, materials, subcontractors, contracts, payments, cash_inflows, charge_categories, financial_charges, sessions, cache, jobs.

### 4.7 Seed Admin User

```bash
php artisan db:seed --force
```

This creates the default admin account:
- **Email:** admin@sitemanager.com
- **Password:** password

> **Important:** Change this password immediately after first login.

### 4.8 Build Frontend Assets

```bash
npm ci
npm run build
```

Expected output: Vite builds assets into `public/build/`.

### 4.9 Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4.10 Set File Permissions

```bash
sudo chown -R www-data:www-data /var/www/site-manager
sudo chmod -R 755 /var/www/site-manager
sudo chmod -R 775 /var/www/site-manager/storage
sudo chmod -R 775 /var/www/site-manager/bootstrap/cache
```

---

## 5. Web Server Configuration

### 5.1 Create Nginx Server Block

```bash
sudo nano /etc/nginx/sites-available/site-manager
```

Paste the following (replace `your-domain.com`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;
    root /var/www/site-manager/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    # Handle Inertia.js SPA routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny hidden files
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 20M;
}
```

### 5.2 Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/site-manager /etc/nginx/sites-enabled/

# Remove default site if not needed
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5.3 Adjust PHP-FPM Settings (Optional)

For better performance, edit the pool config:

```bash
sudo nano /etc/php/8.2/fpm/pool.d/www.conf
```

Recommended settings for a small server:

```ini
pm = dynamic
pm.max_children = 20
pm.start_servers = 5
pm.min_spare_servers = 3
pm.max_spare_servers = 10
```

Restart PHP-FPM:

```bash
sudo systemctl restart php8.2-fpm
```

---

## 6. SSL Certificate

### 6.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

Follow the prompts. Certbot will automatically update the Nginx config to handle HTTPS.

### 6.3 Verify Auto-Renewal

```bash
sudo certbot renew --dry-run
```

---

## 7. Queue Worker Setup

The queue worker processes background jobs (e.g. large Excel imports).

### 7.1 Create Supervisor Config

```bash
sudo apt install -y supervisor
sudo nano /etc/supervisor/conf.d/site-manager-worker.conf
```

```ini
[program:site-manager-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/site-manager/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/site-manager/storage/logs/worker.log
stopwaitsecs=3600
```

### 7.2 Start the Worker

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start site-manager-worker:*
```

---

## 8. Post-Deployment Verification

Run through this checklist after deployment:

### 8.1 Application Checks

- [ ] Open `https://your-domain.com` in a browser — login page loads
- [ ] Log in with admin@sitemanager.com / password
- [ ] Dashboard shows charts and summary cards
- [ ] Navigate to Projects — create a test project
- [ ] Navigate to Expenses — add a test expense
- [ ] Navigate to Reports — view Monthly Expenses report
- [ ] Download a PDF report — PDF generates correctly
- [ ] Download a CSV report — file downloads correctly
- [ ] Toggle language (EN/SW) — UI switches language
- [ ] Toggle dark mode — theme changes

### 8.2 Server Checks

```bash
# Check Nginx is running
sudo systemctl status nginx

# Check PHP-FPM is running
sudo systemctl status php8.2-fpm

# Check queue worker is running
sudo supervisorctl status

# Check Laravel logs for errors
tail -50 /var/www/site-manager/storage/logs/laravel.log
```

### 8.3 Security Checks

- [ ] `APP_DEBUG=false` in `.env`
- [ ] `.env` file is not publicly accessible (try `https://your-domain.com/.env`)
- [ ] Default admin password has been changed
- [ ] SSL certificate is active (HTTPS works)

---

## 9. Updating the Application

When deploying new code:

```bash
cd /var/www/site-manager

# Pull latest code
git pull origin main

# Install updated dependencies
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# Run new migrations
php artisan migrate --force

# Clear and rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart queue worker
sudo supervisorctl restart site-manager-worker:*

# Restart PHP-FPM (clears opcache)
sudo systemctl restart php8.2-fpm
```

### Quick Update Script

Save this as `/var/www/site-manager/deploy.sh`:

```bash
#!/bin/bash
set -e

cd /var/www/site-manager

echo "Pulling latest code..."
git pull origin main

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "Installing JS dependencies and building..."
npm ci
npm run build

echo "Running migrations..."
php artisan migrate --force

echo "Clearing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Restarting services..."
sudo supervisorctl restart site-manager-worker:*
sudo systemctl restart php8.2-fpm

echo "Deployment complete!"
```

Make it executable:

```bash
chmod +x /var/www/site-manager/deploy.sh
```

Run future deployments with:

```bash
sudo /var/www/site-manager/deploy.sh
```

---

## 10. Rollback Procedure

If a deployment causes issues:

### 10.1 Code Rollback

```bash
cd /var/www/site-manager

# Find the previous commit
git log --oneline -5

# Rollback to previous commit
git checkout <previous-commit-hash>

# Reinstall and rebuild
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo systemctl restart php8.2-fpm
sudo supervisorctl restart site-manager-worker:*
```

### 10.2 Database Rollback

```bash
# Rollback the last migration batch
php artisan migrate:rollback --force
```

> Only use this if the new code added migrations. This will drop the new tables/columns.

### 10.3 Full Database Restore (from backup)

```bash
mysql -u sitemanager -p site_manager < /path/to/backup.sql
```

---

## 11. Troubleshooting

### 500 Internal Server Error

```bash
# Check Laravel log
tail -100 /var/www/site-manager/storage/logs/laravel.log

# Check Nginx error log
tail -100 /var/log/nginx/error.log

# Common fix: permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Blank Page / Assets Not Loading

```bash
# Verify assets were built
ls -la public/build/

# If missing, rebuild
npm ci && npm run build
```

### "Class not found" Error

```bash
composer dump-autoload --optimize
php artisan config:cache
```

### Database Connection Refused

```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials
mysql -u sitemanager -p -e "SELECT 1"

# Check .env values match
grep DB_ .env
```

### PDF Export Returns Empty/Error

DomPDF requires the `gd` extension:

```bash
php -m | grep gd
# If missing:
sudo apt install php8.2-gd
sudo systemctl restart php8.2-fpm
```

### Queue Jobs Not Processing

```bash
# Check supervisor status
sudo supervisorctl status

# Restart if stopped
sudo supervisorctl restart site-manager-worker:*

# Check worker log
tail -50 /var/www/site-manager/storage/logs/worker.log
```

---

## Backup Recommendations

### Daily Database Backup

Add to crontab (`crontab -e`):

```cron
0 2 * * * mysqldump -u sitemanager -pYOUR_PASSWORD site_manager > /var/backups/site-manager/db-$(date +\%Y\%m\%d).sql
```

### Keep 30 Days of Backups

```cron
0 3 * * * find /var/backups/site-manager -name "db-*.sql" -mtime +30 -delete
```

Create the backup directory:

```bash
sudo mkdir -p /var/backups/site-manager
sudo chown $USER:$USER /var/backups/site-manager
```

---

## Server Sizing Recommendations

| Users | Server Spec |
|-------|------------|
| 1-5 | 1 vCPU, 1 GB RAM |
| 5-20 | 2 vCPU, 2 GB RAM |
| 20-50 | 4 vCPU, 4 GB RAM |

The application is lightweight. A $5-10/month VPS (DigitalOcean, Hetzner, Vultr) is sufficient for most use cases.
