# Assignment 2 — PostgreSQL as SQL + NoSQL: Working with JSONB

## Learning Objective

To understand how PostgreSQL's `jsonb` type allows a relational database to work as both a SQL and a document-style NoSQL database, and to compare PostgreSQL JSONB with MongoDB.

---

# Part A — Conceptual Questions

## 1. What is `jsonb` in PostgreSQL, and how does it differ from the plain `json` type?

PostgreSQL provides two data types for storing JSON data: `json` and `jsonb`. Both can store JSON objects, arrays, strings, numbers, and other valid JSON values, but they differ mainly in how the data is stored and processed.

The `json` type stores the supplied JSON data in its original text format. Since less conversion is required while inserting the value, writing JSON data can be slightly faster. However, when the stored data is queried, PostgreSQL has to process the JSON text to access its contents.

The `jsonb` type stores JSON data in a decomposed binary representation. This requires some additional processing while inserting data, but makes later operations on the stored JSON more efficient. JSONB also supports useful indexing methods such as GIN indexes, which can improve the performance of searches involving JSON keys and values.

Therefore, `json` can be useful when retaining the original JSON representation is important, whereas `jsonb` is generally more suitable when the data needs to be frequently queried or indexed.

Example:

```sql
CREATE TABLE example (
    id INTEGER,
    data JSONB
);

INSERT INTO example
VALUES (1, '{"name": "Laptop", "ram": 16}');

SELECT data ->> 'name'
FROM example;
```

---

## 2. How can PostgreSQL work as both a SQL and a NoSQL database in the same table?

PostgreSQL can combine traditional relational data with flexible document-style data by using normal SQL columns together with a `jsonb` column. This allows information that follows a fixed structure to use strongly typed relational columns while variable information can be stored as JSON.

For example, every product in a product catalog may have an `id`, `name`, `category`, and `price`. These values have a predictable structure and can therefore be stored using standard SQL data types. However, different product categories may have different properties. A book may have `author` and `pages`, while a laptop may have `ram_gb` and `cpu`.

Instead of creating many category-specific columns, PostgreSQL can store these variable properties inside one JSONB column called `attributes`.

This provides relational database features such as primary keys, data types, constraints, joins, and transactions while also providing the flexible document structure normally associated with NoSQL databases.

Example schema:

```sql
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);
```

Thus, a single PostgreSQL table can contain both structured relational information and flexible document-style information.

---

## 3. Give examples of JSONB queries using `->`, `->>`, `@>`, and `?`.

PostgreSQL provides several operators for accessing and searching data stored inside JSONB columns.

The `->` operator retrieves a JSON field and returns the result as JSON/JSONB. For example:

```sql
SELECT attributes -> 'cpu'
FROM products
WHERE name = 'ThinkPad E14';
```

This returns the CPU value as JSON:

```text
"Intel Core i5"
```

The `->>` operator retrieves the value as text instead:

```sql
SELECT attributes ->> 'cpu'
FROM products
WHERE name = 'ThinkPad E14';
```

It returns:

```text
Intel Core i5
```

Therefore, the main difference is that `->` returns JSON/JSONB while `->>` returns text.

The `@>` operator checks whether one JSONB value contains another:

```sql
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

This returns `Wireless Mouse`.

The `?` operator checks whether a particular key exists:

```sql
SELECT name
FROM products
WHERE attributes ? 'cpu';
```

This returns products whose `attributes` object contains the `cpu` key.

These operators make it possible to search flexible JSONB documents using normal PostgreSQL queries.

---

## 4. How can a GIN index on a JSONB column change query performance?

A GIN (Generalized Inverted Index) can improve the performance of certain queries performed on a JSONB column. Without an appropriate index, PostgreSQL may perform a sequential scan and examine rows one by one to determine whether their JSONB data satisfies a condition.

A GIN index can be created on the `attributes` column as follows:

```sql
CREATE INDEX idx_products_attributes
ON products
USING GIN (attributes);
```

This type of index is useful for JSONB containment and key-existence operations. For example:

```sql
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

On a sufficiently large dataset, a suitable GIN index can allow PostgreSQL to locate matching JSONB values without scanning every row.

However, a general GIN index does not necessarily help every kind of JSONB query. For example:

```sql
SELECT name
FROM products
WHERE (attributes ->> 'ram_gb')::int >= 16;
```

This extracts a value and performs a numeric range comparison. A normal GIN index on the entire JSONB document is not designed specifically for this expression.

Therefore, GIN indexes are especially useful for operations such as JSONB containment and key existence, while other query patterns may require different indexing strategies.

---

## 5. Where could PostgreSQL + JSONB replace MongoDB, and where could MongoDB still be a better fit?

PostgreSQL with JSONB can be useful when an application requires both relational database features and flexible document-style data. For example, an e-commerce system may contain strongly related data such as customers, orders, and payments while product attributes vary depending on the product category.

PostgreSQL provides transactions, joins, constraints, schema enforcement, and strongly typed relational columns. JSONB can then be used for information whose structure varies. This means an application may not need a separate document database simply to store flexible attributes.

For example:

```sql
SELECT name, price
FROM products
WHERE attributes @> '{"wireless": true}';
```

MongoDB, on the other hand, is built around a document-oriented data model. Its document syntax can be convenient when most application data naturally consists of flexible or nested documents. MongoDB also provides mechanisms for distributing document data horizontally through sharding.

Therefore, PostgreSQL with JSONB can be a strong option when transactions, joins, relational constraints, and flexible attributes are needed together. MongoDB can still be suitable when the application is primarily document-oriented and horizontal distribution of document data is an important architectural requirement.

---

# Part B — Hands-on Exercise: Product Catalog

## Task 1 — Schema

A `products` table was created using fixed relational columns and one flexible JSONB column.

