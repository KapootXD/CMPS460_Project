-- OneCoffe Schema v1
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

-- 3. Employees
CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    role        VARCHAR(50) NOT NULL DEFAULT 'barista',
    email       VARCHAR(150) UNIQUE NOT NULL,
    hired_at    TIMESTAMP DEFAULT NOW(),
    is_active   BOOLEAN DEFAULT TRUE
);

-- 4. Discount Codes
CREATE TABLE IF NOT EXISTS discount_codes (
    discount_code_id SERIAL PRIMARY KEY,
    code             VARCHAR(50) UNIQUE NOT NULL,
    discount_type    VARCHAR(10) NOT NULL CHECK (discount_type IN ('percent', 'flat')),
    discount_value   NUMERIC(6,2) NOT NULL CHECK (discount_value > 0),
    is_active        BOOLEAN DEFAULT TRUE,
    valid_from       DATE,
    valid_to         DATE
);

-- 5. Orders
CREATE TABLE IF NOT EXISTS orders (
    order_id         SERIAL PRIMARY KEY,
    customer_id      INT NOT NULL REFERENCES customers(customer_id),
    order_status     VARCHAR(20) NOT NULL DEFAULT 'pending'
                     CHECK (order_status IN ('pending', 'confirmed', 'completed', 'canceled')),
    order_total      NUMERIC(8,2) NOT NULL DEFAULT 0,
    discount_code_id INT REFERENCES discount_codes(discount_code_id),
    placed_at        TIMESTAMP DEFAULT NOW()
);

-- 6. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id      INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    coffee_id     INT NOT NULL REFERENCES coffees(coffee_id),
    quantity      INT NOT NULL CHECK (quantity > 0),
    unit_price    NUMERIC(6,2) NOT NULL,
    line_total    NUMERIC(8,2) NOT NULL
);

-- 7. Inventory Batches
CREATE TABLE IF NOT EXISTS inventory_batches (
    batch_id           SERIAL PRIMARY KEY,
    coffee_id          INT NOT NULL REFERENCES coffees(coffee_id),
    supplier_name      VARCHAR(100),
    quantity_received  INT NOT NULL CHECK (quantity_received >= 0),
    quantity_remaining INT NOT NULL CHECK (quantity_remaining >= 0),
    received_at        TIMESTAMP DEFAULT NOW(),
    expiration_date    DATE
);

-- 8. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    review_id    SERIAL PRIMARY KEY,
    customer_id  INT NOT NULL REFERENCES customers(customer_id),
    coffee_id    INT NOT NULL REFERENCES coffees(coffee_id),
    rating       INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment_text TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);
