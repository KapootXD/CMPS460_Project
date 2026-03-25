# STUDENT.md — Full Project Scaffolding Explained

This document explains **every single file** in the project, what it does, how the pieces connect, and what you need to do on your end to get everything running.

---

## Table of Contents
1. [The Big Picture](#1-the-big-picture)
2. [What YOU Need to Do](#2-what-you-need-to-do)
3. [Root-Level Files](#3-root-level-files)
4. [The Backend Folder](#4-the-backend-folder)
5. [The Frontend Folder](#5-the-frontend-folder)
6. [The Database Folder](#6-the-database-folder)
7. [How They All Connect](#7-how-they-all-connect)
8. [Common Questions](#8-common-questions)
9. [Useful Commands](#9-useful-commands)

---

## 1. The Big Picture

This project has **three services** that work together:

```
┌──────────────────────────────────────────────────────────────────┐
│                     Docker Compose                               │
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│   │   Frontend   │    │   Backend    │    │   Database   │      │
│   │              │    │              │    │              │      │
│   │  React app   │───►│  Express API │───►│  PostgreSQL  │      │
│   │  (Vite)      │    │  (Node.js)   │    │  (stores     │      │
│   │              │◄───│              │◄───│   data)      │      │
│   │  Port 3000   │    │  Port 5000   │    │  Port 5432   │      │
│   └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
│   You open this        Frontend talks       Backend talks        │
│   in your browser      to this over HTTP    to this over SQL     │
└──────────────────────────────────────────────────────────────────┘
```

**Docker Compose** is the glue. It reads the `docker-compose.yml` file and:
1. Builds a container for the frontend (React)
2. Builds a container for the backend (Express)
3. Pulls a pre-built container for PostgreSQL (no build needed)
4. Puts them all on the **same virtual network** so they can talk to each other
5. Starts them all with **one command**: `docker compose up --build`

**You do NOT need to manually connect anything.** Docker Compose handles the networking. The backend knows how to find the database because Docker Compose gives each service a hostname equal to its service name (the database service is reachable at hostname `database`).

---

## 2. What YOU Need to Do

### Prerequisites
The only thing you need installed on your computer is:

✅ **Docker Desktop** — [Download here](https://www.docker.com/products/docker-desktop/)

That's it. You do NOT need to install:
- ❌ Node.js (Docker handles it)
- ❌ PostgreSQL (Docker handles it)
- ❌ npm (Docker handles it)

Docker Desktop includes both `docker` and `docker compose` commands.

### Steps to Run

```bash
# 1. Open a terminal and navigate to the project folder
cd /Users/pete/Documents/CMPS460_Project

# 2. Make sure Docker Desktop is open and running (check the whale icon in your menu bar)

# 3. Start everything
docker compose up --build
```

The first time you run this, Docker will:
- Download the Node.js 20 base image (~150MB)
- Download the PostgreSQL 16 image (~400MB)
- Install all npm packages for frontend and backend
- Create the database and run the schema + seed SQL files
- Start all three services

This takes **2-5 minutes** the first time. After that, it's much faster.

### When it's working, you'll see:
```
database-1  | PostgreSQL init process complete; ready for start up.
backend-1   | ✅ Connected to PostgreSQL
backend-1   | 🚀 OneCoffe API running on port 5000
frontend-1  | VITE v6.x.x ready in XXX ms
frontend-1  |   ➜ Local:   http://localhost:3000/
```

Then open **http://localhost:3000** in your browser.

---

## 3. Root-Level Files

These files live in the project root (`CMPS460_Project/`):

### `docker-compose.yml`
**What it is:** The master configuration file that tells Docker how to run your entire app.

**What it does:**
- Defines three **services**: `frontend`, `backend`, `database`
- For frontend and backend: tells Docker to build using their respective `Dockerfile`
- For database: tells Docker to use the official `postgres:16` image (no build needed)
- Maps **ports** so you can access services from your browser
- Sets **environment variables** (database credentials, etc.)
- Creates a **volume** called `pgdata` so your database data survives restarts
- Mounts the `database/migrations/` and `database/seeds/` folders into the PostgreSQL container so the SQL files run automatically on first startup
- Mounts your `src/` folders so code changes appear live without rebuilding

**Key parts explained:**
```yaml
services:
  frontend:
    build: ./frontend           # "Build a container using frontend/Dockerfile"
    ports:
      - "3000:3000"             # "Map my computer's port 3000 to the container's port 3000"
    volumes:
      - ./frontend/src:/app/src # "Sync my local src/ into the container for live reload"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      database:
        condition: service_healthy  # "Don't start backend until database is ready"
    environment:
      - DB_HOST=database        # "The database hostname is 'database'" (Docker DNS magic)

  database:
    image: postgres:16          # "Use the official PostgreSQL 16 image, don't build anything"
    volumes:
      - pgdata:/var/lib/postgresql/data                          # Persist data
      - ./database/migrations:/docker-entrypoint-initdb.d/migrations  # Auto-run SQL
      - ./database/seeds:/docker-entrypoint-initdb.d/seeds            # Auto-run SQL
    healthcheck:
      test: ["CMD-SHELL", "pg_isready ..."]  # "Check if PostgreSQL is accepting connections"
```

### `.env`
**What it is:** A file that stores configuration values (like passwords) in one place.

**What it does:** Docker Compose reads this file and substitutes the values into `docker-compose.yml` wherever you see `${VARIABLE_NAME}`. This way you don't hardcode passwords in your code.

```env
POSTGRES_USER=postgres          # Database username
POSTGRES_PASSWORD=postgres      # Database password
POSTGRES_DB=onecoffe            # Database name (created automatically)
JWT_SECRET=change_me_in_production  # Secret key for login tokens (used later)
```

### `.gitignore`
**What it is:** Tells Git which files/folders to NOT track.

**What it does:** Prevents `node_modules/`, `.env`, and other generated files from being committed to your repository. These files are either generated automatically or contain secrets.

---

## 4. The Backend Folder

```
backend/
├── Dockerfile           # Instructions to build the backend container
├── package.json         # Lists what npm packages to install
└── src/
    ├── server.js        # The Express API server (main entry point)
    └── db.js            # Database connection setup
```

### `backend/Dockerfile`
**What it is:** A recipe that tells Docker how to create the backend container.

**What it does, line by line:**
```dockerfile
FROM node:20-alpine         # Start with a lightweight Linux + Node.js 20 image
WORKDIR /app                # All following commands run inside /app in the container
COPY package.json ./        # Copy package.json into the container
RUN npm install             # Install all the packages listed in package.json
COPY . .                    # Copy the rest of the backend code into the container
EXPOSE 5000                 # Document that this container uses port 5000
CMD ["npm", "run", "dev"]   # When the container starts, run "npm run dev"
```

Think of it like: "Start with a computer that has Node.js, copy my code into it, install my packages, and start the server."

### `backend/package.json`
**What it is:** The manifest file for the backend. Lists project info, scripts, and dependencies.

**Scripts:**
```json
"scripts": {
    "dev": "node --watch src/server.js",   // Start server with auto-reload on file changes
    "start": "node src/server.js"          // Start server normally (production)
}
```

The `--watch` flag means: if you edit `server.js` or `db.js`, Node will automatically restart. No need to stop and restart manually.

**Dependencies (packages installed):**

| Package | What it does |
|---|---|
| `express` | Web framework — handles HTTP routes like `GET /api/coffees` |
| `pg` | PostgreSQL client — lets Node.js send SQL queries to the database |
| `cors` | Allows the frontend (port 3000) to make requests to the backend (port 5000). Without this, browsers block the requests for security reasons |
| `dotenv` | Reads `.env` files into `process.env` (useful when running outside Docker) |
| `bcryptjs` | Hashes passwords so you never store plain text passwords in the database |
| `jsonwebtoken` | Creates and verifies JWT tokens for login authentication |

### `backend/src/db.js`
**What it is:** The database connection module. This is HOW the backend talks to PostgreSQL.

**What it does, line by line:**
```javascript
import pg from 'pg';                    // Import the PostgreSQL client library

const pool = new pg.Pool({              // Create a "connection pool"
  host: process.env.DB_HOST,            // Where is the database? → "database" (Docker hostname)
  port: process.env.DB_PORT,            // What port? → 5432 (PostgreSQL default)
  user: process.env.DB_USER,            // Login as who? → "postgres"
  password: process.env.DB_PASSWORD,    // With what password? → "postgres"
  database: process.env.DB_NAME,        // Which database? → "onecoffe"
});

export default pool;                    // Make it available to other files
```

**What is a "connection pool"?**
Instead of opening a new database connection for every single request (slow), a pool keeps a few connections open and reuses them. Think of it like having 10 phone lines to the database instead of dialing a new number every time.

**How does `DB_HOST=database` work?**
Docker Compose creates a virtual network. Each service can reach other services by their service name. Since the PostgreSQL service is named `database` in `docker-compose.yml`, the backend can connect to it using hostname `database`. Docker resolves this to the correct IP address automatically. You never need to know the actual IP.

### `backend/src/server.js`
**What it is:** The main API server. This is the "brain" of the backend.

**What it does:**
```javascript
import express from 'express';       // Import Express framework
import cors from 'cors';             // Import CORS middleware
import pool from './db.js';          // Import the database connection from db.js

const app = express();               // Create an Express application
const PORT = process.env.PORT || 5000;

app.use(cors());                     // Allow frontend to make requests
app.use(express.json());             // Parse JSON request bodies (for POST requests)

// Health check — lets you verify the backend + database are working
app.get('/api/health', async (req, res) => {
    const result = await pool.query('SELECT NOW()');   // Ask database for current time
    res.json({ message: 'OneCoffe API is running!' }); // Send response back
});

// Get all coffees — the frontend will call this to display coffee cards
app.get('/api/coffees', async (req, res) => {
    const result = await pool.query('SELECT * FROM coffees ORDER BY name');
    res.json(result.rows);           // Send the rows back as JSON
});

app.listen(PORT, '0.0.0.0', () => { ... }); // Start listening for requests
```

**How a request flows:**
1. Frontend JavaScript calls `fetch('http://localhost:5000/api/coffees')`
2. Express receives the request and matches it to the `/api/coffees` route
3. The route handler runs `pool.query('SELECT * FROM coffees')` — this sends SQL to PostgreSQL
4. PostgreSQL returns the data
5. Express sends the data back as JSON
6. Frontend receives the JSON and displays it on the page

---

## 5. The Frontend Folder

```
frontend/
├── Dockerfile           # Instructions to build the frontend container
├── package.json         # Lists what npm packages to install
├── index.html           # The single HTML page (React is a "single page app")
├── vite.config.js       # Vite bundler configuration
└── src/
    ├── main.jsx         # Entry point — mounts React to the page
    ├── App.jsx          # The main React component (what you see on screen)
    └── index.css        # Global styles
```

### `frontend/Dockerfile`
**What it is:** Same concept as the backend Dockerfile — a recipe to build the container.

```dockerfile
FROM node:20-alpine         # Lightweight Linux + Node.js 20
WORKDIR /app                # Work inside /app
COPY package.json ./        # Copy package.json
RUN npm install             # Install React, Vite, etc.
COPY . .                    # Copy all frontend code
EXPOSE 3000                 # This container uses port 3000
CMD ["npm", "run", "dev"]   # Start the Vite dev server
```

### `frontend/package.json`
**Dependencies:**

| Package | What it does |
|---|---|
| `react` | The UI library — lets you build interfaces with components |
| `react-dom` | Connects React to the browser's DOM (the actual HTML page) |
| `react-router-dom` | Client-side routing — navigate between pages without full page reloads |
| `vite` | Dev server + build tool — serves your app locally, handles hot reload |
| `@vitejs/plugin-react` | Vite plugin that adds React support (JSX, fast refresh) |

**Scripts:**
```json
"dev": "vite --host 0.0.0.0 --port 3000"
```
- `--host 0.0.0.0` makes the server accessible from outside the container (required for Docker)
- `--port 3000` runs on port 3000

### `frontend/index.html`
**What it is:** The ONE HTML file in the entire app. React is a "Single Page Application" (SPA) — there's only one HTML page, and React dynamically changes what's displayed using JavaScript.

```html
<div id="root"></div>                              <!-- React mounts here -->
<script type="module" src="/src/main.jsx"></script> <!-- Load the React app -->
```

Everything you see on screen is rendered INSIDE that `<div id="root">` by React.

### `frontend/vite.config.js`
**What it is:** Configuration for Vite (the dev server / build tool).

```javascript
export default defineConfig({
  plugins: [react()],       // Enable React support (JSX files, hot reload)
  server: {
    host: '0.0.0.0',        // Listen on all interfaces (needed for Docker)
    port: 3000,             // Serve on port 3000
  },
});
```

### `frontend/src/main.jsx`
**What it is:** The entry point. This is the first JavaScript that runs.

```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />    // Render the App component inside the <div id="root"> from index.html
);
```

### `frontend/src/App.jsx`
**What it is:** The main component — what you actually see on the screen.

Right now it's a simple starter that:
1. Shows the app title "OneCoffe"
2. Calls the backend's `/api/health` endpoint
3. Shows whether the backend is connected or not

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// ↑ This reads the VITE_API_URL environment variable from docker-compose.yml
//   so the frontend knows where the backend lives

useEffect(() => {
    fetch(`${API_URL}/api/health`)     // Call the backend
        .then(res => res.json())
        .then(data => setMessage(data.message))
        .catch(() => setMessage('Backend not connected yet'));
}, []);
```

### `frontend/src/index.css`
**What it is:** Global CSS styles applied to the whole app. Currently has a basic dark theme and CSS reset.

---

## 6. The Database Folder

```
database/
├── migrations/
│   └── 001_schema.sql      # Table definitions (DDL)
├── seeds/
│   └── 002_seed_data.sql    # Sample data (INSERT statements)
└── queries/
    └── basic_selects.sql    # Practice queries for the assignment
```

**There is no Dockerfile here.** The database uses the official `postgres:16` image directly — no custom build needed.

### How the SQL files run automatically

PostgreSQL's official Docker image has a special folder: `/docker-entrypoint-initdb.d/`. Any `.sql` files placed in this folder are **automatically executed in alphabetical order** when the container starts for the first time (on a fresh database).

In `docker-compose.yml`, we mount our local folders into that special folder:
```yaml
volumes:
  - ./database/migrations:/docker-entrypoint-initdb.d/migrations
  - ./database/seeds:/docker-entrypoint-initdb.d/seeds
```

So when you first run `docker compose up`:
1. PostgreSQL starts up and creates the `onecoffe` database
2. It finds `001_schema.sql` → runs it → creates all 8 tables
3. It finds `002_seed_data.sql` → runs it → inserts sample data

**Important:** This only runs on the FIRST startup (when the database is empty). If you want to reset the database, run:
```bash
docker compose down -v    # The -v flag deletes the database volume
docker compose up --build # Starts fresh, re-runs all SQL files
```

### `database/migrations/001_schema.sql`
**What it is:** The DDL (Data Definition Language) — creates all 8 tables.

Each table has:
- `SERIAL PRIMARY KEY` — auto-incrementing ID
- `NOT NULL` — required fields
- `UNIQUE` — no duplicate values (like emails)
- `CHECK` — validation rules (e.g., price must be positive, rating 1-5)
- `REFERENCES` — foreign keys linking tables together
- `DEFAULT` — automatic values (e.g., `created_at` defaults to current time)

The file is numbered `001_` so it runs before the seed data.

### `database/seeds/002_seed_data.sql`
**What it is:** INSERT statements that populate the tables with sample data.

Includes One Piece themed:
- 10 coffees (Luffy Latte, Zoro Zen Matcha, etc.)
- 5 customers
- 3 employees
- 3 discount codes
- 5 orders with 7 order items
- 4 inventory batches
- 6 reviews

Numbered `002_` so it runs AFTER the schema (tables must exist before you can insert into them).

### `database/queries/basic_selects.sql`
**What it is:** Practice SQL queries for the CMPS460 assignment. These don't run automatically — they're for you to study and execute manually.

You'll add more query files here as you work through the query portfolio:
- `joins.sql`
- `aggregations.sql`
- `subqueries_ctes.sql`
- `views_indexes.sql`

---

## 7. How They All Connect

### The connection chain, step by step:

```
YOU (browser)
  │
  │  http://localhost:3000
  ▼
┌─────────────────────────────────────────────────────┐
│ FRONTEND container                                   │
│                                                      │
│  App.jsx calls:                                      │
│    fetch('http://localhost:5000/api/coffees')         │
│                                                      │
│  This goes OUT of the container, through the port    │
│  mapping, and hits the backend on YOUR computer's    │
│  port 5000                                           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │  http://localhost:5000/api/coffees
                       ▼
┌─────────────────────────────────────────────────────┐
│ BACKEND container                                    │
│                                                      │
│  server.js receives the request                      │
│  Matches route: app.get('/api/coffees', ...)         │
│  Calls: pool.query('SELECT * FROM coffees')          │
│                                                      │
│  db.js has:  host: 'database'  ← Docker DNS name    │
│  Docker resolves 'database' to the DB container's IP │
└──────────────────────┬──────────────────────────────┘
                       │
                       │  SQL query over TCP to host "database" port 5432
                       ▼
┌─────────────────────────────────────────────────────┐
│ DATABASE container                                   │
│                                                      │
│  PostgreSQL receives the query                       │
│  Runs: SELECT * FROM coffees                         │
│  Returns rows to the backend                         │
└─────────────────────────────────────────────────────┘
```

### What connects what:

| Connection | How it works | Who set it up |
|---|---|---|
| You → Frontend | Port mapping `3000:3000` in docker-compose.yml | Docker Compose |
| Frontend → Backend | `fetch('http://localhost:5000/...')` in App.jsx | You (in your code) |
| Backend → Database | `pg.Pool({ host: 'database' })` in db.js | Docker DNS + your code |
| Database auto-setup | SQL files mounted into `initdb.d/` | Docker Compose volumes |

### Do you have to manually connect them?
**No.** Docker Compose handles the networking. When you run `docker compose up`:
- All three containers join the same virtual network
- Each container can reach others by service name (`frontend`, `backend`, `database`)
- Port mappings let YOUR browser access them via `localhost`

---

## 8. Common Questions

### "Do I need PostgreSQL installed on my Mac?"
**No.** PostgreSQL runs entirely inside the Docker container. You don't install it on your machine.

### "Do I need Node.js installed on my Mac?"
**No.** Node.js runs inside the frontend and backend containers. Docker handles it.

### "If I change my React code, do I have to rebuild?"
**No for src/ files.** The `docker-compose.yml` mounts your local `src/` folder into the container with a `volume`. Changes to files in `frontend/src/` or `backend/src/` are reflected immediately (Vite hot-reloads the frontend, Node `--watch` restarts the backend).

**Yes for package.json.** If you add a new npm package, you need to rebuild:
```bash
docker compose up --build
```

### "How do I add a new npm package?"
```bash
# For frontend:
docker compose exec frontend npm install <package-name>

# For backend:
docker compose exec backend npm install <package-name>

# Then rebuild to make sure the Dockerfile picks it up:
docker compose up --build
```

### "How do I see what's in the database?"
You can connect to the running PostgreSQL container:
```bash
docker compose exec database psql -U postgres -d onecoffe
```

Then run SQL directly:
```sql
SELECT * FROM coffees;
SELECT * FROM customers;
\dt    -- list all tables
\q     -- quit
```

### "How do I reset the database?"
```bash
docker compose down -v       # Delete everything including database data
docker compose up --build    # Fresh start, re-runs all SQL files
```

### "What if port 3000 or 5000 is already in use?"
Change the ports in `docker-compose.yml`. The format is `host:container`:
```yaml
ports:
  - "3001:3000"    # Now access frontend at localhost:3001
```

### "How do I see logs / errors?"
```bash
# All services:
docker compose logs

# Just the backend:
docker compose logs backend

# Follow logs in real-time:
docker compose logs -f backend
```

---

## 9. Useful Commands

| Command | What it does |
|---|---|
| `docker compose up --build` | Build and start everything |
| `docker compose up --build -d` | Same but in background (detached) |
| `docker compose down` | Stop everything |
| `docker compose down -v` | Stop everything AND delete database data |
| `docker compose logs -f` | Watch all logs in real-time |
| `docker compose logs -f backend` | Watch just backend logs |
| `docker compose exec database psql -U postgres -d onecoffe` | Open database shell |
| `docker compose exec backend sh` | Open a terminal inside backend container |
| `docker compose exec frontend sh` | Open a terminal inside frontend container |
| `docker compose restart backend` | Restart just the backend |
| `docker compose ps` | See status of all containers |

---

## Summary

| Question | Answer |
|---|---|
| What do I need installed? | Just Docker Desktop |
| How do I start the app? | `docker compose up --build` |
| Do I connect things manually? | No, Docker Compose does it |
| How does backend find the database? | Docker DNS: hostname `database` resolves automatically |
| How does frontend find the backend? | `fetch('http://localhost:5000/...')` in your React code |
| Where do I write my React code? | `frontend/src/` |
| Where do I write my API routes? | `backend/src/server.js` |
| Where do I write SQL? | `database/migrations/`, `database/seeds/`, `database/queries/` |
| How do I reset everything? | `docker compose down -v` then `docker compose up --build` |
