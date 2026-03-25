# OneCoffe Project Plan (CMPS460)

## 1. Project Mission
Build a database-heavy One Piece themed coffee shop web app called **OneCoffe** using:
- React frontend
- Node.js + Express backend API
- PostgreSQL relational database
- Docker Compose for local development

The course priority is strong relational modeling and a large set of practical SQL queries.

## 2. Functional Scope
### Core pages
- Landing page: coffee catalog with images, categories, prices, and availability.
- Order page: add items to cart and place simulated orders.
- Login page: customer/admin authentication.

### Core behaviors
- Users can browse coffees and see stock status.
- Customers can register/login and place orders.
- Orders can contain multiple items.
- Admin can view reports and analytics.

## 3. Data Model Plan (8 Tables)
Minimum required is 4; this plan uses 8 to maximize query depth.

### 3.1 `customers`
- `customer_id` (PK)
- `full_name`
- `email` (UNIQUE)
- `password_hash`
- `phone`
- `created_at`
- `is_active`

### 3.2 `coffees`
- `coffee_id` (PK)
- `name`
- `theme_tag` (One Piece naming/theme)
- `description`
- `price`
- `image_url`
- `is_available`
- `created_at`

### 3.3 `orders`
- `order_id` (PK)
- `customer_id` (FK -> `customers.customer_id`)
- `order_status` (pending, confirmed, completed, canceled)
- `order_total`
- `discount_code_id` (nullable FK)
- `placed_at`

### 3.4 `order_items`
- `order_item_id` (PK)
- `order_id` (FK -> `orders.order_id`)
- `coffee_id` (FK -> `coffees.coffee_id`)
- `quantity`
- `unit_price`
- `line_total`

### 3.5 `employees`
- `employee_id` (PK)
- `full_name`
- `role` (barista, manager)
- `email` (UNIQUE)
- `hired_at`
- `is_active`

### 3.6 `inventory_batches`
- `batch_id` (PK)
- `coffee_id` (FK -> `coffees.coffee_id`)
- `supplier_name`
- `quantity_received`
- `quantity_remaining`
- `received_at`
- `expiration_date`

### 3.7 `reviews`
- `review_id` (PK)
- `customer_id` (FK -> `customers.customer_id`)
- `coffee_id` (FK -> `coffees.coffee_id`)
- `rating` (1-5)
- `comment_text`
- `created_at`

### 3.8 `discount_codes`
- `discount_code_id` (PK)
- `code` (UNIQUE)
- `discount_type` (percent, flat)
- `discount_value`
- `is_active`
- `valid_from`
- `valid_to`

## 4. Relationship Design
- One customer -> many orders.
- One order -> many order items.
- One coffee -> many order items.
- One coffee -> many reviews.
- One customer -> many reviews.
- One coffee -> many inventory batches.
- One discount code -> many orders (nullable usage).

## 5. Docker Compose Setup

### `docker-compose.yml` overview
Three services:
1. **frontend** — React dev server (Vite), port 3000
2. **backend** — Node.js + Express API, port 5000
3. **database** — PostgreSQL 16, port 5432

### How it connects
- Frontend makes HTTP requests to `http://localhost:5000/api/...`
- Backend connects to PostgreSQL using hostname `database` (Docker DNS)
- Database data persists in a named Docker volume

### Key commands
```bash
# Start everything
docker compose up --build

# Start in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop everything
docker compose down

# Stop and delete database data
docker compose down -v

# Rebuild one service
docker compose up --build backend
```

## 6. Milestone Roadmap

## Milestone 0: Environment + Docker Setup
### Goals
- Set up project folders and Docker configuration.

### Tasks
- Create directories: `frontend/src`, `backend/src`, `database/migrations`, `database/seeds`, `database/queries`.
- Create `docker-compose.yml` with all three services.
- Create `Dockerfile` for frontend and backend.
- Add `.env` file for database and API settings.
- Verify `docker compose up` starts all services.

### Deliverables
- Working Docker Compose setup that starts all three services.

### Exit criteria
- `docker compose up --build` runs without errors and all services are accessible.

