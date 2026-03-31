# OneCafe (CMPS460 Database Project)

## Project Overview
OneCoffe is a One Piece themed coffee shop website built for **CMPS460 (Database Systems)**. The project is database-heavy and focuses on relational design, SQL querying, and practical data workflows.

The website includes:
- A **landing page** with coffee cards and images
- An **order page** for placing mock orders (no real card processing)
- A **login page** for customer/admin authentication

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose

## Architecture
```
┌──────────────┐      HTTP       ┌──────────────┐     SQL      ┌──────────────┐
│   Frontend   │ ──────────────► │   Backend    │ ───────────► │  PostgreSQL  │
│   (React)    │ ◄────────────── │  (Express)   │ ◄─────────── │  (Database)  │
│  port 3000   │      JSON       │  port 5000   │   Results    │  port 5432   │
└──────────────┘                 └──────────────┘              └──────────────┘
       │                                │                             │
       └────────────────────────────────┴─────────────────────────────┘
                         Docker Compose Network
```

## Why This Stack Fits CMPS460
- PostgreSQL gives strong support for joins, aggregates, views, indexes, transactions, and constraints.
- Express keeps backend API development simple and beginner-friendly.
- React makes it easy to present query-heavy data in dashboards/tables.
- Docker Compose runs everything with one command — no manual installs needed.

## Core Entities (8 Tables)
1. `customers`
2. `coffees`
3. `orders`
4. `order_items`
5. `employees`
6. `inventory_batches`
7. `reviews`
8. `discount_codes`

## Project Structure
```text
onecoffe/
  frontend/          # React app (Vite)
    src/
    Dockerfile
    package.json
  backend/           # Node.js + Express API
    src/
    Dockerfile
    package.json
  database/
    migrations/      # SQL schema files
    seeds/           # Sample data
    queries/         # Assignment query portfolio
  docker-compose.yml
  .env
  README.md
  PROJECT.md
```

## Quick Start (Docker Compose)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone and configure
```bash
git clone <your-repo-url>
cd onecoffe
```

### 2. Create `.env` file
```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=onecoffe

# Backend
API_PORT=5000
JWT_SECRET=change_me_in_production

# Database connection (used by backend)
DB_HOST=database
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=onecoffe
```

### 3. Run everything
```bash
docker compose up --build
```

This starts all three services:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **PostgreSQL:** localhost:5432

### 4. Stop everything
```bash
docker compose down
```

To also delete the database data:
```bash
docker compose down -v
```

## Course-Oriented Goals
- Use at least 4 relational tables with proper PK/FK constraints.
- Implement 50+ SQL queries (basic to advanced).
- Demonstrate normalization and indexing decisions.
- Show meaningful reports and analytics from real-looking data.
- Keep the website functional while showcasing database concepts first.

## Current Status
- Project documentation created
- Tech stack finalized (React + Express + PostgreSQL + Docker)
- Detailed milestone plan: see `PROJECT.md`
