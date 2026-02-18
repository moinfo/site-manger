# Site Manager - Construction Project Management System

A simple, practical system for managing construction site expenses, subcontractor payments, and cash flow. Built to replace Excel-based tracking with a proper web application.

## Problem

Construction sites in Arusha are currently tracked using Excel spreadsheets — material purchases, subcontractor billing, cash in/out — all scattered across multiple sheets. This makes it hard to get quick answers: "How much have we spent this month?", "How much do we owe Baraka?", "What's our cash balance?"

## Solution

A Laravel web application with 5 core modules that gives real-time visibility into project finances.

---

## Features

### Dashboard
- Total spent this month (big number at a glance)
- Spending by category (pie chart: cement, paint, transport, labor, etc.)
- Monthly spending trend (bar chart, last 6 months)
- Subcontractor balances (who is owed / overpaid)
- Current cash position
- Recent expense entries

### Expenses Tracking (Priority Module)
- Daily material purchase log
- Categorize expenses (cement, paint, timber, electrical, plumbing, transport, labor, other)
- Filter by date range, category, project
- Monthly subtotals
- Bulk entry support

### Subcontractor Management
- Register subcontractors with contact info
- Create work contracts with billed amounts
- Record partial payments with dates
- Auto-calculate: total billed vs total paid vs balance
- View full payment history per contractor

### Cash Flow
- Record cash received (from funders/clients)
- Track cash outflows (auto-linked from expenses + payments)
- Monthly summary: total in, total out, running balance
- Identify negative cash positions early

### Reports
- Monthly expense report by project
- Expense breakdown by category
- Subcontractor payment summary
- Cash flow statement
- Export to PDF and Excel

### Data Import
- One-click import from existing Excel files
- Maps ACCOUNTS and WORKS sheets to expenses
- Maps subcontractor sheets to contracts and payments
- Maps CASH IN - CASH OUT to cash inflows

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 11 (PHP 8.2+) |
| Frontend | Blade templates |
| CSS | Tailwind CSS 3 |
| JS | Alpine.js 3 |
| Charts | Chart.js |
| Database | MySQL 8 |
| Auth | Laravel Breeze |
| Excel | Maatwebsite Laravel Excel |
| PDF | Barryvdh Laravel DomPDF |

---

## User Roles

| Role | Can Do |
|------|--------|
| **Admin** | Everything — manage users, full access to all modules |
| **Manager** | Add expenses, manage subcontractors, view dashboard & reports |
| **Accountant** | Add expenses, record cash in/out, view financial reports |
| **Viewer** | Read-only access to dashboard and reports |

---

## Database Schema

### projects
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Project name (e.g., "Arusha Main House") |
| location | string | Site location |
| start_date | date | Project start |
| end_date | date | nullable, Project end |
| budget | decimal | Total budget in TZS |
| status | enum | active, completed, on_hold |
| created_at | timestamp | |
| updated_at | timestamp | |

### users
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Full name |
| email | string | Login email |
| password | string | Hashed |
| role | enum | admin, manager, accountant, viewer |
| created_at | timestamp | |
| updated_at | timestamp | |

### materials (expenses)
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| project_id | foreign | Links to projects |
| date | date | Purchase date |
| description | string | Item name (e.g., "TWIGA CEMENT") |
| quantity | decimal | Amount purchased |
| unit | string | BAGS, PCS, KGS, TRIP, BKTS, ROLL, etc. |
| unit_price | decimal | Price per unit in TZS |
| subtotal | decimal | qty * unit_price |
| category | enum | cement, paint, timber, electrical, plumbing, steel, transport, labor, hardware, other |
| recorded_by | foreign | User who entered it |
| created_at | timestamp | |
| updated_at | timestamp | |

### subcontractors
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Contractor name |
| phone | string | nullable, Contact number |
| notes | text | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### contracts
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| subcontractor_id | foreign | Links to subcontractors |
| project_id | foreign | Links to projects |
| description | string | Work description (e.g., "Main House Plaster") |
| billed_amount | decimal | Agreed amount in TZS |
| status | enum | pending, in_progress, completed, cancelled |
| created_at | timestamp | |
| updated_at | timestamp | |

### payments
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| contract_id | foreign | Links to contracts |
| date | date | Payment date |
| amount | decimal | Amount paid in TZS |
| notes | string | nullable, e.g., "partial payment" |
| recorded_by | foreign | User who recorded it |
| created_at | timestamp | |
| updated_at | timestamp | |