---

## Milestone 1: Database Schema v1
### Goals
- Implement initial SQL schema with constraints.

### Tasks
- Write DDL for all 8 planned tables.
- Add primary keys, foreign keys, unique constraints.
- Add checks (ex: rating range, positive prices/quantities).
- Define cascade policies where appropriate.
- Create an init script that runs automatically when the database container starts.

### Deliverables
- `database/migrations/001_schema.sql`
- ER diagram image or markdown table map.

### Exit criteria
- Schema loads automatically when `docker compose up` runs on a fresh setup.
- All FK relationships validate.

---

## Milestone 2: Seed Data + Realistic Test Dataset
### Goals
- Create meaningful sample data for query testing.

### Tasks
- Insert at least:
  - 40+ coffees
  - 100+ customers
  - 300+ orders
  - 800+ order items
  - 200+ reviews
  - 60+ inventory batches
- Include diverse dates, statuses, and price ranges.

### Deliverables
- `database/seeds/seed_data.sql`
- Optional generator script for bulk records.

### Exit criteria
- Database has enough volume to make aggregation queries non-trivial.

---

## Milestone 3: Backend API (Node.js + Express)
### Goals
- Implement core API routes backed by PostgreSQL.

### Tasks
- Setup Express server with `pg` connection pool.
- Build routes:
  - `GET /api/coffees`
  - `GET /api/coffees/:id`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/orders`
  - `GET /api/orders/:orderId`
  - `GET /api/customers/:id/orders`
- Add request validation.
- Add JWT auth middleware.
- Add CORS middleware for frontend access.

### Deliverables
- Working API with structured error responses.

### Exit criteria
- API tested against database with seeded data.

---

## Milestone 4: React Frontend
### Goals
- Build the three required pages.

### Tasks
- Landing page:
  - coffee grid/cards
  - image display
  - filter/search by name/theme
- Login page:
  - register + login forms
  - token storage
- Order page:
  - cart UI
  - quantity controls
  - order submission to backend

### Deliverables
- Navigable frontend with live API integration.

### Exit criteria
- End-to-end flow works: login -> browse -> order.

---

## Milestone 5: Query Portfolio (Main CMPS460 Requirement)
### Goals
- Build a large SQL query set demonstrating breadth and depth.

### Tasks
- Create categorized query files.
- Document purpose of each query.
- Include expected output columns.

### Deliverables
- `database/queries/basic_selects.sql`
- `database/queries/joins.sql`
- `database/queries/aggregations.sql`
- `database/queries/subqueries_ctes.sql`
- `database/queries/views_indexes.sql`

### Exit criteria
- 50+ meaningful queries documented and runnable.

---

## Milestone 6: Performance + Integrity Hardening
### Goals
- Improve query speed and enforce data integrity.

### Tasks
- Add indexes for common filters/joins.
- Run `EXPLAIN ANALYZE` on slow queries.
- Add transaction boundaries for order insert flow.
- Add DB constraints and default values where missing.

### Deliverables
- Performance notes and before/after query plans.

### Exit criteria
- Key report/API queries meet target latency on local data.

---

## Milestone 7: Final Demo + Documentation
### Goals
- Prepare class-ready submission package.

### Tasks
- Record demo sequence.
- Prepare SQL showcase script list.
- Add architecture section + ERD to README.
- Add known limitations and future improvements.

### Deliverables
- Final project with polished docs and repeatable setup.

### Exit criteria
- Anyone in class can follow docs and run the project with just `docker compose up`.

## 7. Query Backlog (60 Target Queries)
Use this as assignment execution checklist.

### A. Basic Retrieval (10)
1. List all coffees currently available.
2. List coffees under a certain price.
3. Find customer by email.
4. Show all orders with status `pending`.
5. List reviews with rating >= 4.
6. List all active discount codes.
7. List all inventory batches expiring this month.
8. Count active customers.
9. Show coffee names and prices sorted high to low.
10. Show latest 20 orders.

### B. Join Queries (15)
1. Orders with customer names.
2. Order items with coffee names.
3. Customer + their total order count.
4. Coffee + average review rating.
5. Coffee + total units sold.
6. Orders + discount code details.
7. Customers + their latest order date.
8. Inventory batches + coffee names.
9. Reviews with customer and coffee info.
10. Employee role distribution.
11. Orders and item counts per order.
12. Customer spend summary by month.
13. Revenue per coffee theme tag.
14. Most reviewed coffees by category/theme.
15. Discount usage frequency by code.

### C. Aggregates + Grouping (12)
1. Daily revenue totals.
2. Weekly revenue totals.
3. Monthly revenue totals.
4. Top 10 selling coffees.
5. Bottom 5 selling coffees.
6. Average order value.
7. Median order value (advanced).
8. Total reviews per coffee.
9. Average rating by coffee.
10. Average rating by customer segment.
11. Inventory remaining by coffee.
12. Cancellation rate by month.

### D. Subqueries + CTEs (10)
1. Customers who spent above global average.
2. Coffees never ordered.
3. Customers with no orders in last 90 days.
4. Top customer per month.
5. Running total revenue by day.
6. Rank coffees by sales volume.
7. Find repeat buyers (>= N orders).
8. Detect low-stock coffees via threshold CTE.
9. Highest-rated coffee per theme tag.
10. Most valuable discount code by generated revenue.

### E. Data Modification + Transactions (8)
1. Insert new customer.
2. Insert new order and order items in one transaction.
3. Update order status.
4. Apply discount code and recalculate total.
5. Soft deactivate customer.
6. Restock inventory batch insert + quantity update.
7. Delete review by id.
8. Rollback demo on intentional failure.

### F. Views / Indexes / Advanced (5)
1. Create view for `v_sales_summary_daily`.
2. Create view for `v_top_customers_monthly`.
3. Add index on `orders(customer_id, placed_at)`.
4. Add index on `order_items(coffee_id)`.
5. Compare plan before/after index with `EXPLAIN ANALYZE`.

## 8. API and Query Mapping
- `GET /api/coffees` -> basic retrieval + optional filters.
- `POST /api/orders` -> transaction query set (insert order + items).
- `GET /api/customers/:id/orders` -> joins + sorting by date.

## 9. Security + Data Rules
- Hash passwords (`bcryptjs`) before insert.
- Use parameterized SQL (`$1, $2` style with `pg` library).
- Validate input on the backend.
- Restrict admin routes behind JWT authentication.
- Never hardcode DB passwords; use `.env` and Docker environment variables.

## 10. Testing Strategy
### SQL tests
- Manual verification scripts for each query category.
- Integrity checks for FK/UNIQUE/NOT NULL behavior.

### API tests
- Verify auth, order creation, and failure paths.
- Check validation errors for invalid payloads.

### UI tests
- Validate landing page loads coffee images/data.
- Validate login error/success flows.
- Validate order submit and confirmation states.

## 11. Grading-Focused Artifacts
Prepare these for submission/demo:
- ERD diagram
- SQL schema file(s)
- Seed data script
- Query portfolio (50+)
- Screenshots of 3 core pages
- Screenshots or outputs of advanced query results
- README with setup and architecture

## 12. Suggested Timeline (7 Weeks)
- Week 1: Milestone 0-1 (Docker + Schema)
- Week 2: Milestone 2 (Seed Data)
- Week 3: Milestone 3 (Backend API)
- Week 4: Milestone 4 (React Frontend)
- Week 5: Milestone 5 (Query Portfolio)
- Week 6: Milestone 6 (Performance Hardening)
- Week 7: Milestone 7 (Final Demo + Polish)

## 13. Immediate Next Actions
1. Create `frontend/`, `backend/`, and `database/` directories.
2. Set up `docker-compose.yml` with React, Express, and PostgreSQL services.
3. Write initial migration SQL for 4 core tables first.
4. Seed small sample data and verify initial joins.
5. Build `GET /api/coffees` in Express and render it on the landing page.
6. Expand schema to all 8 tables and start query portfolio.
