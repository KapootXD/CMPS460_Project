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
- Cart page: view and adjust items saved for purchase (checkout can remain simulated).
- Login page: customer/admin authentication.

### Core behaviors
- Users can browse coffees and see stock status.
- Customers can register/login and manage a cart.
- Carts contain multiple line items (`cart_items`).
- Admin can view reports and analytics.

## 3. Data Model Plan (4 Tables)
The course minimum is 4 relational tables; this project standardizes on the four tables defined in `database/migrations/001_schema.sql` (customers, coffees, `cart`, `cart_items`). Totals are computed from `quantity` and `unit_price` in queries or application code (third normal form).

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

### 3.3 `cart`
- `cart_id` (PK)
- `customer_id` (FK -> `customers.customer_id`)
- `cart_status` (`active`, `abandoned`)
- `updated_at`

### 3.4 `cart_items`
- `cart_item_id` (PK)
- `cart_id` (FK -> `cart.cart_id`, `ON DELETE CASCADE`)
- `coffee_id` (FK -> `coffees.coffee_id`)
- `quantity`
- `unit_price`
- *(No stored line total or cart total; derive `quantity * unit_price` and sums in SQL or the API for 3NF.)*

## 4. Relationship Design
- One customer -> many carts.
- One cart -> many cart items.
- One coffee -> many cart items.

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
- Write DDL for the four planned tables (`customers`, `coffees`, `cart`, `cart_items`).
- Add primary keys, foreign keys, unique constraints.
- Add checks (e.g. positive prices/quantities, valid `cart_status`).
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
- Create meaningful sample data for query testing across the four core tables.

### Tasks
- Insert at least (targets can grow with the course rubric):
  - 15+ coffees
  - 25+ customers
  - 80+ carts
  - 200+ cart line items
- Include diverse dates, `cart_status` values, and price ranges.

### Deliverables
- `database/seeds/002_seed_data.sql` (or equivalent seed script)
- Optional generator script for bulk records.

### Exit criteria
- Database has enough volume to make aggregation and join queries non-trivial.

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
  - `POST /api/cart` / `PUT /api/cart/items` (or equivalent) for cart mutations
  - `GET /api/cart/:cartId` or `GET /api/customers/:id/cart`
  - `GET /api/customers/:id/carts` (optional history)
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
- Cart page:
  - line items UI
  - quantity controls
  - persist cart via backend (e.g. checkout or save)

### Deliverables
- Navigable frontend with live API integration.

### Exit criteria
- End-to-end flow works: login -> browse -> manage cart.

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
- Add transaction boundaries for cart + line item insert/update flows.
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
Use this as assignment execution checklist. All items assume only `customers`, `coffees`, `cart`, and `cart_items` unless you add more tables later. Where “cart value” or “line value” is needed, use `quantity * unit_price` (and sums thereof), not stored total columns.

### A. Basic Retrieval (10)
1. List all coffees currently available.
2. List coffees under a certain price.
3. Find customer by email.
4. Show all carts with status `active`.
5. Count coffees grouped by `theme_tag`.
6. List carts updated in the last N days.
7. List `cart_items` with quantity above a threshold.
8. Count active customers (`is_active`).
9. Show coffee names and prices sorted high to low.
10. Show latest 20 carts by `updated_at`.

### B. Join Queries (15)
1. Carts with customer names.
2. Cart items with coffee names.
3. Customer + their total cart count.
4. Coffee + total units in carts (sum `cart_items.quantity`).
5. Carts + line item count per cart.
6. Customers + their most recently updated cart.
7. Single cart expanded to all line items (cart id, coffee names, quantities).
8. Coffees that have never appeared in any cart.
9. Average line value (`quantity * unit_price`) per coffee across `cart_items`.
10. Customer cart-value summary by month (sum of line values, grouped by month of `cart.updated_at`).
11. Cart value per coffee `theme_tag` (join `coffees`, aggregate).
12. Top customers by total current cart value (sum of line items in `active` carts).
13. Active carts with customer email.
14. Abandoned carts with item-level breakdown.
15. Coffees appearing in carts filtered by `cart_status`.

### C. Aggregates + Grouping (12)
1. Daily totals of cart line value (sum `quantity * unit_price` by date of `cart.updated_at`).
2. Weekly totals of the same.
3. Monthly totals of the same.
4. Top 10 coffees by quantity in `cart_items`.
5. Bottom 5 coffees by quantity in `cart_items`.
6. Average cart value (sum of line values per cart, then average across carts).
7. Median cart value (or percentile).
8. Total units per coffee in carts.
9. Cart count grouped by `cart_status`.
10. Average number of line items per cart.
11. Cart value or cart counts by customer cohort (e.g. by month of `customers.created_at`).
12. Share of `abandoned` vs `active` carts by month.

### D. Subqueries + CTEs (10)
1. Customers whose carts total above the global average cart value.
2. Coffees never added to a cart.
3. Customers with no cart activity in the last 90 days.
4. Top customer by cart value per calendar month.
5. Running total of aggregate cart line value by day.
6. Rank coffees by units in carts.
7. Customers with >= N carts.
8. Carts whose total line value exceeds the store average (subquery).
9. Best-represented coffee per `theme_tag` by units in carts.
10. Customers with the single highest-value cart (sum of line items).

### E. Data Modification + Transactions (8)
1. Insert new customer.
2. Insert new cart and cart items in one transaction.
3. Update `cart_status` (e.g. active -> abandoned).
4. Insert or update line items and bump `cart.updated_at` in one transaction.
5. Soft deactivate customer (`is_active`).
6. Update quantities on `cart_items` consistently within a transaction.
7. Remove line items or delete an empty cart (respecting FK/cascade rules).
8. Rollback demo on intentional failure.

### F. Views / Indexes / Advanced (5)
1. Create view for daily cart-line-value summary (e.g. `v_cart_value_daily`).
2. Create view for top customers by monthly cart value.
3. Add index on `cart(customer_id, updated_at)`.
4. Add index on `cart_items(coffee_id)`.
5. Compare plan before/after index with `EXPLAIN ANALYZE`.

## 8. API and Query Mapping
- `GET /api/coffees` -> basic retrieval + optional filters.
- Cart endpoints -> transaction patterns (insert/update `cart` + `cart_items`); expose computed totals in JSON rather than storing them.
- `GET /api/customers/:id/cart` (or similar) -> joins + sorting by `updated_at`.

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
- Verify auth, cart mutations, and failure paths.
- Check validation errors for invalid payloads.

### UI tests
- Validate landing page loads coffee images/data.
- Validate login error/success flows.
- Validate cart updates and confirmation or checkout states.

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
3. Keep `database/migrations/001_schema.sql` aligned with the four-table model (`cart` / `cart_items`, 3NF).
4. Seed sample data and verify joins across customers, coffees, cart, and cart items.
5. Build `GET /api/coffees` in Express and render it on the landing page.
6. Grow the query portfolio using the backlog in section 7.
