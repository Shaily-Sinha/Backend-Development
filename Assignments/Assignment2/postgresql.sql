 -- ============================================
-- Task 1 - Schema
-- ============================================

CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);

-- ============================================
-- Task 2 - Insert Data
-- ============================================

INSERT INTO products (name, category, price, attributes)
VALUES
('Clean Code', 'book', 499.00,
 '{"author": "Robert C. Martin", "pages": 464}'),

('Atomic Habits', 'book', 399.00,
 '{"author": "James Clear", "pages": 320}'),

('ThinkPad E14', 'laptop', 65000.00,
 '{"ram_gb": 16, "cpu": "Intel Core i5"}'),

('ASUS Vivobook', 'laptop', 55000.00,
 '{"ram_gb": 8, "cpu": "AMD Ryzen 5"}'),

('Wireless Mouse', 'accessory', 1299.00,
 '{"color": "black", "wireless": true}');


-- ============================================
-- Task 3 - Query by Category-Specific Attribute
-- ============================================

-- Books by a specific author
SELECT name, attributes ->> 'author' AS author
FROM products
WHERE category = 'book'
AND attributes ->> 'author' = 'Robert C. Martin';

-- Laptops with at least 16 GB RAM
SELECT name, attributes ->> 'cpu' AS cpu
FROM products
WHERE category = 'laptop'
AND (attributes ->> 'ram_gb')::int >= 16;

-- Wireless accessories
SELECT name, attributes ->> 'color' AS color
FROM products
WHERE category = 'accessory'
AND (attributes ->> 'wireless')::boolean = true;

-- ============================================
-- Task 4 - Containment Query
-- ============================================

SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';

-- ============================================
-- Task 5 - Update JSONB Without Altering Table
-- ============================================

UPDATE products
SET attributes = attributes || '{"discount_pct": 10}'
WHERE name = 'Wireless Mouse';

-- ============================================
-- Task 6 - Index and Compare
-- ============================================

-- Before creating GIN index
EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';

-- Create GIN index
CREATE INDEX idx_products_attributes
ON products
USING GIN (attributes);

