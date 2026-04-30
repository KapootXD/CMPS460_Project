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


