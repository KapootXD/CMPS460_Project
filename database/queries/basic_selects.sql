-- OneCoffe: Basic Select Queries
-- Category A from the query portfolio

-- 1. List all coffees currently available
SELECT * FROM coffees WHERE is_available = TRUE;

-- 2. List coffees under $5.00
SELECT name, price FROM coffees WHERE price < 5.00 ORDER BY price;

-- 3. Find customer by email
SELECT * FROM customers WHERE email = 'luffy@onecoffe.com';

-- 4. Show all active carts
SELECT * FROM cart WHERE cart_status = 'active';

-- 5. List cart items for cart_id = 1
SELECT * FROM cart_items WHERE cart_id = 1;

-- TODO: Add queries 6-10
