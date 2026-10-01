# Task 1 - E-Commerce Conceptual Data Model

## Objective

Design a conceptual data model for an E-Commerce System using the
following entities:

- Customer
- Product
- Cart
- Order

## Entities

### Customer
Represents a customer who uses the e-commerce system.

### Product
Represents a product available in the e-commerce system.

### Cart
Represents the shopping cart associated with a customer.

### Order
Represents an order placed by a customer.

## Relationships

- A Customer has a Cart.
- A Customer places Orders.
- A Cart contains Products.
- An Order contains Products.

## Conceptual Data Model

Customer --Has--> Cart

Customer --Places--> Order

Cart --Contains--> Product

Order --Contains--> Product

## Cardinality

- Customer to Cart: One-to-One (1:1)
- Customer to Order: One-to-Many (1:M)
- Cart to Product: Many-to-Many (M:N)
- Order to Product: Many-to-Many (M:N)