```sql
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);
```

The relational columns store common product information, while `attributes` stores category-specific information.

---

## Task 2 — Insert Data

Five products belonging to three different categories were inserted.

```sql
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
```

The inserted data was verified using:

```sql
SELECT * FROM products;
```

Total rows inserted: **5**

---

## Task 3 — Query by Category-Specific Attribute

### Book — Filter by Author

```sql
SELECT name, attributes ->> 'author' AS author
FROM products
WHERE category = 'book'
AND attributes ->> 'author' = 'Robert C. Martin';
```

Result:

```text
Clean Code | Robert C. Martin
```

### Laptop — Filter by RAM

```sql
SELECT name, attributes ->> 'cpu' AS cpu
FROM products
WHERE category = 'laptop'
AND (attributes ->> 'ram_gb')::int >= 16;
```

Result:

```text
ThinkPad E14 | Intel Core i5
```

### Accessory — Filter by Wireless Attribute

```sql
SELECT name, attributes ->> 'color' AS color
FROM products
WHERE category = 'accessory'
AND (attributes ->> 'wireless')::boolean = true;
```

Result:

```text
Wireless Mouse | black
```

---

## Task 4 — Containment Query

The JSONB containment operator `@>` was used to find products containing `"wireless": true`.

```sql
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

Result:

```text
Wireless Mouse
```

---

## Task 5 — Update JSONB Without Altering the Table

A new `discount_pct` attribute was added to the Wireless Mouse without altering the table schema.

```sql
UPDATE products
SET attributes = attributes || '{"discount_pct": 10}'
WHERE name = 'Wireless Mouse';
```

The update was verified using:

```sql
SELECT name, attributes
FROM products
WHERE name = 'Wireless Mouse';
```

Result:

```text
Wireless Mouse |
{"color": "black", "wireless": true, "discount_pct": 10}
```

This demonstrates that new attributes can be added to JSONB data without adding a new relational column.

---

## Task 6 — GIN Index and Performance Comparison

First, the containment query was analyzed before creating the index.

```sql
EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

### Before GIN Index

The query plan used:

```text
Seq Scan on products
```

Observed values:

```text
Rows Removed by Filter: 4
Planning Time: 0.102 ms
Execution Time: 0.053 ms
```

The GIN index was then created:

```sql
CREATE INDEX idx_products_attributes
ON products
USING GIN (attributes);
```

The same query was analyzed again:

```sql
EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

### After GIN Index

PostgreSQL still selected:

```text
Seq Scan on products
```

Observed values:

```text
Rows Removed by Filter: 4
Planning Time: 3.397 ms
Execution Time: 0.118 ms
```

### Observation

PostgreSQL used a sequential scan both before and after the GIN index was created. This experiment contains only five rows, so scanning the complete table is inexpensive. PostgreSQL's query planner can therefore choose a sequential scan instead of using the index.

The small timing difference in this experiment should not be interpreted as evidence that the GIN index makes queries slower. A five-row table is too small for a meaningful performance benchmark. GIN indexes become more useful on larger datasets, especially for JSONB containment and key-existence queries.

---

## Task 7 — MongoDB Comparison

The same five products were recreated as documents in a MongoDB `products` collection.

```javascript
db.products.insertMany([
  {
    name: "Clean Code",
    category: "book",
    price: 499.00,
    attributes: {
      author: "Robert C. Martin",
      pages: 464
    }
  },
  {
    name: "Atomic Habits",
    category: "book",
    price: 399.00,
    attributes: {
      author: "James Clear",
      pages: 320
    }
  },
  {
    name: "ThinkPad E14",
    category: "laptop",
    price: 65000.00,
    attributes: {
      ram_gb: 16,
      cpu: "Intel Core i5"
    }
  },
  {
    name: "ASUS Vivobook",
    category: "laptop",
    price: 55000.00,
    attributes: {
      ram_gb: 8,
      cpu: "AMD Ryzen 5"
    }
  },
  {
    name: "Wireless Mouse",
    category: "accessory",
    price: 1299.00,
    attributes: {
      color: "black",
      wireless: true
    }
  }
]);
```

### MongoDB Query 1 — Book by Author

```javascript
db.products.find({
  category: "book",
  "attributes.author": "Robert C. Martin"
});
```

Result: `Clean Code`

### MongoDB Query 2 — Laptop with at least 16 GB RAM

```javascript
db.products.find({
  category: "laptop",
  "attributes.ram_gb": { $gte: 16 }
});
```

Result: `ThinkPad E14`

### MongoDB Query 3 — Wireless Accessory

```javascript
db.products.find({
  category: "accessory",
  "attributes.wireless": true
});
```

Result: `Wireless Mouse`

---

## PostgreSQL JSONB vs MongoDB

MongoDB provides direct dot notation for accessing nested document properties. For example:

```javascript
"attributes.ram_gb"
```

PostgreSQL uses JSONB operators such as:

```sql
attributes ->> 'ram_gb'
```

and explicit type casting may be necessary when performing numeric comparisons:

```sql
(attributes ->> 'ram_gb')::int >= 16
```

MongoDB therefore provides natural syntax for working with document fields, while PostgreSQL allows document-style JSONB data to exist alongside strongly typed relational columns.

For indexing, PostgreSQL supports GIN indexes for JSONB data, while MongoDB supports indexes on document fields. PostgreSQL also provides relational features such as joins, constraints, and typed columns.

---

## Conclusion

This assignment demonstrated how PostgreSQL can combine relational SQL features with flexible NoSQL-style data using JSONB. JSONB allows different products to store different attributes without changing the table structure. PostgreSQL provides operators for querying JSONB data and GIN indexes for suitable JSONB searches.

The MongoDB comparison also showed that both systems can represent flexible product attributes, although their syntax and data models differ.