### cash_inflows
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| project_id | foreign | Links to projects |
| date | date | Date received |
| source | string | Funder name (e.g., "Wildedge Safaris Ltd") |
| amount | decimal | Amount in TZS |
| notes | string | nullable |
| recorded_by | foreign | User who recorded it |
| created_at | timestamp | |
| updated_at | timestamp | |

### Relationships
```
Project    → has many Materials (expenses)
Project    → has many Contracts
Project    → has many CashInflows

Subcontractor → has many Contracts
Contract      → has many Payments
Contract      → belongs to Project
Contract      → belongs to Subcontractor

User → has many Materials (recorded_by)
User → has many Payments (recorded_by)
User → has many CashInflows (recorded_by)
```

---

## Pages & Routes

```
Auth
  GET  /login                     → Login page
  GET  /register                  → Register (admin only)

Dashboard
  GET  /dashboard                 → Main dashboard with widgets

Projects
  GET  /projects                  → List all projects
  GET  /projects/create           → New project form
  POST /projects                  → Store project
  GET  /projects/{id}             → Project detail
  GET  /projects/{id}/edit        → Edit project
  PUT  /projects/{id}             → Update project

Expenses
  GET  /expenses                  → List with filters (date, category, project)
  GET  /expenses/create           → New expense form
  POST /expenses                  → Store expense
  GET  /expenses/{id}/edit        → Edit expense
  PUT  /expenses/{id}             → Update expense
  DEL  /expenses/{id}             → Delete expense

Subcontractors
  GET  /subcontractors            → List all with balances
  GET  /subcontractors/create     → New subcontractor form
  POST /subcontractors            → Store subcontractor
  GET  /subcontractors/{id}       → Detail: contracts + payments
  POST /subcontractors/{id}/contracts → Add contract
  POST /contracts/{id}/payments   → Add payment

Cash Flow
  GET  /cashflow                  → Monthly summary view
  GET  /cashflow/inflows/create   → Record cash received
  POST /cashflow/inflows          → Store inflow

Reports
  GET  /reports                   → Report selection
  GET  /reports/monthly           → Monthly expense report
  GET  /reports/subcontractors    → Subcontractor payment report
  GET  /reports/cashflow          → Cash flow statement
  GET  /reports/export/{type}     → Export as PDF or Excel

Admin
  GET  /users                     → User management
  GET  /users/create              → Add user
  POST /users                     → Store user

Import
  GET  /import                    → Upload Excel page
  POST /import                    → Process Excel file
```

---

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ & npm
- MySQL 8

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd site-manager

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Set database credentials in .env
# DB_DATABASE=site_manager
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed default admin user
php artisan db:seed

# Build frontend assets
npm run build

# Start the server
php artisan serve
```

### Default Admin Account
After seeding:
- Email: `admin@sitemanager.com`
- Password: `password`
(Change this immediately after first login)

### Import Existing Data
1. Go to `/import` in the browser
2. Upload `ARUSHA SITE.xlsx`
3. The system will map data to the appropriate tables
4. Review the import summary

---

## Project Structure

```
site-manager/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── DashboardController.php
│   │   │   ├── ProjectController.php
│   │   │   ├── MaterialController.php      (expenses)
│   │   │   ├── SubcontractorController.php
│   │   │   ├── ContractController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── CashInflowController.php
│   │   │   ├── ReportController.php
│   │   │   ├── ImportController.php
│   │   │   └── UserController.php
│   │   ├── Middleware/
│   │   │   └── CheckRole.php
│   │   └── Requests/
│   │       ├── StoreMaterialRequest.php
│   │       ├── StorePaymentRequest.php
│   │       └── ...
│   ├── Models/
│   │   ├── Project.php
│   │   ├── Material.php
│   │   ├── Subcontractor.php
│   │   ├── Contract.php
│   │   ├── Payment.php
│   │   └── CashInflow.php
│   ├── Services/
│   │   ├── ImportService.php
│   │   └── ReportService.php
│   └── Policies/
│       └── ...
├── resources/views/
│   ├── layouts/
│   │   └── app.blade.php            (main layout + sidebar)
│   ├── dashboard/
│   │   └── index.blade.php
│   ├── expenses/
│   │   ├── index.blade.php
│   │   └── create.blade.php
│   ├── subcontractors/
│   │   ├── index.blade.php
│   │   └── show.blade.php
│   ├── cashflow/
│   │   └── index.blade.php
│   ├── reports/
│   │   └── index.blade.php
│   └── admin/
│       └── users/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── web.php
```

---

## Currency

All monetary values are in **Tanzanian Shillings (TZS)**. Displayed with thousand separators (e.g., 1,450,000).

---

## License

Private — Moinfotech internal use.
