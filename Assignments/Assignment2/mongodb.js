// ============================================
// Assignment 2 - MongoDB Comparison
// Task 7
// ============================================

// Insert the same 5 products used in PostgreSQL
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

// Verify inserted products
db.products.find();


// Query 1 - Book by author
db.products.find({
  category: "book",
  "attributes.author": "Robert C. Martin"
});


// Query 2 - Laptops with at least 16 GB RAM
db.products.find({
  category: "laptop",
  "attributes.ram_gb": { $gte: 16 }
});


// Query 3 - Wireless accessories
db.products.find({
  category: "accessory",
  "attributes.wireless": true
});