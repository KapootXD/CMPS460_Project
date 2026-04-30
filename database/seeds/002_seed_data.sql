-- OneCoffe Seed Data
-- Small starter dataset for development/testing.

-- Coffees (One Piece themed)
-- image_url: public URL path served by the frontend (Vite public/), not a filesystem path.
INSERT INTO coffees (name, theme_tag, description, price, image_url, is_available) VALUES
('Luffy Latte',        'Straw Hat',    'Bold espresso with stretchy caramel swirl',         4.99, '/onecafe-assets/generated/drinks/luffy-latte-generated.png', TRUE),
('Zoro Zen Matcha',    'Straw Hat',    'Three-sword strength matcha latte',                 5.49, '/onecafe-assets/generated/drinks/zoro-zen-matcha-generated.png', TRUE),
('Nami Navigator',     'Straw Hat',    'Citrus cold brew with orange zest',                 4.49, '/onecafe-assets/generated/drinks/nami-navigator-generated.png', TRUE),
('Sanji Sunrise',      'Straw Hat',    'Smooth vanilla latte with a kick of cinnamon',      5.29, '/onecafe-assets/generated/drinks/sanji-sunrise-generated.png', TRUE),
('Chopper Cocoa',      'Straw Hat',    'Rich hot chocolate with marshmallow antlers',        3.99, '/onecafe-assets/generated/drinks/chopper-cocoa-generated.png', TRUE),
('Robin Dark Roast',   'Straw Hat',    'Deep, mysterious dark roast coffee',                 4.29, '/onecafe-assets/generated/drinks/robin-dark-roast-generated.png', TRUE),
('Franky Fuel',        'Straw Hat',    'Super-charged espresso with cola syrup',             5.99, '/onecafe-assets/generated/drinks/franky-fuel-generated.png', TRUE),
('Brook Bone Chill',   'Straw Hat',    'Iced coffee so cold it chills your soul',            4.79, '/onecafe-assets/generated/drinks/brook-bone-chill-generated.png', TRUE),
('Ace Inferno Brew',   'Whitebeard',   'Spicy espresso with chili and dark chocolate',       5.99, '/onecafe-assets/backgrounds/comic-rays-red.png', TRUE),
('Shanks Redline',     'Red Hair',     'Red berry mocha with raspberry drizzle',             5.49, '/onecafe-assets/backgrounds/comic-rays-pink.png', TRUE);
/*
-- Customers (using bcrypt hash for password "password123")
INSERT INTO customers (full_name, email, password_hash, phone) VALUES
('Monkey D. Luffy',  'luffy@onecoffe.com',  '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0001'),
('Roronoa Zoro',     'zoro@onecoffe.com',   '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0002'),
('Nami',             'nami@onecoffe.com',   '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0003'),
('Tony Chopper',     'chopper@onecoffe.com','$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0004'),
('Nico Robin',       'robin@onecoffe.com',  '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', '555-0005');


-- Carts
INSERT INTO cart (customer_id, cart_status, updated_at) VALUES
(1, 'active', '2026-03-01 10:30:00'),
(2, 'active', '2026-03-02 14:15:00'),
(3, 'active', '2026-03-03 09:00:00'),
(1, 'abandoned', '2026-03-10 11:00:00'),
(4, 'active', '2026-03-15 16:45:00');

-- Cart items
INSERT INTO cart_items (cart_id, coffee_id, quantity, unit_price) VALUES
(1, 1, 2, 4.99),
(1, 3, 1, 4.49),
(2, 2, 2, 5.49),
(3, 3, 1, 4.49),
(4, 4, 1, 5.29),
(4, 8, 1, 4.79),
(5, 5, 1, 3.99);
*/

