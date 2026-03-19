# OneCoffe (CMPS460 Database Project)

## Project Overview
OneCoffe is a One Piece themed coffee shop website built for **CMPS460 (Database Systems)**. The project is intentionally database-heavy and focuses on relational design, SQL querying, and practical data workflows.

The website will include:
- A **landing page** with coffee cards and images
- An **order page** for placing mock orders (no real card processing)
- A **login page** for customer/admin authentication

## Tech Stack
- **Frontend:** React + Vite
- **Backend API:** Bun.js (planned runtime) + Hono
- **Database:** PostgreSQL
- **Additional Server-Side Layer:** PHP + PostgreSQL (`pdo_pgsql`) for DB-focused scripts/pages

## Why This Stack Fits CMPS460
- PostgreSQL gives strong support for joins, aggregates, views, indexes, transactions, and constraints.
- Bun + Hono keeps API development fast.
- PHP + PostgreSQL is excellent for additional database reports/admin utilities and course demonstration.
- React makes it easy to present query-heavy data in dashboards/tables.

## Core Entities (Minimum 4+ Tables)
Initial table plan:
1. `customers`
2. `coffees`
3. `orders`
4. `order_items`

Planned extra tables for deeper query practice:
- `employees`
- `inventory_batches`
- `reviews`
- `discount_codes`

## Dependencies Installed (Node/Bun-Compatible)
Installed in this workspace:
- `react`, `react-dom`
- `hono`
- `pg`
- `dotenv`
- `zod`
- `cors`
- `bcryptjs`
- `jsonwebtoken`
- `vite`, `@vitejs/plugin-react`
- `typescript`, `tsx`
- `@types/node`, `@types/react`, `@types/react-dom`
- `concurrently`
- `eslint`, `prettier`

## Local Setup Notes
### 1. Bun runtime (needed for backend)
Bun is not currently installed in this environment.

Install on your machine:
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. PHP + PostgreSQL driver
PHP is not currently installed in this environment.

Install on macOS (Homebrew):
```bash
brew install php
```

Verify PostgreSQL support:
```bash
php -m | grep -E 'pdo|pgsql'
```

If missing, enable/install `pdo_pgsql` for your PHP setup.

### 3. PostgreSQL
Install and run PostgreSQL locally (or use a managed instance).

Example macOS install:
```bash
brew install postgresql@16
brew services start postgresql@16
```

## Planned Environment Variables
Create a `.env` file later with values like:
```env
# Bun API
API_PORT=3001
JWT_SECRET=change_me

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=onecoffe
PGUSER=postgres
PGPASSWORD=postgres

# PHP reporting/admin scripts can share these DB values
```

## Proposed Folder Structure
```text
onecoffe/
  frontend/        # React app (landing, order, login)
  backend/         # Bun + Hono API
  php/             # PHP pages/scripts using PostgreSQL
  database/
    migrations/    # SQL schema changes
    seeds/         # sample data
    queries/       # assignment query set
  README.md
  PROJECT.md
```

## Course-Oriented Goals
- Use at least 4 relational tables with proper PK/FK constraints.
- Implement many SQL queries (basic to advanced).
- Demonstrate normalization and indexing decisions.
- Show meaningful reports and analytics from real-looking data.
- Keep the website functional while showcasing database concepts first.

## Current Status
- Initial dependencies installed
- Project documentation created
- Detailed milestone plan: see `PROJECT.md`
# CMPS460_Project
