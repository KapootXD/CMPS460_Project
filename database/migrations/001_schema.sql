-- OneCafe Schema v1
-- This file runs automatically when the database container starts for the first time.

-- 1. Customers
CREATE TABLE IF NOT EXISTS customers (
    customer_id   SERIAL PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    created_at    TIMESTAMP DEFAULT NOW(),
    is_active     BOOLEAN DEFAULT TRUE
);

-- 2. Coffees
CREATE TABLE IF NOT EXISTS coffees (
    coffee_id    SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    theme_tag    VARCHAR(50),
    description  TEXT,
    price        NUMERIC(6,2) NOT NULL CHECK (price > 0),
    image_url    VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT NOW()
);



-- 3. Shopping cart (one cart per row; line items live in cart_items)
CREATE TABLE IF NOT EXISTS cart (
    cart_id     SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    cart_status VARCHAR(20) NOT NULL DEFAULT 'active'
                CHECK (cart_status IN ('active', 'abandoned')),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- 4. Cart items (no line_total: derive quantity * unit_price in queries for 3NF)
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id      INT NOT NULL REFERENCES cart(cart_id) ON DELETE CASCADE,
    coffee_id    INT NOT NULL REFERENCES coffees(coffee_id),
    quantity     INT NOT NULL CHECK (quantity > 0),
    unit_price   NUMERIC(6,2) NOT NULL
);

