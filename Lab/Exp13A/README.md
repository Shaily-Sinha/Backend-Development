# Experiment 13A - Express + Mongoose User Management System

## Aim

To create a simple User Management System using Express.js, MongoDB, and Mongoose that demonstrates database connectivity, schema and model creation, user registration, login, and retrieval of registered users.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML

---

## Features

- Register a new user
- Store user details in MongoDB
- Login using username and password
- View all registered users
- Prevent duplicate usernames and email addresses
- Display appropriate error messages
- Automatically store account creation date

---

## Project Structure

```text
Experiment-13A/
│
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
│
└── screenshots/
    ├── home.png
    ├── registration.png
    ├── login.png
    ├── users.png
    └── mongodb.png
```

> `node_modules` is generated locally after installing dependencies and is not uploaded to GitHub.

---

## Installation

### 1. Install Dependencies

```bash
npm install
```

The application uses:

```bash
npm install express mongoose
```

### 2. Start MongoDB

Make sure your local MongoDB server is running.

You can verify MongoDB using:

```bash
mongosh
```

### 3. Run the Application

```bash
node server.js
```

The terminal should display:

```text
Server running on http://localhost:3000
Connected to MongoDB successfully
```

Open the following URL in your browser:

```text
http://localhost:3000
```

---

## MongoDB Configuration

The application connects to the local MongoDB server using:

```text
mongodb://localhost:27017/userdb
```

### Database

```text
userdb
```

### Collection

```text
users
```

Mongoose automatically creates the database and collection when user data is saved.

---

## User Schema

Each user document contains the following fields:

| Field | Type | Description |
|------|------|-------------|
| username | String | Unique username of the user |
| email | String | Unique email address |
| password | String | User password |
| createdAt | Date | Date and time when the account was created |

---

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Displays the User Management home page |
| POST | `/signup` | Registers a new user |
| POST | `/login` | Authenticates an existing user |
| GET | `/users` | Displays all registered users |

---

## Application Workflow

### User Registration

```text
Registration Form
       ↓
POST /signup
       ↓
req.body
       ↓
Create User object
       ↓
newUser.save()
       ↓
Mongoose
       ↓
MongoDB
```

The username, email, and password entered through the registration form are stored as a new document in MongoDB.

### User Login

```text
Login Form
     ↓
POST /login
     ↓
User.findOne()
     ↓
Find user in MongoDB
     ↓
Check password
     ↓
Login Success / Error
```

### View Users

```text
GET /users
     ↓
User.find()
     ↓
MongoDB
     ↓
Retrieve all users
     ↓
Display registered users
```

---

## Mongoose Concepts Used

### Schema

A Mongoose schema defines the structure and properties of documents stored in MongoDB.

### Model

The `User` model provides an interface for interacting with the `users` collection.

### Methods Used

- `save()` - saves a new user document
- `find()` - retrieves all user documents
- `findOne()` - retrieves a specific user
- `mongoose.connect()` - connects the application to MongoDB

The application also uses `async/await` for asynchronous database operations.

---

## Error Handling

The application handles basic errors such as:

- Duplicate username
- Duplicate email address
- User not found
- Incorrect password
- MongoDB/database errors

Mongoose duplicate key error code `11000` is used to identify duplicate username or email entries.

---

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Successful Registration

![Successful Registration](screenshots/registration.png)

### Successful Login

![Successful Login](screenshots/login.png)

### Registered Users

![Registered Users](screenshots/users.png)

### MongoDB Stored Documents

![MongoDB Database](screenshots/mongodb.png)

---

## Testing

The following operations were tested successfully:

- [x] MongoDB connection
- [x] User registration
- [x] Duplicate user prevention
- [x] User login
- [x] Invalid username handling
- [x] Incorrect password handling
- [x] Retrieval of all registered users
- [x] User data stored successfully in MongoDB

---

## Security Note

This experiment is designed for learning purposes.

Passwords are stored as plain text in this basic implementation. In a production application, passwords should never be stored directly and should instead be securely hashed using a library such as `bcrypt`.

---

## Result

Successfully developed a User Management System using Express.js, MongoDB, and Mongoose.

The application establishes a connection between Node.js and MongoDB, stores user information using a Mongoose model, authenticates registered users, and retrieves user records from the database.