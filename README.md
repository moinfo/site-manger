# Arusha Site Manager

Construction site management application for tracking projects, expenses, subcontractors, cash flow, and financial charges. Built for Moinfotech.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12 (PHP 8.2+) |
| Frontend | React 18, TypeScript, Inertia.js |
| UI | Mantine v8 |
| Charts | Recharts |
| Database | MySQL 8 |
| Auth | Laravel Breeze, role-based |
| Reports | DomPDF (PDF), CSV export |
| Import | Maatwebsite Laravel Excel |
| i18n | English / Swahili |

## Features

- **Dashboard** — Project overview, spending charts, cash balance, subcontractor balances
- **Expenses** — Material/expense tracking with category auto-detection
- **Projects** — CRUD with budget tracking and status management
- **Subcontractors** — Contracts, partial payments, auto-calculated balances
- **Cash Flow** — Income tracking and management
- **Financial Charges** — Custom charge categories and tracking
- **Reports** — In-browser views + PDF/CSV export with date & project filters
  - Monthly Expense Report
  - Subcontractor Summary
  - Cash Flow Statement
  - Project Statement (debit/credit ledger with opening/closing balance)
- **Excel Import** — Bulk import from spreadsheets (admin only)
- **Bilingual** — English / Swahili toggle
- **Dark Mode** — Light/dark theme toggle

## User Roles

| Role | Access |
|------|--------|
| **admin** | Full access + user management + Excel import |
| **manager** | Projects, expenses, subcontractors, cash flow, reports |
| **accountant** | Expenses, cash flow, reports |
| **viewer** | Read-only dashboard and reports |

## Currency

All monetary values are in **TZS (Tanzanian Shillings)**.

---

## Requirements

- PHP 8.2+ with extensions: `mbstring`, `xml`, `curl`, `zip`, `gd`, `pdo_mysql`
- Composer 2
- Node.js 20+ & npm
- MySQL 8+

## Local Development

### Prerequisites

1. Install PHP 8.2+, Composer, Node.js 20+, and MySQL 8+
2. Create a MySQL database:

```sql
CREATE DATABASE site_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Setup

```bash
# Clone the repository
git clone <repo-url> site-manager
cd site-manager

# One-command setup (installs deps, generates key, runs migrations, builds assets)
composer setup

# Update .env with your MySQL credentials
# DB_CONNECTION=mysql
# DB_DATABASE=site_manager
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed the admin user
php artisan db:seed

# Start all dev services (Laravel server + queue + logs + Vite HMR)
composer dev
```

The app will be available at **http://localhost:8000**.

### Default Admin Login

| Email | Password |
|---|---|
| admin@sitemanager.com | password |

> Change this immediately after first login in production.

### Import Existing Data

1. Log in as admin
2. Go to `/import`
3. Upload the Excel file (e.g. `ARUSHA SITE.xlsx`)
4. The system auto-maps sheets to expenses, subcontractors, contracts, payments, and cash inflows

---

## Production Deployment

### 1. Install and Configure

```bash
# Clone
git clone <repo-url> /var/www/site-manager
cd /var/www/site-manager

# Install PHP dependencies (production)
composer install --no-dev --optimize-autoloader

# Install JS dependencies and build
npm ci
npm run build

# Configure environment
cp .env.example .env
nano .env
```

### 2. Environment Configuration (`.env`)

```env
APP_NAME="Arusha Site Manager"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# MySQL for production
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=site_manager
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

### 3. Initialize

```bash
# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate --force

# Seed admin user
php artisan db:seed --force

# Cache configuration for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set file permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/site-manager/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 5. Queue Worker (optional)

Required if using queued jobs (e.g. large Excel imports):

```bash
php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

For production, use Supervisor or a systemd service to keep the worker running.

---

## Routes

```
Dashboard
  GET  /dashboard                      Main dashboard

Projects
  GET  /projects                       List projects
  POST /projects                       Create project
  GET  /projects/{id}                  Project detail
  PUT  /projects/{id}                  Update project
  DEL  /projects/{id}                  Delete project

Expenses
  GET  /expenses                       List with filters
  POST /expenses                       Create expense
  GET  /expenses/{id}/edit             Edit form
  PUT  /expenses/{id}                  Update expense
  DEL  /expenses/{id}                  Delete expense

Subcontractors
  GET  /subcontractors                 List with balances
  GET  /subcontractors/{id}            Detail: contracts + payments
  POST /subcontractors/{id}/contracts  Add contract
  POST /contracts/{id}/payments        Add payment

Cash Flow
  GET  /cashflow                       Cash inflow list
  POST /cashflow                       Record inflow
  DEL  /cashflow/{id}                  Delete inflow

Financial Charges
  GET  /charges                        List charges
  POST /charges                        Create charge
  PUT  /charges/{id}                   Update charge
  DEL  /charges/{id}                   Delete charge
  POST /charge-categories              Create category
  DEL  /charge-categories/{id}         Delete category

Reports
  GET  /reports                        Report hub
  GET  /reports/monthly                Monthly expense view
  GET  /reports/subcontractors         Subcontractor summary view
  GET  /reports/cashflow               Cash flow statement view
  GET  /reports/project-statement      Project statement view
  GET  /reports/export/{type}          PDF/CSV export

Admin (admin role only)
  GET  /users                          User management
  GET  /import                         Excel import page
  POST /import                         Process Excel upload
```

---

## Project Structure

```
app/
  Http/Controllers/
    DashboardController.php        Overview with charts
    MaterialController.php         Expense CRUD
    ProjectController.php          Project CRUD
    SubcontractorController.php    Subcontractor CRUD
    ContractController.php         Contract management
    PaymentController.php          Payment recording
    CashInflowController.php       Cash inflow management
    FinancialChargeController.php  Financial charges CRUD
    ReportController.php           All reports + PDF/CSV exports
    ImportController.php           Excel import (admin)
    UserController.php             User management (admin)
  Models/
    Project, Material, Subcontractor, Contract, Payment,
    CashInflow, FinancialCharge, ChargeCategory, User

resources/js/
  Pages/
    Dashboard.tsx                  Overview with Recharts
    Expenses/                      Material expense CRUD
    Projects/                      Project CRUD
    Subcontractors/                Subcontractor + contracts + payments
    CashFlow/                      Cash inflow management
    Charges/                       Financial charges CRUD
    Reports/
      Index.tsx                    Report hub
      MonthlyExpenses.tsx          Monthly expense breakdown
      SubcontractorSummary.tsx     Subcontractor balances
      CashFlowStatement.tsx        Cash in vs out
      ProjectStatement.tsx         Ledger with opening/closing balance
    Admin/Users/                   User management
    Import/                        Excel upload
  contexts/
    LanguageContext.tsx             EN/SW bilingual translations
  Components/
    DatePicker.tsx                 Flatpickr date picker
    ColorSchemeToggle.tsx          Dark/light mode toggle
    LanguageToggle.tsx             EN/SW language switch

resources/views/reports/           Blade templates for PDF export

database/
  migrations/                      All table definitions
  seeders/
    DatabaseSeeder.php             Seeds admin user
```

## License

Private — Moinfotech internal use.
