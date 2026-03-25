-- OneCoffe Seed Data
-- Small starter dataset for development/testing.

-- Coffees (One Piece themed)
INSERT INTO coffees (name, theme_tag, description, price, is_available) VALUES
('Luffy Latte',        'Straw Hat',    'Bold espresso with stretchy caramel swirl',         4.99, TRUE),
('Zoro Zen Matcha',    'Straw Hat',    'Three-sword strength matcha latte',                 5.49, TRUE),
('Nami Navigator',     'Straw Hat',    'Citrus cold brew with orange zest',                 4.49, TRUE),
('Sanji Sunrise',      'Straw Hat',    'Smooth vanilla latte with a kick of cinnamon',      5.29, TRUE),
('Chopper Cocoa',      'Straw Hat',    'Rich hot chocolate with marshmallow antlers',        3.99, TRUE),
('Robin Dark Roast',   'Straw Hat',    'Deep, mysterious dark roast coffee',                 4.29, TRUE),
('Franky Fuel',        'Straw Hat',    'Super-charged espresso with cola syrup',             5.99, TRUE),
('Brook Bone Chill',   'Straw Hat',    'Iced coffee so cold it chills your soul',            4.79, TRUE),
('Ace Inferno Brew',   'Whitebeard',   'Spicy espresso with chili and dark chocolate',       5.99, TRUE),
('Shanks Redline',     'Red Hair',     'Red berry mocha with raspberry drizzle',             5.49, TRUE);

-- Customers (using bcrypt hash for password "password123")
INSERT INTO customers (full_name, email, password_hash, phone) VALUES
('Monkey D. Luffy',  'luffy@onecoffe.com',  '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0001'),
('Roronoa Zoro',     'zoro@onecoffe.com',   '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0002'),
('Nami',             'nami@onecoffe.com',   '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0003'),
('Tony Chopper',     'chopper@onecoffe.com','$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0004'),
('Nico Robin',       'robin@onecoffe.com',  '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0005');

-- Employees
INSERT INTO employees (full_name, role, email) VALUES
('Red-Haired Shanks', 'manager', 'shanks@onecoffe.com'),
('Makino',            'barista', 'makino@onecoffe.com'),
('Dadan',             'barista', 'dadan@onecoffe.com');

-- Discount Codes
INSERT INTO discount_codes (code, discount_type, discount_value, is_active, valid_from, valid_to) VALUES
('NAKAMA10',   'percent', 10.00, TRUE,  '2025-01-01', '2026-12-31'),
('GRANDLINE5', 'flat',     5.00, TRUE,  '2025-06-01', '2026-06-30'),
('PIRATE20',   'percent', 20.00, FALSE, '2025-01-01', '2025-06-30');

-- Orders
INSERT INTO orders (customer_id, order_status, order_total, placed_at) VALUES
(1, 'completed', 15.47, '2026-03-01 10:30:00'),
(2, 'completed', 10.98, '2026-03-02 14:15:00'),
(3, 'pending',    4.49, '2026-03-03 09:00:00'),
(1, 'confirmed', 11.28, '2026-03-10 11:00:00'),
(4, 'completed',  3.99, '2026-03-15 16:45:00');

-- Order Items
INSERT INTO order_items (order_id, coffee_id, quantity, unit_price, line_total) VALUES
(1, 1, 2, 4.99,  9.98),
(1, 3, 1, 4.49,  4.49),
(2, 2, 2, 5.49, 10.98),
(3, 3, 1, 4.49,  4.49),
(4, 4, 1, 5.29,  5.29),
(4, 8, 1, 4.79,  4.79),
(5, 5, 1, 3.99,  3.99);

-- Inventory Batches
INSERT INTO inventory_batches (coffee_id, supplier_name, quantity_received, quantity_remaining, expiration_date) VALUES
(1, 'Grand Line Beans Co.',   100, 72, '2026-09-01'),
(2, 'East Blue Tea Imports',   80, 55, '2026-08-15'),
(5, 'Drum Island Cacao',       60, 48, '2026-07-20'),
(9, 'New World Spice Trade',   40, 30, '2026-06-01');

-- Reviews
INSERT INTO reviews (customer_id, coffee_id, rating, comment_text) VALUES
(1, 1, 5, 'This latte gives me the energy to be King of the Pirates!'),
(2, 2, 4, 'Strong like my swords. Could use a fourth flavor.'),
(3, 3, 5, 'Refreshing! Almost as good as treasure.'),
(4, 5, 5, 'The marshmallows are so cute! Emergency food supply approved.'),
(1, 9, 4, 'Spicy! Reminds me of Ace... great coffee though.'),
(5, 6, 5, 'Dark and complex. I could read a thousand books drinking this.');
