# Lecture 3 - Setting Up the Backend Environment

This lecture demonstrates how to set up a backend development environment and create backend servers using two different technologies:

- **Task 1:** Node.js, Express.js and EJS
- **Task 2:** Python and Flask

The implementation covers basic server creation, routing, JSON/HTML responses, and server-side rendering.

---

## Project Structure

```text
Lecture3/
│
├── Task1/
│   ├── views/
│   │   ├── home.ejs
│   │   └── students.ejs
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── Task2/
│   └── app.py
│
└── README.md
```

> `node_modules` and `venv` are local dependency/environment folders and should not be pushed to GitHub.

---

# Task 1 - Express.js and EJS

Task 1 demonstrates backend development using **Node.js and Express.js**.

It also uses **EJS (Embedded JavaScript)** as a template engine to generate dynamic HTML pages from the server.

## Technologies Used

- JavaScript
- Node.js
- Express.js
- EJS

## Files

### `server.js`

Contains the Express server configuration, routes, student data, and rendering logic.

### `views/home.ejs`

EJS template used to render the home page.

### `views/students.ejs`

EJS template used to dynamically display student information.

---

## Installation

Navigate to the Task1 directory:

```bash
cd Task1
```

Install the required dependencies:

```bash
npm install
```

Run the server:

```bash
node server.js
```

The Express server can then be accessed through the browser.

---

## Concepts Demonstrated

- Creating an Express server
- Defining routes
- Handling HTTP GET requests
- Returning responses from the server
- Working with student data
- Rendering HTML pages
- Server-side rendering
- Using EJS templates
- Passing data from Express to EJS templates

---

# Task 2 - Flask

Task 2 demonstrates backend development using **Python and Flask**.

A Python virtual environment is used to keep the project dependencies isolated.

## Technologies Used

- Python
- Flask
- Python Virtual Environment (`venv`)

---

## Files

### `app.py`

Contains the Flask application and route definitions.

---

## Virtual Environment

The project uses a Python virtual environment.

On Windows, activate it using:

```bash
venv\Scripts\activate
```

Install Flask if required:

```bash
pip install flask
```

Run the Flask application:

```bash
python app.py
```

---

## Concepts Demonstrated

- Setting up a Python backend environment
- Creating a Flask application
- Creating routes
- Handling HTTP requests
- Returning responses
- Returning JSON data
- Working with URL parameters
- Running a local Flask development server

---

# Express.js vs Flask

| Express.js | Flask |
|---|---|
| JavaScript | Python |
| Runs on Node.js | Runs on Python |
| Uses `app.get()` for GET routes | Uses `@app.route()` for routes |
| Can use EJS for server-side rendering | Can use Flask templates for server-side rendering |
| Dependencies managed using npm | Dependencies managed using pip |
| Uses `package.json` | Can use a virtual environment for dependencies |

---

# Request-Response Cycle

Both implementations follow the basic HTTP request-response cycle:

```text
Client / Browser
       |
       | HTTP Request
       ↓
Backend Server
(Express / Flask)
       |
       | Route Processing
       ↓
Application Logic
       |
       | HTTP Response
       ↓
Client / Browser
```

The browser sends a request to the backend server. The server processes the request using the corresponding route and returns a response to the client.

---

# Key Concepts Covered

- Backend development environment setup
- Node.js and npm
- Python and pip
- Express.js
- Flask
- HTTP requests and responses
- Routing
- JSON responses
- HTML responses
- Server-side rendering
- EJS templates
- Virtual environments

---

## Conclusion

This implementation demonstrates how backend servers can be created using both **Express.js** and **Flask**.

The Express implementation also demonstrates server-side rendering using **EJS**, while the Flask implementation demonstrates creating routes and returning responses using Python.